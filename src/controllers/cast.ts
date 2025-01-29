import { RequestHandler } from "express";
import Cast from "../models/cast";
import Show from "../models/show";
import Person from "../models/person";
import { IPerson } from "../interfaces/person";

export const getCastsForShow: RequestHandler = async (req, res) => {
    const { showId } = req.params;

    try {
        const castDoc = await Cast.findOne({ id: showId }).populate(
            "casts.person",
            "id name original_name known_for_department profile_path"
        );

        if (!castDoc) {
            res.status(404).json({
                message: "Cast does't exist for this show",
            });
            return;
        }

        const result = castDoc.casts.map((cast) => ({
            id: (cast.person as IPerson).id,
            role: cast.role,
            name: (cast.person as IPerson).name,
            profile_path: (cast.person as IPerson).profile_path,
            order: cast.order,
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateShowCast: RequestHandler = async (req, res) => {
    const { showId } = req.params;
    const { additionalCasts } = req.body;

    try {
        let castDoc = await Cast.findOne({ id: showId });

        if (!castDoc) {
            castDoc = new Cast({
                id: showId,
                casts: [],
            });
            await castDoc.save();
        }

        const thisShow = await Show.findOne({ id: showId });

        for (const additionalCast of additionalCasts) {
            const existingCastIndex = castDoc.casts.findIndex(
                (cast) => cast.person.id === additionalCast.id
            );

            if (existingCastIndex === -1) {
                let person = await Person.findOne({ id: additionalCast.id });

                if (!person) {
                    person = await Person.create({
                        id: additionalCast.id,
                        name: additionalCast.name,
                        original_name: additionalCast.original_name,
                        known_for_department: additionalCast.known_for_department,
                        profile_path: additionalCast.profile_path,
                        shows: [thisShow._id],
                    });
                } else if (!person.shows.includes(thisShow._id)) {
                    person.shows.push(thisShow._id);
                    await person.save();
                }

                castDoc.casts.push({
                    person: person._id,
                    role: additionalCast.role,
                    original_role: additionalCast.original_role,
                    order: additionalCast.order,
                });
            }
        }

        const result = await castDoc.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
};
