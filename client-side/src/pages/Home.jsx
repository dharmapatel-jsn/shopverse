import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { products } from '../data/products';
import './Home.css';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeatured(products.slice(0, 4));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner container">
          <div className="hero-content">
            <span className="hero-badge">New Arrivals 2026</span>
            <h1>
              Discover Your <span>Style</span>
            </h1>
            <p>
              Shop the latest trends in fashion, electronics, bags and more.
              Quality products at unbeatable prices.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn-hero-primary">
                Shop Now
              </Link>
              <Link to="/products" className="btn-hero-outline">
                Browse All
              </Link>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>10+</strong>
              <span>Categories</span>
            </div>
            <div className="hero-stat">
              <strong>Free</strong>
              <span>Shipping</span>
            </div>
            <div className="hero-stat">
              <strong>24/7</strong>
              <span>Support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="category-bar">
        <div className="container">
          {['Clothing', 'Electronics', 'Bags', 'Footwear'].map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="category-chip"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="featured container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="see-all">
            See All →
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="products-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="promo-banner">
        <div className="promo-inner container">
          <div>
            <h2>Summer Sale is Live</h2>
            <p>Get up to 50% off on selected items. Limited time only.</p>
          </div>
          <Link to="/products" className="btn-promo">
            Shop the Sale
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
