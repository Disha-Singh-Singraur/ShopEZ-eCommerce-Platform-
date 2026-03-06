import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Selection states
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  const { token } = useContext(AuthContext);
  const { refreshCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
        setActiveImage(data.mainImg);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        } else {
          setSelectedSize(""); // No size needed
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0); // Scroll to top when page loads
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size first.");
      return;
    }

    try {
      setAddingToCart(true);
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: product._id,
          size: selectedSize || "", // Send empty if no sizes
          quantity
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      alert("Item added to cart successfully!");
      refreshCartCount();
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center min-vh-100 d-flex justify-content-center align-items-center">
        <div>
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}></div>
          <p className="mt-3 text-muted fw-medium fs-5">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5 text-center min-vh-100 py-5">
        <h2 className="text-muted">Product not found.</h2>
        <Link to="/" className="btn btn-primary mt-3 rounded-pill px-4">Back to Shopping</Link>
      </div>
    );
  }

  // Combine main image with carousel images for the gallery
  const galleryImages = [product.mainImg, ...(product.carousel || [])].filter(Boolean);

  return (
    <div className="container py-5 min-vh-100">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted hover-primary">Home</Link></li>
          <li className="breadcrumb-item"><Link to={`/?search=${product.category}`} className="text-decoration-none text-muted hover-primary">{product.category}</Link></li>
          <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">{product.title}</li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Gallery Section */}
        <div className="col-lg-6">
          <div className="d-flex flex-column gap-3 sticky-top" style={{ top: "100px", zIndex: 1 }}>
            {/* Main Image View */}
            <div className="bg-light rounded-4 overflow-hidden border shadow-sm position-relative fade-in">
              <img
                src={activeImage || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"}
                alt={product.title}
                className="w-100 object-fit-cover"
                style={{ height: "550px", objectPosition: "center" }}
              />
              {product.discount > 0 && (
                <span className="position-absolute top-0 start-0 m-3 badge bg-danger fs-6 rounded-pill px-3 py-2 shadow-sm">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="row g-2 mt-1">
                {galleryImages.map((img, idx) => (
                  <div className="col-3" key={idx}>
                    <div
                      className={`rounded-3 overflow-hidden cursor-pointer border-2 transition-transform ${activeImage === img ? 'border-primary border opacity-100 shadow-sm' : 'border-transparent opacity-75 hover-opacity-100'}`}
                      onClick={() => setActiveImage(img)}
                      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                    >
                      <img
                        src={img}
                        alt={`${product.title} view ${idx + 1}`}
                        className="w-100 object-fit-cover bg-light"
                        style={{ height: "100px" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="col-lg-6">
          <div className="d-flex flex-column h-100">
            <span className="text-uppercase tracking-wider text-primary fw-bold small mb-2">{product.category}</span>
            <h1 className="fw-bold display-5 mb-3 text-dark" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.5px" }}>{product.title}</h1>

            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="fs-2 fw-bold text-dark">₹{product.price}</span>
              {product.discount > 0 && (
                <span className="text-muted text-decoration-line-through fs-5">
                  ₹{Math.round(product.price / (1 - product.discount / 100))}
                </span>
              )}
            </div>

            <p className="fs-5 text-muted mb-5 lh-lg" style={{ maxWidth: "90%" }}>
              {product.description}
            </p>

            <hr className="my-4 opacity-10" />

            {/* Product Configuration Box */}
            <div className="bg-light bg-opacity-50 p-4 rounded-4 border mb-4">
              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-end mb-2">
                    <h6 className="fw-bold mb-0">Select Size</h6>
                    <span className="text-primary small fw-medium text-decoration-underline cursor-pointer">Size Guide</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`btn rounded-circle fw-bold transition-all ${selectedSize === size ? 'btn-dark shadow-sm scale-105' : 'btn-outline-secondary bg-white'}`}
                        style={{ width: "50px", height: "50px", transition: "all 0.2s ease" }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-2">
                <h6 className="fw-bold mb-3">Quantity</h6>
                <div className="input-group" style={{ width: "130px" }}>
                  <button
                    className="btn btn-outline-secondary shadow-none px-3 border-opacity-50"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="form-control text-center fw-bold border-secondary border-opacity-50 shadow-none bg-white"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary shadow-none px-3 border-opacity-50"
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-column gap-3 mt-auto pt-3">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn btn-primary btn-lg rounded-pill py-3 fw-bold shadow hover-scale d-flex justify-content-center align-items-center gap-2"
                style={{ fontSize: "1.1rem", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
              >
                {addingToCart ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <i className="bi bi-bag-plus fs-5"></i>
                    Add to Cart - ₹{(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>

              <div className="d-flex justify-content-center gap-4 mt-3 text-muted small fw-medium">
                <span className="d-flex align-items-center gap-1"><i className="bi bi-shield-check text-success fs-5"></i> Secure Checkout</span>
                <span className="d-flex align-items-center gap-1"><i className="bi bi-truck text-primary fs-5"></i> Free Shipping</span>
                <span className="d-flex align-items-center gap-1"><i className="bi bi-arrow-repeat text-dark fs-5"></i> 30-Day Returns</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
