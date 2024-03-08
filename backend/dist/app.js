import express from 'express';
// Routes
import userRoutes from './routes/userRoutes.js';
const app = express();
const PORT = 5000;
app.use("/user", userRoutes);
app.listen(PORT, () => {
    console.log(`Node-Express Server started on https://localhost:${PORT}`);
});
