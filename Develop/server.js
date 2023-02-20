const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');



const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.static('public'));


app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


// return note obj route
app.get('/api/notes', function(req, res) {
fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', function(err, data) {
    if (err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
});
});

// new note (save) route
app.post('/api/notes', function(req, res) {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', function(err, data) {
      if (err) throw err;
      const notes = JSON.parse(data);
      const newNote = req.body;
      newNote.id = uuidv4(); // Assign a unique ID to the new note using the uuid package
      notes.push(newNote);
      fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), function(err) {
        if (err) throw err;
        res.json(newNote);
      });
    });
  });

  // delete route
app.delete('/api/notes/:id', function(req, res) {
const noteId = req.params.id;
fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', function(err, data) {
    if (err) throw err;
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter(function(note) {
    return note.id !== noteId; // Filter out the note with the specified ID
    });
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(updatedNotes), function(err) {
    if (err) throw err;
    res.json({ success: true });
    });
});
});
  

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
