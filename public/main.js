const events = document.querySelector('.events');
const user = document.querySelector('.user');
const postEvent = document.querySelectorAll('.postEvent');
const clubInput = document.getElementById('club');
const userModal = document.querySelector('.user-float');
const smUser = document.querySelector('.sm-user');

const setUser = () => {
    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    user.innerHTML = username || 'guest';
    postEvent.forEach(event => event.style.display = (role == 'admin') ? 'block' : 'none');
    userModal.innerHTML = `<p>logged in as</p><p>${username || 'guest'}</p>${(role ? '<button class="logout" onClick=deleteUser()>logout</button>' : '' )}`;
    smUser.innerHTML = `<p>logged in as ${username || 'guest'}</p>${role ? '<button onclick=deleteUser()>logout</button>':''}`;
}

const sortByDate = (data) => {
    const recentData = data.filter(date => new Date(date.date) >= Date.now());
    const sortedData = recentData.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    })
    return sortedData;
}

const sortByClubs = async (e) => {
    const { value } = e.target;
    if(value == 'all') {
        events.innerHTML = '<div style="font-size: 30px; background-color: white;">Loading...</div>';
        const sortedData = sortByDate(contextData);
        const eventsHTML = createHTML(sortedData);
        events.innerHTML = eventsHTML;
        return;
    }
    events.innerHTML = '<div style="font-size: 30px; background-color: white;">Loading...</div>';
    const sortedData = sortByDate(contextData);
    const clubSort = sortedData.filter(event => event.club.toLowerCase() == value);
    const eventsHTML = createHTML(clubSort);
    events.innerHTML = eventsHTML;
}

const getClubs = (data) => {
    // returns set of all clubs
    const clubs = data.map(event => event.club.toLowerCase());
    clubs.push('all');
    const clubSet = Array.from(new Set(clubs));
    const clubsOptions = clubSet.map(club => `<option value="${club}" ${club == 'all' ? 'selected' : ''}>${club}</option>`).join('');
    clubInput.innerHTML = clubsOptions;
}

const createHTML = (data) => {
    if(!data.length) {
        return "<div style='font-size: 30px; background-color: white;'>There's nothing up</div>";
    }
    const htmldata = data.map((event, idx) => {
        const {
            title,
            _id,
            fromTime,
            toTime,
            image,
            club,
            venue,
            date
        } = event;
        const imageurl = image.split('./public')[1];
        return `
            <div class="event-card" data-index="${idx}" club=${club}>
            <a href="./EventPage/index.html?id=${_id}">
            <img src="./${imageurl}" alt="" class="background-image">
                    <p class="space"></p>
                    <h2 class="space">${title}</h2>
                    <h2 class="space">${date.split('T')[0]}</h2>
                    <p class="venue-text space">${venue}</p>
                    <div class="space flat">
                    <p>${fromTime}<p>
                    <span class="bar">-</span>
                    <p>${toTime}</p>
                    </div>
                    <p class="space"></p>
                    </div>
                </a>
            </div> `;
    }).join('');
    return htmldata;
};

const getContent = async(url) => {
    events.innerHTML = '<div style="font-size: 30px; background-color: white;">Loading...</div>';
    try {
        const payload = await axios.get(url);
        contextData = payload.data;
        const sortedData = sortByDate(payload.data);
        const eventsHTML = createHTML(sortedData);
        getClubs(sortedData);
        events.innerHTML = eventsHTML;
    } catch(err) {
        events.innerHTML = `<div style="font-size: 30px; background-color: white;">something went wrong, ;(</div>`;
    }
};

setUser();
getContent('/event');

clubInput.addEventListener('change', (e) => sortByClubs(e));

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

const deleteUser = () => {
    localStorage.clear();
    setUser();
}

user.addEventListener('click', () => userModal.classList.toggle('modal-view'));
window.addEventListener('scroll', () => userModal.classList.add('modal-view'));