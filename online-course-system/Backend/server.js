const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
 host:"127.0.0.1",
 port: 8700,
 user:"root",
 password:"root",
 database:"webdb"
})

app.get("/courses",(req,res)=>{
    const sql = "SELECT * FROM courses"

    db.query(sql,(err,result)=>{
        if(err) res.send(err)
            else res.json(result)
    })
})

app.post("/courses",(req,res)=>{
    const {title,description} = req.body
    const sql = "INSERT INTO courses (title,description,instructor_id) VALUES (?,?,1)"

    db.query(sql,[title,description],(err,result)=>{
        if(err) res.send(err)
            else res.json({message:"Course created"})
    })
})

app.delete("/courses/:id",(req, res)=> {
    const id = req.params.id 
    const sql = "DELETE FROM courses WHERE id=?"

    db.query(sql,[id],(err,result)=>{
        if(err) res.send(err)
            else res.json({message:"Course deleted"})
    })
})

app.put("/courses/:id",(req, res)=> {
    const id = req.params.id 
    const {title,description} = req.body
    const sql = "UPDATE courses SET title=?, description=? WHERE id=?"

    db.query(sql,[title,description,id],(err,result)=>{
        if(err) res.send(err)
            else res.json({message:"Course updated"})
    })
})

app.listen(3000,()=>{
 console.log("Server running on port 3000")
})

app.get("/courses/:id",(req, res)=> {
    const id = req.params.id
    const sql = "SELECT * FROM courses WHERE id=?"

    db.query(sql,[id],(err,result)=>{
        if(err) res.send(err)
            else res.json(result)
    })
})
app.get("/courses/:id/lessons",(req, res)=> {
    const courseId = req.params.id
    const sql = "SELECT * FROM lessons WHERE course_id=?"
    db.query(sql,[courseId],(err,result)=>{
        if(err) res.send(err)
            else res.json(result)
    })
})
