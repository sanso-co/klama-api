import mongoose from "mongoose";

const showSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        original_name: {
            type: String,
            required: true,
        },
        season_number: {
            type: Number,
        },
        related_seasons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Show",
            },
        ],
        poster_path: {
            US: {
                path: {
                    type: String,
                },
            },
            KR: {
                path: {
                    type: String,
                },
            },
        },
        genres: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Genre",
            },
        ],
        credits: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Credit",
            },
        ],
        overview: {
            type: String,
        },
        original_overview: {
            type: String,
        },
        first_air_date: {
            type: Date,
        },
        number_of_episodes: {
            type: Number,
        },
        homepage: {
            type: String,
        },
        networks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Network",
            },
        ],
        production_companies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Production",
            },
        ],
        show_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShowType",
            required: true,
        },
        original_story: {
            author: {
                name: {
                    type: String,
                },
                korean_name: {
                    type: String,
                },
            },
            title: {
                title: {
                    type: String,
                },
                korean_title: {
                    type: String,
                },
            },
        },
        popularity_score: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

showSchema.index({ first_air_date: 1 });
showSchema.index({ genres: 1 });
showSchema.index({ id: 1 }, { unique: true });
showSchema.index({ name: 1 });
showSchema.index({ original_name: 1 });
showSchema.index({ show_type: 1 });
showSchema.index({ popularity_score: -1 });

export default mongoose.model("Show", showSchema);
