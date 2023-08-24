const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const cors = require("cors");

// mock
const data = require("./mock/GraphGet.json");

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

app.get("/GraphGetTest", async (req, res) => {
  try {
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/GraphGet", async (req, res) => {
  try {
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/convertHtmlToImg", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1280, height: 720 })

    let type = "average"

    async function findTemplate() {
      switch (type) {
        case "average":
          return await fs.readFile("./templates/average.html", {
            encoding: "utf8",
          });
        case "regulatory":
          return await fs.readFile("./templates/regulatory.html", {
            encoding: "utf8",
          });

        default:
          return await fs.readFile("index.html", { encoding: "utf8" });
      }
    }

    // Read the HTML content from the input HTML file
    const htmlContent = await findTemplate();

    await page.setContent(htmlContent);

    // Navigate to a data URL with the HTML content
    await page.goto(`data:text/html,${htmlContent}`, {
      waitUntil: "networkidle0",
    });

    // const imageBuffer = await page.screenshot();
    // Capture screenshot
    const imageBuffer = await page.screenshot({
      path: `images/chart${new Date().getTime()}.png`,
      type: "png",
      fullPage: true,
    });

    await browser.close();

    res.set("Content-Type", "image/png");
    // res.send(imageBuffer);
    res.status(200).send(imageBuffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
