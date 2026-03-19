const express = require("express");
const router = express.Router();

module.exports = (db) => {
    // ดึงคอร์สทั้งหมด
    router.get("/", (req, res) => {
        const sql = `SELECT courses.*, users.name AS instructor_name FROM courses 
                     LEFT JOIN users ON courses.instructor_id = users.id`;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    });

    // ดึงคอร์สเดียว
    router.get("/:id", (req, res) => {
        const sql = "SELECT * FROM courses WHERE id = ?";
        db.query(sql, [req.params.id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result[0]);
        });
    });

    // ส่วน สร้าง/แก้ไข/ลบ คอร์ส (คงไว้เหมือนเดิม)
    router.put("/:id", (req, res) => {
        const { title, description } = req.body;
        const sql = "UPDATE courses SET title = ?, description = ? WHERE id = ?";
        db.query("UPDATE courses SET title = ?, description = ? WHERE id = ?", [title, description, req.params.id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Updated Course successfully" });
        });
    });

    router.post("/", (req, res) => {
        const { title, description, instructor_id } = req.body;
        db.query("INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)", [title, description, instructor_id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ id: result.insertId });
        });
    });

    router.delete('/:id', (req, res) => {
        db.query("DELETE FROM courses WHERE id = ?", [req.params.id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Deleted' });
        });
    });
    // ในไฟล์ routes/courses.js หรือไฟล์ที่เกี่ยวข้อง
    router.post("/complete-lesson", (req, res) => {
        const { userId, lessonId } = req.body;

        // ใช้ INSERT IGNORE เพื่อป้องกันการบันทึกซ้ำ (ถ้ามีอยู่แล้วจะไม่พัง)
        const sql = "INSERT IGNORE INTO lesson_progress (user_id, lesson_id, completed) VALUES (?, ?, 1)";

        db.query(sql, [userId, lessonId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึก" });
            }
            res.json({ message: "บันทึกการเรียนจบสำเร็จ" });
        });
    });

    return router; // อยู่ตรงนี้ ถูกต้องแล้ว
};