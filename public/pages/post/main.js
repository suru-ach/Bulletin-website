
const menu = document.getElementById('menu');
const menuClose = document.getElementById('menu-close');
const menuOpen = document.getElementById('menu-open');
const profileMenu = document.getElementById('profile-menu');
const profileToggle = document.getElementById('profile-view');
const postLinks = Array.from(document.querySelectorAll('.post-link'));
const contents = document.getElementById('contents');

const submit = document.getElementById('submit');
const form = document.getElementById('form');
const message = document.getElementById('message-box');

const setUser = () => {
    const role = localStorage.getItem('role');
    const profile = localStorage.getItem('profile') ? '../..' + localStorage.getItem('profile').split('/public')[1] : '../../uploads/profile/default.png';
    const username = localStorage.getItem('username');
    if(role !== null) {
        Array.from(document.querySelectorAll('.reg_log')).forEach(link => link.classList.add('hidden'));
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
}

const postData = async (e) => {
    e.preventDefault();
    message.innerHTML = 'posting';
    message.classList.remove('hidden');
    message.classList.add('block');
    submit.classList.add('cursor-not-allowed');
    submit.disabled = true;

    const input_title = document.getElementById('title');
    const input_date = document.getElementById('date');
    const input_fromTime = document.getElementById('fromTime');
    const input_toTime = document.getElementById('toTime');
    const input_venue = document.getElementById('venue');
    const input_club = document.getElementById('club');
    const input_smallDesc = document.getElementById('smallDesc');
    const input_fullDesc = document.getElementById('fullDesc');
    const input_image = document.getElementById('postImage');
    const form = e.target;


    const formData = new FormData();
    formData.append('title', input_title.value);
    formData.append('date', (input_date.value).toString());
    formData.append('fromTime', (input_fromTime.value).toString());
    formData.append('toTime', (input_toTime.value).toString());
    formData.append('venue', input_venue.value);
    formData.append('club', input_club.value);
    formData.append('imagePost', input_image.files[0]);
    formData.append('smallDesc', input_smallDesc.value);
    formData.append('fullDesc', input_fullDesc.value);

    try {
        const res = await axios.post('/events', formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                'authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        message.style.backgroundColor = 'rgb(34 197 94)';
        message.innerHTML = res.data.message;
    } catch (err) {
        message.style.backgroundColor = 'rgb(220 38 38)';
        message.innerHTML = err.response.data.message;
    }

    submit.disabled = false;
    submit.classList.remove('cursor-not-allowed');
    setTimeout(() => {
        message.classList.remove('block');
        message.classList.add('hidden');
        window.location.href = "../../index.html";
    }, 2000);
    form.reset();
};

form.addEventListener('submit', e => postData(e))

menuOpen.addEventListener('click', () => {
    menu.classList.remove('-left-full');
});
menuClose.addEventListener('click', () => {
    menu.classList.add('-left-full');
});
profileMenu.addEventListener('click', () => {
    if (profileToggle.classList.contains('hidden')) {
        profileToggle.classList.replace('hidden', 'flex');
    } else {
        profileToggle.classList.replace('flex', 'hidden');
    }
});
setUser();