const express = require("express");
const router = express.Router();

module.exports = (db) => {
    router.post("/save-quiz-progress", (req, res) => {
        const { user_id, course_id, lesson_id } = req.body;

        // 1.เช็คก่อนว่าเคยบันทึกไปหรือยังเพื่อป้องกันข้อมูลซ้ำ
        const checkSql = "SELECT * FROM quiz_progress WHERE user_id = ? AND lesson_id = ?";
        db.query(checkSql, [user_id, lesson_id], (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length > 0) {
                return res.json({ message: "Progress already exists" });
            }

            // 2.ถ้ายังไม่เคยให้ Insert ลงตาราง quiz_progress
            const insertSql = "INSERT INTO quiz_progress (user_id, course_id, lesson_id) VALUES (?, ?, ?)";
            db.query(insertSql, [user_id, course_id, lesson_id], (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Quiz progress saved successfully" });
            });
        });
    });

    router.get("/my-courses/:userId", (req, res) => {
        const userId = req.params.userId;
        const sql = `
    SELECT c.id, c.title, c.description,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) AS total_lessons,
        (SELECT COUNT(*) FROM lesson_progress WHERE course_id = c.id AND user_id = ?) AS completed_lessons,
        (SELECT COUNT(*) FROM quiz_progress WHERE course_id = c.id AND user_id = ?) AS passed_quizzes
    FROM courses c 
    JOIN enrollments e ON c.id = e.course_id 
    WHERE e.user_id = ?`;

        db.query(sql, [userId, userId, userId], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    });

    router.post("/enroll", (req, res) => {
        const { userId, courseId } = req.body;
        const sql = "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)";
        db.query(sql, [userId, courseId], (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Enrolled successfully" });
        });
    });

    router.post("/complete-lesson", (req, res) => {
        const { user_id, course_id, lesson_id } = req.body;
        const sql = "INSERT IGNORE INTO lesson_progress (user_id, course_id, lesson_id) VALUES (?, ?, ?)";
        db.query(sql, [user_id, course_id, lesson_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Progress saved" });
        });
    });

    router.get("/check-enroll", (req, res) => {
        const { userId, courseId } = req.query;
        db.query("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?", [userId, courseId], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ enrolled: results.length > 0 });
        });
    });

    // ดึง Progress รวม
    router.get("/:userId/:courseId", (req, res) => {
        const { userId, courseId } = req.params;
        const sql = `SELECT 
                (SELECT COUNT(*) FROM lessons WHERE course_id = ?) AS total,
                (SELECT COUNT(*) FROM lesson_progress WHERE user_id = ? AND course_id = ?) AS completed,
                (SELECT COUNT(*) FROM quiz_progress WHERE user_id = ? AND course_id = ?) AS passed`;

        db.query(sql, [courseId, userId, courseId, userId, courseId], (err, results) => {
            if (err) {
                console.error("SQL Error in Progress:", err);
                return res.status(500).json(err);
            }
            res.json(results[0] || { total: 0, completed: 0, passed: 0 });
        });
    });
    return router;
};