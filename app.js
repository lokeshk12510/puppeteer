const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());

app.get("/getMockData", async (req,res)=>{
    try {

        let data = [{
            "year": "2021",
            "europe": 2.5,
            "namerica": 2.5,
            "asia": 2.1,
            "lamerica": 1,
            "meast": 0.8,
            "africa": 0.4
          }, {
            "year": "2022",
            "europe": 2.6,
            "namerica": 2.7,
            "asia": 2.2,
            "lamerica": 0.5,
            "meast": 0.4,
            "africa": 0.3
          }, {
            "year": "2023",
            "europe": 2.8,
            "namerica": 2.9,
            "asia": 2.4,
            "lamerica": 0.3,
            "meast": 0.9,
            "africa": 0.5
          }]

        res.status(200).send(data);
        
    } catch (error) {
        console.error("Error:", error);
    res.status(500).send("Internal Server Error");
    }
})

app.get("/convertHtmlToImg", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
        headless:true
    });
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1280, height: 720 });

    // Read the HTML content from the input HTML file
    const htmlContent = await fs.readFile("index.html", { encoding: "utf8" });

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

    res.set('Content-Type', 'image/png');
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
