const Announcement = require("../models/Announcement");

const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const announcement = new Announcement({
      title,
      message,
      createdBy: req.admin._id,
    });

    await announcement.save();

    return res.status(201).json({
      message: "Announcement Created Successfully",
      announcement,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email designation");

    return res.status(200).json(announcements);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
};
