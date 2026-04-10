import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import './Cart.css';

const Cart = () => {
  const { cartItems, getTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">Cart</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven&apos;t added anything yet.</p>
        <Link to="/products" className="btn-start-shopping">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-list">
          <div className="cart-list-header">
            <span>Product</span>
            <span>Qty</span>
            <span>Subtotal</span>
          </div>

          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{Number(getTotal()).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free">Free</span>
          </div>

          <hr className="summary-divider" />

          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{Number(getTotal()).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <Link to="/checkout" className="btn-checkout">
            Proceed to Checkout
          </Link>
          <Link to="/products" className="btn-continue">
            ← Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
