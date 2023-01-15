
const menu = document.getElementById('menu');
const menuClose = document.getElementById('menu-close');
const menuOpen = document.getElementById('menu-open');
const profileMenu = document.getElementById('profile-menu');
const profileToggle = document.getElementById('profile-view');
const postLinks = Array.from(document.querySelectorAll('.post-link'));
const contents = document.getElementById('contents');

const form = document.getElementById('form');
const commentInput = document.getElementById('comment');
const submit = document.getElementById('submit');
const message = document.getElementById('message-box');

let commentId = '';

const urlId = window.location.search.split('=')[1];

const populatePage = async (data) => {
    const {
        author,
        club,
        comments,
        createdAt,
        date,
        fromTime,
        fullDesc,
        image,
        smallDesc,
        title,
        toTime,
        updatedAt,
        venue,
        userId,
        _id
    } = data;
    const { username, profileImage } = await getAuthor(author);
    const html = `
        <div class="flex flex-col mx-0 mt-12 sm:bg-white sm:mx-8 w-[95%] sm:w-[60%] md:w-[50%]  max-w-6xl font-cormorant">
            <p class="text-2xl md:text-5xl font-bold text-center my-5 p-3 capitalize font-roboto tracking-wide">${title}</p>
            <div class="py-5 px-3 md:px-10 flex flex-col sm:flex-row font-mono text-sm">
                <div class="pl-4 w-full sm:w-1/2 flex justify-center flex-col">
                    <p class="text-slate-400 p-3">from: ${date.slice(0, 10)} ${fromTime}</p>
                    <p class="text-slate-400 p-3">to: ${date.slice(0, 10)} ${toTime}</p>
                    <p class=" p-3">club: ${club}</p>
                    <p class=" p-3">venue: ${venue}</p>
                </div>
                <div class="w-full sm:w-1/2">
                    <img src="../..${image.split('/public')[1]}" alt="event">
                </div>
            </div>
            <div class="px-3 py-6 tracking-wider">
                ${fullDesc}
            </div>
            <div class="px-3 py-3 flex justify-between">
                <p class="text-sm text-slate-500">created at ${createdAt.split('T')[0]+" "+createdAt.split('T')[1].slice(0,8)}</p>
                <p class="text-sm text-slate-500">updated at ${updatedAt.split('T')[0]+" "+updatedAt.split('T')[1].slice(0,8)}</p>
            </div>  
            <div class="flex justify-between">
                <div class="px-0 md:px-8 sm:px-14 py-3 flex items-center">
                    <div class="px-2">
                        <img class="h-12 aspect-square object-cover rounded-full" src="../..${profileImage.split('/public')[1]}" alt="event">
                    </div>
                    <p class="font-bold">author: ${username}</p>
                </div>
                <div class="py-3 flex items-center mr-12 ${localStorage.getItem('id') === author ? '' : 'hidden'}">
                    <a href="../update/index.html?id=${_id}"><img src="../../icons/edit-icon.png"></a>
                </div>
            </div>
            <div class="px-6 sm:px-14 py-6">
                <p class="text-xl font-roboto">comments</p>
                <div>
                    ${(comments.length == 0) ? 'none' : comments.map(({ comment, user, userProfile, userId, _id }) => {
        return `
                    <div class="py-3 flex items-center">
                        <div class="px-4">
                            <img class="h-12 aspect-square object-cover rounded-full" src="../..${userProfile.split('/public')[1]}" alt="event">
                        </div>
                        <div class="px-2 flex items-center justify-between grow">
                            <div>
                                <p class="font-semibold">${user}</p>
                                <p class="font-mono ">${comment}</p>
                            </div>
                            <div class="flex cursor-pointer ${userId === localStorage.getItem('id') ? '' : 'hidden'}" id="${_id}">
                                <img id="edit-comment" class="opacity-20 hover:opacity-100" src="../../icons/edit-icon.png" class=${localStorage.getItem('id') === userId ? '' : 'hidden'}>
                                <img id="delete-comment" class="opacity-20 hover:opacity-100" src="../../icons/delete-icon.png" class=${localStorage.getItem('id') === userId ? '' : 'hidden'}>
                            </div>
                        </div>
                    </div>`;
    }).join('')}
                </div>
            </div>
            <input id="update-comment" class="hidden border-2 border-slate-200 rounded-md focus:outline-none focus:border-sky-500" type="text" placeholder="update comment" id="updateComment" required>
        </div>`;
    contents.innerHTML = html;
    form.classList.remove('hidden');
    form.classList.add('flex');
}

const getAuthor = async (id) => {
    try {
        const res = await axios.get(`/auth/user/${id}`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return res.data.payload;
    } catch (err) {
        return 'none';
    }
}

const populateMenu = async () => {
    try {
        const res = await axios.get(`/events/${urlId}`);
        populatePage(res.data.payload);
    } catch (err) {
        contents.innerHTML = ('<div>500 internal error, ;\\. please come back later</div>');
    }
}

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

const commentsPost = async (e) => {
    const comment = commentInput.value;

    e.preventDefault();
    message.classList.remove('hidden');
    message.classList.add('flex');
    message.innerHTML = 'loading';
    submit.classList.add('cursor-not-allowed');
    submit.disabled = true;

    try {
        const res = await axios.post(`/comments/${urlId}`, { comment: comment }, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('token')}`
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
        message.classList.remove('flex');
        message.classList.add('hidden');
    }, 2000);
    form.reset();
    populateMenu();
}

const update = document.getElementById('update');
const commentUpdate = document.getElementById('comment-update');
const submitUpdate = document.getElementById('submit-update');

const commentUpdateFunc = async (e) => {
    e.preventDefault();
    message.classList.remove('hidden');
    message.classList.add('flex');
    message.innerHTML = 'loading';
    submitUpdate.classList.add('cursor-not-allowed');
    submitUpdate.disabled = true;
    try {
        const res = await axios.patch(`/comments/${urlId}?commentId=${commentId}`, { comment: commentUpdate.value, author: localStorage.getItem('id') }, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        message.style.backgroundColor = 'rgb(34 197 94)';
        message.innerHTML = res.data.message;
    } catch (err) {
        message.style.backgroundColor = 'rgb(220 38 38)';
        message.innerHTML = err.response.data.message;
    }
    submitUpdate.disabled = false;
    submitUpdate.classList.remove('cursor-not-allowed');
    setTimeout(() => {
        message.classList.remove('flex');
        message.classList.add('hidden');
        update.classList.remove('flex');
        update.classList.add('hidden');
    }, 2000);
    populateMenu();
}

const commentDelete = async (id) => {
    message.classList.remove('hidden');
    message.classList.add('flex');
    message.innerHTML = 'loading';
    try {
        const res = await axios.delete(`/comments/${urlId}?commentId=${id}`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: {
                author: localStorage.getItem('id')
            }
        });
        message.style.backgroundColor = 'rgb(34 197 94)';
        message.innerHTML = res.data.message;
    } catch (err) {
        message.style.backgroundColor = 'rgb(220 38 38)';
        message.innerHTML = err.response.data.message;
    }
    setTimeout(() => {
        message.classList.remove('flex');
        message.classList.add('hidden');
    }, 2000);
    populateMenu();
}

const updateDelete = (e) => {
    commentId = e.target.parentNode.id;
    const type = (e.target.id).split('-')[0];
    if (commentId && type === 'edit') {
        update.classList.remove('hidden');
        update.classList.add('flex');
    }
    if (commentId && type === 'delete') {
        if (window.confirm('are you sure you want to delete the comment')) {
            commentDelete(commentId);
        }
    }
};

update.addEventListener('submit', (e) => commentUpdateFunc(e));
contents.addEventListener('click', (e) => updateDelete(e));
form.addEventListener('submit', (e) => commentsPost(e));
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