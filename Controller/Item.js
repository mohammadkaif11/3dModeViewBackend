const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const router = express.Router();
const {
  saveModelData,
  getModelsfromDb,
  getModelName,
  getModelByNameandthumbnail,
} = require("../Service/ItemService");

//AWS Sdk
const AWS = require("aws-sdk");
const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
const BUCKET_NAME = process.env.BACKET_NAME;

//S3 Bucket
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

router.post("/senddata", saveModel);
router.get("/getdata", getModels);
router.get("/modelname", getModelName);

//Save Models
function saveModel(req, res) {
  try {
    const Myfile = req.files;
    const file = Myfile.file;
    const img = Myfile.img;
    const fname = file.name;
    const iname = img.name;
    const cname = req.body.name;
    const mname = req.body.modelname;

    //Model Params
    const ModelParams = {
      Bucket: BUCKET_NAME,
      Key: fname,
      Body: file.data,
    };

    //Image Params
    const ImageParms = {
      Bucket: BUCKET_NAME,
      Key: iname,
      Body: img.data,
    };

    console.log("image", img);
    console.log("file", file);
    console.log("name", req.body.name);
    console.log("dirname", __dirname);

    let modelPath = "";
    let ImagePath = "";

    s3.upload(ModelParams, function (err, data) {
      if (err) {
        console.log("Error uploading file: ", err.message);
        res.status(400).json({ message: "Server Error" ,error:err.message });
        return;
      } else {
        modelPath = data.Location;
        console.log("model  sucessfully save", modelPath);
        s3.upload(ImageParms, function (err, data) {
          if (err) {
            console.log("Error uploading file: ", err.message);
            res.status(400).json({ message: "Server Error" ,error:err.message });
            return;
          } else {
            ImagePath = data.Location;
            console.log("ImagePath successfully save", ImagePath);
            saveModelData(cname, mname, fname, iname,modelPath,ImagePath)
              .then((data) => {
                if (data == null) {
                  res
                    .status(400)
                    .json({ message: "Model name,Model Image,ThumbNail should be unique" });
                  return;
                } else {
                  res.status(200).json({ message: "Successfully upload" });
                  return;
                }
              })
              .catch((err) => {
                console.log("Saving db",err);
                res.status(400).json({ message: "Server Error" ,error:err.message });
              });
          }
        });
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" ,error:error.message });
  }
}

//GetModels
function getModels(req, res) {
  getModelsfromDb()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send("Something went Wrong");
      return;
    });
}

//Getmodels by name
function getModelName(req, res) {
  const { id } = req.query;
  getModelName(id)
    .then((data) => {
      res.json({ filename: data });
    })
    .catch(() => {
      res.status(400).send("Error");
    });
}

//get file
router.get("/file/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    let x = await s3
      .getObject({ Bucket: BUCKET_NAME, Key: filename })
      .promise();
    res.send(x.Body); 
  } catch (error) {
    console.log('Error downloading: ',error.message);
    res.send(error.message);
  }
});

module.exports = router;
