import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-card-img"
      />

      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product.id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <div className="product-footer">
          <span className="product-price">
            ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <button
            className="btn-add-cart"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
