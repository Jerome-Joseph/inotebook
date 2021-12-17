const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All the Notes using: GET "/api/auth/fetchallnotes". Login required
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
        const notes = await Notes.find({user:req.user.id})
        res.json(notes)   
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error has been occured");
    }
})

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({ min: 3 }),
    body('description',"Enter a valid description").isLength({ min: 5 })
], async (req,res)=>{

    try {
    const {title ,description, tags} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
// creating new note and saving it
    const note = new Notes({
        title,description,tags, user:req.user.id
    })
    const savedNotes = await note.save();

    res.json(savedNotes)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Some error has been occured"); 
}

})

// ROUTE 3: Updating a Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id',fetchuser, async (req,res)=>{
    const {title ,description, tags} = req.body;

    //  Create a newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tags){newNote.tags = tags};

    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note){res.status(404).send("Not found")}

    if(note.user.toString() !== req.user.id){
        res.status(401).send("Not allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote}, {new:true})
    res.json({note});
})

// ROUTE 4: Deleting a Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id',fetchuser, async (req,res)=>{
   
    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note){res.status(404).send("Not found")}

    if(note.user.toString() !== req.user.id){
        res.status(401).send("Not allowed")
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted", note:note});
})

module.exports= router
