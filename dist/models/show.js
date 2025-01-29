"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const showSchema = new mongoose_1.Schema({
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
        default: 1,
    },
    related_seasons: [
        {
            season: {
                type: Number,
                default: 1,
            },
            show: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Show",
            },
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
    trailer: [
        {
            key: {
                type: String,
            },
            site: {
                type: String,
            },
        },
    ],
    genres: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Genre",
        },
    ],
    keywords: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Keyword",
        },
    ],
    tones: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Tone",
        },
    ],
    credits: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Network",
        },
    ],
    production_companies: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Production",
        },
    ],
    show_type: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    likes_count: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
// Indexes
showSchema.index({ first_air_date: 1 });
showSchema.index({ genres: 1 });
showSchema.index({ id: 1 }, { unique: true });
showSchema.index({ name: 1 });
showSchema.index({ original_name: 1 });
showSchema.index({ show_type: 1 });
showSchema.index({ popularity_score: -1 });
exports.default = mongoose_1.default.model("Show", showSchema);
