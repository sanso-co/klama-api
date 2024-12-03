import mongoose from "mongoose";
import periodicCollection from "../models/periodicCollection.js";

// create a new periodic collection: eg. trending now or new releases
export const createPeriodicCollection = async (req, res) => {
    const collection = req.body;
    const newCollection = new periodicCollection(collection);
    try {
        await newCollection.save();
        res.status(201).json(newCollection);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// get all periodic collections
export const getAllPeriodicCollections = async (req, res) => {
    try {
        const result = await periodicCollection.find();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get periodic collection details
export const getPeriodicCollectoinDetails = async (req, res) => {
    const { id: _id } = req.params;
    try {
        const result = await periodicCollection.findById(_id);

        if (!result) {
            return res.status(404).json({ message: "Periodic collection not found" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Periodic collection doesn't exist" });
    }
};

// add a list to a periodic collection
export const addListToPeriodicCollection = async (req, res) => {
    const { id } = req.params;
    const { releaseDate, shows } = req.body;

    try {
        // Validate that each show ID is a valid ObjectId
        const showObjectIds = shows.map((show) => new mongoose.Types.ObjectId(show));

        const existingCollection = await periodicCollection.findById(id);
        if (!existingCollection) {
            return res.status(404).json({ message: "Periodic collection not found" });
        }
        const newList = {
            releaseDate,
            shows: showObjectIds,
        };
        existingCollection.lists.push(newList);
        const updatedCollection = await existingCollection.save();
        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get a specified list from a specified periodic collection
export const getAListFromPeriodicCollection = async (req, res) => {
    try {
        const { collectionId, listId } = req.params;
        const { sort } = req.query;

        let query = {
            _id: collectionId,
        };

        let projection = {};

        if (listId === "latest") {
            // For 'latest', get the first item in the lists array
            projection = {
                lists: 1,
                name: 1,
            };
        } else {
            query["lists._id"] = listId;
            projection = {
                "lists.$": 1,
                name: 1,
            };
        }

        const collection = await periodicCollection.findOne(query, projection).populate({
            path: "lists.shows",
            select: "id name original_name poster_path first_air_date popularity_score",
        });

        if (!collection) {
            return res.status(404).json({
                message: listId === "latest" ? "No lists found in collection" : "List not found",
            });
        }

        if (!collection.lists || collection.lists.length === 0) {
            return res.status(404).json({
                message: "No lists found in collection",
            });
        }

        let response =
            listId === "latest"
                ? collection.lists[collection.lists.length - 1]
                : collection.lists[0];

        if (
            (sort === "ascending" || sort === "descending") &&
            response.shows &&
            response.shows.length > 0
        ) {
            response.shows.sort((a, b) => {
                const dateA = new Date(a.first_air_date);
                const dateB = new Date(b.first_air_date);
                return sort === "ascending" ? dateA - dateB : dateB - dateA;
            });
        }

        res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// add a show to a permanent collection
export const addShowToSubPeriodicList = async (req, res) => {
    const { collectionId, listId } = req.params;
    const { showId } = req.body; // Single show ID instead of an array

    try {
        // Validate that the show ID is a valid ObjectId
        const showObjectId = new mongoose.Types.ObjectId(showId);

        // Find the periodic collection first
        const collection = await periodicCollection.findOne({
            _id: collectionId,
            "lists._id": listId,
        });

        if (!collection) {
            return res.status(404).json({
                message: "Periodic collection or list not found",
            });
        }

        // Find the specific list
        const targetList = collection.lists.id(listId);

        // Check if show already exists in the list
        if (targetList.shows.includes(showObjectId)) {
            return res.status(400).json({
                message: "Show already exists in the list",
            });
        }

        // Verify that the show exists in the Shows collection
        const showExists = await mongoose.model("Show").findById(showObjectId);

        if (!showExists) {
            return res.status(400).json({
                message: "Invalid show ID",
            });
        }

        // Update the collection
        const updatedCollection = await periodicCollection.findOneAndUpdate(
            {
                _id: collectionId,
                "lists._id": listId,
            },
            {
                $push: {
                    "lists.$.shows": showObjectId,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeShowFromSubPeriodicList = async (req, res) => {
    const { collectionId, listId } = req.params;
    const { showId } = req.body;

    try {
        // Validate that the show ID is a valid ObjectId
        const showObjectId = new mongoose.Types.ObjectId(showId);

        // Find the periodic collection first
        const collection = await periodicCollection.findOne({
            _id: collectionId,
            "lists._id": listId,
        });

        if (!collection) {
            return res.status(404).json({
                message: "Periodic collection or list not found",
            });
        }

        // Find the specific list
        const targetList = collection.lists.id(listId);

        // Check if show exists in the list
        if (!targetList.shows.includes(showObjectId)) {
            return res.status(400).json({
                message: "Show does not exist in the list",
            });
        }

        // Update the collection by pulling the show from the array
        const updatedCollection = await periodicCollection.findOneAndUpdate(
            {
                _id: collectionId,
                "lists._id": listId,
            },
            {
                $pull: {
                    "lists.$.shows": showObjectId,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
