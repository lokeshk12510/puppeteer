const puppeteer = require("puppeteer");
const fs = require("fs/promises");

(async () => {
  // Create a browser instance
  const browser = await puppeteer.launch({
    headless: false,
  });

  // Create a new page
  const page = await browser.newPage();

  // Set viewport width and height
  await page.setViewport({ width: 1280, height: 720 });

  //   const website_url = "https://www.intergy.com.au/";

  //   // Open URL in current page
  //   await page.goto(website_url, { waitUntil: "networkidle0" });
  try {
    // Read the HTML content from the input HTML file
    const htmlContent = await fs.readFile("index.html", { encoding: "utf8" });

    // Navigate to a data URL with the HTML content
    await page.goto(`data:text/html,${htmlContent}`, {
      waitUntil: "networkidle0",
    });

    // Capture screenshot
    await page.screenshot({
      path: "images/html.jpg",
      type: "png",
      fullPage: true,
    });

    console.log("Screenshot saved as html.png");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();
