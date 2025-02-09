// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const bookResults = document.getElementById('bookResults');
const libraryShelves = document.getElementById('libraryShelves');

// Load library from localStorage
let myLibrary = JSON.parse(localStorage.getItem('myLibrary')) || [];

// Fetch books from Google Books API
async function fetchBooks(query) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    const data = await response.json();
    return data.items || [];
}

// Display book recommendations
function displayBooks(books) {
    bookResults.innerHTML = books.map(book => `
        <div class="book-card">
            <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${book.volumeInfo.title}">
            <h3>${book.volumeInfo.title}</h3>
            <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
            <button onclick="addToLibrary('${book.id}', '${book.volumeInfo.title}')">Add to Library</button>
        </div>
    `).join('');
}

// Add book to library
function addToLibrary(bookId, title) {
    const book = myLibrary.find(b => b.id === bookId);
    if (!book) {
        const newBook = { id: bookId, title, progress: 0 };
        myLibrary.push(newBook);
        localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
        displayLibrary();
    }
}

// Delete book from library
function deleteBook(bookId) {
    myLibrary = myLibrary.filter(book => book.id !== bookId);
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    displayLibrary();
}

// Update reading progress
function updateProgress(bookId) {
    const book = myLibrary.find(b => b.id === bookId);
    if (book) {
        const newProgress = prompt('Enter new progress (0-100):');
        if (newProgress >= 0 && newProgress <= 100) {
            book.progress = newProgress;
            localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
            displayLibrary();
        }
    }
}

// Display library
function displayLibrary() {
    libraryShelves.innerHTML = myLibrary.map(book => `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p><strong>ID:</strong> ${book.id}</p>
            <p><strong>Progress:</strong> ${book.progress}%</p>
            <div class="button-group">
                <button class="update-btn" onclick="updateProgress('${book.id}')">Update Progress</button>
                <button class="delete-btn" onclick="deleteBook('${book.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Event Listeners
searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
        const books = await fetchBooks(query);
        displayBooks(books);
    }
});

// Initial Load
displayLibrary();