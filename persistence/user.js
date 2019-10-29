const mongoose = require('mongoose');
const utils = require('../utils/response-utils');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName: String,
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
});

const UserModel = mongoose.model('User',userSchema);

let User = {};

User.saveUser = async (req,res)=>{
    try{
    let userToSave = req.body;
    console.log(`Incoming user `,userToSave);
    userToSave = await UserModel.create(userToSave);
    res.status(200).json(utils.makeSuccessResponse(userToSave));
    }catch (error) {
        console.log('Error',error);
        res.status(500).json(utils.makeFailureResponse('Failed to save user!'));
    }
}

User.getAllUsers = async(req,res) =>{
 try {
     const users = await UserModel.find().sort({firstName:1});
     res.status(200).json(utils.makeSuccessResponse(users));
 } catch (error) {
     console.log('Error',error);
     res.status(500).json(utils.makeFailureResponse('Failed to get user!'));
 }
} 

User.updateUser = async(req,res)=>{
    try {
        const userToUpdate = req.body;
        console.log('User to Update',userToUpdate);
        await UserModel.updateOne({_id:userToUpdate._id},userToUpdate);
        res.status(200).json(utils.makeSuccessResponse(userToUpdate));
    } catch (error) {
        console.log('Error',error);
        res.status(500).json(utils.makeFailureResponse('Failed to update user!'));
    }
}

User.deleteUser = async(req,res)=>{
    try{
        let userToDelete = req.body;
        console.log('User to Delete ',userToDelete);
        await UserModel.deleteOne({"_id":userToDelete._id});
        res.status(200).json(utils.makeSuccessResponse({"message":"User deleted successfully"}));
    }catch(error){
        console.log('Error',error);
        res.status(500).json(utils.makeFailureResponse('Failed to delete user!'));
    }
}

User.findUser = async(req,res)=>{
    try{
        let query = req.query.filter;
        if(!query){
            res.status(400).json(utils.makeFailureResponse('Invalid filter value'));
            return;
        }
        const q ={"$regex":new RegExp(".*" + query, "i")};
        console.log('User to Find ',q);
        let userToFind = await UserModel.find({"$or":[
            {"firstName":q},
            {"lastName":q},
            {"email":q}
        ]});
        res.status(200).json(utils.makeSuccessResponse(userToFind));
    }catch(error){
        console.log('Error',error);
        res.status(500).json(utils.makeFailureResponse('Failed to delete user!'));
    }
}
module.exports = User;