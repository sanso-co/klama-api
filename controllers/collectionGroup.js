import CollectionGroup from "../models/collectionGroup.js";
import Collection from "../models/collection.js";

// create a new collection
// export const createCollectionGroup = async (req, res) => {
//   const collection = req.body;
//   const newCollection = new CollectionGroup(collection);
//   try {
//     await newCollection.save();
//     res.status(201).json(newCollection);
//   } catch (error) {
//     res.status(409).json({ message: error.message });
//   }
// };

export const createCollectionGroup = async (req, res) => {
  const { group } = req.body;
  const collection = req.body;

  try {
    if (group) {
      // Create a new collection group
      const newCollectionGroup = new CollectionGroup(collection);
      await newCollectionGroup.save();
      res.status(201).json(newCollectionGroup);
    } else {
      // Create a new collection and a collection group with the collection
      const newCollection = new Collection(collection);
      await newCollection.save();

      const newCollectionGroup = new CollectionGroup({
        ...collection,
        collections: [newCollection._id],
      });
      await newCollectionGroup.save();

      res.status(201).json(newCollectionGroup);
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// get all collections
export const getAllCollections = async (req, res) => {
  try {
    let collectionGroup = CollectionGroup.find();
    const result = await collectionGroup;
    res.status(200).json({ results: result });
  } catch (error) {
    res.status(500).json(error);
  }
};

// get collection details
export const getCollectoinDetails = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const collectionGroup = await CollectionGroup.findById(_id).populate({
      path: "collections",
      model: "Collection",
      select: "name description releaseDate shows",
    });

    if (!collectionGroup) {
      return res.status(404).json({ message: "Collection Group not found" });
    }
    res.status(200).json({ results: collectionGroup });
  } catch (error) {
    res.status(500).json({ message: "Collection doesn't exist" });
  }
};
