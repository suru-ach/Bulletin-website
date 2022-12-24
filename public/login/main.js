const user = document.querySelector('.user');

const register = document.querySelector('.register');
const input_email = document.getElementById('email');
const input_password = document.getElementById('password');

const alertDiv = document.querySelector('.alertDiv');

const setLocalStorage = (username, token, role) => {
    localStorage.setItem('user', username);
    localStorage.setItem('token', `${token}`);
    localStorage.setItem('role', role);
}

const setUser = () => {
    const username = localStorage.getItem('user');
    user.innerHTML = username || 'guest';
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
        setLocalStorage(res.data.username, res.data.token, res.data.role);
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