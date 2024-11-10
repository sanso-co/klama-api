import Cast from "../models/cast.js";
import Person from "../models/person.js";
import Show from "../models/show.js";

// create cast list for a show

export const addCastToShow = async (req, res) => {
    const { showId } = req.params;
    const { mainCast } = req.body;

    try {
        const thisShow = await Show.findOne({ id: showId });
        let castDoc = await Cast.findOne({ id: showId });
        if (!castDoc) {
            castDoc = new Cast({
                id: showId,
                casts: [],
            });
            await castDoc.save();
        }

        const updatedCasts = [];
        for (const castMember of mainCast) {
            let person = await Person.findOne({ id: castMember.id });
            if (!person) {
                person = await Person.create({
                    id: castMember.id,
                    name: castMember.name,
                    original_name: castMember.original_name,
                    known_for_department: castMember.known_for_department,
                    profile_path: castMember.profile_path,
                    shows: [thisShow._id],
                });
            } else if (!person.shows.includes(thisShow._id)) {
                person.shows.push(thisShow._id);
                await person.save();
            }
            updatedCasts.push({
                person: person._id,
                role: castMember.role,
                original_role: castMember.original_role,
                order: castMember.order,
            });
        }
        castDoc.casts = updatedCasts;
        const result = await castDoc.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateShowCast = async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
};

// get casts for a show
export const getCastsForShow = async (req, res) => {
    const { showId } = req.params;

    try {
        const castDoc = await Cast.findOne({ id: showId }).populate(
            "casts.person",
            "id name original_name known_for_department profile_path"
        );

        if (!castDoc) {
            return res.status(404).json({
                message: "Cast does't exist for this show",
            });
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
        res.status(500).json({ message: error.message });
    }
};
