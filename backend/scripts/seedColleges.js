const mongoose = require("mongoose");
const College = require("../models/College");

const seedColleges = async () => {
  const colleges = [
    { name: "IGDTUW", code: "igdtuw", description: "Indira Gandhi Delhi Technical University for Women", isActive: true },
    { name: "NSUT", code: "nsut", description: "Netaji Subhas University of Technology", isActive: true },
    { name: "DTU", code: "dtu", description: "Delhi Technological University", isActive: true },
    { name: "IIT Delhi", code: "iitd", description: "Indian Institute of Technology Delhi", isActive: true },
    { name: "IIIT Delhi", code: "iiitd", description: "Indraprastha Institute of Information Technology Delhi", isActive: true },
  ];

  try {
    for (const college of colleges) {
      const existing = await College.findOne({ code: college.code });
      if (!existing) {
        await College.create(college);
        console.log(`Seeded college: ${college.name}`);
      } else {
        console.log(`College already exists: ${college.name}`);
      }
    }
  } catch (error) {
    console.error("College seeding failed:", error);
  }
};

module.exports = seedColleges;
