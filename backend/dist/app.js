import express from 'express';
import NodeCache from 'node-cache';
import { config } from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
// import Routes
import userRoutes from './routes/userRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
config({ path: "./.env" });
// const mongoURI = process.env.MONGO_URI_CLOUD;
const mongoURI = process.env.MONGO_URI_LOCAL;
connectDB(mongoURI);
export const nodeCache = new NodeCache();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
const PORT = process.env.PORT || 5000;
// using Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/orders", ordersRoutes);
// static files
app.use("/api/v1/uploads", express.static("uploads"));
// custom error handling middleware
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Node-Express Server started on https://localhost:${PORT}`);
});
