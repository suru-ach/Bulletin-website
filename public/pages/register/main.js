

const email = document.getElementById('email');
const password = document.getElementById('password');
const username = document.getElementById('username');
const clubs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
const submit = document.getElementById('submit');
const imagePost = document.getElementById('imagePost');
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
    const inputClubs = clubs.filter(club => club.checked).map(club => club.id);

    const formData = new FormData();
    formData.append('email', email.value);
    formData.append('password', password.value);
    formData.append('username', username.value);
    formData.append('clubs', inputClubs);
    formData.append('imagePost', imagePost.files[0]);

    try {
        const res = await axios.post('/auth/register', formData, {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        });
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