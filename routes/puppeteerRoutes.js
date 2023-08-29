const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

// mock
const data = require("../mock/GraphGet.json");

// Define routes
router.get("/", (req, res) => {
  res.send("Hello, World! - puppeteer");
});

router.get("/GraphGetTest", async (req, res) => {
  try {
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/GraphGet", async (req, res) => {
  try {
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/convertTest", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath:
        "/c/home/site/wwwroot/.cache/puppeteer/chrome/win32-116.0.5845.96/chrome-win32/chrome.exe",
      args: ["--enable-gpu"],
    });
    // const browser = await puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io/' });
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1280, height: 720 });

    // Navigate to a data URL with the HTML content
    await page.goto("https://www.intergy.com.au/", {
      waitUntil: "networkidle0",
    });

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
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

router.get("/convertHtmlToImg", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1280, height: 720 });

    let type = "average";

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

module.exports = router;
