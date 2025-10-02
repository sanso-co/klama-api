# src/ml/intent_model.py
import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

DOMAIN_STOPWORDS = [
    "any", "anything",
    "bit",
    "can", "could",
    "drama",
    "got",
    "help",
    "idea", "ideas", "im", "i'm", "ive", "i’ve",
    "just",
    "kdrama",
    "little", "look", "looking",
    "me", "my", "mine", "movie",
    "need",
    "pick", "picks",  "please",
    "really", "recommend", "recommends", "recommendation",
    "series", "should", "show", "so", "something", "suggest", "suggestion", "super",
    "totally",
    "u",
    "very",
    "want", "wanna", "watch", "will", "would",
    "you",
]


class DramaIntentClassifier:
    """
    질문(question) 텍스트만으로 intent를 분류하는 분류기.
    - TF-IDF(1~2gram) + LogisticRegression
    - models/ 에 model/vectorizer/label_encoder 저장/로드
    - (중요) emotion 컬럼은 CSV에 존재해도 '학습 입력'에서는 사용하지 않음.
             서빙 단계에서는 prior(가벼운 재정렬)로만 활용.
    """

    def __init__(
        self,
        min_count: int = 2,
        rare_strategy: str = "drop",
        other_label: str = "other",
        max_features: int = 30000,
    ):
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            ngram_range=(1, 3),
            stop_words=DOMAIN_STOPWORDS,
            lowercase=True,
        )
        self.label_encoder = LabelEncoder()
        self.model = LogisticRegression(
            random_state=42, max_iter=1000, C=1.0, class_weight="balanced")
        self.min_count = min_count
        self.rare_strategy = rare_strategy
        self.other_label = other_label
        self.data: pd.DataFrame | None = None

    # -----------------------
    # Data
    # -----------------------
    def load_data(self, csv_path: str = "data/intent_training_data.csv") -> pd.DataFrame | None:
        """
        CSV 데이터 로드 및 전처리
        - 필수 컬럼: ['emotion','question','intent'] (emotion은 학습 입력에 사용하지 않음)
        - 상대경로면 이 파일(src/ml) 기준으로 안전하게 합성
        """
        base_dir = os.path.dirname(__file__)  # src/ml
        full_path = csv_path if os.path.isabs(
            csv_path) else os.path.join(base_dir, csv_path)

        try:
            df = pd.read_csv(full_path)

            # 필수 컬럼 확인
            required = ["emotion", "question", "intent"]
            missing = [c for c in required if c not in df.columns]
            if missing:
                raise ValueError(
                    f"CSV에 필요한 컬럼이 없습니다: {missing} / 실제 컬럼: {list(df.columns)}"
                )

            # 결측치 제거 및 문자열 정리
            df = df.dropna(subset=required).copy()
            for col in required:
                df[col] = df[col].astype(str).str.strip()

            # 완전 공백 행 제거
            for col in required:
                df = df[df[col].str.len() > 0]

            self.data = df.reset_index(drop=True)
            return self.data

        except FileNotFoundError:
            print(f"[ERROR] CSV not found: {full_path}")
            return None

    def _handle_rare_classes(self) -> None:
        """샘플 수가 min_count 미만인 intent를 제거(drop)하거나 other로 병합"""
        if self.data is None:
            return
        vc = self.data["intent"].value_counts()
        rare = vc[vc < self.min_count].index.tolist()
        if not rare:
            return
        if self.rare_strategy == "drop":
            self.data = self.data[~self.data["intent"].isin(
                rare)].reset_index(drop=True)
        elif self.rare_strategy == "other":
            self.data["intent"] = self.data["intent"].where(
                ~self.data["intent"].isin(rare), self.other_label
            )

    def _prepare_text_and_labels(self, fit_label_encoder: bool = True):
        """
        (핵심) 질문 텍스트만으로 입력 피처 생성.
        emotion은 학습 입력에 포함하지 않음.
        """
        if self.data is None:
            raise ValueError("데이터가 로드되지 않았습니다.")
        X_text_series = self.data["question"].fillna(
            "").astype(str).str.strip()
        if fit_label_encoder:
            y = self.label_encoder.fit_transform(self.data["intent"])
        else:
            y = self.label_encoder.transform(self.data["intent"])
        return X_text_series, y

    # -----------------------
    # Train & Eval
    # -----------------------
    def train(self, test_size: float = 0.2) -> dict:
        """모델 학습 및 간단 리포트 반환"""
        if self.data is None or len(self.data) == 0:
            raise ValueError("데이터가 로드되지 않았습니다. 먼저 load_data()를 호출하세요.")

        # 희소 클래스 처리
        self._handle_rare_classes()

        print("[DEBUG] intent value counts after rare-class handling:")
        print(self.data["intent"].value_counts())

        # 텍스트/라벨 준비 (질문만)
        text, y = self._prepare_text_and_labels(fit_label_encoder=True)

        # train/test 분할
        from sklearn.model_selection import train_test_split  # 지연 import
        X_tr_text, X_te_text, y_tr, y_te = train_test_split(
            text, y, test_size=test_size, random_state=42, stratify=y
        )

        # 벡터화: train fit / test transform
        X_tr = self.vectorizer.fit_transform(X_tr_text)
        X_te = self.vectorizer.transform(X_te_text)

        # 학습
        self.model.fit(X_tr, y_tr)

        # 성능
        train_acc = self.model.score(X_tr, y_tr)
        test_acc = self.model.score(X_te, y_te)
        y_pred = self.model.predict(X_te)
        report = classification_report(
            y_te,
            y_pred,
            labels=np.arange(len(self.label_encoder.classes_)),
            target_names=self.label_encoder.classes_,
            zero_division=0,
        )

        return {"train_acc": train_acc, "test_acc": test_acc, "report": report}

    # -----------------------
    # Persistence
    # -----------------------
    def save(self, model_dir: str = "models") -> None:
        """학습된 모델/전처리기 저장"""
        os.makedirs(model_dir, exist_ok=True)
        joblib.dump(self.model, os.path.join(model_dir, "intent_model.pkl"))
        joblib.dump(self.vectorizer, os.path.join(model_dir, "vectorizer.pkl"))
        joblib.dump(self.label_encoder, os.path.join(
            model_dir, "label_encoder.pkl"))

    def load(self, model_dir: str = "models") -> bool:
        """저장된 모델/전처리기 로드"""
        self.model = joblib.load(os.path.join(model_dir, "intent_model.pkl"))
        self.vectorizer = joblib.load(
            os.path.join(model_dir, "vectorizer.pkl"))
        self.label_encoder = joblib.load(
            os.path.join(model_dir, "label_encoder.pkl"))
        return True

    # -----------------------
    # Inference
    # -----------------------
    def _predict_proba_from_text(self, question: str) -> np.ndarray:
        """질문 텍스트만으로 클래스 확률 벡터 반환"""
        q = (question or "").strip()
        vec = self.vectorizer.transform([q])
        return self.model.predict_proba(vec)[0]

    def predict_topk(self, question: str, top_k: int = 2) -> dict:
        """
        (기본) 텍스트만 기반 Top-K intent와 confidence 반환
        """
        proba = self._predict_proba_from_text(question)
        idxs = np.argsort(proba)[::-1][:top_k]
        results = [
            {"intent": self.label_encoder.classes_[
                i], "confidence": float(proba[i])}
            for i in idxs
        ]
        return {"input": question.strip(), "top_predictions": results}

    def debug_tokens(self, text: str):
        vec = self.vectorizer.transform([(text or "").strip()])
        feats = self.vectorizer.get_feature_names_out()
        nz = vec.nonzero()[1]
        print("[TOKENS]", [feats[i] for i in nz])

    def predict_topk_with_emotion_prior(
        self,
        question: str,
        feeling: str = "",
        prior_map: Dict[str, Dict[str, float]] | None = None,
        alpha: float = 0.15,
        top_k: int = 2,
    ) -> dict:
        """
        (서빙용) 텍스트 확률 + emotion prior를 약하게 결합하여 Top-K 반환
        - alpha: 0.0~0.4 권장. 0이면 prior 무시.
        - prior_map: { feeling: { intent: weight, ... }, ... }
        """
        proba = self._predict_proba_from_text(question)
        intents: List[str] = list(self.label_encoder.classes_)

        if not prior_map or not feeling:
            post = proba
        else:
            raw_prior = np.array([prior_map.get(feeling, {}).get(
                intent, 0.0) for intent in intents], dtype=float)
            if raw_prior.sum() <= 0:
                post = proba
            else:
                prior = raw_prior / raw_prior.sum()
                post = (1 - alpha) * proba + alpha * prior

        idxs = np.argsort(post)[::-1][:top_k]
        results = [
            {
                "intent": intents[i],
                "confidence": float(post[i]),
                "base_confidence": float(proba[i]),
            }
            for i in idxs
        ]
        return {
            "input": (feeling + " | " if feeling else "") + question.strip(),
            "alpha": alpha,
            "top_predictions": results,
        }


# ------ 외부에서 바로 쓰는 헬퍼 (텍스트만) ------
def predict_drama_intent(question: str, model_dir: str = "models", top_k: int = 3) -> dict:
    clf = DramaIntentClassifier()
    clf.load(model_dir=model_dir)
    return clf.predict_topk(question=question, top_k=top_k)


# ------ 외부에서 바로 쓰는 헬퍼 (emotion prior 결합) ------
def predict_drama_intent_with_prior(
    question: str,
    feeling: str = "",
    model_dir: str = "models",
    prior_map: Dict[str, Dict[str, float]] | None = None,
    alpha: float = 0.15,
    top_k: int = 3,
) -> dict:
    clf = DramaIntentClassifier()
    clf.load(model_dir=model_dir)
    return clf.predict_topk_with_emotion_prior(
        question=question, feeling=feeling, prior_map=prior_map, alpha=alpha, top_k=top_k
    )
