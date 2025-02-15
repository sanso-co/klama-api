import { RequestHandler } from "express";
import cloudinary from "../middleware/cloudinary";
import Hero from "../models/hero";

export const getAllHero: RequestHandler = async (req, res) => {
    try {
        const heros = await Hero.find().sort({
            order: 1,
        });
        res.status(200).json(heros);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const addHeroItem: RequestHandler = async (req, res) => {
    const { img, title, tagline, tag, url, order } = req.body;

    try {
        const isValidUrl = (string: string) => {
            try {
                new URL(string);
                return true;
            } catch (error) {
                return false;
            }
        };

        let imgUrl;

        if (img && img.startsWith("data:image")) {
            const uploadedResponse = await (cloudinary as any).uploader.upload(img, {
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
            tagline,
            tag,
            order,
            url,
            img: imgUrl,
        };

        const newHero = new Hero(heroData);
        const result = await newHero.save();

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in addOrUpdateHeroItem:", error);
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
};

export const updateHeroItem: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { img, title, tagline, tag, url, order } = req.body;

    try {
        const heroData = {
            title,
            tagline,
            tag,
            order,
            url,
            img,
        };

        const updatedHero = await Hero.findByIdAndUpdate(id, heroData, { new: true });

        if (!updatedHero) {
            res.status(404).json({ message: "Hero item not found." });
            return;
        }

        res.status(200).json({ message: "Hero item updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// REMOVE HERO ITEM
export const removeHeroItem: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedHero = await Hero.findByIdAndDelete(id);

        if (!deletedHero) {
            res.status(404).json({ message: "Hero item not found." });
            return;
        }
        res.status(200).json({ message: "Hero item removed successfully." });
    } catch (error) {
        res.status(500).json(error);
    }
};
