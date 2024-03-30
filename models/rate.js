import mongoose from "mongoose";

const showSchema = mongoose.Schema({
  id: Number,
  name: String,
  original_name: String,
  first_air_date: String,
  genre_ids: [String],
  poster_path: String,
  rating: String,
});

const rateSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratings: [showSchema],
});

export default mongoose.model("Rate", rateSchema);
