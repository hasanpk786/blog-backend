const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating schema
const ProgramSchema = new Schema({

    Featured: {
        type: Boolean,
        default: false,
    },

    programName: {
        type: String,
        required: true,
    },
    programTag: {
        taglist: []
            
    },

    programThumbnail: {
        type: String,
        default: "URL",
        requried: false,
    },

    shortDescription: {
        type: String,
        required: true,
    },

    longDescription: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: false,
        default: "2 hours",
    },

    programFee: {
        type: Number,
        required: false,
        default: 1000,
    },

    price: {
        type: String,
        required: true,
    },

    Eventdates: {
        type: String,
        default: Date.now,
        required: true,
    },

    startDate: {
        type: Date,
        default: Date.now,
        required: true,
    },

    endDate: {
        type: Date,
        default: Date.now,
        required: true,
    },

    Cap: {
        type: Number,
        default: 0,
        required: true,
    },

    whoJoin: {
        type: String,
        default: "Adults",
        required: true,
    },

    Location: {
        type: String,
        required: true,
    },

    relatedEvents: {
        type: String,
        default: "None",
        required: true,
    },

    ticketSelect: {
        type: String,
        default: "Festival",
        required: true,
    },
});

mongoose.model("programs", ProgramSchema);