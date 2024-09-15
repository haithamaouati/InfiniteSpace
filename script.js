const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
const verseDiv = document.getElementById('verse');
const referenceDiv = document.getElementById('reference');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 1000;
const speed = 0.5;

function createStar() {
    return {
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width // Depth
    };
}

function init() {
    for (let i = 0; i < numStars; i++) {
        stars.push(createStar());
    }
}

function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    for (const star of stars) {
        const scale = canvas.width / star.z;
        const x = (star.x * scale) + canvas.width / 2;
        const y = (star.y * scale) + canvas.height / 2;
        const size = Math.max((1 - star.z / canvas.width) * 2, 0.1);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        star.z += speed;
        if (star.z > canvas.width) {
            star.z = 0;
        }
    }

    requestAnimationFrame(animate);
}

async function fetchRandomVerse() {
    const randomIndex = Math.floor(Math.random() * 114) + 1;
    const response = await fetch(`https://raw.githubusercontent.com/00AhmedMokhtar00/QuranTafseer-ar-json/master/quran-data/sura/${randomIndex}.json`);
    const data = await response.json();
    const sura = data[randomIndex];
    const ayahNumber = Math.floor(Math.random() * sura.number_of_ayah) + 1;
    const verse = sura.text[ayahNumber];
    return {
        verse: verse,
        suraName: sura.name,
        ayahNumber: ayahNumber
    };
}

async function displayVerse() {
    const { verse, suraName, ayahNumber } = await fetchRandomVerse();
    verseDiv.innerHTML = `﷽<br>﴿ ${verse} ﴾`;
    referenceDiv.textContent = `[${suraName}: ${ayahNumber}]`;
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

init();
animate();
setInterval(displayVerse, 7000); // Update verse every 7 seconds
displayVerse(); // Display a verse immediately on load