import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { products, categories } from '../data/products';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      let result = [...products];

      if (selectedCategory !== 'All') {
        result = result.filter((p) => p.category === selectedCategory);
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
      }

      setFiltered(result);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat !== 'All') setSearchParams({ category: cat });
    else setSearchParams({});
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="container">
          <h1>All Products</h1>
          <p>Explore our full collection across all categories</p>
        </div>
      </div>

      <div className="container products-body">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <div className="filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="results-count">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </p>

        {loading ? (
          <Loader />
        ) : filtered.length > 0 ? (
          <div className="products-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No products found. Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
