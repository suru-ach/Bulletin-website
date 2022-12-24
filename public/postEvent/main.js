
const alertDiv = document.querySelector('.alertDiv');
const postEvent = document.getElementById('postEvent');

const submitData = async (e) => {
    e.preventDefault();

    alertDiv.innerHTML = 'saving';
    alertDiv.classList.add('message');

    const input_title = document.getElementById('title');
    const input_date = document.getElementById('date');
    const input_fromTime = document.getElementById('fromTime');
    const input_toTime = document.getElementById('toTime');
    const input_venue = document.getElementById('venue');
    const input_club = document.getElementById('club');
    const input_smallDesc = document.getElementById('smallDesc');
    const input_fullDesc = document.getElementById('fullDesc');
    const input_image = document.getElementById('eventImage');
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
    formData.append('fullDesc', fullDesc.value);

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
    }, 10000);
}
postEvent.addEventListener('submit', (e) => submitData(e));

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}