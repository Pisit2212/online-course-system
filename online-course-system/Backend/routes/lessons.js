const express = require("express");
const router = express.Router();

module.exports = (db) => {
    router.get("/course/:courseId", (req, res) => {
        const courseId = req.params.courseId;
        const userId = req.query.userId;

        const sql = `
            SELECT l.*, 
            IFNULL(lp.is_completed, 0) AS is_completed
            FROM lessons l
            LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = ?
            WHERE l.course_id = ?
            ORDER BY l.id ASC`;

        db.query(sql, [userId, courseId], (err, results) => {
            if (err) {
                console.error("SQL Error:", err);
                return res.status(500).json(err);
            }
            res.json(results);
        });
    });

    router.post("/", (req, res) => {
        const { course_id, title, video_url } = req.body;
        const sql = "INSERT INTO lessons (course_id, title, video_url) VALUES (?, ?, ?)";
        db.query(sql, [course_id, title, video_url], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "เพิ่มบทเรียนสำเร็จ", id: result.insertId });
        });
    });
    
    router.delete("/:id", (req, res) => {
        const lessonId = req.params.id;
        const deleteQuizProgress = "DELETE FROM quiz_progress WHERE lesson_id = ?";
        const deleteLessonProgress = "DELETE FROM lesson_progress WHERE lesson_id = ?";
        const deleteQuizzes = "DELETE FROM quizzes WHERE lesson_id = ?";
        const deleteLesson = "DELETE FROM lessons WHERE id = ?";

        db.query(deleteQuizProgress, [lessonId], (err) => {
            if (err) return res.status(500).json(err);

            db.query(deleteLessonProgress, [lessonId], (err) => {
                if (err) return res.status(500).json(err);

                db.query(deleteQuizzes, [lessonId], (err) => {
                    if (err) return res.status(500).json(err);

                    db.query(deleteLesson, [lessonId], (err, result) => {
                        if (err) return res.status(500).json(err);

                        if (result.affectedRows === 0) {
                            return res.status(404).json({ message: "ไม่พบบทเรียนที่ต้องการลบ" });
                        }
                        res.json({ message: "ลบบทเรียนและข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว" });
                    });
                });
            });
        });
    });
    return router;
};