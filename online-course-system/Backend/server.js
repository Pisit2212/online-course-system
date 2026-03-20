const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 8700,
    user: "root",
    password: "root",
    database: "webdb"
});

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const lessonRoutes = require("./routes/lessons");
const progressRoutes = require("./routes/progress");
const quizRoutes = require("./routes/quizzes");

app.use("/api/auth", authRoutes(db));
app.use("/api/courses", courseRoutes(db));
app.use("/api/lessons", lessonRoutes(db));
app.use("/api/quizzes", quizRoutes(db));
app.use("/api/progress", progressRoutes(db));

// เพิ่มข้อสอบ
app.post("/api/add-quiz", (req, res) => {
    const { lesson_id, question, option1, option2, option3, option4, answer } = req.body;
    const sql = "INSERT INTO quizzes (lesson_id, question, option1, option2, option3, option4, answer) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [lesson_id, question, option1, option2, option3, option4, answer], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Quiz added", id: result.insertId });
    });
});

// แก้ไขบทเรียน
app.put('/api/lessons/:id', (req, res) => {
    const lessonId = req.params.id;
    const { title, video_url } = req.body;

    if (!title || !video_url) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    const sql = "UPDATE lessons SET title = ?, video_url = ? WHERE id = ?";
    db.query(sql, [title, video_url, lessonId], (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบบทเรียนที่ต้องการแก้ไข" });
        }

        res.json({ message: "แก้ไขบทเรียนสำเร็จ!" });
    });
});


app.get("/", (req, res) => res.send("Online Course API is running smoothly!"));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});