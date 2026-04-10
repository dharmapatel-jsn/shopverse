import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import './ProductDetails.css';

const reviewMap = {
  1: [
    { name: 'Aarav', rating: 5, text: 'Soft fabric, clean fit, and exactly what I expected.' },
    { name: 'Meera', rating: 4, text: 'Good value for the price and comfortable for daily wear.' },
  ],
  2: [
    { name: 'Kabir', rating: 5, text: 'Noise cancellation is excellent and battery life is strong.' },
    { name: 'Nisha', rating: 5, text: 'Premium feel, great sound, and worth the price.' },
  ],
  3: [
    { name: 'Rohan', rating: 4, text: 'Spacious and practical for daily use.' },
    { name: 'Isha', rating: 5, text: 'Lightweight but sturdy, with useful compartments.' },
  ],
  4: [
    { name: 'Dev', rating: 4, text: 'Fits well and the denim quality is solid.' },
    { name: 'Anika', rating: 4, text: 'Nice everyday jeans with a modern cut.' },
  ],
  5: [
    { name: 'Sana', rating: 5, text: 'Easy pairing, clear sound, and comfortable fit.' },
    { name: 'Arjun', rating: 5, text: 'Top-tier audio with smooth connectivity.' },
  ],
  6: [
    { name: 'Priya', rating: 4, text: 'Very comfortable for long walks and workouts.' },
    { name: 'Rahul', rating: 4, text: 'Good cushioning and a secure fit.' },
  ],
  7: [
    { name: 'Tanya', rating: 5, text: 'Feature rich and great for tracking daily activity.' },
    { name: 'Imran', rating: 4, text: 'Responsive display and excellent battery performance.' },
  ],
  8: [
    { name: 'Vikram', rating: 4, text: 'Elegant look and handy for essentials.' },
    { name: 'Riya', rating: 5, text: 'Stylish finish and feels durable.' },
  ],
  9: [
    { name: 'Neel', rating: 5, text: 'Excellent tactile feedback and low latency.' },
    { name: 'Kavya', rating: 5, text: 'Great for both work and gaming.' },
  ],
  10: [
    { name: 'Maya', rating: 4, text: 'Warm, comfortable, and easy to layer.' },
    { name: 'Aditya', rating: 4, text: 'Good everyday sweatshirt with a clean look.' },
  ],
  11: [
    { name: 'Simran', rating: 4, text: 'Comfortable fit and polished finish.' },
    { name: 'Hitesh', rating: 4, text: 'Nice formal style for regular use.' },
  ],
  12: [
    { name: 'Pooja', rating: 4, text: 'Reliable pair with good grip and comfort.' },
    { name: 'Sahil', rating: 4, text: 'Looks good and works well for long wear.' },
  ],
};

const defaultReviews = [
  { name: 'User 1', rating: 5, text: 'A strong choice with good overall value.' },
  { name: 'User 2', rating: 4, text: 'Performs well and matches the description.' },
];

const starString = (rating) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

const getDescription = (product) => {
  const descriptions = {
    Clothing: 'Designed for everyday wear with balanced comfort, style, and durability.',
    Electronics: 'Packed with modern features and built for dependable everyday performance.',
    Bags: 'Practical storage with a clean finish that works for daily carry and travel.',
    Footwear: 'Comfort-focused design with support and style for regular use.',
  };

  return descriptions[product.category] || 'A reliable product selected for quality and everyday use.';
};

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((item) => item.id === Number(id)) || null;

  const initialReviews = product ? reviewMap[product.id] || defaultReviews : defaultReviews;
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewCount, setReviewCount] = useState(product?.reviewsCount || initialReviews.length);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: '5', text: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    if (!product) {
      return;
    }

    const nextReviews = reviewMap[product.id] || defaultReviews;
    setReviews(nextReviews);
    setReviewCount(product.reviewsCount || nextReviews.length);
    setReviewForm({ name: '', rating: '5', text: '' });
    setReviewError('');
    setReviewSuccess('');
  }, [product?.id]);

  if (!product) {
    return (
      <div className="product-details-page product-details-empty container">
        <h1>Product not found</h1>
        <p>The product you are looking for does not exist.</p>
        <Link to="/products" className="btn-back-products">
          Back to Products
        </Link>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length).toFixed(1)
      : (product.rating || 4.5).toFixed(1);

  const ratingStars = starString(Number(averageRating));

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
    if (reviewError) setReviewError('');
    if (reviewSuccess) setReviewSuccess('');
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    const trimmedName = reviewForm.name.trim();
    const trimmedText = reviewForm.text.trim();
    const numericRating = Number(reviewForm.rating);

    if (!trimmedName || !trimmedText) {
      setReviewError('Please enter your name and review text.');
      return;
    }

    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      setReviewError('Please choose a rating between 1 and 5.');
      return;
    }

    const duplicateReview = reviews.some(
      (review) => review.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicateReview) {
      setReviewError('Duplicate review detected. You have already reviewed this product.');
      return;
    }

    setReviews((prev) => [
      ...prev,
      {
        name: trimmedName,
        rating: numericRating,
        text: trimmedText,
      },
    ]);
    setReviewCount((prev) => prev + 1);
    setReviewForm({ name: '', rating: '5', text: '' });
    setReviewError('');
    setReviewSuccess('Review added successfully.');
  };

  return (
    <div className="product-details-page">
      <section className="product-details-hero">
        <div className="container product-details-layout">
          <div className="product-image-panel">
            <img src={product.image} alt={product.name} className="product-details-image" />
          </div>

          <div className="product-info-panel">
            <span className="product-details-category">{product.category}</span>
            <h1>{product.name}</h1>

            <div className="product-rating-row">
              <span className="product-stars">{ratingStars}</span>
              <span className="product-rating-score">{averageRating} / 5</span>
              <span className="product-rating-count">({reviewCount} reviews)</span>
            </div>

            <p className="product-description">{getDescription(product)}</p>

            <div className="product-meta-grid">
              <div>
                <span>Price</span>
                <strong>
                  ₹{product.price.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
              <div>
                <span>Stock</span>
                <strong>{product.stock} units</strong>
              </div>
            </div>

            <div className="product-details-actions">
              <button className="btn-add-cart btn-detail-cart" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
              <Link to="/products" className="btn-back-products">
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="product-details-content container">
        <div className="product-details-section">
          <h2>Product Info</h2>
          <div className="product-info-cards">
            <div className="info-card">
              <h3>Highlights</h3>
              <ul>
                <li>Clean product information display</li>
                <li>Category and stock visibility</li>
                <li>Fast add-to-cart action</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>Details</h3>
              <ul>
                <li>Category: {product.category}</li>
                <li>Availability: {product.stock > 0 ? 'In stock' : 'Out of stock'}</li>
                <li>Rating: {averageRating} out of 5</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="product-details-section">
          <div className="section-heading-row">
            <div>
              <h2>Ratings & Reviews</h2>
              <p>Add a review to share your product experience.</p>
            </div>
          </div>

          <div className="reviews-summary">
            <div>
              <strong>{averageRating}</strong>
              <span>Average rating</span>
            </div>
            <div>
              <strong>{reviewCount}</strong>
              <span>Total reviews</span>
            </div>
          </div>

          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="review-form-grid">
              <div className="review-form-group">
                <label htmlFor="reviewName">Your Name</label>
                <input
                  id="reviewName"
                  name="name"
                  type="text"
                  value={reviewForm.name}
                  onChange={handleReviewChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="review-form-group">
                <label htmlFor="reviewRating">Rating</label>
                <select
                  id="reviewRating"
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
            </div>

            <div className="review-form-group">
              <label htmlFor="reviewText">Review</label>
              <textarea
                id="reviewText"
                name="text"
                rows="4"
                value={reviewForm.text}
                onChange={handleReviewChange}
                placeholder="Write your review here"
              />
            </div>

            {reviewError && <p className="review-feedback review-feedback-error">{reviewError}</p>}
            {reviewSuccess && (
              <p className="review-feedback review-feedback-success">{reviewSuccess}</p>
            )}

            <button type="submit" className="btn-submit-review">
              Add Review
            </button>
          </form>

          <div className="review-list">
            {reviews.map((review) => (
              <article key={`${product.id}-${review.name}-${review.text}`} className="review-card">
                <div className="review-card-top">
                  <h3>{review.name}</h3>
                  <span>{starString(review.rating)}</span>
                </div>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
