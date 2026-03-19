const express = require("express");
const router = express.Router();

module.exports = (db) => {
    router.post("/save-quiz-progress", (req, res) => {
        const { user_id, course_id, lesson_id } = req.body;

        // 1. เช็คก่อนว่าเคยบันทึกไปหรือยัง (ป้องกันข้อมูลซ้ำ)
        const checkSql = "SELECT * FROM quiz_progress WHERE user_id = ? AND lesson_id = ?";
        db.query(checkSql, [user_id, lesson_id], (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length > 0) {
                return res.json({ message: "Progress already exists" });
            }

            // 2. ถ้ายังไม่เคยมี ให้ Insert ลงตาราง quiz_progress
            const insertSql = "INSERT INTO quiz_progress (user_id, course_id, lesson_id) VALUES (?, ?, ?)";
            db.query(insertSql, [user_id, course_id, lesson_id], (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Quiz progress saved successfully" });
            });
        });
    });
    
    // ไฟล์ routes/progress.js
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

        // ต้องส่ง userId เข้าไป 3 รอบให้ครบตามเครื่องหมาย ?
        db.query(sql, [userId, userId, userId], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    });

    // 2. ลงทะเบียนเรียน
    router.post("/enroll", (req, res) => {
        const { userId, courseId } = req.body;
        const sql = "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)";
        db.query(sql, [userId, courseId], (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Enrolled successfully" });
        });
    });

    // 3. บันทึกการเรียนจบ
    router.post("/complete-lesson", (req, res) => {
        const { user_id, course_id, lesson_id } = req.body;
        const sql = "INSERT IGNORE INTO lesson_progress (user_id, course_id, lesson_id) VALUES (?, ?, ?)";
        db.query(sql, [user_id, course_id, lesson_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Progress saved" });
        });
    });

    // 4. เช็คว่าลงทะเบียนหรือยัง (ใช้ในหน้าเรียน)
    router.get("/check-enroll", (req, res) => {
        const { userId, courseId } = req.query;
        db.query("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?", [userId, courseId], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ enrolled: results.length > 0 });
        });
    });

    // ดึง Progress รวม (สำหรับ Progress Bar ในหน้าเรียน course.html)
    router.get("/:userId/:courseId", (req, res) => {
        const { userId, courseId } = req.params;

        // แก้ไข SQL ให้สมบูรณ์ (เพิ่ม FROM dual หรือ SELECT เฉยๆ ให้จบประโยค)
        const sql = `
            SELECT 
                (SELECT COUNT(*) FROM lessons WHERE course_id = ?) AS total,
                (SELECT COUNT(*) FROM lesson_progress WHERE user_id = ? AND course_id = ?) AS completed,
                (SELECT COUNT(*) FROM quiz_progress WHERE user_id = ? AND course_id = ?) AS passed
        `;

        // ลำดับการส่ง Parameter:
        // 1. courseId (สำหรับ total)
        // 2. userId, 3. courseId (สำหรับ completed)
        // 4. userId, 5. courseId (สำหรับ passed)
        db.query(sql, [courseId, userId, courseId, userId, courseId], (err, results) => {
            if (err) {
                console.error("SQL Error in Progress:", err); // เพิ่ม log ดู error
                return res.status(500).json(err);
            }

            // ส่ง results[0] กลับไป
            res.json(results[0] || { total: 0, completed: 0, passed: 0 });
        });
    });

    return router; // ต้องอยู่บรรทัดสุดท้ายแบบนี้
};