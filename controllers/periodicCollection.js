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

// get periodic collection details with the latest list only
export const getPeriodicDetailsLatest = async (req, res) => {
    const { id: _id } = req.params;
    try {
        const result = await periodicCollection.findById(_id);

        if (!result) {
            return res.status(404).json({ message: "Periodic collection not found" });
        }

        const latestList = result.lists[result.lists.length - 1];

        const response = {
            name: result.name,
            description: result.description,
            frequency: result.frequency,
            list: {
                releaseDate: latestList.releaseDate,
                shows: latestList.shows,
            },
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Periodic collection doesn't exist" });
    }
};

// add a list to a periodic collection
export const addListToPeriodicCollection = async (req, res) => {
    const { id } = req.params;
    const list = req.body;

    try {
        const existingCollection = await periodicCollection.findById(id);

        if (!existingCollection) {
            return res.status(404).json({ message: "Periodic collection not found" });
        }
        existingCollection.lists.push(list);
        const updatedCollection = await existingCollection.save();

        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
