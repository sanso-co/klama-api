import { RequestHandler } from "express";
import { PaginationResponseType, RequestQuery } from "../interfaces/api";
import { getSortOptions, sortShows } from "../utilities/sortUtils";
import Person from "../models/person";
import { paginatedResult } from "../utilities/paginateUtils";

interface PersonParams {
    personId: string;
}

interface PersonResponse extends PaginationResponseType {
    id: number;
    name: string;
    original_name?: string;
    img_path?: string;
}

export const getPersonDetails: RequestHandler<
    PersonParams,
    PersonResponse | { message: string } | { error: any },
    {},
    RequestQuery
> = async (req, res) => {
    const { personId } = req.params;
    const { page = "1", limit = "30", sort = "date_desc" } = req.query;

    try {
        const sortOptions = getSortOptions(sort);

        const person = await Person.findOne({ id: personId }).populate({
            path: "shows",
            select: "_id id name original_name poster_path genres first_air_date popularity_score",
        });

        if (!person) {
            res.status(404).json({ message: "Person not found" });
            return;
        }

        const sortedShows = sortShows(person.shows, sortOptions);

        const response = paginatedResult(sortedShows, { page, limit });

        res.status(200).json({
            id: person.id,
            name: person.name,
            original_name: person.original_name,
            img_path: person.profile_path,
            ...response,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
