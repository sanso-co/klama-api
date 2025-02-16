import { RequestHandler } from "express";
import { marked } from "marked";
import createDOMPurifier from "dompurify";
import { JSDOM } from "jsdom";
import Profile from "../models/profile";

// Create DOMPurifier instance
const window = new JSDOM("").window;
const DOMPurify = createDOMPurifier(window);

// Set marked options for security
marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert line breaks to <br>
    pedantic: false, // Conform to markdown.pl
});

export const getProfile: RequestHandler = async (req, res) => {
    try {
        const profile = await Profile.findOne();

        if (!profile) {
            res.status(404).json({
                success: false,
                message: "Profile not found",
            });
            return;
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updateProfile: RequestHandler = async (req, res) => {
    const { about, email } = req.body;

    try {
        // Input validation
        // if (!about || !email) {
        //     res.status(400).json({
        //         success: false,
        //         message: "Both about and email are required",
        //     });
        //     return;
        // }

        // Email validation
        // const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        // if (!emailRegex.test(email)) {
        //     res.status(400).json({
        //         success: false,
        //         message: "Invalid email format",
        //     });
        //     return;
        // }

        // Markdown validation
        if (about.length > 50000) {
            res.status(400).json({
                success: false,
                message: "Markdown content too long",
            });
            return;
        }

        // Convert markdown to HTML
        const rawHtml = await marked(about);

        // Sanitize HTML
        const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
            ALLOWED_TAGS: [
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "p",
                "ul",
                "ol",
                "li",
                "strong",
                "em",
                "blockquote",
                "code",
                "pre",
                "br",
                "a",
            ],
            ALLOWED_ATTR: ["href"],
        });

        // Find existing profile or create new one
        const profile = await Profile.findOneAndUpdate(
            {}, // empty filter to match any document
            {
                about,
                // email,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
