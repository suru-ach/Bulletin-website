

const email = document.getElementById('email');
const password = document.getElementById('password');
const submit = document.getElementById('submit');
const form = document.getElementById('form');

const message = document.getElementById('message-box');

const setToken = (data) => {
    for (key in data) {
        localStorage.setItem(key, data[key]);
    }
};

const postData = async (e) => {
    e.preventDefault();
    message.style.visibility = 'visible';
    message.innerHTML = 'loading';
    submit.classList.add('cursor-not-allowed');
    submit.disabled = true;

    const data = {
        email: email.value,
        password: password.value
    };

    try {
        const res = await axios.post('/auth/login', data);
        message.style.color = 'rgb(34 197 94)';
        message.innerHTML = res.data.message;
        setToken(res.data.payload);
    } catch (err) {
        message.style.color = 'rgb(220 38 38)';
        message.innerHTML = err.response.data.message;
    }

    submit.disabled = false;
    submit.classList.remove('cursor-not-allowed');
    setTimeout(() => {
        message.style.visibility = 'hidden';
        window.location.href = "../../index.html";
    }, 3000);
    form.reset();
};

form.addEventListener('submit', e => postData(e));