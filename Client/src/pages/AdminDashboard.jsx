import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    category: "Electronics",
    gender: "Unisex",
    mainImg: ""
  });
  const [formMessage, setFormMessage] = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    // Redirect if not admin
    if (!user || user.userType !== "admin") {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/stats", {
          credentials: "include"
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchStats();
    fetchProducts();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMessage({ text: "", type: "" });

    try {
      const url = editingProductId
        ? `http://localhost:5000/api/products/${editingProductId}`
        : "http://localhost:5000/api/products";

      const method = editingProductId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setFormMessage({
          text: editingProductId ? "Product updated successfully!" : "Product added successfully!",
          type: "success"
        });

        if (!editingProductId) {
          setStats(prev => ({ ...prev, products: prev.products + 1 }));
        }

        // Reset form
        resetForm();

        // Refetch products to update list
        fetch("http://localhost:5000/api/products")
          .then(res => res.json())
          .then(data => setProducts(data))
          .catch(console.error);

      } else {
        setFormMessage({ text: data.message || "Failed to save product.", type: "danger" });
      }
    } catch (error) {
      setFormMessage({ text: "An error occurred while saving the product.", type: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setFormData({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      discount: product.discount || "",
      category: product.category || "Electronics",
      gender: product.gender || "Unisex",
      mainImg: product.mainImg || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingProductId(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      discount: "",
      category: "Electronics",
      gender: "Unisex",
      mainImg: ""
    });
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== productId));
        setStats(prev => ({ ...prev, products: prev.products - 1 }));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting product.");
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold m-0"><span className="text-primary">Admin</span> Dashboard</h2>
        <span className="badge bg-dark rounded-pill px-3 py-2 fs-6">Logged in as {user.name}</span>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 bg-primary text-white text-center h-100 p-4">
            <h5 className="fw-medium opacity-75 mb-2">Total Users</h5>
            <h1 className="fw-bold display-4 m-0">{stats.users}</h1>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 bg-success text-white text-center h-100 p-4">
            <h5 className="fw-medium opacity-75 mb-2">Total Products</h5>
            <h1 className="fw-bold display-4 m-0">{stats.products}</h1>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 bg-warning text-dark text-center h-100 p-4">
            <h5 className="fw-medium opacity-75 mb-2">Total Orders</h5>
            <h1 className="fw-bold display-4 m-0">{stats.orders}</h1>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Section */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold m-0">{editingProductId ? "Edit Product" : "Add New Product"}</h3>
            {editingProductId && (
              <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>

          {formMessage.text && (
            <div className={`alert alert-${formMessage.type} rounded-3`} role="alert">
              {formMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmitProduct}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-medium text-secondary">Product Title</label>
                <input type="text" className="form-control bg-light border-0 rounded-3 px-3 py-2" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium text-secondary">Price (₹)</label>
                <input type="number" min="0" step="0.01" className="form-control bg-light border-0 rounded-3 px-3 py-2" name="price" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium text-secondary">Discount (%)</label>
                <input type="number" min="0" max="100" className="form-control bg-light border-0 rounded-3 px-3 py-2" name="discount" value={formData.discount} onChange={handleInputChange} />
              </div>

              <div className="col-12">
                <label className="form-label fw-medium text-secondary">Description</label>
                <textarea className="form-control bg-light border-0 rounded-3 px-3 py-2" name="description" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium text-secondary">Category</label>
                <select className="form-select bg-light border-0 rounded-3 px-3 py-2" name="category" value={formData.category} onChange={handleInputChange} required>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium text-secondary">Gender</label>
                <select className="form-select bg-light border-0 rounded-3 px-3 py-2" name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium text-secondary">Main Image URL</label>
                <input type="url" className="form-control bg-light border-0 rounded-3 px-3 py-2" name="mainImg" value={formData.mainImg} onChange={handleInputChange} placeholder="https://..." />
              </div>

              <div className="col-12 mt-4 d-flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg rounded-pill px-5 fw-medium shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : (editingProductId ? "Update Product" : "Add Product")}
                </button>
                {editingProductId && (
                  <button
                    type="button"
                    className="btn btn-light btn-lg rounded-pill px-5 fw-medium shadow-sm"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Manage Products Section */}
      <div className="card shadow-sm border-0 rounded-4 mt-5">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold m-0">Manage Products</h3>
            <span className="badge bg-primary rounded-pill px-3 py-2 fs-6">{products.length} Items</span>
          </div>

          <div className="table-responsive">
            <table className="table gap-3 table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-secondary fw-medium py-3 rounded-start">Product</th>
                  <th scope="col" className="text-secondary fw-medium py-3">Category</th>
                  <th scope="col" className="text-secondary fw-medium py-3">Price</th>
                  <th scope="col" className="text-secondary fw-medium py-3 rounded-end text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">No products available.</td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3 py-2">
                          <img
                            src={product.mainImg || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150"}
                            alt={product.title}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                            className="bg-light border"
                          />
                          <div>
                            <h6 className="mb-0 fw-bold">{product.title}</h6>
                            <small className="text-muted d-inline-block text-truncate" style={{ maxWidth: "200px" }}>
                              {product.description}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1">{product.category}</span>
                      </td>
                      <td className="fw-medium">₹{product.price}</td>
                      <td className="text-end text-nowrap">
                        <button
                          className="btn btn-sm btn-outline-primary shadow-sm rounded-3 px-3 fw-medium me-2"
                          onClick={() => handleEditProduct(product)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger shadow-sm rounded-3 px-3 fw-medium"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <i className="bi bi-trash3 me-1"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
