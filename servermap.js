const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.get("/data", (req, res) => {
   const dataPath = path.join(__dirname, "mapdata.json");

   fs.readFile(dataPath, "utf8", (err, jsonData) => {
      if (err) {
         res.status(500).send("Error reading data file");
         return;
      }

      try {
         const data = JSON.parse(jsonData);
         res.json(data);
      } catch (err) {
         res.status(500).send("Error parsing JSON data");
      }
   });
});

app.get("/npoint", (req, res) => {
    const dataPath = path.join(__dirname, "mapnpoint.json");
 
    fs.readFile(dataPath, "utf8", (err, jsonData) => {
       if (err) {
          res.status(500).send("Error reading data file");
          return;
       }
 
       try {
          const data = JSON.parse(jsonData);
          res.json(data);
       } catch (err) {
          res.status(500).send("Error parsing JSON data");
       }
    });
 });

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
