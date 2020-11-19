const FormUS = document.querySelector("#FormUS")
const FormNS = document.querySelector("#FormNS")
const showFormNS = document.querySelector("#showFormNS")
const rejectFormUS = document.querySelector("#rejectFormUS")
const rejectFormNS = document.querySelector("#rejectFormNS")
const validFormUS = document.querySelector("#validFormUS")


showFormNS.addEventListener("click", function(event){
    FormNS.style.display = "block";
})

rejectFormNS.addEventListener("click", function(event){
    FormNS.style.display = "none"
})

rejectFormUS.addEventListener("click", function(event){ 
    FormUS.style.display = "none"
})

validFormUS.addEventListener('click', function(event){
    updateURL()
})

function showPopupUS(elementId){
    FormUS.style.display = "block";
    const US = document.querySelector("#US"+elementId)
    FormUS.querySelector("#_IDUS").value = elementId;
    FormUS.querySelector("#IDUS").value = US.querySelector("#ID"+elementId).innerHTML;
    FormUS.querySelector("#TIUS").value = US.querySelector("#TI"+elementId).innerHTML;
    FormUS.querySelector("#DEUS").value = US.querySelector("#DE"+elementId).innerHTML;
    FormUS.querySelector("#DIUS").value = US.querySelector("#DI"+elementId).innerHTML;
    FormUS.querySelector("#PRUS").value = US.querySelector("#PR"+elementId).innerHTML;
}

function updateURL(){
    const elementId = FormUS.querySelector("#_IDUS").value

    const name = FormUS.querySelector("#TIUS").value
    const description = FormUS.querySelector("#DEUS").value
    const difficulty = FormUS.querySelector("#DIUS").value
    const priority = FormUS.querySelector("#PRUS").value

    const url = '/backlog/update?_id='+elementId+'&name='+name+'&description='+description+'&difficulty='+difficulty+'&priority='+priority
    FormUS.style.display = "none"

    fetch(url, {
        method: 'PUT'
    })
    .then(response => response.json())
    .then(json => {
        updateMessage(json)
        const US = document.querySelector("#US"+elementId)
        US.querySelector("#TI"+elementId).innerHTML = name;
        US.querySelector("#DE"+elementId).innerHTML = description;
        US.querySelector("#DI"+elementId).innerHTML = difficulty;
        US.querySelector("#PR"+elementId).innerHTML = priority;
    })
    .catch(err => console.log(err))
}

function deleteURL(elementId, url) {
    fetch(url, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(json => {
        updateMessage(json)
        document.querySelector("#"+elementId).remove();
    })
    .catch(err => console.log(err))
} 
