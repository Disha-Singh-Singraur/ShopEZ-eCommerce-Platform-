import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && user === null) {
      navigate("/login");
      return;
    }

    if (token) {
      fetchOrders();
    }
  }, [token, navigate, user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/order", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      // Sort orders descending by date
      const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center min-vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="fw-bold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Your Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border-0">
          <i className="bi bi-box-seam text-muted" style={{ fontSize: "4rem" }}></i>
          <h4 className="mt-3 text-dark">No orders found</h4>
          <p className="text-muted mb-4">You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill fw-medium shadow-sm">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => {
            const orderTotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);

            return (
              <div key={order._id} className="col-12">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      <span className="text-muted small d-block">Order Placed</span>
                      <span className="fw-bold">{new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-muted small d-block">Total</span>
                      <span className="fw-bold text-primary">₹{orderTotal.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted small d-block">Order #</span>
                      <span className="fw-bold text-muted">{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                    </div>
                    <div className="text-end">
                      <span className={`badge rounded-pill ${order.deliveryDate && new Date(order.deliveryDate) <= new Date() ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {order.deliveryDate && new Date(order.deliveryDate) <= new Date() ? "Delivered" : "Processing"}
                      </span>
                      {order.deliveryDate && new Date(order.deliveryDate) > new Date() && (
                        <div className="small text-muted mt-1 fw-medium">Est. Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</div>
                      )}
                      {order.deliveryDate && new Date(order.deliveryDate) <= new Date() && (
                        <div className="small text-muted mt-1 fw-medium">Delivered on {new Date(order.deliveryDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                      {order.items.map((item, index) => (
                        <li key={index} className="list-group-item p-4 d-flex align-items-center gap-4">
                          <img
                            src={item.productId?.mainImg || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"}
                            alt={item.productId?.title}
                            className="rounded-3 shadow-sm border"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1 text-dark text-truncate" style={{ maxWidth: "400px" }}>
                              {item.productId?.title || "Unknown Product"}
                            </h6>
                            <p className="text-muted small mb-1">
                              Qty: {item.quantity}
                              {item.productId && !['Electronics', 'Accessories'].includes(item.productId.category) && item.size && (
                                <span className="ms-1">| Size: {item.size}</span>
                              )}
                            </p>
                            <span className="fw-bold text-secondary">₹{item.price}</span>
                          </div>
                          <div>
                            <Link to={`/`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                              Buy Again
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-footer bg-light border-0 px-4 py-3 d-flex flex-column gap-1">
                    <small className="fw-medium text-muted">Shipping Address:</small>
                    <small className="text-dark">{order.address}, PIN: {order.pincode}</small>
                    <small className="text-dark mt-1">Payment: {order.paymentMethod}</small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
