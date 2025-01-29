"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShowCast = exports.getCastsForShow = void 0;
const cast_1 = __importDefault(require("../models/cast"));
const show_1 = __importDefault(require("../models/show"));
const person_1 = __importDefault(require("../models/person"));
const getCastsForShow = async (req, res) => {
    const { showId } = req.params;
    try {
        const castDoc = await cast_1.default.findOne({ id: showId }).populate("casts.person", "id name original_name known_for_department profile_path");
        if (!castDoc) {
            res.status(404).json({
                message: "Cast does't exist for this show",
            });
            return;
        }
        const result = castDoc.casts.map((cast) => ({
            id: cast.person.id,
            role: cast.role,
            name: cast.person.name,
            profile_path: cast.person.profile_path,
            order: cast.order,
        }));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getCastsForShow = getCastsForShow;
const updateShowCast = async (req, res) => {
    const { showId } = req.params;
    const { additionalCasts } = req.body;
    try {
        let castDoc = await cast_1.default.findOne({ id: showId });
        if (!castDoc) {
            castDoc = new cast_1.default({
                id: showId,
                casts: [],
            });
            await castDoc.save();
        }
        const thisShow = await show_1.default.findOne({ id: showId });
        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }
        for (const additionalCast of additionalCasts) {
            const existingCastIndex = castDoc.casts.findIndex((cast) => cast.person.id === additionalCast.id);
            if (existingCastIndex === -1) {
                let person = await person_1.default.findOne({ id: additionalCast.id });
                if (!person) {
                    person = await person_1.default.create({
                        id: additionalCast.id,
                        name: additionalCast.name,
                        original_name: additionalCast.original_name,
                        known_for_department: additionalCast.known_for_department,
                        profile_path: additionalCast.profile_path,
                        shows: [thisShow._id],
                    });
                }
                else if (!person.shows.includes(thisShow._id)) {
                    person.shows.push(thisShow._id);
                    await person.save();
                }
                castDoc.casts.push({
                    person: person._id,
                    role: additionalCast.role,
                    original_role: additionalCast.original_role,
                    name: person.name,
                    order: additionalCast.order,
                });
            }
        }
        const result = await castDoc.save();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.updateShowCast = updateShowCast;
