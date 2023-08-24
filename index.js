const express = require("express");
const app = express();

// Custom initialization logic before starting the server
console.log("Initializing...");

// Define routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
