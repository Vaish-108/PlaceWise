const fs = require("fs").promises;
const pdfParse = require("pdf-parse");

/**
 * Reads a PDF file from disk and returns its plain-text content.
 * @param {string} filePath - Absolute or relative path to the PDF file
 * @returns {Promise<string>} Extracted text (empty string if none found)
 */
const extractTextFromPdf = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const result = await pdfParse(buffer);
  return result?.text?.trim() || "";
};

module.exports = {
  extractTextFromPdf,
};
