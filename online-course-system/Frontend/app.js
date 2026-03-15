function loadCourse() {
fetch("http://localhost:3000/courses")
.then(response => response.json())
.then(data => {
    const courseList = document.getElementById("courseList")
    courseList.innerHTML = ""
    data.forEach(course => {
        const div = document.createElement("div")
        div.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>

            <button onclick="viewCourse(${course.id})">View</button>
            <button onclick="editCourse(${course.id})">Edit</button>
            <button onclick="deleteCourse(${course.id})">Delete</button>
            <hr>`
        courseList.appendChild(div)
    })
})
}
window.onload = loadCourse

function createCourse(){
    const title = document.getElementById("title").value 
    const description = document.getElementById("description").value 

    fetch("http://localhost:3000/courses", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            title:title,
            description:description
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("Course created")
        loadCourse()
    })
}

function deleteCourse(id) {
    fetch("http://localhost:3000/courses/" + id, {
        method:"DELETE"
    })
    .then(res=>res.json())
    .then(data=>{
        alert("Course deleted")
        location.reload()
    })
}
function editCourse(id) {
    fetch("http://localhost:3000/courses/" + id)
    .then(res => res.json())
    .then(data => {
        document.getElementById("title").value = data[0].title
        document.getElementById("description").value = data[0].description
        document.getElementById("updateBtn").onclick = function() {
            updateCourse(id)
        }
    })
}
function updateCourse(id) {
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    fetch("http://localhost:3000/courses/" + id, {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            title:title,
            description:description
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("Course updated")
        loadCourse()
    })
}
function viewCourse(id) {
    window.location.href = "course.html?id=" + id
}
