import Collection from "../models/collection.js";
import CollectionGroup from "../models/collectionGroup.js";

// create a new collection to a group
export const addCollectionToGroup = async (req, res) => {
  const { id } = req.params;
  const collection = req.body;

  try {
    const newCollection = new Collection(collection);
    await newCollection.save();

    const existingGroup = await CollectionGroup.findById(id);
    existingGroup.collections.push(newCollection._id);
    await existingGroup.save();

    res.status(200).json(existingGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add a show to a collection
export const addShowToCollection = async (req, res) => {
  const { id } = req.params;
  const show = {
    id: req.body.id,
    name: req.body.name,
    original_name: req.body.original_name,
    first_air_date: req.body.release_date,
    genre_ids: req.body.genre_ids,
    poster_path: req.body.poster_path,
  };

  try {
    const existingCollection = await Collection.findById(id);

    const showExists = existingCollection.shows.some((existingShow) => existingShow.id === show.id);
    if (showExists) {
      return res.status(400).json("Show already exists in the collection");
    }

    existingCollection.shows.push(show);
    await existingCollection.save();
    res.status(201).json(existingCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeShowFromCollection = async (req, res) => {
  const { id } = req.params;
  const { showId } = req.body;
  console.log(showId);

  try {
    const existingCollection = await Collection.findById(id);

    if (!existingCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const showIndex = existingCollection.shows.findIndex((show) => show.id === showId);

    existingCollection.shows.splice(showIndex, 1);
    await existingCollection.save();
    res.status(200).json(existingCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get collection details
export const getCollectoinDetails = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const collection = await Collection.findById(_id);
    res.status(200).json({ results: collection });
  } catch (error) {
    res.status(500).json({ message: "Collection doesn't exist" });
  }
};

// not used below

// add details to a collection
export const addDetailsToCollection = async (req, res) => {
  const { id } = req.params;
  const { description, releaseDate } = req.body;

  try {
    const existingCollection = await Collection.findById(id);

    if (description) existingCollection.description = description;
    if (releaseDate) existingCollection.releaseDate = releaseDate;

    await existingCollection.save();
    res.status(200).json(existingCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all collections
export const getAllCollections = async (req, res) => {
  try {
    let collections = Collection.find();
    const result = await collections;
    res.status(200).json({ results: result });
  } catch (error) {
    res.status(500).json(error);
  }
};
