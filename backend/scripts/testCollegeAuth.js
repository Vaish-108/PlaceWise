const mongoose = require("mongoose");
const dotenv = require("dotenv");
const College = require("../models/College");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const colleges = await College.find({});
    console.log("Colleges available:", colleges.map((c) => ({ id: c._id.toString(), code: c.code, name: c.name })));
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
