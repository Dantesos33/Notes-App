const container = document.querySelector('.container');
let newX = 0, newY = 0, x = 0, y = 0;
const color = document.querySelector('#color');
let newValue = '';

// Listen for color change
color.addEventListener('change', (e) => {
    newValue = color.value;
});

// Note template
const noteTemplate = document.createElement('div');
noteTemplate.innerHTML = `
    <button class="close">x</button>
    <textarea type="text" placeholder="Make Notes..."></textarea>
`;
noteTemplate.classList.add('note');

// Get the add button
const addBtn = document.querySelector('.btn');

// Load notes from localStorage
window.onload = () => {
    loadNotesFromLocalStorage();
};

// Add event listener to the "Add" button
addBtn.addEventListener('click', () => {
    const newNote = noteTemplate.cloneNode(true); // Clone the template for a new note
    newNote.style.position = 'absolute'; // Ensure the new note is positionable
    newNote.style.borderTop = `20px solid ${newValue}`; // Apply the selected color

    // Optionally set an initial position for the note
    newNote.style.top = '100px';  // Starting top position
    newNote.style.left = '100px'; // Starting left position

    container.appendChild(newNote);

    // Add event listeners for the new note
    newNoteListener(newNote);
    // Disable spellcheck for all input and textarea elements on page load
    document.querySelectorAll('input, textarea').forEach(function(element) {
        element.setAttribute('spellcheck', 'false');
    });

    // Save all notes to localStorage after adding a new one
    saveNotesToLocalStorage();
});

// Function to add listeners to each new note
const newNoteListener = (note) => {
    let x = 0, y = 0, newX = 0, newY = 0;

    // Close button event listener for each note
    note.querySelector('.close').addEventListener('click', (e) => {
        e.target.parentNode.remove();
        // Save updated notes to localStorage after removing one
        saveNotesToLocalStorage();
    });

    // Draggable functionality (for both mouse and touch events)
    note.addEventListener('mousedown', (e) => {
        handleDragStart(e, note);
    });

    note.addEventListener('touchstart', (e) => {
        handleDragStart(e, note);
    });

    const handleDragStart = (e, note) => {
        // For mouse
        if (e.type === 'mousedown') {
            x = e.clientX;
            y = e.clientY;
        }
        // For touch
        if (e.type === 'touchstart') {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }

        note.style.cursor = 'move';

        // Add appropriate event listeners based on mouse or touch
        const moveEvent = e.type === 'mousedown' ? 'mousemove' : 'touchmove';
        const upEvent = e.type === 'mousedown' ? 'mouseup' : 'touchend';

        document.addEventListener(moveEvent, handleMouseMove);
        document.addEventListener(upEvent, handleMouseUp);
    };

    const handleMouseMove = (e) => {
        // For mouse
        if (e.type === 'mousemove') {
            newX = x - e.clientX;
            newY = y - e.clientY;
            x = e.clientX;
            y = e.clientY;
        }
        // For touch
        if (e.type === 'touchmove') {
            newX = x - e.touches[0].clientX;
            newY = y - e.touches[0].clientY;
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }

        note.style.top = (note.offsetTop - newY) + 'px';
        note.style.left = (note.offsetLeft - newX) + 'px';
    };

    const handleMouseUp = () => {
        // Remove both move and up event listeners after mouse/touch is released
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);

        // Reset cursor back to normal
        note.style.cursor = 'auto';

        // Save updated notes to localStorage after moving one
        saveNotesToLocalStorage();
    };
};

// Save all notes to localStorage
const saveNotesToLocalStorage = () => {
    const notes = [];
    const noteElements = document.querySelectorAll('.note');
    
    noteElements.forEach(note => {
        const noteData = {
            text: note.querySelector('textarea').value,
            top: note.style.top,
            left: note.style.left,
            borderTop: note.style.borderTop
        };
        notes.push(noteData);
    });

    // Save the notes array to localStorage as a JSON string
    localStorage.setItem('notes', JSON.stringify(notes));
};

// Load notes from localStorage
const loadNotesFromLocalStorage = () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        const notes = JSON.parse(savedNotes);

        notes.forEach(noteData => {
            const newNote = noteTemplate.cloneNode(true);
            newNote.style.position = 'absolute';
            newNote.style.top = noteData.top || '100px';
            newNote.style.left = noteData.left || '100px';
            newNote.style.borderTop = noteData.borderTop || '20px solid #000';

            // Set the saved note's text content
            newNote.querySelector('textarea').value = noteData.text;

            container.appendChild(newNote);
            newNoteListener(newNote); // Add listeners for the new note
        });
    }
};
