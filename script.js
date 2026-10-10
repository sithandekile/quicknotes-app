const noteForm=document.querySelector('#note-form');
const noteInput=document.querySelector('#note-input');
const noteList=document.querySelector('#notes-list');

const quickNotes=[
    {id:1, text:'Buy groceries',category:'Personal',createdAt:new Date()},
    {id:2, text:'Finish project report',category:'Work',createdAt:new Date()},
    {id:3, text:'Call mom',category:'Personal',createdAt:new Date()},
    {id:4, text:'Schedule dentist appointment',category:'Other',createdAt:new Date()},
    {id:5, text:'Plan weekend trip',category:'Other',createdAt:new Date()},
]
function render() {
    noteList.replaceChildren();
    quickNotes.forEach(note => {
        const noteItem=document.createElement('li');
        noteItem.textContent=`${note.text} [${note.category}] - ${note.createdAt.toLocaleString()}`;
        noteList.appendChild(noteItem);
    });
}
render();