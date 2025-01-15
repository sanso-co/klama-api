import { RequestHandler } from "express";
import Cast from "../models/cast";

interface CastParams {
    showId: string;
}

export const getCastsForShow: RequestHandler<CastParams, {}, {}, {}> = async (req, res) => {
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
            id: cast.person.id,
            known_for_department: cast.person.known_for_department,
            name: cast.person.name,
            original_name: cast.person.original_name,
            profile_path: cast.person.profile_path,
            role: cast.role,
            order: cast.order,
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
};
