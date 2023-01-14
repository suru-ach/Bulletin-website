
const menu = document.getElementById('menu');
const menuClose = document.getElementById('menu-close');
const menuOpen = document.getElementById('menu-open');
const profileMenu = document.getElementById('profile-menu');
const profileToggle = document.getElementById('profile-view');
const postLinks = Array.from(document.querySelectorAll('.post-link'));

const setUser = () => {
    const role = localStorage.getItem('role');
    const profile = localStorage.getItem('profile') ? '../..' + localStorage.getItem('profile').split('/public')[1] : '../../uploads/profile/default.png';
    const username = localStorage.getItem('username');
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