import Show from "../models/show.js";

//create a new show
export const createShow = async (req, res) => {
    const { show } = req.body;

    try {
        const existingShow = await Show.findOne({ id: show.id });

        if (existingShow) {
            return res.status(400).json("Show already exists");
        }

        const newShow = await Show.create(show);

        res.status(200).json(newShow);
    } catch (error) {
        res.status(500).json(error);
    }
};

// get all shows
export const getAllShows = async (req, res) => {
    try {
        let shows = Show.find();
        const result = await shows;
        res.status(200).json({ results: result });
    } catch (error) {
        res.status(500).json(error);
    }
};
