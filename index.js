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
    const htmlContent = String.raw`<!DOCTYPE html>
    <html>
      <head>
        <title>PDF Generation</title>
      </head>
      <body>
      <table class="table-colored mt-15" width="100%">
        <tr>
          <th>Average of Workers On Site by Month</th>
        </tr>
        <tr>
          <td>
            <div id="areaChart"></div>
          </td>
        </tr>
      </table>
      <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
      <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
      <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
  
      <script>
        var apiUrl =
          "http://localhost:5224/api/PrintPdf/GraphGet";
  
        function average(averageWorkersData) {
          let data = averageWorkersData.map((item) => ({
            date: new Date("01"+item.label).getTime(),
            value: item.value ?? 0,
          }));
  
          console.log(data);
  
          am5.ready(function () {
            console.log();
  
            let root = am5.Root.new("areaChart");
            // Set themes
            let myTheme = am5.Theme.new(root);
            root.setThemes([am5themes_Animated.new(root), myTheme]);
            myTheme.rule("ColorSet").set("colors", [am5.color("#B1D489")]);
  
            // Create chart
            let chart = root.container.children.push(
              am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                // wheelX: 'panX',
                // wheelY: 'zoomX',
                pinchZoomX: true,
              })
            );
  
            // Add cursor
            let cursor = chart.set(
              "cursor",
              am5xy.XYCursor.new(root, {
                behavior: "none",
              })
            );
            cursor.lineY.set("visible", false);
  
            // Create axes
            let xAxis = chart.xAxes.push(
              am5xy.DateAxis.new(root, {
                maxDeviation: 0.5,
                baseInterval: {
                  timeUnit: "month",
                  count: 1,
                },
                renderer: am5xy.AxisRendererX.new(root, {
                  pan: "zoom",
                  minGridDistance: 2,
                }),
                tooltip: am5.Tooltip.new(root, {}),
              })
            );
  
            xAxis.get("renderer").labels.template.setAll({
              rotation: -90,
              fontSize: 11,
            });
  
            let yAxis = chart.yAxes.push(
              am5xy.ValueAxis.new(root, {
                maxDeviation: 1,
                renderer: am5xy.AxisRendererY.new(root, {
                  pan: "zoom",
                }),
              })
            );
  
            // Add series
            let series = chart.series.push(
              am5xy.SmoothedXLineSeries.new(root, {
                name: "Series",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                valueXField: "date",
                tooltip: am5.Tooltip.new(root, {
                  labelText: "{valueY}",
                }),
              })
            );
  
            series.fills.template.setAll({
              visible: true,
              fillOpacity: 0.2,
            });
  
            series.bullets.push(function () {
              return am5.Bullet.new(root, {
                locationY: 0,
                sprite: am5.Circle.new(root, {
                  radius: 6,
                  stroke: root.interfaceColors.get("background"),
                  strokeWidth: 2,
                  fill: series.get("fill"),
                }),
              });
            });
            series.data.setAll(data);
  
            // Make stuff animate on load
            series.appear(1000);
            chart.appear(1000, 100);
          });
        }
  
        function makeAPICallWithPayload(url, method, payload, callback) {
          var xhr = new XMLHttpRequest();
          xhr.open(method, url, true);
          xhr.setRequestHeader("Content-Type", "application/json"); // Set the appropriate Content-Type header for your API
  
          xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
              // Request was successful
              callback(null, xhr.responseText);
            } else {
              // Request failed
              callback("Error: " + xhr.status);
            }
          };
  
          xhr.onerror = function () {
            // Network errors
            callback("Network error");
          };
  
          xhr.send(JSON.stringify(payload));
        }
  
        // Example usage for a POST request:
        var postData = {
          jobId: "3572",
          period: "JUL23",
          projectId: "1753",
        };
  
        makeAPICallWithPayload(
          apiUrl,
          "POST",
          postData,
          function (error, response) {
            if (error) {
              console.error("Error:", error);
            } else {
              let data = JSON.parse(response);
              average(data.result.hseOverall.hseAverageWorkers);
            }
          }
        );
      </script>
    </body>
  </html>
  `;

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
    // await browser.close();
  }
})();
