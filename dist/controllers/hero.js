"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHeroItem = exports.addHeroItem = exports.getAllHero = void 0;
const cloudinary_1 = __importDefault(require("../middleware/cloudinary"));
const hero_1 = __importDefault(require("../models/hero"));
const getAllHero = async (req, res) => {
    try {
        const heros = await hero_1.default.find().sort({
            order: 1,
        });
        res.status(200).json(heros);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getAllHero = getAllHero;
const addHeroItem = async (req, res) => {
    const { img, title, tagline, tag, url, order } = req.body;
    try {
        const isValidUrl = (string) => {
            try {
                new URL(string);
                return true;
            }
            catch (error) {
                return false;
            }
        };
        let imgUrl;
        if (img && img.startsWith("data:image")) {
            const uploadedResponse = await cloudinary_1.default.uploader.upload(img, {
                upload_preset: "kdrama_hero",
            });
            imgUrl = uploadedResponse.url;
        }
        else if (isValidUrl(img) && img.includes("cloudinary.com")) {
            imgUrl = img;
        }
        else {
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
        const newHero = new hero_1.default(heroData);
        const result = await newHero.save();
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error in addOrUpdateHeroItem:", error);
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
};
exports.addHeroItem = addHeroItem;
const updateHeroItem = async (req, res) => {
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
        const updatedHero = await hero_1.default.findByIdAndUpdate(id, heroData, { new: true });
        if (!updatedHero) {
            res.status(404).json({ message: "Hero item not found." });
            return;
        }
        res.status(200).json({ message: "Hero item updated successfully." });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateHeroItem = updateHeroItem;
