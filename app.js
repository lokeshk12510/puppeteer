const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const cors = require("cors");
const bodyParser = require("body-parser");

// mock
const data = require("./mock/GraphGet.json");

const app = express();
const port = 3002;

app.use(cors());

// Parse application/json
app.use(bodyParser.json());

app.post("/GraphGet", async (req, res) => {
  try {
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/convertHtmlToImg", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1280, height: 720 });

    let type = req.body.type;

    async function findTemplate() {
      switch (type) {
        case "average":
          return await fs.readFile("./templates/average.html", {
            encoding: "utf8",
          });

        default:
          return await fs.readFile("index.html", { encoding: "utf8" });
      }
    }

    // Read the HTML content from the input HTML file
    const htmlContent = findTemplate();

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
