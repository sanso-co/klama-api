# src/ml/intent_model.py
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report


class DramaIntentClassifier:
    """
    감정(emotion) + 질문(question) 텍스트를 결합해 intent를 분류하는 분류기.
    - 희소 클래스(drop/other) 처리
    - TF-IDF(1~2gram) + LogisticRegression
    - models/ 에 model/vectorizer/label_encoder 저장/로드
    """

    def __init__(self, min_count: int = 2, rare_strategy: str = "drop", other_label: str = "other"):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            ngram_range=(1, 2),
            stop_words="english",
            lowercase=True,
        )
        self.label_encoder = LabelEncoder()
        self.model = LogisticRegression(random_state=42, max_iter=1000, C=1.0)
        self.min_count = min_count
        self.rare_strategy = rare_strategy
        self.other_label = other_label
        self.data: pd.DataFrame | None = None

    def load_data(self, csv_path: str = "data/intent_training_data.csv") -> pd.DataFrame | None:
        """
        CSV 데이터 로드 및 전처리
        - csv_path: 'data/intent_training_data.csv' 같은 상대경로나 절대경로 모두 허용
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

            # 결측치 제거 및 문자열 클린업
            df = df.dropna(subset=required).copy()
            for col in required:
                df[col] = df[col].astype(str).str.strip()

            # 완전 공백 행 제거(선택)
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
        """emotion + question 결합 텍스트 생성 및 레이블 인코딩"""
        if self.data is None:
            raise ValueError("데이터가 로드되지 않았습니다.")
        combined = (
            self.data["emotion"].fillna(
                "") + " " + self.data["question"].fillna("")
        ).str.strip()
        if fit_label_encoder:
            y = self.label_encoder.fit_transform(self.data["intent"])
        else:
            y = self.label_encoder.transform(self.data["intent"])
        return combined, y

    def train(self, test_size: float = 0.2) -> dict:
        """모델 학습 및 간단 리포트 반환"""
        if self.data is None or len(self.data) == 0:
            raise ValueError("데이터가 로드되지 않았습니다. 먼저 load_data()를 호출하세요.")

        # 희소 클래스 처리
        self._handle_rare_classes()

        # 텍스트/라벨 준비
        text, y = self._prepare_text_and_labels(fit_label_encoder=True)

        # train/test 분할
        from sklearn.model_selection import train_test_split  # 지연 import
        X_tr_text, X_te_text, y_tr, y_te = train_test_split(
            text, y, test_size=test_size, random_state=42, stratify=y
        )

        # 벡터화: train fit / test transform (데이터 유출 방지)
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
            labels=np.arange(len(self.label_encoder.classes_)),  # 🔹 클래스 개수 명시
            target_names=self.label_encoder.classes_,
            zero_division=0,
        )

        return {"train_acc": train_acc, "test_acc": test_acc, "report": report}

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

    def predict_topk(self, question: str, feeling: str = "", top_k: int = 2) -> dict:
        """새 인풋에 대해 Top-K intent와 confidence 반환"""
        combined = f"{feeling} {question}".strip()
        vec = self.vectorizer.transform([combined])
        proba = self.model.predict_proba(vec)[0]
        idxs = np.argsort(proba)[::-1][:top_k]
        results = [
            {"intent": self.label_encoder.classes_[
                i], "confidence": float(proba[i])}
            for i in idxs
        ]
        return {
            "input": combined,
            "top_predictions": results,
        }


def predict_drama_intent(question: str, feeling: str = "", model_dir: str = "models", top_k: int = 3) -> dict:
    """추론용 헬퍼 (API에서 바로 호출 가능)"""
    clf = DramaIntentClassifier()
    clf.load(model_dir=model_dir)
    return clf.predict_topk(question=question, feeling=feeling, top_k=top_k)
