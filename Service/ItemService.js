const Model = require("../DataContext/Model/Item");

//Save Model Data
async function saveModelData(CreatorName,ModelName,ModelFileName,ModelImageName,Modelpath,Imagepath){
    try{
        const model=await Model.find({Model_name: ModelName});
        if(model.length>0){
            return null;
        }
        const product = new Model({
            Model_name:ModelName,
            Creator_Name:CreatorName,
            ModelFile_Name:ModelFileName,
            ThumbNail_Name:ModelImageName,
            dateCreated: new Date(),
            ModelFile_Path:Modelpath,
            ThumbNail_Path:Imagepath
        })
        const data = await product.save();
        console.log(data)
        return data
    }catch(err){
        console.log(err)
        console.log('SomeThing Went Wrong');
        return new Error('SomeThing Went Wrong')
    }
}

//get Model Data
async function getModelsfromDb(){
    try{
        const data = await Model.find()
        return data
    }catch(err){
        console.log(err)
        console.log('SomeThing Went Wrong');
        return new Error('SomeThing Went Wrong')
    }
}

//get Model by id
async function getModelName(id){
    try{
        const data = await Model.findOne({_id:id})
        return data.ModelFile_Name;
    }catch(err){
        console.log(err)
        console.log('SomeThing Went Wrong');
        return new Error('SomeThing Went Wrong')
    }
}

async function getModelByNameandthumbnail(modelName, thubnailName,filename){
    try{
        const data = await Model.find({Model_name:modelName,ThumbNail_Name:thubnailName,ModelFile_Name:filename})
        return data;
    }catch(err){
        console.log(err)
        return new Error('SomeThing Went Wrong')
    }
}

module.exports = {saveModelData,getModelsfromDb,getModelName,getModelByNameandthumbnail}