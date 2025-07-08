const express = require("express");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const CloudConvert = require("cloudconvert");

// Load .env file
dotenv.config();

const app = express();
app.use(cors());

// Initialize CloudConvert
const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

// Use memory storage for file upload
const upload = multer({ storage: multer.memoryStorage() });

// POST route for conversion
app.post("/convert", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { conversionType } = req.body;

  const inputFormat = conversionType === "pdf-to-word" ? "pdf" : "docx";
  const outputFormat = conversionType === "pdf-to-word" ? "docx" : "pdf";

  try {
    // Create conversion job
    const job = await cloudConvert.jobs.create({
      tasks: {
        upload: {
          operation: "import/upload"
        },
        convert: {
          operation: "convert",
          input: "upload",
          input_format: inputFormat,
          output_format: outputFormat
        },
        export: {
          operation: "export/url",
          input: "convert"
        }
      }
    });

    // Upload file to CloudConvert
    const uploadTask = job.tasks.find(t => t.name === "upload");
    await cloudConvert.tasks.upload(uploadTask, file.buffer, file.originalname);

    // Wait until job is done
    const completedJob = await cloudConvert.jobs.wait(job.id);
    const exportTask = completedJob.tasks.find(t => t.operation === "export/url");
    const fileUrl = exportTask.result.files[0].url;

    // Return download link
    res.json({ downloadUrl: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Conversion failed" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
