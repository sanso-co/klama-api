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

        const existingHero = await Hero.findOne({ order });

        let result;
        if (existingHero) {
            result = await Hero.findOneAndUpdate({ order }, heroData, {
                new: true,
                runValidators: true,
            });
        } else {
            const newHero = new Hero(heroData);
            result = await newHero.save();
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in addOrUpdateHeroItem:", error);
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
};

// get all hero
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
