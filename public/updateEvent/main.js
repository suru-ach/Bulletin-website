const alertDiv = document.querySelector('.alertDiv');
const postEventrole = document.querySelectorAll('.postEvent');
const postEvent = document.getElementById('postEvent');
const user = document.querySelector('.user');
const submitButton = postEvent.querySelector('button');
const userModal = document.querySelector('.user-float');
const smUser = document.querySelector('.sm-user');

const url = window.location.search.split('=')[1];

let author = '';
const input_title = document.getElementById('title');
const input_date = document.getElementById('date');
const input_fromTime = document.getElementById('fromTime');
const input_toTime = document.getElementById('toTime');
const input_venue = document.getElementById('venue');
const input_club = document.getElementById('club');
const input_smallDesc = document.getElementById('smallDesc');
const input_fullDesc = document.getElementById('fullDesc');
const input_image = document.getElementById('eventImage');

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

const populate = async() => {
    alertDiv.innerHTML = 'loading';
    alertDiv.classList.add('message');
    let res = null;
    try {
        res = await axios.get(`/event/${url}`);
        if(res.status !== 200) {
            throw Error(res);
        }
        alertDiv.innerHTML = 'saved';
        alertDiv.classList.remove('message');
    } catch(err) {
        alertDiv.innerHTML = 'error';
        alertDiv.classList.remove('message');
        alertDiv.classList.add('error');
    }
    let date = new Date(res.data.date);
    date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    
    input_title.value = res.data.title;
    input_date.value = date;
    input_fromTime.value = res.data.fromTime;
    input_toTime.value = res.data.toTime;
    input_venue.value = res.data.venue;
    input_club.value = res.data.club;
    input_smallDesc.value = res.data.smallDesc;
    input_fullDesc.value = res.data.fullDesc;
    author = res.data.author;
}

const submitData = async (e) => {
    submitButton.disabled = true;
    e.preventDefault();
    
    alertDiv.innerHTML = 'saving';
    alertDiv.classList.add('message');
    
    const formData = new FormData();
    formData.append('title', input_title.value);
    formData.append('date', (input_date.value).toString());
    formData.append('fromTime', (input_fromTime.value).toString());
    formData.append('toTime', (input_toTime.value).toString());
    formData.append('venue', input_venue.value);
    formData.append('club', input_club.value);
    formData.append('eventImage', input_image.files[0]);
    formData.append('smallDesc', input_smallDesc.value);
    formData.append('fullDesc', input_fullDesc.value);
    formData.append('author', author);
    
    try {
        const res = await axios.patch(`/admin/event/${url}`, formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (res.status != 200) {
            throw Error(res);
        }
        alertDiv.innerHTML = res.data.msg;
        alertDiv.classList.remove('message');
        alertDiv.classList.add('success');
        populate();
    } catch (err) {
        alertDiv.innerHTML = err.response.data.msg;
        alertDiv.classList.remove('message');
        alertDiv.classList.add('error');
    }
    
    setTimeout(() => {
        alertDiv.classList.remove('error');
        alertDiv.classList.remove('success');
    }, 3000);
    submitButton.disabled = false;
}
setUser();
populate();

user.addEventListener('click', () => userModal.classList.toggle('modal-view'));
window.addEventListener('scroll', () => userModal.classList.add('modal-view'));
postEvent.addEventListener('submit', (e) => submitData(e));


function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}