import cloudinary from "../middleware/cloudinary.js";
import Hero from "../models/hero.js";

export const addHeroItem = async (req, res) => {
    const { img, title, tag, url, order } = req.body;

    try {
        const isValidUrl = (string) => {
            try {
                new URL(string);
                return true;
            } catch (error) {
                return false;
            }
        };

        let imgUrl;

        if (img && img.startsWith("data:image")) {
            const uploadedResponse = await cloudinary.uploader.upload(img, {
                upload_preset: "kdrama_hero",
            });
            imgUrl = uploadedResponse.url;
        } else if (isValidUrl(img) && img.includes("cloudinary.com")) {
            imgUrl = img;
        } else {
            throw new Error("Invalid image format provided");
        }

        const heroData = {
            title,
            tag,
            order,
            url,
            img: imgUrl,
        };

        const newHero = new Hero(heroData);
        result = await newHero.save();

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in addOrUpdateHeroItem:", error);
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
};

// REMOVE HERO ITEM
export const removeHeroItem = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedHero = await Hero.findByIdAndDelete(id);

        if (!deletedHero) {
            return res.status(404).json({ message: "Hero item not found." });
        }
        res.status(200).json({ message: "Hero item removed successfully." });
    } catch (error) {
        res.status(500).json(error);
    }
};

// UPDATE HERO ITEM
export const updateHeroItem = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const { img, title, tag, url, order } = req.body;

    try {
        const heroData = {
            title,
            tag,
            order,
            url,
            img,
        };

        const updatedHero = await Hero.findByIdAndUpdate(id, heroData, { new: true });

        if (!updatedHero) {
            return res.status(404).json({ message: "Hero item not found." });
        }

        res.status(200).json({ message: "Hero item updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// GET ALL HERO ITEMS
export const getAllHero = async (req, res) => {
    try {
        let heros = await Hero.find().sort({
            order: 1,
        });
        res.status(200).json(heros);
    } catch (error) {
        res.status(500).json(error);
    }
};
