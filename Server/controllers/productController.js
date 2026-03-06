const Product = require("../models/product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, description, price, discount, category, gender, mainImg } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newProduct = new Product({
      title,
      description,
      price: Number(price),
      discount: discount ? Number(discount) : 0,
      category,
      gender: gender || "Unisex",
      mainImg: mainImg || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
      sizes: (category === "Clothing" || category === "Shoes") ? ["S", "M", "L", "XL"] : [],
      carousel: []
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, discount, category, gender, mainImg } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price: Number(price),
        discount: discount ? Number(discount) : 0,
        category,
        gender,
        mainImg,
        sizes: (category === "Clothing" || category === "Shoes") ? ["S", "M", "L", "XL"] : [],
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getProducts, getSingleProduct, createProduct, deleteProduct, updateProduct };
