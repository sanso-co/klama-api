import mongoose from "mongoose";

const showSchema = mongoose.Schema({
  id: String,
  name: String,
  original_name: String,
  first_air_date: String,
  genre_ids: [String],
  poster_path: String,
});

const collectionSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    releaseDate: {
      type: String,
    },
    shows: [showSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);
