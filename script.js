const noteForm=document.querySelector('#note-form');
const noteList=document.querySelector('#notes-list');
const noteInput=document.querySelector('#note-input');
const noteCategory=document.querySelector('#note-category');
const errorMessage=document.querySelector('#error-message');

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
    quickNotes.forEach(note => {
        const noteItem=document.createElement('li');
        noteItem.textContent=`${note.text} [${note.category}] - ${note.createdAt.toLocaleString()}`;
        const delBtn=document.createElement('button');
        delBtn.textContent='Delete';
        delBtn.classList.add('delete-btn');
        delBtn.addEventListener('click', () => {
            quickNotes.splice(quickNotes.indexOf(note), 1);
            saveNotes();
            render();
        });
        noteItem.appendChild(delBtn);
        noteList.appendChild(noteItem);
    });
}

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text=noteInput.value.trim();
    const category=noteCategory.value;
    if(!text || !category || text.length>200) {
        errorMessage.textContent='Enter a note of 1-200 characters and choose a category.';
    }
    else{
        const newNote={
            id:quickNotes.length + 1,
            text,
            category,
            createdAt:new Date()
        };
        quickNotes.push(newNote);
        saveNotes();
        render();
        noteForm.reset();
    }
})

loadNotes();
render();