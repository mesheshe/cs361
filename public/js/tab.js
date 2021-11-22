let nav1 = document.getElementById("1");
let nav2 = document.getElementById("2");
let nav3 = document.getElementById("3");
nav1.setAttribute("class", "nav-link")
nav2.setAttribute("class", "nav-link active")
nav3.setAttribute("class", "nav-link")

let tab4 = document.getElementById("4");
let tab5 = document.getElementById("5");
let tab6 = document.getElementById("6");
let tab7 = document.getElementById("7");
let tab8 = document.getElementById("8");
let containers = document.getElementsByClassName('containers')

tab4.addEventListener("click", function(event){
    tab4.setAttribute("class","nav-link active")
    tab5.setAttribute("class","nav-link")
    tab6.setAttribute("class","nav-link")
    let id = parseInt(event.target.getAttribute('id'));
    containers[0].style.display = 'none';
    containers[1].style.display = 'none';
    containers[2].style.display = 'none';
    containers[id-3-1].style.display = 'block';
})
tab5.addEventListener("click", function(event){
    tab4.setAttribute("class","nav-link")
    tab5.setAttribute("class","nav-link active")
    tab6.setAttribute("class","nav-link")
    let id = parseInt(event.target.getAttribute('id'));
    containers[0].style.display = 'none';
    containers[1].style.display = 'none';
    containers[2].style.display = 'none';
    containers[id-3-1].style.display = 'block';
})
tab6.addEventListener("click", function(event){
    tab4.setAttribute("class","nav-link")
    tab5.setAttribute("class","nav-link")
    tab6.setAttribute("class","nav-link active")
    let id = parseInt(event.target.getAttribute('id'));
    containers[0].style.display = 'none';
    containers[1].style.display = 'none';
    containers[2].style.display = 'none';
    containers[id-3-1].style.display = 'block';
})
tab7.addEventListener("click", function(event){
    tab7.setAttribute("class","nav-link active")
    tab8.setAttribute("class","nav-link")
    let id = parseInt(event.target.getAttribute('id'));
    containers[3].style.display = 'none';
    containers[4].style.display = 'none';
    containers[id-3-1].style.display = 'block';
})
tab8.addEventListener("click", function(event){
    tab7.setAttribute("class","nav-link")
    tab8.setAttribute("class","nav-link active")
    let id = parseInt(event.target.getAttribute('id'));
    containers[3].style.display = 'none';
    containers[4].style.display = 'none';
    console.log(`id - 3 = ${id - 3}` )
    containers[id-3-1].style.display = 'block';
})
