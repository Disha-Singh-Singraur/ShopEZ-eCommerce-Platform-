import ProductCard from "../components/ProductCard";
import { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Dashboard() {

  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { token } = useContext(AuthContext);
  const { refreshCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    if (!token) {
      alert("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      // Small lookup to check category via ID to submit correct size fallback if needed.
      // (This could be improved by passing product object instead of ID, but updating ID usage here)
      const product = products.find(p => p._id === productId);
      const defaultSize = (product && (product.category === "Clothing" || product.category === "Shoes")) ? "M" : "";

      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId, size: defaultSize, quantity: 1 })
      });
      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }
      const data = await response.json();
      alert("Item added to cart successfully!");
      refreshCartCount();
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  const [activeCategory, setActiveCategory] = useState("All");
  const [activePriceRange, setActivePriceRange] = useState("All Prices");

  const categories = ["All", "Electronics", "Clothing", "Shoes", "Accessories"];
  const priceRanges = [
    { label: "All Prices", min: 0, max: Infinity },
    { label: "Under ₹50", min: 0, max: 49.99 },
    { label: "₹50 - ₹100", min: 50, max: 100 },
    { label: "Over ₹100", min: 100.01, max: Infinity }
  ];

  const filteredProducts = products.filter(p => {
    // Category match
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;

    // Search match
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Price match
    const currentRange = priceRanges.find(r => r.label === activePriceRange);
    const matchesPrice = currentRange
      ? (p.price >= currentRange.min && p.price <= currentRange.max)
      : true;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="container-fluid px-4 mb-5">
      {/* Hero Section */}
      <div className="hero-section">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600"
          alt="Banner"
          className="hero-img"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Discover Your Aesthetic</h1>
            <p className="fs-5 opacity-75 mb-4">Explore our premium collection of electronics, fashion, and everyday essentials curated just for you.</p>
            <button
              className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow"
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container px-0 mt-5 pt-3" id="products-section">
        {searchQuery && (
          <div className="mb-4">
            <h4 className="text-muted">Search results for <span className="text-dark fw-bold">"{searchQuery}"</span></h4>
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-5">
          <h2 className="fw-bold mb-0">Trending Collection</h2>

          <div className="d-flex gap-3 align-items-center flex-wrap">
            {/* Category Dropdown */}
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle rounded-pill px-4 shadow-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Category: {activeCategory}
              </button>
              <ul className="dropdown-menu shadow border-0 mt-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      className={`dropdown-item ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => {
                        setActiveCategory(cat);
                        if (cat === "All") {
                          setSearchParams({});
                        }
                      }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range Dropdown */}
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle rounded-pill px-4 shadow-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Price: {activePriceRange}
              </button>
              <ul className="dropdown-menu shadow border-0 mt-2">
                {priceRanges.map((range) => (
                  <li key={range.label}>
                    <button
                      className={`dropdown-item ${activePriceRange === range.label ? 'active' : ''}`}
                      onClick={() => setActivePriceRange(range.label)}
                    >
                      {range.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">No products found matching your criteria.</h4>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
