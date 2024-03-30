import Rate from "../models/rate.js";

//add to likes
export const addToRated = async (req, res) => {
  const user = req.user._id;
  const show = {
    id: req.body.id,
    name: req.body.name,
    original_name: req.body.original_name,
    first_air_date: req.body.release_date,
    genre_ids: req.body.genre_ids,
    poster_path: req.body.poster_path,
    rating: req.body.rating,
  };

  try {
    const existingRated = await Rate.findOne({ user });
    if (!existingRated) {
      await Rate.create({
        user,
        ratings: [show],
      });
    } else {
      const matchingIndex = existingRated.ratings.findIndex((item) => item.id === req.body.id);

      if (matchingIndex !== -1) {
        // If the item exists in the ratings array
        if (existingRated.ratings[matchingIndex].rating === req.body.rating) {
          // If the rating is the same, remove the item from ratings
          existingRated.ratings.splice(matchingIndex, 1);
        } else {
          // If the rating is different, replace the item's rating
          existingRated.ratings[matchingIndex].rating = req.body.rating;
        }
      } else {
        // If the item doesn't exist, push the new item to ratings
        existingRated.ratings.push(show);
      }

      await existingRated.save();
    }

    const updatedShows = await Rate.findOne({ user });
    if (!updatedShows) {
      res.status(400).json({ message: "Collection empty" });
    } else {
      res.status(200).json(updatedShows);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get rated shows that belong to one user
export const getRated = async (req, res) => {
  const user = req.user._id;

  try {
    const rated = await Rate.findOne({ user });

    if (!rated) {
      return res.status(400).json({ message: "Collection empty" });
    }
    return res.status(200).json(rated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
