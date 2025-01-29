"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
//import models
require("./models");
//import routes
const auth_1 = __importDefault(require("./routes/auth"));
const hero_1 = __importDefault(require("./routes/hero"));
const show_1 = __importDefault(require("./routes/show"));
const genre_1 = __importDefault(require("./routes/genre"));
const keyword_1 = __importDefault(require("./routes/keyword"));
const tone_1 = __importDefault(require("./routes/tone"));
const provider_1 = __importDefault(require("./routes/provider"));
const cast_1 = __importDefault(require("./routes/cast"));
const credit_1 = __importDefault(require("./routes/credit"));
const person_1 = __importDefault(require("./routes/person"));
const user_1 = __importDefault(require("./routes/user"));
const userShow_1 = __importDefault(require("./routes/userShow"));
const showType_1 = __importDefault(require("./routes/showType"));
const periodicCollection_1 = __importDefault(require("./routes/periodicCollection"));
const permanentCollection_1 = __importDefault(require("./routes/permanentCollection"));
const recommendations_1 = __importDefault(require("./routes/recommendations"));
const app = (0, express_1.default)();
dotenv_1.default.config();
//middlewares
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cors_1.default)());
//use router
app.use("/auth", auth_1.default);
app.use("/hero", hero_1.default);
app.use("/show", show_1.default);
app.use("/genre", genre_1.default);
app.use("/keyword", keyword_1.default);
app.use("/tone", tone_1.default);
app.use("/provider", provider_1.default);
app.use("/cast", cast_1.default);
app.use("/credit", credit_1.default);
app.use("/person", person_1.default);
app.use("/user", user_1.default);
app.use("/user-show", userShow_1.default);
app.use("/type", showType_1.default);
app.use("/periodic-collection", periodicCollection_1.default);
app.use("/permanent-collection", permanentCollection_1.default);
app.use("/recommendations", recommendations_1.default);
const dbOptions = {};
const PORT = process.env.PORT || 4500;
mongoose_1.default
    .connect(process.env.MONGODB_ADDRESS, dbOptions)
    .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
    .catch((error) => console.log(error.message));
