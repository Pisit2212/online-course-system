const express = require("express");
const router = express.Router();

module.exports = (db) => {
    // routes/quizzes.js
    router.get("/:lessonId", (req, res) => {
        const lessonId = req.params.lessonId;
        const userId = req.query.userId;

        const checkSql = "SELECT * FROM quiz_progress WHERE user_id = ? AND lesson_id = ?";
        db.query(checkSql, [userId, lessonId], (err, progress) => {
            if (err) return res.status(500).json(err);
            if (progress.length > 0) return res.json({ hasPassed: true });

            // *** จุดที่ต้องแก้: เพิ่ม answer ลงไปใน SELECT ด้วย ***
            const sql = "SELECT id, question, option1, option2, option3, option4, answer FROM quizzes WHERE lesson_id = ?";
            db.query(sql, [lessonId], (err, results) => {
                if (err) return res.status(500).json(err);
                res.json(results);
            });
        });
    });
    // ลบข้อสอบ
    router.delete("/:id", (req, res) => {
        const quizId = req.params.id;
        db.query("DELETE FROM quizzes WHERE id = ?", [quizId], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "ลบข้อสอบเรียบร้อยแล้ว" });
        });
    });

    // แก้ไขข้อสอบ
    router.put("/:id", (req, res) => {
        const quizId = req.params.id;
        const { question, option1, option2, option3, option4, answer } = req.body;
        const sql = "UPDATE quizzes SET question=?, option1=?, option2=?, option3=?, option4=?, answer=? WHERE id=?";
        db.query(sql, [question, option1, option2, option3, option4, answer, quizId], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "แก้ไขข้อสอบเรียบร้อยแล้ว" });
        });
    });

    return router;
};