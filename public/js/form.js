function openTab(event, opt){
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }
    tabcontent[parseInt(opt)-1].style.display = "block";  
    var tabs = document.getElementsByClassName("nav-link");
    for (i = 0; i< tabs.length; i++){
        if (tabs[i].getAttribute("class") == "nav-link active"){
            tabs[i].setAttribute("class", "nav-link")
        }
    }
    event.currentTarget.className += " active";
}