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

const app = express();
dotenv.config();

//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

//use router
app.use("/auth", authRoutes);
app.use("/hero", heroRoutes);
app.use("/show", showRoutes);
app.use("/genre", genreRoutes);
app.use("/keyword", keywordRoutes);
app.use("/tone", toneRoutes);
app.use("/provider", providerRoutes);
app.use("/cast", castRoutes);
app.use("/credit", creditRoutes);
app.use("/person", personRoutes);
app.use("/user", userRoutes);
app.use("/user-show", userShowRoutes);
app.use("/type", showTypeRoutes);
app.use("/periodic-collection", periodicRoutes);
app.use("/permanent-collection", permanentRoutes);
app.use("/recommendations", recommendationsRoutes);

const dbOptions: mongoose.ConnectOptions = {};

const PORT = process.env.PORT || 4500;

mongoose
    .connect(process.env.MONGODB_ADDRESS!, dbOptions)
    .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
    .catch((error) => console.log(error.message));
