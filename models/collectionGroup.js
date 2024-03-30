import mongoose from "mongoose";

const collectionGroup = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    group: {
      type: Boolean,
      default: false,
    },
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("CollectionGroup", collectionGroup);
