const express = require("express");
const app = express();
// mock
const data = require("./mock/GraphGet.json");

// Custom initialization logic before starting the server
console.log("Initializing...");

// Define routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/GraphGet", async (req, res) => {
  try {
    res.status(200).send(data);
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
