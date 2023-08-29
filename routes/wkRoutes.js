const fs = require("fs");
const wkhtmltopdf = require("wkhtmltopdf");
const path = require("path");
const express = require("express");
const router = express.Router();

// Define routes
router.get("/", (req, res) => {
  res.send("Hello, World! - WKHtmltopdf");
});

router.get("/generate", async (req, res) => {
  // Get the absolute path to the HTML template
  const templatePath = path.join(__dirname, "templates", "average.html");

  // Read the HTML template
  fs.readFile(templatePath, "utf-8", async (err, template) => {
    if (err) {
      return res.status(500).send("Error reading template file.");
    }

    // Generate PDF from the HTML template
    const pdf = await wkhtmltopdf(template, { pageSize: "letter" }).pipe(res);

    res.status(200).send(pdf);
  });
});

module.exports = router;
