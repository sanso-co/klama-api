import sys
import json
import os
from intent_model import predict_drama_intent_with_prior

# (예시) 감정 → intent prior 매핑 (서빙 단계 재정렬용, 가볍게)
EMOTION_PRIOR = {
    "Feeling love":       {"romantic": 0.5, "heart-fluttering": 0.3, "slice-of-life": 0.2},
    "Emotionless":        {"suspenseful": 0.5, "intense": 0.3, "thought-provoking": 0.2},
    "Stressed out":       {"calming": 0.3, "lighthearted": 0.3, "suspenseful": 0.4},
    "Feeling down":       {"healing": 0.5, "heartwarming": 0.3, "uplifting": 0.2},
    "Need a boost":       {"uplifting": 0.5, "feel-good": 0.3, "heart-fluttering": 0.2},
    "Tired & Drained":    {"calming": 0.3, "heartwarming": 0.3, "slice-of-life": 0.2},
}

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "missing_args"}))
        sys.exit(1)

    feeling = sys.argv[1]          # 예: "Feeling love" (없으면 빈 문자열 전달 가능)
    question = sys.argv[2]         # 사용자 입력 질문

    # 모델 경로: .../src/ml/models (절대경로로 계산)
    BASE_DIR = os.path.dirname(__file__)          # .../src/ml
    MODEL_DIR = os.path.join(BASE_DIR, "models")  # .../src/ml/models

    # prior 강도(환경변수로도 제어 가능): 기본 0.15
    try:
        alpha_env = float(os.environ.get("EMOTION_PRIOR_ALPHA", "0.15"))
    except ValueError:
        alpha_env = 0.15

    try:
        result = predict_drama_intent_with_prior(
            question=question,
            feeling=feeling,
            model_dir=MODEL_DIR,
            prior_map=EMOTION_PRIOR,
            alpha=alpha_env,
            top_k=2,
        )
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"error": "inference_failed", "details": str(e)}))
        sys.exit(2)
