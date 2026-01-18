const express = require('express');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {protect} =require('../middleware/authMiddleware');
const router = express.Router();

// /api/user/register
// Description: Register new user (Public)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1️ Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️ Hash password which is already done in model

    // 3️ Create user
    user = new User({
      name,
      email,
      password
    });

    await user.save();

    // 4️ Create JWT payload
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    // 5️ Sign JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        // 6️ Send response
        res.status(201).json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

//login
//authenticate user and acess public
router.post('/login',async(req,res)=>{
    const{email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user)return res.status(400).json({message:"Invalid credentials"});

        const isMatched=await user.matchPassword(password);
        if(!isMatched){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

    // 5️ Sign JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "40h" },
            (err, token) => {
                if (err) throw err;

                // 6️ Send response
                res.json({
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                });
            }
        );
    }catch(err){
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

//profile protected acess-private
router.get('/profile',protect,async(req,res)=>{
    res.json(req.user);
})

module.exports = router;
