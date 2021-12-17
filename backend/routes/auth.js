const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'thisIsAHighLvl$$Pass';

// ROUTE 1: creating a user no login required /api/auth/createuser
router.post('/createuser',[
    body('name','Name should be more than 3 characters').isLength({ min: 3 }),
    body('email',"Enter a valid email").isEmail(),
    body('password','Password should be more than 5 characters').isLength({ min: 5 })
],async (req,res)=>{
  // if there are any errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // res.send(req.body);
    //check user with same email exsit or not
    try {
      
    let user = await User.findOne({email:req.body.email});
    if(user){
      return res.status(400).json({error:"User with email already exits"})
    }
    // create a new user
    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hashSync(req.body.password, salt);

    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      })

      const data={
        user:{
          id: user.id
        }
      }
      const authToken = jwt.sign(data,JWT_SECRET);
      // console.log(authToken);
  
    res.json({authToken})

  } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error has been occured");
  }
})

//ROUTE 2 : Route for authenticating user POST "/api/auth/login". No login required
router.post('/login',[
  body('email',"Enter a valid email").isEmail(),
  body('password','Password should not be blank').exists()
],async (req,res)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const{email,password} = req.body;

  try {

    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({error:"Please use proper credentitals"})
    }

    const passCompare = await bcrypt.compare(password, user.password)
    if (!passCompare) {
      return res.status(400).json({error:"Please use proper credentitals"})
    }

    const data={
      user:{
        id: user.id
      }
    }
    
    const authToken = jwt.sign(data,JWT_SECRET);
    res.json({authToken});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error has been occured");
  }
})

//ROUTE  : Route for getting user details POST "/api/auth/getuser". Login required
router.post('/getuser',fetchuser,async (req,res)=>{

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error has been occured");
  }
})

module.exports= router