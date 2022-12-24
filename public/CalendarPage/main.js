const user = document.querySelector('.user');
const postEvent = document.querySelector('.postEvent');

const setUser = () => {
    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    user.innerHTML = username || 'guest';
    postEvent.style.display = (role == 'admin') ? 'block' : 'none';
}
setUser();

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}