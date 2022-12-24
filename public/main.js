const events = document.querySelector('.events');
const user = document.querySelector('.user');
const postEvent = document.querySelector('.postEvent');

const setUser = () => {
    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    user.innerHTML = username || 'guest';
    postEvent.style.display = (role == 'admin') ? 'block' : 'none';
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
            smallDesc
        } = event;
        const imageurl = image.split('./public')[1];
        return `
            <div class="event-card" data-index="${idx}" club=${club}>
            <a href="./EventPage/index.html?id=${_id}">
            <img src="./${imageurl}" alt="" class="background-image">
                    <p class="space"></p>
                    <h2 class="space">${title}</h2>
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
        const eventsHTML = createHTML(payload.data);
        events.innerHTML = eventsHTML;
    } catch(err) {
        events.innerHTML = `<div style="font-size: 30px; background-color: white;">something went wrong, ;(</div>`;
    }
};

setUser();
getContent('/event');