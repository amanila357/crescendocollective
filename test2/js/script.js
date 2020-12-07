const toggleButton = document.getElementsByClassName('toggle_nav')[0];
const navbar = document.getElementsByClassName('navlinks')[0];

toggleButton.addEventListener('click', () => {
    navbar.classList.toggle('active');
});