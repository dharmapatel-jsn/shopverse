import { useCart } from '../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-img" />

      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <span className="cart-item-unit-price">
          ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
        </span>
      </div>

      <div className="cart-item-qty">
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>

      <span className="cart-item-subtotal">
        ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>

      <button
        className="cart-item-remove"
        onClick={() => removeFromCart(item.id)}
        aria-label="Remove item"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
