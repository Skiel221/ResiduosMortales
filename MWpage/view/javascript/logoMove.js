// filepath: c:\Users\Ezequiel\Documents\GitHub\ResiduosMortales\MWpage\view\javascript\logoMove.js
const logo = document.getElementById('logo');
const logoImg = logo.querySelector('img');

// Movimiento suave
document.addEventListener('mousemove', (e) => {
    const rect = logo.getBoundingClientRect();
    const logoX = rect.left + rect.width / 2;
    const logoY = rect.top + rect.height / 2;
    const dx = (e.clientX - logoX) * -0.02; // sensibilidad
    const dy = (e.clientY - logoY) * -0.02;
    logoImg.style.transform = `translate(${dx}px, ${dy}px)`;
});

// Parpadeo de brillo
function flicker() {
    const base = 1;
    const flickerAmount = Math.random() * 0.8 + 0.2; // entre 0.7 y 1.4
    logoImg.style.filter = `brightness(${base * flickerAmount})`;
    setTimeout(flicker, Math.random() * 400 + 300); // parpadeo aleatorio
}
flicker();