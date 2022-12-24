const alertDiv = document.querySelector('.alertDiv');
const postEvent = document.getElementById('postEvent');
const user = document.querySelector('.user');
const submitButton = postEvent.querySelector('button');

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
    postEvent.style.display = (role == 'admin') ? 'block' : 'none';
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

    const form = e.target;

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

    try {
        const res = await axios.post('/admin/event', formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (res.status !== 201) {
            throw Error(res);
        }
        alertDiv.innerHTML = res.data.msg;
        alertDiv.classList.remove('message');
        alertDiv.classList.add('success');
        form.reset();
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

postEvent.addEventListener('submit', (e) => submitData(e));


function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}