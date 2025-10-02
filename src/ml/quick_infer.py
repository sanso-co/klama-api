# from intent_model import predict_drama_intent
# q = "Got any mature romances with grown-up communication?"
# print(predict_drama_intent(q))


from intent_model import DramaIntentClassifier

clf = DramaIntentClassifier()
clf.load(model_dir="models")
print(clf.predict_topk(
    "Any dramas with lighthearted romance and banter?", top_k=5))
