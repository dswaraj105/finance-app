require("dotenv").config();

// NodeJs Core modules
const path = require("path");

// External Libraries
const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const cookieParser = require("cookie-parser");

const PORT = 6001;

// Initializing the app
const app = express();

// Connecting to a loca instance of mongodb
// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://swaraj:qHzy3SpJmEHfxmQa@social-finance.8hgch.mongodb.net/socialfinance?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", (error) => console.error(error));
// db.once("open", () => console.log("Connected to Database"));


// Setting up various parsers to parse the request
// app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static(path.join(__dirname, "../apps/main/build")));

app.use(express.json({ limit: "10mb" }));


// User Track
// req.user

// Importing Routes
const samplingRoutes = require('./api/sampling/index')
const documentsRoutes = require('./api/documents/index')

app.use(samplingRoutes);
app.use("/documents", documentsRoutes);

app.get("/", (req, res, next) => {
  console.log("rendering Html");
  res.sendFile(path.join(__dirname , "..", "apps", "main","build",'index.html'));
});

app.use("*", (req, res, next) =>{ 
  res.status(400).json({'msg': "Invalid routes"});
})

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
