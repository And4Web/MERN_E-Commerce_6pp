import mongoose from "mongoose";
export const connectDB = () => {
    mongoose
        .connect("mongodb://localhost:27017", { dbName: "e-commerce-6pp" })
        .then((c) => {
        console.log(`MongoDB connection to HOST: ${c.connection.host} successful.`);
    })
        .catch((e) => console.log(`MongoDB connection failed >>> ${e}`));
};
