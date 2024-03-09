import express from 'express';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
// import Routes
import userRoutes from './routes/userRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
connectDB();
const app = express();
app.use(express.json());
const PORT = 5000;
// using Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productsRoutes);
// static files
app.use("/api/v1/uploads", express.static("uploads"));
// custom error handling middleware
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Node-Express Server started on https://localhost:${PORT}`);
});
