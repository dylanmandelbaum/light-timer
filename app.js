window.addEventListener("DOMContentLoaded", () => {

console.log("JS LOADED");

const startButton = document.getElementById("startButton");

console.log("startButton =", startButton);

startButton.addEventListener("click", () => {
    console.log("CLICK WORKS");
    alert("CLICK WORKS");
});

});
