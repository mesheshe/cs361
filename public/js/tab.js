// This file sets up the javascript to control the navigation tabs in the trip page. 
let nav1 = document.getElementById("1");
let nav2 = document.getElementById("2");
nav1.setAttribute("class", "nav-link")
nav2.setAttribute("class", "nav-link active")

let tab3 = document.getElementById("3");
let tab4 = document.getElementById("4");
let tab5 = document.getElementById("5");
let tab6 = document.getElementById("6");
let tab7 = document.getElementById("7");

let containers = document.getElementsByClassName('containers')

tab3.addEventListener("click", function(event){
    tab3.setAttribute("class","nav-link active")
    tab4.setAttribute("class","nav-link")
    tab5.setAttribute("class","nav-link")
    let id = parseInt(event.target.getAttribute('id'));
    containers[0].style.display = 'none';
    containers[1].style.display = 'none';
    containers[2].style.display = 'none';
    containers[id-2-1].style.display = 'block';
});
tab4.addEventListener("click", function(event){
    tab3.setAttribute("class","nav-link")
    tab4.setAttribute("class","nav-link active")
    tab5.setAttribute("class","nav-link")
    let id = parseInt(event.target.getAttribute('id'));
    containers[0].style.display = 'none';
    containers[1].style.display = 'none';
    containers[2].style.display = 'none';
    containers[id-2-1].style.display = 'block';
});
tab5.addEventListener("click", function(event){
    tab3.setAttribute("class","nav-link")
    tab4.setAttribute("class","nav-link")
    tab5.setAttribute("class","nav-link active")
    let id = parseInt(event.target.getAttribute('id'));
    containers[0].style.display = 'none';
    containers[1].style.display = 'none';
    containers[2].style.display = 'none';
    containers[id-2-1].style.display = 'block';
});
tab6.addEventListener("click", function(event){
    tab6.setAttribute("class","nav-link active")
    tab7.setAttribute("class","nav-link")
    let id = parseInt(event.target.getAttribute('id'));
    containers[3].style.display = 'none';
    containers[4].style.display = 'none';
    containers[id-2-1].style.display = 'block';
});
tab7.addEventListener("click", function(event){
    tab6.setAttribute("class","nav-link")
    tab7.setAttribute("class","nav-link active")
    let id = parseInt(event.target.getAttribute('id'));
    containers[3].style.display = 'none';
    containers[4].style.display = 'none';
    containers[id-2-1].style.display = 'block';
});
