const express = require("express");
const connectToMongo = require("./DataContext/Database");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cors());
app.use(express.static("upload/image"));
app.use(express.static("upload/3dModels"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("content-type","multipart/form-data");  
  next();
});

connectToMongo();

app.use("/item", require("./Controller/Item"));

app.get("/", function (req, res) {
  res.send("working on 8080");
});

//listen on
app.listen(process.env.PORT || 8080, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
