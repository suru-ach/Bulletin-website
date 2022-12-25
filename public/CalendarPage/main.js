const user = document.querySelector('.user');
const postEvent = document.querySelectorAll('.postEvent');
const userModal = document.querySelector('.user-float');
const smUser = document.querySelector('.sm-user');

const setUser = () => {
    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    user.innerHTML = username || 'guest';
    postEvent.forEach(event => event.style.display = (role == 'admin') ? 'block' : 'none');
    userModal.innerHTML = `<p>logged in as</p><p>${username || 'guest'}</p>${(role ? '<button class="logout" onClick=deleteUser()>logout</button>' : '' )}`;
    smUser.innerHTML = `<p>logged in as ${username || 'guest'}</p>${role ? '<button onclick=deleteUser()>logout</button>':''}`;
}

const deleteUser = () => {
    localStorage.clear();
    setUser();
}

setUser();

user.addEventListener('click', () => userModal.classList.toggle('modal-view'));
window.addEventListener('scroll', () => userModal.classList.add('modal-view'));

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}