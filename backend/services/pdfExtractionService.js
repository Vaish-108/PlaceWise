require("pdf-parse/worker");

const fs = require("fs").promises;
const { PDFParse } = require("pdf-parse");

/**
 * Reads a PDF file from disk and returns its plain-text content.
 * @param {string} filePath - Absolute or relative path to the PDF file
 * @returns {Promise<string>} Extracted text (empty string if none found)
 */
const extractTextFromPdf = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text ? result.text.trim() : "";
  } finally {
    await parser.destroy();
  }
};

module.exports = {
  extractTextFromPdf,
};
