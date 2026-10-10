const noteForm=document.querySelector('#note-form');
const noteList=document.querySelector('#notes-list');
const noteInput=document.querySelector('#note-input');
const noteCategory=document.querySelector('#note-category');
const errorMessage=document.querySelector('#error-message');
const noteCount=document.querySelector('#note-count');
const searchInput=document.querySelector('#search-input');
const searchMessage=document.querySelector('#search-message');

const quickNotes=[
    {id:1, text:'Buy groceries',category:'Personal',createdAt:new Date()},
    {id:2, text:'Finish project report',category:'Work',createdAt:new Date()},
    {id:3, text:'Call mom',category:'Personal',createdAt:new Date()},
    {id:4, text:'Schedule dentist appointment',category:'Other',createdAt:new Date()},
    {id:5, text:'Plan weekend trip',category:'Other',createdAt:new Date()},
]

function saveNotes() {
    try {
        localStorage.setItem('notes', JSON.stringify(quickNotes));
        errorMessage.textContent='';
    } catch (error) {
        console.error('Could not save notes to local storage.', error);
        errorMessage.textContent='Changes could not be saved in this browser.';
    }
}

function loadNotes() {
    try {
        const savedNotes = localStorage.getItem('notes');
        const loadedNotes = savedNotes ? JSON.parse(savedNotes) : null;

        if (loadedNotes) {
            quickNotes.length = 0;
            loadedNotes.forEach(note => {
                note.createdAt = new Date(note.createdAt);
                quickNotes.push(note);
            });
        }
    } catch (error) {
        console.error('Could not load notes from local storage.', error);
        errorMessage.textContent = 'Saved notes could not be loaded.';
    }
}

function render() {
    noteList.replaceChildren();

    const searchTerm = searchInput.value.trim().toLowerCase();
    const visibleNotes = quickNotes.filter(note =>
        note.text.toLowerCase().includes(searchTerm) ||
        note.category.toLowerCase().includes(searchTerm)
    );

    searchMessage.textContent = searchTerm && visibleNotes.length === 0
        ? 'No notes match your search.'
        : '';

    visibleNotes.forEach(note => {
        const noteItem = document.createElement('li');
        const noteContent = document.createElement('div');
        noteContent.classList.add('note-content');

        const noteText = document.createElement('span');
        noteText.classList.add('note-text');
        noteText.textContent = note.text;

        const noteNoteCategory = document.createElement('span');
        const categoryName = note.category.toLowerCase();
        noteNoteCategory.classList.add('note-category', `category-${categoryName}`);
        noteNoteCategory.textContent = note.category;

        const noteDate = document.createElement('span');
        noteDate.classList.add('note-date');
        noteDate.textContent = note.createdAt.toLocaleString();

        noteContent.append(noteText, noteNoteCategory, noteDate);

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.textContent = 'Delete';
        delBtn.classList.add('delete-btn');
        delBtn.setAttribute('aria-label', `Delete note: ${note.text}`);
        delBtn.addEventListener('click', () => {
            quickNotes.splice(quickNotes.indexOf(note), 1);
            saveNotes();
            render();
        });

        noteItem.append(noteContent, delBtn);
        noteList.appendChild(noteItem);
    });
    updateNoteCount();
}

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text=noteInput.value.trim();
    const category=noteCategory.value;
    if(!text) {
        errorMessage.textContent='Please enter a note.';
    } else if(text.length > 200) {
        errorMessage.textContent='Your note must be 200 characters or fewer.';
    } else if(!category) {
        errorMessage.textContent='Please choose a category.';
    } else {
        const newNote = {
            id: quickNotes.reduce((largestId, note) => Math.max(largestId, note.id), 0) + 1,
            text,
            category,
            createdAt: new Date()
        };
        quickNotes.push(newNote);
        saveNotes();
        render();
        noteForm.reset();
    }
});

loadNotes();
render();

searchInput.addEventListener('input', render);

function updateNoteCount() {
    const totalNotes = quickNotes.length;
    noteCount.textContent = totalNotes === 0
        ? 'No notes'
        : totalNotes === 1
            ? '1 note'
            : `${totalNotes} notes`;
}

    