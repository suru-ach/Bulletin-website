
const menu = document.getElementById('menu');
const menuClose = document.getElementById('menu-close');
const menuOpen = document.getElementById('menu-open');
const profileMenu = document.getElementById('profile-menu');
const profileToggle = document.getElementById('profile-view');
const postLinks = Array.from(document.querySelectorAll('.post-link'));
const contents = document.getElementById('contents');

const password = document.getElementById('password');
const email = document.getElementById('email');
const newpassword = document.getElementById('newpassword');
const newusername = document.getElementById('newusername');
const clubs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
const submit = document.getElementById('submit');
const imagePost = document.getElementById('imagePost');
const form = document.getElementById('form');
const message = document.getElementById('message-box');

const messageDelete = document.getElementById('message-delete');
const deleteForm = document.getElementById('deleteForm');
const deleteEmail = document.getElementById('deleteEmail');
const deletePassword = document.getElementById('deletePassword');
const deleteButton = document.getElementById('delete');

const infoImg = document.getElementById('infoImg');
const infoUsername = document.getElementById('infoUsername');
const infoRole = document.getElementById('infoRole');
const infoEmail = document.getElementById('infoEmail');
const infoClubs = document.getElementById('infoClubs');

const getUser = async () => {
    const id = localStorage.getItem('id');
    if (id !== null) {
        try {
            const res = await axios.get(`/auth/user/${id}?type=all`, {
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const {
                clubs,
                email,
                profileImage,
                role,
                username,
                _id
            } = res.data.payload;
            infoImg.src = profileImage ? '../..' + profileImage.split('/public')[1] : 'uploads/profile/default.png';
            infoUsername.innerHTML = username;
            infoRole.innerHTML = role;
            infoEmail.innerHTML = email;
            infoClubs.innerHTML = clubs.length === 0 ? 'none' : clubs;
        } catch (err) {

        }
    }
};

const setUser = () => {
    const role = localStorage.getItem('role');
    const profile = localStorage.getItem('profile') ? '../..' + localStorage.getItem('profile').split('/public')[1] : '../../uploads/profile/default.png';
    const username = localStorage.getItem('username');
    if (role == undefined) {
        contents.innerHTML = '<div>your not logged in</div>';
    }
    if (role == 'admin') {
        postLinks.forEach(link => link.classList.remove('hidden'))
    }

    if (profile) {
        profileMenu.src = profile;
    }
    const html = `
               <div class="p-7">
                 <img class="aspect-square object-cover rounded-full" id="profile" src="${profile ? profile : '../../uploads/profile/default.png'}" alt="profile">
               </div>
               <p class="mb-2">${username ? username : 'guest'}</p>
               ${role ? `<p class="mb-2">role: ${role}</p>` : ''}
               <div class="mb-2 ${role != undefined ? '' : 'hidden'}">
                 <a href="../../pages/profile/index.html#logout" class="bg-blue-500 px-3 py-1 rounded-md text-white">edit</a>
                 <a href="../../pages/profile/index.html#logout" class="bg-black px-3 py-1 rounded-md text-white">logout</a>
               </div>
            `;
    profileToggle.innerHTML = html;
};

const setToken = (data) => {
    for (key in data) {
        localStorage.setItem(key, data[key]);
    }
};

const updateUser = async (e) => {
    e.preventDefault();
    message.style.visibility = 'visible';
    message.innerHTML = 'loading';
    submit.classList.add('cursor-not-allowed');
    submit.disabled = true;
    const inputClubs = clubs.filter(club => club.checked).map(club => club.id);

    const formData = new FormData();
    formData.append('password', password.value);
    formData.append('email', email.value);
    formData.append('newPassword', newpassword.value);
    formData.append('newUsername', newusername.value);
    formData.append('clubs', inputClubs);
    formData.append('imagePost', imagePost.files[0]);

    try {
        const res = await axios.patch('/auth/register', formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        message.style.color = 'rgb(34 197 94)';
        message.innerHTML = res.data.message;
        setToken(res.data.payload);
        form.reset();
    } catch (err) {
        message.style.color = 'rgb(220 38 38)';
        message.innerHTML = err.response.data.message;
    }

    submit.disabled = false;
    submit.classList.remove('cursor-not-allowed');
    setTimeout(() => {
        message.style.visibility = 'hidden';
    }, 3000);
};


const deleteUser = async (e) => {
    if (window.confirm('are you sure you want to delete you account!')) {
        e.preventDefault();
        messageDelete.style.visibility = 'visible';
        messageDelete.innerHTML = 'loading';
        deleteButton.classList.add('cursor-not-allowed');
        deleteButton.disabled = true;

        const data = {
            email: deleteEmail.value,
            password: deletePassword.value
        }

        try {
            const res = await axios.delete('/auth/register', {
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                },
                data
            });
            messageDelete.style.color = 'rgb(34 197 94)';
            messageDelete.innerHTML = res.data.message;
        } catch (err) {
            messageDelete.style.color = 'rgb(220 38 38)';
            messageDelete.innerHTML = err.response.data.message;
        }

        deleteButton.disabled = false;
        deleteButton.classList.remove('cursor-not-allowed');
        setTimeout(() => {
            messageDelete.style.visibility = 'hidden';
            logout();
        }, 3000);
        deleteForm.reset();
    }
};

const logout = () => {
    localStorage.clear();
    setUser();
    window.location.href = "../../index.html";
};

menuOpen.addEventListener('click', () => {
    menu.classList.remove('-left-full');
});
menuClose.addEventListener('click', () => {
    menu.classList.add('-left-full');
});
form.addEventListener('submit', e => updateUser(e));
deleteForm.addEventListener('submit', e => deleteUser(e));
profileMenu.addEventListener('click', () => {
    if (profileToggle.classList.contains('hidden')) {
        profileToggle.classList.replace('hidden', 'flex');
    } else {
        profileToggle.classList.replace('flex', 'hidden');
    }
});
setUser();
getUser();