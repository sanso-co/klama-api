import ShowType from "../models/showType.js";

export const addShowType = async (req, res) => {
    const showType = req.body;

    try {
        const existingType = await ShowType.findOne({ id: showType.id });

        if (existingType) {
            return res.status(400).json("Show type already exists");
        }

        const newShowType = await ShowType.create(showType);

        res.status(200).json(newShowType);
    } catch (error) {}
};

// get all show types
export const getAllShowType = async (req, res) => {
    try {
        let types = await ShowType.find().sort({
            id: 1,
        });
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json(error);
    }
};
