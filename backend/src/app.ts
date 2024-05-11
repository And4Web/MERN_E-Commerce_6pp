import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import NodeCache from 'node-cache';
import { errorMiddleware } from './middlewares/error.js';
import { connectDB } from './utils/features.js';

// import Routes
import Stripe from 'stripe';
import ordersRoutes from './routes/ordersRoutes.js';
import paymentsRoutes from './routes/paymentsRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import userRoutes from './routes/userRoutes.js';

config({path: "./.env"})

const mongoURI = process.env.MONGO_URI_CLOUD;
// const mongoURI = process.env.MONGO_URI_LOCAL;

const stripeKey = process.env.STRIPE_KEY || "";

connectDB( mongoURI as string);

export const stripe = new Stripe(stripeKey, {});

export const nodeCache = new NodeCache();

const app = express();

app.use(express.json());

app.use(morgan("dev"))

app.use(cors());


app.get("/", (req, res)=>{

  return res.status(200).json({
    success: true, 
    message: "A-shop app",
  })
})
 
// const PORT = 3000;
const PORT = process.env.PORT || 5500;
// using Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/dashboard", statsRoutes);

// static files
app.use("/api/v1/uploads", express.static("uploads"));

// custom error handling middleware
app.use(errorMiddleware)

app.listen(PORT, ()=>{
  console.log(`Node-Express Server started on https://localhost:${PORT} - ${mongoURI}`)
})
