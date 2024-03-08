import express from 'express';
// import Routes
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './utils/features.js';
import { errorHandler } from './middlewares/error.js';
connectDB();
const app = express();
app.use(express.json());
const PORT = 5000;
// using Routes
app.use("/api/v1/user", userRoutes, (req, res) => {
    return res.send({ "request from 2nd": req });
});
// custom error handling middleware
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Node-Express Server started on https://localhost:${PORT}`);
});
