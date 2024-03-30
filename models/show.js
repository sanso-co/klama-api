import mongoose from "mongoose";

const showSchema = mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    poster_path: {
      type: String,
    },
    youtube_keywords: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Show", showSchema);
