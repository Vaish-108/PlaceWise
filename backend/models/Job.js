const mongoose = require("mongoose");


const jobSchema = new mongoose.Schema({

    company: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Company",

        required: true

    },


    title: {

        type: String,

        required: true

    },


    description: {

        type: String,

        required: true

    },


    package: {

        type: String,

        required: true

    },

    applicationLink: {

        type: String,

        required:true

    },


    requiredSkills: {

        type: [String],

        default: []

    },


    minCGPA: {

        type: Number,

        default: 0

    },


    createdAt: {

        type: Date,

        default: Date.now

    }

    


});


const Job = mongoose.model(
    "Job",
    jobSchema
);


module.exports = Job;