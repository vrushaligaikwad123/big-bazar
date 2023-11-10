import express from "express";
import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";
import Product from "./models/Product.js";

const app = express();

app.use(express.json());

const connectMongoDB = async() =>{
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    if(connection){
        console.log('Connected to MongoDB');
    }
}
connectMongoDB();


app.post('/product',async (req,res) => {
    const {name, price, description} = req.body;

    const product = new Product({
        name : name,
        price : price,
        description: description
    });

const savedProduct = await product.save();

    res.json({
        success: true,
        data:savedProduct,
        message: "Product added successfully"

    })
})

app.get('/products',async (req,res)=>{
    const products = await Product.find();

    res.json({
        success : true,
        data : products,
        message : "Product retrieved sucessfully"
    })
})

app.get('/product/:id', async(req,res) => {
    const {id} = req.params;
    const product = await Product.findOne({_id: id});

    res.json({
        success : true,
        data : product,
        message : "Product retrieved sucessfully"
    })
})

app.delete("/product/:id", async(req, res) =>{
    const {id} = req.params;
    await Product.deleteOne({_id: id});

    res.json({
        success : true,
        message : "Product deleted sucessfully"
    })

});

app.put("/product/:id", async (req, res) => {
    const{id} = req.params;
    const {name, price, description} = req.body;

    await Product.updateOne({_id :id}, {$set: {
        name : name, 
        price: price,
        description: description
    }});

    const updatedProduct = await Product.findOne({_id :id});

    res.json({
        success : true,
        data : updatedProduct,
        message : "Product updated sucessfully"
    })
});

app.post("/test", async(req,res) => {
    console.log(req.query);

    res.json({
        success : true ,
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});