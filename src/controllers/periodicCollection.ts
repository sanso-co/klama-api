import { RequestHandler } from "express";
import PeriodicCollection from "../models/periodicCollection";
import { RequestQuery } from "../interfaces/api";
import mongoose from "mongoose";
import { PeriodicType } from "../interfaces/periodicCollection";
import { ShowType } from "../interfaces/show";

interface CollectionParams {
    collectionId: string;
    listId: string;
}

interface ListResponse {
    releaseDate: Date;
    shows: (mongoose.Types.ObjectId | ShowType)[];
}

// get a specific list from a designated collection, e.g., latest from trending.
export const getListFromCollection: RequestHandler<
    CollectionParams,
    ListResponse | { message: string } | { error: any },
    {},
    RequestQuery
> = async (req, res) => {
    const { collectionId, listId } = req.params;
    const { sort } = req.query;

    try {
        const query: mongoose.FilterQuery<PeriodicType> = {
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

        const collection = await PeriodicCollection.findOne(query, projection).populate({
            path: "lists.shows",
            select: "id name original_name poster_path first_air_date popularity_score",
        });

        if (!collection) {
            res.status(404).json({
                message: listId === "latest" ? "No lists found in collection" : "List not found",
            });
            return;
        }

        if (!collection.lists || collection.lists.length === 0) {
            res.status(404).json({
                message: "No lists found in collection",
            });
            return;
        }

        let response =
            listId === "latest"
                ? collection.lists[collection.lists.length - 1]
                : collection.lists[0];

        if (
            (sort === "date_asc" || sort === "date_desc") &&
            response.shows &&
            response.shows.length > 0
        ) {
            const isShowType = (show: mongoose.Types.ObjectId | ShowType): show is ShowType => {
                return "first_air_date" in show && show.first_air_date !== undefined;
            };

            if (response.shows.every(isShowType)) {
                response.shows.sort((a, b) => {
                    if (!a.first_air_date) return 1;
                    if (!b.first_air_date) return -1;

                    const dateA = new Date(a.first_air_date);
                    const dateB = new Date(b.first_air_date);

                    if (isNaN(dateA.getTime())) return 1;
                    if (isNaN(dateB.getTime())) return -1;

                    return sort === "date_asc"
                        ? dateA.getTime() - dateB.getTime()
                        : dateB.getTime() - dateA.getTime();
                });
            }
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error });
    }
};
