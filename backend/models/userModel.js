import mongoose from "mongoose";

const userSchema=  new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    image:{type:String,default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'},
    address:{type:Object,default:{line1:'',line2:''}},
    gender:{type:String,default:'Not Selected'},
    dob:{type:String,default:"Not Selected"},
    phone:{type:String,default:"0000000000"}
},{minimize:false})

const userModel= mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;
