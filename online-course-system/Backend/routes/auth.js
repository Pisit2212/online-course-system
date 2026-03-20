const express = require("express");
const router = express.Router();

module.exports = (db) => {
    router.post("/register", (req, res) => {
        const { name, email, password, role } = req.body;
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

        db.query(sql, [name, email, password, role], (err, result) => {
            if (err) {
                // เช็คว่า Error มาจากข้อมูลซ้ำและซํ้าที่จุดไหน
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.message.includes(email)) {
                        return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
                    } else {
                        return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" });
                    }
                }
                console.error("Register Error:", err);
                return res.status(500).json({ message: "เกิดข้อผิดพลาดที่ระบบฐานข้อมูล" });
            }
            res.json({ message: "สมัครสมาชิกสำเร็จ!" });
        });
    });

    router.post("/login", (req, res) => {
        const { email, password } = req.body;
        const sql = "SELECT id, name, email, role FROM users WHERE email = ? AND password = ?";
        db.query(sql, [email, password], (err, result) => {
            if (result.length > 0) res.json({ message: "Login success", user: result[0] });
            else res.status(401).json({ message: "Invalid credentials" });
        });
    });

    return router;
};