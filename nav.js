const Navmove = () => {
    const sammich = document.querySelector('.sammich');
    const nav = document.querySelector('.navigation');

    sammich.addEventListener('click',() => {
        nav.classList.toggle('navigation-activate');
    });
}
Navmove();