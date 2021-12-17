import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const host = "http://localhost:5000"
    const notesInitial =[]

const [notes, setNotes] = useState(notesInitial)

const getNotes = async()=>{
    //API CALL
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFhNjYwZWRmYTI3Mjc4NTE4OTFmMWFlIn0sImlhdCI6MTYzODI5Mzc4NH0.Yy1m4MhfUT8RPw7E1Jh6gqO_CSf3kprCerBYBZP1bM4'
        }, 
      });
    
     const json = await response.json()
     console.log(json)
     setNotes(json)
}
const addNote = async(title, description, tag)=>{
    //API CALL
    const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFhNjYwZWRmYTI3Mjc4NTE4OTFmMWFlIn0sImlhdCI6MTYzODI5Mzc4NH0.Yy1m4MhfUT8RPw7E1Jh6gqO_CSf3kprCerBYBZP1bM4'
        },
        body: JSON.stringify({title, description, tag}) 
      });
      const json = await response.json()
      console.log(json)
      
// CLient side add note logic
    console.log("Adding a new data")
    const note ={
        "_id": "61b497aeddsf01dbl973a3f98889",
        "user": "61a660edfa2727851891f1ae",
        "title": title,
        "description": description,
        "tag": tag,
        "date": "2021-12-11T12:21:02.127Z",
        "__v": 0
    }
    setNotes(notes.concat(note))
}

const deleteNote = async(id)=>{
     //API CALL
     const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFhNjYwZWRmYTI3Mjc4NTE4OTFmMWFlIn0sImlhdCI6MTYzODI5Mzc4NH0.Yy1m4MhfUT8RPw7E1Jh6gqO_CSf3kprCerBYBZP1bM4'
        }
      });
      const json = await response.json();
      console.log(json)

    console.log("Deleting the note" + id)
    const newNotes = notes.filter((note)=>{return note._id!==id})
    setNotes(newNotes)
}

const editNote = async(id, title, description, tag)=>{
    //API CALL
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFhNjYwZWRmYTI3Mjc4NTE4OTFmMWFlIn0sImlhdCI6MTYzODI5Mzc4NH0.Yy1m4MhfUT8RPw7E1Jh6gqO_CSf3kprCerBYBZP1bM4'
        },
        body: JSON.stringify({title, description, tag}) 
      });
      
      const json = await response.json;
      console.log(json)
     
      let newNotes = JSON.parse(JSON.stringify(notes))
    //CLient side edit note code
    for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if (element._id === id) {
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag;
            break;
        } 
    }
    setNotes(newNotes);
}

    return(
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;