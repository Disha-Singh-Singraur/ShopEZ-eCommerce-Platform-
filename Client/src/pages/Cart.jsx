import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const { refreshCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (token) {
      fetchCartItems();
    }
  }, [token, navigate]);

  const fetchCartItems = async () => {
    try {
      console.log("Fetching cart items with token:", token);
      const response = await fetch(`http://localhost:5000/api/cart`, {
        method: "GET",
        credentials: "include"
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();
      console.log("Cart data received:", data);
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to remove item");

      // Update UI
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
      refreshCartCount();
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      // Update UI
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="fw-bold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border-0">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: "4rem" }}></i>
          <h4 className="mt-3 text-dark">Your cart is empty</h4>
          <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill fw-medium shadow-sm">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {cartItems.map((item) => (
                    <li key={item._id} className="list-group-item p-4 d-flex align-items-center gap-4 border-bottom">

                      {/* Product Image */}
                      <img
                        src={item.productId?.mainImg || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"}
                        alt={item.productId?.title}
                        className="rounded-3 shadow-sm"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />

                      {/* Product Details */}
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1 text-dark text-truncate" style={{ maxWidth: "300px" }}>
                          {item.productId?.title || "Unknown Product"}
                        </h5>
                        <p className="text-muted small mb-2 text-uppercase letter-spacing-1">
                          {item.productId?.category || "Category"}
                          {item.productId && !['Electronics', 'Accessories'].includes(item.productId.category) && item.size && (
                            <span className="ms-1">| Size: {item.size}</span>
                          )}
                        </p>
                        <h5 className="text-primary fw-bold mb-0">
                          ₹{item.productId?.price || 0}
                        </h5>
                      </div>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-1 border">
                        <button
                          className="btn btn-sm btn-link text-dark text-decoration-none px-1"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        >
                          <span className="fw-bold fs-5">-</span>
                        </button>
                        <span className="fw-medium px-2" style={{ minWidth: "20px", textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-sm btn-link text-dark text-decoration-none px-1"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          <span className="fw-bold fs-5">+</span>
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        className="btn btn-outline-danger btn-sm rounded-circle shadow-sm ms-2"
                        style={{ width: "38px", height: "38px" }}
                        onClick={() => removeItem(item._id)}
                        title="Remove Item"
                      >
                        X
                      </button>

                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: "100px" }}>
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Order Summary</h4>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Items ({cartItems.length}):</span>
                  <span className="fw-medium">₹{calculateTotal()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-success">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold fs-5">Total:</span>
                  <span className="fw-bold text-primary fs-4">₹{calculateTotal()}</span>
                </div>

                <Link
                  to="/checkout"
                  className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm fs-5"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
