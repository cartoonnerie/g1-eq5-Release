const popupForm = document.querySelector("#popupForm")
const rejectForm = document.querySelector("#rejectForm")

rejectForm.addEventListener("click", function(event){ 
    popupForm.style.display = "none"
})

function showPopup(_id, id, name, description, difficulty, priority){
    popupForm.style.display = "block";
    popupForm.querySelector("#_id").value = _id;
    popupForm.querySelector("#id").value = id;
    popupForm.querySelector("#name").value = name;
    popupForm.querySelector("#description").value = description;
    popupForm.querySelector("#difficulty").value = difficulty;
    popupForm.querySelector("#priority").value = priority;
}