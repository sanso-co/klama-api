import { Request, Response } from "express";
import { create } from "xmlbuilder2";
import { formatUrl } from "../utilities/formatUrl";
import Show from "../models/show";
import Genre from "../models/genre";
import Provider from "../models/provider";
import Keyword from "../models/keyword";
import Person from "../models/person";
import Credit from "../models/credit";

const baseUrl = "https://k-lama.com";

export const generateSitemap = async (req: Request, res: Response) => {
    try {
        const staticRoutes = ["/", "/discover", "/login", "/signup"];

        // Fetch dynamic show details
        const shows = await Show.find({}, "_id id").lean();
        const showUrls = shows.map((show) => `/details/${show.id}`);

        // Fetch dynamic category for genre
        const genres = await Genre.find({}, "id name").lean();
        const genreUrls = genres.map((genre) => `/genre/${formatUrl(genre.name)}/${genre.id}`);

        // Fetch dynamic category for provider
        const providers = await Provider.find({}, "id name").lean();
        const providerUrls = providers.map(
            (provider) => `/provider/${formatUrl(provider.name)}/${provider.id}`
        );

        // Fetch dynamic category for keyword
        const keywords = await Keyword.find({}, "id name").lean();
        const keywordUrls = keywords.map(
            (keyword) => `/keyword/${formatUrl(keyword.name)}/${keyword.id}`
        );

        // Fetch dynamic category for cast
        const casts = await Person.find({ known_for_department: "Acting" }, "id name").lean();
        const castUrls = casts.map((cast) => `/cast/${formatUrl(cast.name)}/${cast.id}`);

        // Fetch dynamic category for credit
        const credits = await Credit.find({}, "id name").lean();
        const creditUrls = credits.map((credit) => `/crew/${formatUrl(credit.name)}/${credit.id}`);

        // Create dynamic url for years from 2000 +
        const yearUrls = Array.from({ length: 26 }, (_, index) => `/year/released/${2000 + index}`);

        // Build the XML structure
        const sitemapObj = {
            urlset: {
                "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
                url: [
                    ...staticRoutes.map((route) => ({ loc: `${baseUrl}${route}` })),
                    ...showUrls.map((route) => ({ loc: `${baseUrl}${route}` })),
                    ...genreUrls.map((route) => ({ loc: `${baseUrl}${route}` })),
                    ...providerUrls.map((route) => ({ loc: `${baseUrl}${route}` })),
                    ...keywordUrls.map((route) => ({ loc: `${baseUrl}${route}` })),
                    ...castUrls.map((route) => ({ loc: `${baseUrl}${route}` })),
                    ...creditUrls.map((route) => ({ loc: `${baseUrl}${route}` })),
                    ...yearUrls.map((route) => ({ loc: `${baseUrl}${route}` })),
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
