const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "..", "uploads");

const ensureUploadsDir = () => {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureUploadsDir();
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_.]/g, "_");
        cb(null, `${Date.now()}-${safeName}`);
    },
});

const createFileFilter = (type) => (req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const mimeType = (file.mimetype || "").toLowerCase();

    const isPdf = mimeType === "application/pdf" || extension === ".pdf";
    const isImage = [".jpg", ".jpeg", ".png", ".webp"].includes(extension) || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(mimeType);

    if (type === "pdf" && isPdf) {
        return cb(null, true);
    }

    if (type === "image" && isImage) {
        return cb(null, true);
    }

    cb(new Error(`Invalid file type for ${type} upload.`));
};

const resumeUpload = multer({
    storage,
    fileFilter: createFileFilter("pdf"),
    limits: { fileSize: 10 * 1024 * 1024 },
});

const imageUpload = multer({
    storage,
    fileFilter: createFileFilter("image"),
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
    resumeUpload,
    imageUpload,
};
