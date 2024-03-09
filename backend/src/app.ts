import express from 'express';

// import Routes
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';

connectDB();

const app = express();

app.use(express.json());

const PORT = 5000;

// using Routes
app.use("/api/v1/user", userRoutes);

// custom error handling middleware

app.use(errorMiddleware)

app.listen(PORT, ()=>{
  console.log(`Node-Express Server started on https://localhost:${PORT}`)
})