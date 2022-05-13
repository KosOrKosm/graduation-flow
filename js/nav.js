function openNav() {
   document.getElementById("myNav").style.height = "100%";
   document.getElementById("mobile-footer").style.transitionDelay = ".3s";
   document.getElementById("mobile-footer").style.color = "white";
}

function closeNav() {
   document.getElementById("myNav").style.height = "0%";
   document.getElementById("mobile-footer").style.color = "black";
}