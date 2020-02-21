const fs = require('fs');

const readJSON = (file)=> {
  return new Promise((resolve, reject)=> {
    fs.readFile(file, (err, data)=> {
      if(data){
        try {
          resolve(JSON.parse(data.toString()));
        }
        catch(ex){
          reject(ex);
        }
      }
      else {
        reject(err);
      }
    });
  });
};

const writeJSON = (file, data)=> {
  return new Promise((resolve, reject)=> {
    fs.writeFile(file, JSON.stringify(data, null, 2), (err)=> {
      if(err){
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
};

const destroy =(id)=>{
  return findAll()
  .then(items=>{
    return writeJSON(items.filter(item=>item.id !== id*1));
  });
};

const create = (note)=> {
  return findAll()
  .then (notes=> {
        const maxId = notes.reduce((acc, notes)=>{
          if(note.id>acc){
            acc=note.id;
          }
          return acc;
        },0)
        note.id=maxId +1;
        notes.push(note)
        return writeJSON(notes)
      })
      .then(()=>{
        return note;
      })
    }

module.exports = {
  readJSON,
  writeJSON,
  destroy,
  create
};
