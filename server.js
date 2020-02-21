const express = require('express');
const app = express();
const path = require('path');
const notes = require('./notes')
const db = require('./db')
app.use(express.static('assets'));

app.use((req, res, next)=> {
    console.log(`you called ${req.url} as a ${req.method}`);
    next();
  });

app.use(express.json())

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/notes', async(req, res, next) => {
  try{
    res.send(await notes)
}
catch (ex){
  next(ex)
}
});

  app.post('/api/notes', async(req,res,next)=>{
    try{
      res.send(await db.create(req.body));
    }
    catch(ex){
      next(ex);
    }
  });



// app.delete('/api/notes', async (req, res, next) => {
//   try {
//     await db.destroy(req.params.id);
//     res.sendStatus(204);
//   }
//   catch(ex){
//     next(ex);
//   }
// });

app.delete('/api/notes/:id', (req, res, next) => {
  db.readJSON('./notes.json')
    .then(notes => {
      const updated = notes.filter(note => note.id !== req.params.id);
      return db.writeJSON('./notes.json', updated);
    })
    .then(() => res.sendStatus(204))
    .catch(ex => next(ex));
});

// app.post('/api/notes', (req, res, next)=>{
//   let note;
//   db.readJSON('./notes.JSON')
//   .then(notes=>{
//       note={...req.body};
//       // note.id= uuid();
//       return db.writeJSON('./notes.JSON', [notes, ...notes]);
//     })
//     .then(()=>res.status(201).send(note))
//     .catch(ex=>next(ex));
//   });


// app.put('/api/notes', (req, res, next) => {res.send(notes)});

app.use((err, req, res, next)=>{
  console.log(err);
  res.status(500).send({message:err.message});
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));

