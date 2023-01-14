
const menu = document.getElementById('menu');
const menuClose = document.getElementById('menu-close');
const menuOpen = document.getElementById('menu-open');
const profileMenu = document.getElementById('profile-menu');
const profileToggle = document.getElementById('profile-view');
const postLinks = Array.from(document.querySelectorAll('.post-link'));
const contents = document.getElementById('contents');

const banner = document.getElementById('banner');
const club = document.getElementById('club');

const populatePage = (data) => {
    if (data == null || data.length == 0) {
        banner.classList.remove('flex');
        banner.classList.add('hidden');
        contents.innerHTML = "<div class='text-4xl'>Nothing's up</div>";
    } else {
        const html = data.map(({ club,
            date,
            comments,
            fromTime,
            smallDesc,
            title,
            toTime,
            venue,
            _id,
            image
        }) => {
            return `<div class="w-[85%] sm:w-[47%] md:w-[30%] lg:w-[21%] my-3 bg-white flex flex-col shadow-xl">
                                    <a href="./pages/eventPage?id=${_id}"><div><img class="w-full" src=".${image != undefined ? image.split('/public')[1] : '/uploads/event/default.png'}" alt="event"></div></a><div class="p-3 space-y-1">
                                        <p class="text-xl text-center">${title}</p>
                                        <div class="flex justify-between"><p class="text-sm text-slate-600">from: ${date.slice(0, 10)}</p><p>venue: ${venue}</p></div>
                                        <div class="flex justify-between"><p class="text-sm text-slate-600">to: ${fromTime}-${toTime}</p><p>club: ${club}</p></div>
                                        <p>${smallDesc}</p><p>comments: ${comments.length}</p></div></div>`;
        }).join('');
        contents.innerHTML = html;
        banner.classList.remove('hidden');
        banner.classList.add('flex');
    }
}

let filterData;
const sortClubs = () => {
    if (club.value === 'all') {
        return populatePage(filterData);
    }
    populatePage(filterData.filter(data => data.club.toLowerCase() === club.value));
}

const sortDate = data => data.filter(val => new Date(val.date).getTime() > new Date().getTime() + 3600 * 1000 * 24);

const getClubs = data => data.length > 0 ? data.map(val => val.club.toLowerCase()) : club;

const fillClubs = (data) => {
    data.push('all');
    const html = data.map(club => `<option value="${club}" ${club == 'all' ? 'selected' : ''}>${club}</option>`);
    club.innerHTML = html;
}

const populateMenu = async () => {
    try {
        const res = await axios.get('/events');
        filterData = sortDate(res.data.payload);
        fillClubs(getClubs(filterData));
        populatePage(filterData);
    } catch (err) {
        // not ok
        contents.innerHTML = "<div class='text-4xl'>Nothing's up</div>";
        banner.classList.remove('flex');
        banner.classList.add('hidden');
    }
}

const setUser = () => {
    const role = localStorage.getItem('role');
    const profile = localStorage.getItem('profile') ? '.' + localStorage.getItem('profile').split('/public')[1] : './uploads/profile/default.png';
    const username = localStorage.getItem('username');
    if (role == 'admin') {
        postLinks.forEach(link => link.classList.remove('hidden'))
    }

    if (profile) {
        profileMenu.src = profileMenu.src.split('/uploads/profile/default.png')[0] + profile.slice(1, profile.length);
    }
    const html = `
               <div class="p-7">
                 <img class="aspect-square object-cover rounded-full" id="profile" src="${profile ? profile : './uploads/profile/default.png'}" alt="profile">
               </div>
               <p class="mb-2">${username ? username : 'guest'}</p>
               ${role ? `<p class="mb-2">role: ${role}</p>` : ''}
               <div class="mb-2 ${role != undefined ? '' : 'hidden'}">
                 <a href="./pages/profile/index.html#logout" class="bg-blue-500 px-3 py-1 rounded-md text-white">edit</a>
                 <a href="./pages/profile/index.html#logout" class="bg-black px-3 py-1 rounded-md text-white">logout</a>
               </div>
            `;
    profileToggle.innerHTML = html;
}

club.addEventListener('change', sortClubs);
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
populateMenu();