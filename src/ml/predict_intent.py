import sys
import json
import os
from intent_model import predict_drama_intent


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "missing_args"}))
        sys.exit(1)

    feeling = sys.argv[1]
    question = sys.argv[2]

    # 🔽 여기가 핵심: models 절대경로
    BASE_DIR = os.path.dirname(__file__)          # .../src/ml
    MODEL_DIR = os.path.join(BASE_DIR, "models")  # .../src/ml/models

    try:
        result = predict_drama_intent(
            question=question,
            feeling=feeling,
            model_dir=MODEL_DIR,  # 절대경로 전달
            top_k=2
        )
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"error": "inference_failed", "details": str(e)}))
        sys.exit(2)
