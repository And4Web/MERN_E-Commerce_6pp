import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product's name."],
  },
  photo: {
    type: String,
    required: [true, "Please provide photo."]
  },
  price: {
    type: Number,
    required: [true, "Please enter price of the product."]
  },
  stock: {
    type: Number,
    required: [true, "Please enter the stock."]
  },
  category: {
    type: String,
    required: [true, "Please enter a category of the product."],
    trim: true
  }
},{
  timestamps: true
});


const Product = mongoose.model("Product", productSchema);

export default Product;