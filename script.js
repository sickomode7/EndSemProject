const sI = document.getElementById('searchInput');
const sB = document.getElementById('searchBtn');
const bR = document.getElementById('bookResults');
const lS = document.getElementById('libraryShelves');
let lib = JSON.parse(localStorage.getItem('lib')) || [];
async function fB(q) {
    const r = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}`);
    const d = await r.json();
    return d.items || [];
}
function dB(b) {
    bR.innerHTML = b.map(b => `
        <div class="bC">
            <img src="${b.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${b.volumeInfo.title}">
            <h3>${b.volumeInfo.title}</h3>
            <p>${b.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
            <button onclick="aL('${b.id}', '${b.volumeInfo.title}')">Add</button>
        </div>
    `).join('');
}
function aL(id, t) {
    const b = lib.find(b => b.id === id);
    if (!b) {
        lib.push({ id, t, p: 0 });
        localStorage.setItem('lib', JSON.stringify(lib));
        dL();
    }
}
function dBk(id) {
    lib = lib.filter(b => b.id !== id);
    localStorage.setItem('lib', JSON.stringify(lib));
    dL();
}
function uP(id) {
    const b = lib.find(b => b.id === id);
    if (b) {
        const p = prompt('Enter progress (0-100):');
        if (p >= 0 && p <= 100) {
            b.p = p;
            localStorage.setItem('lib', JSON.stringify(lib));
            dL();
        }
    }
}
function dL() {
    lS.innerHTML = lib.map(b => `
        <div class="bC">
            <h3>${b.t}</h3>
            <p><strong>ID:</strong> ${b.id}</p>
            <p><strong>Progress:</strong> ${b.p}%</p>
            <div class="bG">
                <button class="uB" onclick="uP('${b.id}')">Update</button>
                <button class="dB" onclick="dBk('${b.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}
sB.addEventListener('click', async () => {
    const q = sI.value.trim();
    if (q) {
        const b = await fB(q);
        dB(b);
    }
});
dL();
