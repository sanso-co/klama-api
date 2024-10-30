import Provider from "../models/provider.js";
import Show from "../models/show.js";

import cloudinary from "../middleware/cloudinary.js";

// ADD NEW PROVIDER
export const addProvider = async (req, res) => {
    const { id, name, logo_path, display_priority } = req.body;

    try {
        const existingProvider = await Provider.findOne({ id });

        if (existingProvider) {
            return res.status(400).json("Provider already exists");
        }

        const uploadedResponse = await cloudinary.v2.uploader.upload(logo_path, {
            upload_preset: "kdrama_providers",
        });

        const providerData = {
            id,
            name,
            display_priority,
            logo_path: uploadedResponse.url,
        };

        const newProvider = await Provider.create(providerData);

        res.status(200).json(newProvider);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
};

// GET ALL PROVIDERS
export const getAllProviders = async (req, res) => {
    try {
        const providers = await Provider.find().select("id name logo_path display_priority").sort({
            display_priority: 1,
        });
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json(error);
    }
};

// GET PROVIDERS FOR A SHOW
export const getProvidersForShow = async (req, res) => {
    const { showId } = req.params;

    try {
        const drama = await Show.findOne({ id: showId });

        if (!drama) {
            return res.status(404).json({ message: "Drama not found" });
        }

        const providers = await Provider.find({ shows: drama._id }).select(
            "id name logo_path display_priority"
        );

        const response = {
            id: showId,
            results: providers.map((provider) => ({
                id: provider.id,
                name: provider.name,
                logo_path: provider.logo_path,
                display_priority: provider.display_priority,
            })),
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};

// GET PROVIDER DETAILS
export const getProviderDetails = async (req, res) => {
    const { providerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const collection = await Provider.findOne({ id: providerId }).populate({
            path: "shows",
            select: "_id id name original_name poster_path genres first_air_date popularity_score",
        });

        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedShows = collection.shows.slice(startIndex, endIndex);

        const result = {
            results: paginatedShows,
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

// ADD SHOW TO A PROVDER
export const addShowToProvider = async (req, res) => {
    const { id } = req.params;
    const { showId } = req.body;

    try {
        const provider = await Provider.findOne({ id });
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }
        const drama = await Show.findOne({ id: showId });

        if (!drama) {
            return res.status(404).json({ message: "Show not found" });
        }

        if (provider.shows.includes(drama._id)) {
            return res.status(400).json({ message: "Drama already exists in the provider" });
        }

        provider.shows.push(drama._id);

        await provider.save();
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REMOVE SHOW FROM A PROVDER
export const removeShowFromProvider = async (req, res) => {
    const { id } = req.params;
    const { showId } = req.body;

    try {
        const collection = await Provider.findById(id);

        if (!collection) {
            return res.status(404).json({ message: "Provider collection not found" });
        }

        const showExists = collection.shows.some((existingShow) => existingShow.id === showId);

        if (!showExists) {
            return res.status(400).json({ message: "Show not found in the collection" });
        }

        const updatedCollection = await Provider.findByIdAndUpdate(
            id,
            { $pull: { shows: { id: showId } } },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE PROVIDER DETAILS
export const updateProvider = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedProvider = await Provider.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        if (!updatedProvider) {
            return res.status(404).json("Provider not found");
        }

        res.status(200).json(updatedProvider);
    } catch (error) {
        res.status(500).json(error);
    }
};

// SEACH PROVIDER
export const searchProvider = async (req, res) => {
    const { query, limit = 10 } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");

        const searchResults = await Provider.find({
            $or: [{ name: regexQuery }],
        })
            .limit(parseInt(limit))
            .select("_id id name logo_path display_priority")
            .lean();

        res.status(200).json(searchResults);
    } catch (error) {
        res.status(500).json({ message: "Error performing search", error: error.message });
    }
};
