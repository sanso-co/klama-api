import { Request, Response } from "express";
import { create } from "xmlbuilder2";
import Show from "../models/show";
import Genre from "../models/genre";

const baseUrl = "https://k-lama.com";

export const generateSitemap = async (req: Request, res: Response) => {
    try {
        const staticRoutes = ["/", "/discover", "/login", "/signup"];

        // Fetch dynamic show details
        const shows = await Show.find({}, "_id id").lean();
        const showUrls = shows.map((show) => `/details/${show.id}`);

        // Fetch dynamic category for genre
        const genres = await Genre.find({}, "id name").lean();
        const genreUrls = genres.map((genre) => `/genre/${genre.name.toLowerCase()}/${genre.id}`);

        // Build the XML structure
        const sitemapObj = {
            urlset: {
                "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
                url: [
                    ...staticRoutes.map((route) => ({ loc: `${baseUrl}${route}` })),
                    ...showUrls.map((route) => ({ loc: `${baseUrl}${route}` })),
                    ...genreUrls.map((route) => ({ loc: `${baseUrl}${route}` })),
                ],
            },
        };

        // Generate XML sitemap
        const xml = create(sitemapObj).end({ prettyPrint: true });

        // Set the response headers and send XML
        res.set("Content-Type", "application/xml");
        res.send(xml);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Error generating sitemap");
    }
};
