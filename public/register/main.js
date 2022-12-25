const user = document.querySelector('.user');
const postEvent = document.querySelectorAll('.postEvent');

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
}

const register = document.querySelector('.register');
const input_user = document.getElementById('username');
const input_email = document.getElementById('email');
const clubs = document.getElementById('clubs');
const input_club = Array.from(clubs.querySelectorAll('input'));
const input_password = document.getElementById('password');

const submitData = async (e) => {
    e.preventDefault();

    alertDiv.innerHTML = 'loading';
    alertDiv.classList.add('message');

    const user = input_user.value;
    const email = input_email.value;
    const password = input_password.value;
    const clubs = input_club.filter(val => val.checked).map(val => val.id.toUpperCase());
    
    try {           
        const res = await axios.post('/user/register', {user, email, password, clubs});
        if(res.status !== 201) {
            throw Error(res);
        }
        alertDiv.innerHTML = 'account successfully created';
        alertDiv.classList.remove('message');
        alertDiv.classList.add('success');
        register.reset();
        setLocalStorage(res.data.username, res.data.token, res.data.role, res.data.clubs);
        setUser();
    } catch(err) {
        alertDiv.innerHTML = err.response.data.msg;
        alertDiv.classList.remove('message');
        alertDiv.classList.add('error');
    }
    input_user.value = '';
    input_email.value = '';
    input_password.value = '';

    setTimeout(() => {
        alertDiv.classList.remove('error');
        alertDiv.classList.remove('success');
    }, 3000);
}
setUser();

register.addEventListener('submit', (e) => submitData(e));

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}