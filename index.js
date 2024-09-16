import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

//import routes
import authRoutes from "./routes/auth.js";
import collectionRoutes from "./routes/collection.js";
import collectionGroupRoutes from "./routes/collectionGroup.js";
import keywordRoutes from "./routes/keyword.js";
import rateRoutes from "./routes/rate.js";
import showRoutes from "./routes/show.js";
import periodicCollection from "./routes/periodicCollection.js";
import permanentCollection from "./routes/permanentCollection.js";
import providerCollection from "./routes/providerCollection.js";
import recommendations from "./routes/recommendations.js";

const app = express();
dotenv.config();

//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

//use router
app.use("/auth", authRoutes);
app.use("/collections", collectionRoutes);
app.use("/collection-group", collectionGroupRoutes);
app.use("/keywords", keywordRoutes);
app.use("/rate", rateRoutes);
app.use("/shows", showRoutes);
app.use("/periodic-collection", periodicCollection);
app.use("/permanent-collection", permanentCollection);
app.use("/provider-collection", providerCollection);
app.use("/recommendations", recommendations);

//db
const dbOptions = {};

const PORT = process.env.PORT || 3500;

mongoose
    .connect(process.env.MONGODB_ADDRESS, dbOptions)
    .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
    .catch((error) => console.log(error.message));
