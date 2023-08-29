const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const wkhtmltopdf = require("wkhtmltopdf");
const path = require("path");
const fs = require("fs/promises");
const { exec } = require("child_process");

const app = express();

app.use(cors());

// Parse application/json
app.use(bodyParser.json());

// Custom initialization logic before starting the server
console.log("Initializing...");

// Define routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/testpdf", (req, res) => {
  const url = "https://www.intergy.com.au/"; // Replace with the URL you want to convert to PDF
  const pdfFilename = "generated.pdf";

  const command = `wkhtmltopdf ${url} ${pdfFilename}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating PDF: ${error}`);
      res.status(500).send("Error generating PDF");
    } else {
      console.log("PDF generated successfully");
      // Return the generated PDF as a response
      res.download(pdfFilename);
    }
  });
});

app.get("/wktest", (req, res) => {
  wkhtmltopdf.command = "C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe";
  const pdfStream = wkhtmltopdf("https://www.intergy.com.au/");
  res.setHeader("Content-Type", "application/pdf");
  pdfStream.pipe(res);
});

app.get("/generate", async (req, res) => {
  try {
    // Get the absolute path to the HTML template
    const templatePath = path.join(__dirname, "templates", "average.html");

    const htmlContent = await fs.readFile(templatePath, {
      encoding: "utf-8",
    });

    if (!htmlContent) {
      return res.status(500).send("Error reading template file.");
    }

    wkhtmltopdf.command = "C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe";

    // Generate PDF from the HTML template
    const pdfStream = wkhtmltopdf(htmlContent, { pageSize: "letter" });

    // Set headers for PDF response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=generated.pdf");

    console.log(pdfStream, "PDF");

    // Pipe the PDF content to the response
    pdfStream.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

const puppeteerRoutes = require("./routes/puppeteerRoutes");
const wkRoutes = require("./routes/wkRoutes");

app.use("/puppetter", puppeteerRoutes);
app.use("/wkRoutes", wkRoutes);

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
