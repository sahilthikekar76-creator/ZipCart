const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            match:[/.+\@.+\..+/,"Please Enter Valid E-mail Address"]
        },
        password:{
            type:String,
            required:true,
            minLength:6,
        },
        role:{
            type:String,
            enum:["customer","admin"],
            default:"customer",
        },
    },
    {timestamps:true}
)

/**
 * 🔐 Hash password before saving
 */
userSchema.pre("save", async function () {
  // Only hash if password is new or modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//match the passsword to hashed password
userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports=mongoose.model("User",userSchema);