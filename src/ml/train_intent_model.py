from intent_model import DramaIntentClassifier

if __name__ == "__main__":
    clf = DramaIntentClassifier(min_count=2, rare_strategy="drop")
    # CSV 경로는 src/ml/data/intent_training_data.csv
    clf.load_data(csv_path='data/intent_training_data.csv')
    metrics = clf.train(test_size=0.2)

    print("\n=== TRAIN METRICS ===")
    print(f"Train Accuracy: {metrics['train_acc']:.4f}")
    print(f"Test Accuracy:  {metrics['test_acc']:.4f}")
    print(metrics['report'])

    clf.save(model_dir='models')
    print("[OK] Saved models to src/ml/models")
