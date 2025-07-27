const express=require("express");
const User=require("../models/user");
const nodemailer=require('nodemailer');

const router=express.Router();

const transport=nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:'zohaibirshad678@gmail.com',
        pass:"qbegpqogkvasmocq"
    },
});

router.get("/signin",(req,res)=>{
    return res.render("signin");
});

router.get("/signup",(req,res)=>{
    return res.render("signup");
});

router.get("/logout",(req,res)=>{
     res.clearCookie("token").redirect("/");
});

router.get("/forgot-password",(req,res)=>{
    return res.render("forgotPassword");
});
router.get("/update-password",(req,res)=>{
    return res.render("updatePassword");
});

router.post("/update-password",async (req,res)=>{
    const {otp,password,confirmPassword}=req.body;


})
router.post("/forgot-password",async (req,res)=>{
    const {email}=req.body;
  try {
         const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "This Email has no active account!"});

    }
        const otp= Math.floor(1000+ Math.random() * 900000);
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      user.otp=otp;
      user.otpExpiry=otpExpiry;
      user.save();

const mailOptions={
    from:"zohaibirshad678@gmail.com",
    to:email,
    subject:"Your OTP Code From Blog Application",
    html: `<p>Your OTP Code is <b>${otp}</b>. It will expire in 10 minutes.</p>`
}

await transport.sendMail(mailOptions);

return res.status(200).render("updatePassword");

  } catch (error) {
        console.error("OTP Send Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

});

router.post("/signin", async (req,res)=>{
    const {email,password}=req.body;
try {
    const token=await User.matchPasswordAndGenerateToken(email,password);
    return res.cookie("token",token).redirect("/");
} catch (error) {
    return res.render("signin",{
        error:"Incorrect Email or password!",
    })
}
});


router.post("/signup",async (req,res)=>{
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");

})

module.exports=router;