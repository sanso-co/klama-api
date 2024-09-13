import providerCollection from "../models/providerCollection.js";

// create a new provider collection: eg. netflix, viki
export const createProviderCollection = async (req, res) => {
    const collection = req.body;
    const newCollection = new providerCollection(collection);
    try {
        const result = await newCollection.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// get all provider collections
export const getAllProviderCollections = async (req, res) => {
    try {
        const result = await providerCollection.find();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get provider collection details
export const getProviderCollectoinDetails = async (req, res) => {
    const { id: _id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const collection = await providerCollection.findById(_id);

        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedShows = collection.shows.slice(startIndex, endIndex);

        const result = {
            result: paginatedShows,
            totalDocs: collection.shows.length,
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(collection.shows.length / limit),
            page: parseInt(page, 10),
            pagingCounter: startIndex + 1,
            hasPrevPage: page > 1,
            hasNextPage: endIndex < collection.shows.length,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: endIndex < collection.shows.length ? page + 1 : null,
        };

        res.status(200).json({
            name: collection.name,
            description: collection.description,
            shows: result,
        });
    } catch (error) {
        res.status(500).json({ message: "Provider collection doesn't exist" });
    }
};

// add a show to a provider collection
export const addShowToProviderCollection = async (req, res) => {
    const { id } = req.params;
    const { show } = req.body;

    try {
        const collection = await providerCollection.findById(id);

        if (!collection) {
            return res.status(404).json({ message: "Provider collection not found" });
        }

        const showExists = collection.shows.some(
            (existingShow) => existingShow.id === show.id.toString()
        );

        if (showExists) {
            return res.status(400).json({ message: "Show already exists in the collection" });
        }

        const updatedCollection = await providerCollection.findByIdAndUpdate(
            id,
            { $push: { shows: show } },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeShowFromProviderCollection = async (req, res) => {
    const { id } = req.params;
    const { showId } = req.body;

    try {
        const collection = await providerCollection.findById(id);

        if (!collection) {
            return res.status(404).json({ message: "Provider collection not found" });
        }

        const showExists = collection.shows.some((existingShow) => existingShow.id === showId);

        if (!showExists) {
            return res.status(400).json({ message: "Show not found in the collection" });
        }

        const updatedCollection = await providerCollection.findByIdAndUpdate(
            id,
            { $pull: { shows: { id: showId } } },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
