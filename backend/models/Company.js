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