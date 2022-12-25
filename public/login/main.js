const user = document.querySelector('.user');

const register = document.querySelector('.register');
const input_email = document.getElementById('email');
const input_password = document.getElementById('password');
const postEvent = document.querySelectorAll('.postEvent');
const userModal = document.querySelector('.user-float');
const smUser = document.querySelector('.sm-user');

const alertDiv = document.querySelector('.alertDiv');

const setLocalStorage = (username, token, role, clubs) => {
    localStorage.setItem('user', username);
    localStorage.setItem('token', `${token}`);
    localStorage.setItem('role', role);
    localStorage.setItem('clubs', clubs);
}

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


const submitData = async (e) => {
    e.preventDefault();
    
    alertDiv.innerHTML = 'loading';
    alertDiv.classList.add('message');
    
    const email = input_email.value;
    const password = input_password.value;
    
    try {
        const res = await axios.post('/user/login', { email, password });
        if (res.msg !== undefined) {
            throw Error(res);
        }
        alertDiv.innerHTML = 'login success';
        alertDiv.classList.remove('message');
        alertDiv.classList.add('success');
        register.reset();
        setLocalStorage(res.data.username, res.data.token, res.data.role, res.data.clubs);
        setUser();
    } catch (err) {
        alertDiv.innerHTML = err.response.data.msg;
        alertDiv.classList.remove('message');
        alertDiv.classList.add('error');
    }
    
    setTimeout(() => {
        alertDiv.classList.remove('error');
        alertDiv.classList.remove('success');
    }, 3000);
}
setUser();

register.addEventListener('submit', (e) => submitData(e));
user.addEventListener('click', () => userModal.classList.toggle('modal-view'));
window.addEventListener('scroll', () => userModal.classList.add('modal-view'));

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}