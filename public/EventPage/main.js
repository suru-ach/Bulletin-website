const user = document.querySelector('.user');
const postEvent = document.querySelector('.postEvent');
const eventContent = document.querySelector('.container');

const container = document.querySelector('.container-full');
const alertDiv = document.querySelector('.alertDiv');

const commentPost = document.getElementById('comment-post');
const commentValue = commentPost.querySelector('input');
const submitButton = commentPost.querySelector('button');
const deleteButton = document.getElementById('delete');
let calendar = '';

const url = window.location.search.split('=')[1];

const setUser = () => {
    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    user.innerHTML = username || 'guest';
    postEvent.style.display = (role == 'admin') ? 'block' : 'none';
}

const getHTML = async (eventData) => {
    const {
        calendarID,
        title,
        date,
        fromTime,
        toTime,
        smallDesc,
        club,
        image,
        fullDesc,
        comments,
        venue
    } = eventData;
    calendar = calendarID;
    const imageData = image.split('./public')[1];
    return `
    <div class="sub-container" id="${calendarID}">
        <div class="content-page">
            <div class="smallDesc">
                <h1>${title}</h1>
                <p>venue: ${venue}</p>
                <p>date: ${date.split('T')[0]}</p>
                <p>starts at: ${fromTime}</p>
                <p>ends at: ${toTime}</p>
                <p>${smallDesc}</p>
                <p>${club == 'ALL' ? 'open to all' : 'by ' + club}</p>
                </div>
        </div>
        <img src="..${imageData}" alt="imageData">
    </div>
    <div>
    <div class="description">
            <p>${fullDesc}</p>
        </div>
        <div class="comments">
        <h3>comments</h3>
        <ul class="comment-list">
        ${comments.length ? 
            comments.map(({ user, comment, userId }) => {
                return `
                    <li id="${userId}">
                        <p class="user"><span style="color: rgba(0,0,139,1);">${user}</span> posted a comment</p>
                        <p class="user-comment">${comment}</p>
                    </li>
                    `
    }).join('')
:   '<li><p>no comments</p></li>'
}
            </ul>
            </div>
            </div>
            `;
}

const getData = async (url) => {
    eventContent.innerHTML = '';
    alertDiv.innerHTML = 'loading...';
    alertDiv.classList.add('message');
    try {
        const payload = await axios.get(`/event/${url}`);
        const populate = await getHTML(payload.data);
        eventContent.innerHTML = populate;
    } catch (err) {
        eventContent.innerHTML = '<h1>No Events found</h1>';
    }
    alertDiv.classList.remove('message');
}

const postComment = async (e) => {
    submitButton.disabled = true;
    e.preventDefault();
    
    alertDiv.innerHTML = 'posting';
    alertDiv.classList.add('message');
    
    try {
        const res = await axios.post(`/event/${url}`, { comment: commentValue.value } ,{
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (res.status != 201) {
            throw Error(res);
        }
        alertDiv.innerHTML = 'comment posted';
        alertDiv.classList.remove('message');
        alertDiv.classList.add('success');
        commentValue.value = '';
    } catch (err) {
        alertDiv.innerHTML = 'not authorized';
        alertDiv.classList.remove('message');
        alertDiv.classList.add('error');
    }

    setTimeout(() => {
        alertDiv.classList.remove('error');
        alertDiv.classList.remove('success');
    }, 3000);
    submitButton.disabled = false;
}

const deleteData = async (e) => {
    e.preventDefault();
    if(!window.confirm('sure you want to delete?')) {
        return;
    }

    alertDiv.innerHTML = 'deleting';
    alertDiv.classList.add('message');

    try {
        const res = await axios.delete(`/admin/event/${url}?calendarID=${calendar}`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(res);
        if(res.status != 200) {
            throw Error(res);
        }
        alertDiv.innerHTML = 'deleted successfully';
        alertDiv.classList.remove('message');
        alertDiv.classList.add('error');
        getData();
    } catch(err) {
        alertDiv.innerHTML = err.response.data.msg;
        alertDiv.classList.remove('message');
        alertDiv.classList.add('error');
    }

    setTimeout(() => {
        alertDiv.classList.remove('error');
        alertDiv.classList.remove('success');
    }, 3000);
}

commentPost.addEventListener('submit', (e) => postComment(e));
deleteButton.addEventListener('click', (e) => deleteData(e));

getData(url);
setUser();

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}