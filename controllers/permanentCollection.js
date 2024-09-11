import permanentCollection from "../models/permanentCollection.js";

// create a new permanent collection: eg. most loved, highly recommended
export const createPermanentCollection = async (req, res) => {
    const collection = req.body;
    const newCollection = new permanentCollection(collection);
    try {
        const result = await newCollection.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// get all permanent collections
export const getAllPermanentCollections = async (req, res) => {
    try {
        const result = await permanentCollection.find();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get permanent collection details
export const getPermanentCollectoinDetails = async (req, res) => {
    const { id: _id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            select: "name description shows",
            pagination: true,
        };

        const result = await permanentCollection.paginate({ _id }, options);

        if (!result.docs.length) {
            return res.status(404).json({ message: "Permanent collection not found" });
        }

        const collection = result.docs[0];

        const paginatedCollection = await permanentCollection
            .findOne({ _id })
            .select("name description")
            .slice("shows", [(page - 1) * limit, parseInt(limit)])
            .lean();

        if (!paginatedCollection) {
            return res.status(404).json({ message: "Permanent collection not found" });
        }

        const response = {
            _id: paginatedCollection._id,
            name: paginatedCollection.name,
            description: paginatedCollection.description,
            shows: {
                result: paginatedCollection.shows,
                totalShows: collection.shows.length,
                currentPage: parseInt(page),
                totalPages: Math.ceil(collection.shows.length / limit),
                limit: parseInt(limit),
            },
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Permanent collection doesn't exist" });
    }
};

// add a show to a permanent collection
export const addShowToPermanentCollection = async (req, res) => {
    const { id } = req.params;
    const { show } = req.body;

    try {
        const updatedCollection = await permanentCollection.findByIdAndUpdate(
            id,
            { $push: { shows: show } },
            { new: true, runValidators: true }
        );

        if (!updatedCollection) {
            return res.status(404).json({ message: "Permanent collection not found" });
        }

        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
