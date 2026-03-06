import { Link } from "react-router-dom";

function ProductCard({ product, addToCart }) {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
      <div className="card h-100 product-card border-0">

        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <div className="img-wrapper">
            {product.discount > 0 && (
              <span className="discount-badge">-{product.discount}% OFF</span>
            )}
            <img
              src={product.mainImg}
              className="card-img-top"
              alt={product.title}
            />
          </div>
        </Link>

        <div className="card-body d-flex flex-column p-4">
          <p className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
            {product.category}
          </p>
          <Link to={`/product/${product._id}`} className="text-decoration-none text-dark hover-primary">
            <h5 className="card-title fw-bold mb-2 text-truncate" title={product.title}>
              {product.title}
            </h5>
          </Link>

          <p className="card-text text-muted mb-4" style={{ fontSize: "0.9rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.description}
          </p>

          <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
            <h5 className="text-dark fw-bold mb-0 fs-4">
              ₹{product.price}
            </h5>

            <button
              className="btn btn-dark add-btn shadow-sm"
              onClick={() => addToCart(product._id)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;