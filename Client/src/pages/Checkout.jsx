import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [placingOrder, setPlacingOrder] = useState(false);

  const { token, user } = useContext(AuthContext);
  const { refreshCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && user === null) {
      navigate("/login");
      return;
    }

    if (token) {
      fetchCartItems();
    }
  }, [token, navigate, user]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();
      setCartItems(data);
      if (data.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.trim() || !pincode.trim()) {
      alert("Please fill in your complete shipping address and pincode.");
      return;
    }

    try {
      setPlacingOrder(true);
      const response = await fetch("http://localhost:5000/api/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address,
          pincode,
          paymentMethod
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to place order");
      }

      const data = await response.json();
      alert("🎉 Order placed successfully!");
      refreshCartCount(); // Clear the badge
      navigate("/"); // Or navigate to an /orders page if it exists
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error.message || "An error occurred while placing the order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center min-vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Preparing your checkout...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="fw-bold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Secure Checkout</h2>

      <div className="row g-5">
        {/* Checkout Form */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h4 className="fw-bold mb-4">Shipping Information</h4>
            <form onSubmit={handlePlaceOrder}>

              <div className="mb-3">
                <label className="form-label text-muted fw-medium">Full Delivery Address</label>
                <textarea
                  className="form-control bg-light border-0"
                  rows="3"
                  placeholder="123 Main Street, Apartment 4B..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-medium">Pincode / Postal Code</label>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="e.g. 10001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>

              <hr className="my-4" />

              <h4 className="fw-bold mb-4">Payment Method</h4>

              <div className="mb-4">
                <div className="form-check border rounded-3 p-3 mb-2 bg-light d-flex align-items-center gap-2">
                  <input
                    className="form-check-input ms-0 mt-0"
                    type="radio"
                    name="paymentMethod"
                    id="creditCard"
                    value="Credit Card"
                    checked={paymentMethod === "Credit Card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label w-100 fw-medium ms-2" htmlFor="creditCard">
                    Credit / Debit Card
                  </label>
                  <i className="bi bi-credit-card fs-4 text-primary"></i>
                </div>

                <div className="form-check border rounded-3 p-3 mb-2 bg-light d-flex align-items-center gap-2">
                  <input
                    className="form-check-input ms-0 mt-0"
                    type="radio"
                    name="paymentMethod"
                    id="upi"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label w-100 fw-medium ms-2" htmlFor="upi">
                    UPI / Mobile Wallet
                  </label>
                  <i className="bi bi-phone fs-4 text-success"></i>
                </div>

                <div className="form-check border rounded-3 p-3 bg-light d-flex align-items-center gap-2">
                  <input
                    className="form-check-input ms-0 mt-0"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label w-100 fw-medium ms-2" htmlFor="cod">
                    Cash on Delivery
                  </label>
                  <i className="bi bi-cash-stack fs-4 text-secondary"></i>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm fs-5 mt-3"
                disabled={placingOrder}
              >
                {placingOrder ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${calculateTotal()} & Place Order`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: "100px" }}>
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">Review Order</h4>

              <div className="mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                <ul className="list-group list-group-flush">
                  {cartItems.map((item) => (
                    <li key={item._id} className="list-group-item px-0 py-3 bg-transparent border-bottom d-flex align-items-center gap-3">
                      <img
                        src={item.productId?.mainImg || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"}
                        alt={item.productId?.title}
                        className="rounded-3 shadow-sm"
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1 text-dark text-truncate" style={{ maxWidth: "200px" }}>
                          {item.productId?.title || "Item"}
                        </h6>
                        <div className="text-muted small">
                          Qty: {item.quantity}
                          {item.productId && !['Electronics', 'Accessories'].includes(item.productId.category) && item.size && (
                            <span className="ms-1">| Size: {item.size}</span>
                          )}
                        </div>
                      </div>
                      <div className="fw-bold text-primary">₹{(item.productId?.price || 0) * item.quantity}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-medium">₹{calculateTotal()}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-success">
                <span>Shipping Discount:</span>
                <span>-₹50</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Shipping Fee:</span>
                <span>₹50</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-5">Total to Pay:</span>
                <span className="fw-bold text-primary fs-3">₹{calculateTotal()}</span>
              </div>

              <div className="mt-4 bg-light rounded-3 p-3 border border-success border-opacity-25">
                <div className="d-flex align-items-center gap-2 text-success mb-1">
                  <i className="bi bi-truck fs-5"></i>
                  <span className="fw-bold">Estimated Delivery</span>
                </div>
                <div className="text-dark fw-medium" style={{ marginLeft: "1.75rem" }}>
                  {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-muted small mt-1" style={{ marginLeft: "1.75rem" }}>
                  Usually arrives within 5 business days.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
