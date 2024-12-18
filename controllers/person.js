import Person from "../models/person.js";

import { getSortOptions, sortShows } from "../utility/sortUtils.js";

// get person details
export const getPersonDetails = async (req, res) => {
    const { personId } = req.params;
    const { page = 1, limit = 30, sort = "date_desc" } = req.query;

    try {
        const sortOptions = getSortOptions(sort);

        const person = await Person.findOne({ id: personId }).populate({
            path: "shows",
            select: "_id id name original_name poster_path genres first_air_date popularity_score",
        });

        if (!person) {
            return res.status(404).json({ message: "Person not found" });
        }

        const sortedShows = sortShows(person.shows, sortOptions);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedShows = sortedShows.slice(startIndex, endIndex);

        const result = {
            results: paginatedShows,
            totalDocs: person.shows.length,
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(person.shows.length / limit),
            page: parseInt(page, 10),
            pagingCounter: startIndex + 1,
            hasPrevPage: page > 1,
            hasNextPage: endIndex < person.shows.length,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: endIndex < person.shows.length ? page + 1 : null,
        };

        res.status(200).json({
            id: person.id,
            name: person.name,
            original_name: person.original_name,
            profile_path: person.profile_path,
            shows: result,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching person details" });
    }
};
