import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getTotal, clearCart } = useCart();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Enter full name';
    if (!form.phone.trim()) nextErrors.phone = 'Enter phone number';
    if (!form.address.trim()) nextErrors.address = 'Enter address';
    if (!form.city.trim()) nextErrors.city = 'Enter city';
    if (!form.state.trim()) nextErrors.state = 'Enter state';
    if (!form.pincode.trim()) nextErrors.pincode = 'Enter pincode';
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setConfirmed(true);
    clearCart();
  };

  if (confirmed) {
    return (
      <div className="checkout-page container">
        <div className="checkout-confirmation">
          <h1>Order Confirmed</h1>
          <p>Your order has been placed successfully.</p>
          <p>
            Delivery to: {form.address}, {form.city}, {form.state} - {form.pincode}
          </p>
          <Link to="/products" className="checkout-primary-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page container">
        <div className="checkout-confirmation">
          <h1>Cart is Empty</h1>
          <p>Add products to continue with checkout.</p>
          <Link to="/products" className="checkout-primary-btn">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <div className="checkout-header">
        <h1>Proceed to Checkout</h1>
        <p>Enter your address and confirm your order.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <div className="checkout-field">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} />
            {errors.fullName && <span className="checkout-error">{errors.fullName}</span>}
          </div>

          <div className="checkout-field">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            {errors.phone && <span className="checkout-error">{errors.phone}</span>}
          </div>

          <div className="checkout-field checkout-field-full">
            <label htmlFor="address">Address</label>
            <textarea id="address" name="address" rows="4" value={form.address} onChange={handleChange} />
            {errors.address && <span className="checkout-error">{errors.address}</span>}
          </div>

          <div className="checkout-grid">
            <div className="checkout-field">
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} />
              {errors.city && <span className="checkout-error">{errors.city}</span>}
            </div>

            <div className="checkout-field">
              <label htmlFor="state">State</label>
              <input id="state" name="state" value={form.state} onChange={handleChange} />
              {errors.state && <span className="checkout-error">{errors.state}</span>}
            </div>

            <div className="checkout-field">
              <label htmlFor="pincode">Pincode</label>
              <input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} />
              {errors.pincode && <span className="checkout-error">{errors.pincode}</span>}
            </div>
          </div>

          <button type="submit" className="checkout-primary-btn">
            Confirm Order
          </button>
        </form>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-summary-item">
              <span>{item.name} x {item.quantity}</span>
              <span>
                ₹{(item.price * item.quantity).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
          <div className="checkout-total">
            <span>Total</span>
            <span>
              ₹{Number(getTotal()).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
