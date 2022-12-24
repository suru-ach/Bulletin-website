// const user = document.querySelector('.user');
// const postEvent = document.querySelector('.postEvent');
// const eventContent = document.querySelector('.container');

// const url = window.location.search.split('=')[1];

// const setUser = () => {
//     const username = localStorage.getItem('user');
//     const role = localStorage.getItem('role');
//     user.innerHTML = username || 'guest';
//     postEvent.style.display = (role == 'admin') ? 'block' : 'none';
// }
// setUser();

// const getHTML = (eventData) => {
// }

// const getData = async (url) => {
//     // eventContent.innerHTML = '<h2 style="margin-top: 60px;">Loading...</h2>';
//     try {
//         const payload = await axios.get(`/event/${url}`);
//         // const html = getHTML(payload.data);
//         console.log(payload.data);
//         // eventContent.innerHTML;
//     } catch(err) {
//         // console.log(err.response.data.msg);
//         // eventContent.innerHTML = '<h1>No Events found</h1>';
//     }
// }
// getData(url);

// function openNav() {
//     document.getElementById("mySidenav").style.width = "250px";
// }

// function closeNav() {
//     document.getElementById("mySidenav").style.width = "0";
// }