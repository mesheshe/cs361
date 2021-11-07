function openTab(event, opt){
    var i, tabcontent, tabs, starts, ends;
    tabcontent = document.getElementsByClassName('tabcontent');
    tabs = document.getElementsByClassName("nav-link");
    if (event.currentTarget.className == "nav-link active"){return;}
    if (parseInt(opt) <= 3){
        starts = 0;
        ends = 3;
    }else{
        starts = 3;
        ends = tabcontent.length;
    }
    for (i = starts; i < ends; i++){
        tabcontent[i].style.display = "none";
    }
    tabcontent[parseInt(opt)-1].style.display = "block";  
    // We are adding plus 3 because the header also has elements with 
    // attribute nav-link, therefore need to offset to fix the issue.
    for (i = starts + 3; i< ends + 3; i++){
        if (tabs[i].getAttribute("class") == "nav-link active")
            tabs[i].setAttribute("class", "nav-link");
    }
    event.currentTarget.className += " active";
}