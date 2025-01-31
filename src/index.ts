import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

//import models
import "./models";

//import routes
import authRoutes from "./routes/auth";
import heroRoutes from "./routes/hero";
import showRoutes from "./routes/show";
import genreRoutes from "./routes/genre";
import keywordRoutes from "./routes/keyword";
import toneRoutes from "./routes/tone";
import providerRoutes from "./routes/provider";
import castRoutes from "./routes/cast";
import creditRoutes from "./routes/credit";
import personRoutes from "./routes/person";
import userRoutes from "./routes/user";
import userShowRoutes from "./routes/userShow";
import showTypeRoutes from "./routes/showType";
import periodicRoutes from "./routes/periodicCollection";
import permanentRoutes from "./routes/permanentCollection";
import recommendationsRoutes from "./routes/recommendations";
import sitemapRoutes from "./routes/sitemap";

const app = express();
dotenv.config();

//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

//use router
app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/show", showRoutes);
app.use("/api/genre", genreRoutes);
app.use("/api/keyword", keywordRoutes);
app.use("/api/tone", toneRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/cast", castRoutes);
app.use("/api/credit", creditRoutes);
app.use("/api/person", personRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user-show", userShowRoutes);
app.use("/api/type", showTypeRoutes);
app.use("/api/periodic-collection", periodicRoutes);
app.use("/api/permanent-collection", permanentRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/", sitemapRoutes);

const dbOptions: mongoose.ConnectOptions = {};

const PORT = process.env.PORT || 4500;

mongoose
    .connect(process.env.MONGODB_ADDRESS!, dbOptions)
    .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
    .catch((error) => console.log(error.message));
