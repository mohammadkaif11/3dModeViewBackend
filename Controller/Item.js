const express = require("express");
const router = express.Router();
const {
  saveModelData,
  getModelsfromDb,
  getModelName,
  getModelByNameandthumbnail,
} = require("../Service/ItemService");

router.post("/senddata", saveProducts);
router.get("/getdata", getModels);
router.get("/modelname", getmodelname);

//Save Products
function saveProducts(req, res) {
  try {
    const Myfile = req.files;
    const file = Myfile.file;
    const img = Myfile.img;
    const fname = file.name;
    const iname = img.name;
    const cname = req.body.name;
    const mname = req.body.modelname;
    // console.log("image", img);
    // console.log("file", file);
    // console.log("name", req.body.name);
    // console.log("dirname", __dirname);

    let uploadpath = process.cwd() + "/upload/3dModels/" + fname;

    console.log(uploadpath);

    file.mv(uploadpath, (err) => {
      if (err) {
        res.status(400).json({ message: "Internal Server Error" });
        return;
      }
    });

    uploadpath = process.cwd() + "/upload/image/" + iname;

    img.mv(uploadpath, (err) => {
      if (err) {
        res.status(400).json({ message: "Internal Server Error" });
        return;
      }
    });
    saveModelData(cname, mname, fname, iname)
      .then((data) => {
        if(data==null){
            res.status(400).json({ message: "Model name will be uinque" });
            return;
        }else{
            res.status(200).json({ message: "Success Upload" });
            return;
        }
      })
      .catch((err) => {
        res.status(400).json({ message: "Server Error" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
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
function getmodelname(req, res) {
  const { id } = req.query;
  getModelName(id)
    .then((data) => {
      res.json({ filename: data });
    })
    .catch(() => {
      res.status(400).send("Error");
    });
}

module.exports = router;
