const express = require("express");
const multer = require("multer");
const libre = require("libreoffice-convert");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ PDF to Word
app.post("/convert/pdf-to-word", upload.single("file"), (req, res) => {
  const file = req.file;
  const outputExt = ".docx";
  const outputFile = `converted/${Date.now()}${outputExt}`;

  const fileBuffer = fs.readFileSync(file.path);
  libre.convert(fileBuffer, outputExt, undefined, (err, done) => {
    if (err) return res.status(500).send("Conversion failed");

    fs.writeFileSync(outputFile, done);
    res.download(outputFile, "converted.docx");
  });
});

// ✅ Word to PDF
app.post("/convert/word-to-pdf", upload.single("file"), (req, res) => {
  const file = req.file;
  const outputExt = ".pdf";
  const outputFile = `converted/${Date.now()}${outputExt}`;

  const fileBuffer = fs.readFileSync(file.path);
  libre.convert(fileBuffer, outputExt, undefined, (err, done) => {
    if (err) return res.status(500).send("Conversion failed");

    fs.writeFileSync(outputFile, done);
    res.download(outputFile, "converted.pdf");
  });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
