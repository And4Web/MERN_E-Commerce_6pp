import express from 'express';

// import Routes
import userRoutes from './routes/userRoutes.js';

const app = express();

const PORT = 5000;

// using Routes
app.use("/api/v1/user", userRoutes);

app.listen(PORT, ()=>{
  console.log(`Node-Express Server started on https://localhost:${PORT}`)
})