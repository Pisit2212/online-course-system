// กำหนด Base URL ไว้ที่เดียว แก้ไขง่าย
const API_BASE_URL = "http://localhost:3000/api";

// ดึงข้อมูล User ไว้ใช้ทั่วไฟล์
const currentUser = JSON.parse(localStorage.getItem("user"));
const userId = currentUser ? currentUser.id : null;

// ฟังก์ชันโหลดคอร์สทั้งหมด
function loadCourse() {
    // แก้ไข URL: เพิ่ม /api/courses
    fetch(`${API_BASE_URL}/courses`)
        .then(res => res.json())
        .then(data => {
            const courseList = document.getElementById("courseList");
            courseList.innerHTML = "";

            if (data.length === 0) {
                courseList.innerHTML = "<p>ยังไม่มีคอร์สในระบบ</p>";
                return;
            }

            data.forEach(course => {
                const div = document.createElement("div");
                div.style = "border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05);";

                let adminButtons = "";
                const isOwner = userId && course.instructor_id && Number(userId) === Number(course.instructor_id);

                if (isOwner) {
                    adminButtons = `
                        <button onclick="editCourse(${course.id})" style="background-color: #ffc107; border: none; padding: 5px 12px; cursor: pointer; border-radius: 4px; margin-left: 5px; font-weight: bold;">แก้ไข</button>
                        <button onclick="deleteCourse(${course.id})" style="background-color: #dc3545; color: white; border: none; padding: 5px 12px; cursor: pointer; border-radius: 4px; margin-left: 5px; font-weight: bold;">ลบ</button>
                    `;
                }

                const mainBtnText = isOwner ? "⚙️ จัดการบทเรียน" : "📖 เข้าเรียน";

                div.innerHTML = `
                    <h3 style="margin-top: 0; color: #2c3e50;">${course.title}</h3>
                    <p style="color: #7f8c8d;">${course.description}</p>
                    <p><small style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px;">👨‍🏫 ผู้สอน: <strong>${course.instructor_name || 'ไม่ระบุชื่อ'}</strong></small></p>
                    <div style="margin-top: 15px;">
                        <button onclick="viewCourse(${course.id})" style="background-color: #3498db; color: white; border: none; padding: 6px 15px; cursor: pointer; border-radius: 4px; font-weight: bold;">
                            ${mainBtnText}
                        </button>
                        ${adminButtons} 
                    </div>
                `;
                courseList.appendChild(div);
            });
        })
        .catch(err => console.error("Error loading courses:", err));
}

// สั่งให้โหลดทันทีที่เปิดหน้า
loadCourse();

function createCourse() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    if (!title) {
        return Swal.fire('กรุณาใส่ชื่อคอร์ส', '', 'warning');
    }

    Swal.fire({
        title: 'ยืนยันการสร้างคอร์ส?',
        text: `คุณกำลังจะสร้างคอร์ส: ${title}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง, สร้างเลย',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            // แก้ไข URL: ใช้ API_BASE_URL
            fetch(`${API_BASE_URL}/courses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    instructor_id: userId
                })
            })
                .then(res => res.json())
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'สร้างคอร์สสำเร็จ!',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        document.getElementById("title").value = "";
                        document.getElementById("description").value = "";
                        loadCourse();
                    });
                });
        }
    });
}

function editCourse(id) {
    fetch(`${API_BASE_URL}/courses/${id}`)
        .then(res => res.json())
        .then(data => {
            const course = Array.isArray(data) ? data[0] : data;

            document.getElementById("title").value = course.title;
            document.getElementById("description").value = course.description;

            Swal.fire({
                icon: 'info',
                title: 'โหมดแก้ไขข้อมูลคอร์ส',
                text: 'คุณสามารถแก้ไขข้อมูลคอร์สที่ด้านล่างนี้ได้เลย !',
                timer: 1500,
                showConfirmButton: false
            });

            // --- นี่คือส่วนที่ 2 ที่ต้องเพิ่ม/แก้ไข ---

            // 1. ซ่อนปุ่ม "สร้างคอร์สใหม่"
            const createBtn = document.querySelector("button[onclick='createCourse()']");
            if (createBtn) createBtn.style.display = "none";

            // 2. แสดงปุ่ม "อัปเดตข้อมูลคอร์ส"
            const updateBtn = document.getElementById("updateBtn");
            if (updateBtn) {
                updateBtn.style.display = "block"; // แสดงปุ่มสีเหลือง
                updateBtn.onclick = function () {
                    updateCourse(id);
                };
            }

            // เลื่อนหน้าจอลงมา
            if (updateBtn) {
                updateBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
}

function updateCourse(id) {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    if (!title) {
        return Swal.fire('กรุณาใส่ชื่อคอร์ส', '', 'warning');
    }

    Swal.fire({
        title: 'ยืนยันการแก้ไขข้อมูล?',
        text: "คุณต้องการเปลี่ยนข้อมูลคอร์สตามนี้ใช่หรือไม่?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ffc107',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ตกลง, อัปเดตเลย!',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            // แก้ไข URL: ใช้ API_BASE_URL
            fetch(`${API_BASE_URL}/courses/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description })
            })
                .then(res => res.json())
                .then(data => {
                    Swal.fire({
                        icon: 'success',
                        title: 'อัปเดตสำเร็จ!',
                        text: 'ข้อมูลคอร์สถูกแก้ไขเรียบร้อยแล้ว',
                        showConfirmButton: false,
                        timer: 1500
                    })// เพิ่มเข้าไปข้างใน .then หลังจาก Swal แจ้งว่าสำเร็จ
                        .then(() => {
                            document.getElementById("title").value = "";
                            document.getElementById("description").value = "";

                            // สลับปุ่มกลับมาโหมดสร้างปกติ
                            document.getElementById("updateBtn").style.display = "none"; // ซ่อนปุ่มอัปเดต
                            const createBtn = document.querySelector("button[onclick='createCourse()']");
                            if (createBtn) createBtn.style.display = "block"; // โชว์ปุ่มสร้างใหม่

                            loadCourse();
                        });
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire('เกิดข้อผิดพลาด', 'คุณไม่มีสิทธิ์แก้ไขหรือเซิร์ฟเวอร์มีปัญหา', 'error');
                });
        }
    });
}

function deleteCourse(id) {
    Swal.fire({
        title: 'ยืนยันการลบ?',
        text: "คอร์สนี้จะหายไปถาวรนะ!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            // แก้ไข URL: ใช้ API_BASE_URL
            fetch(`${API_BASE_URL}/courses/${id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) throw new Error('ลบไม่สำเร็จ');
                    return response.json();
                })
                .then(data => {
                    Swal.fire({
                        icon: 'success',
                        title: 'ลบแล้ว!',
                        text: 'คอร์สของคุณถูกลบออกแล้ว',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    loadCourse();
                })
                .catch(err => {
                    console.log('เกิดข้อผิดพลาด:', err);
                    Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบคอร์สได้', 'error');
                });
        }
    })
}

function viewCourse(id) {
    window.location.href = `course.html?id=${id}`;
}