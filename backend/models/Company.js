const mongoose = require("mongoose");


const companySchema = new mongoose.Schema(

{

  name: {
    type: String,
    required: true,
  },


  role: {
    type: String,
    required: true,
  },


  package: {
    type: String,
    required: true,
  },


  requiredSkills: {

    type: [String],

    default: [],

  },


  minCGPA: {

    type: Number,

    default: 0,

  },

  college: {
    type: String,
    required: true,
    index: true,
  },

  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
    index: true,
  },

  createdAt: {

    type: Date,

    default: Date.now,

  }


}

);


const Company = mongoose.model(
  "Company",
  companySchema
);


module.exports = Company;