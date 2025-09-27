const toggleButton = document.querySelector(".toggle-button");
const mainMenu = document.querySelector(".main-menu");

toggleButton.addEventListener('click', function () {
    // Toggles the active class
    mainMenu.classList.toggle('active');
        if (mainMenu.classList.contains("active")) {              
            // Adds the close (x) icon 
            toggleButton.innerHTML = "&#215;";
        } else {          
            // Adds the hamburger icon 
            toggleButton.innerHTML = "&#9776;";
        }
});