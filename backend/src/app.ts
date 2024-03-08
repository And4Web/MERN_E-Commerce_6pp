import express from 'express';

const app = express();

const PORT = 5000;



app.listen(PORT, ()=>{
  console.log(`Node-Express Server started on https://localhost:${PORT}`)
})