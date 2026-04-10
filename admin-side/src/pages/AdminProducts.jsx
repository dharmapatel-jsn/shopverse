import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { products as initialProducts } from '../data/mockData';
import './AdminProducts.css';

const AdminProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    if (location.state?.newProduct) {
      setProducts((prev) => [...prev, location.state.newProduct]);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (product) => {
    const name = window.prompt('Product Name', product.name);
    if (name === null) return;

    const priceInput = window.prompt('Price', product.price);
    if (priceInput === null) return;

    const category = window.prompt('Category', product.category);
    if (category === null) return;

    const stockInput = window.prompt('Stock', product.stock);
    if (stockInput === null) return;

    const image = window.prompt('Image URL', product.image);
    if (image === null) return;

    const nextPrice = Number(priceInput);
    const nextStock = Number(stockInput);

    if (!name.trim() || !category.trim() || !image.trim()) {
      window.alert('Name, category, and image URL are required.');
      return;
    }

    if (!Number.isFinite(nextPrice) || nextPrice <= 0 || !Number.isFinite(nextStock) || nextStock < 0) {
      window.alert('Please enter valid numeric values for price and stock.');
      return;
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? {
              ...item,
              name: name.trim(),
              price: nextPrice,
              category: category.trim(),
              stock: Math.floor(nextStock),
              image: image.trim(),
            }
          : item
      )
    );
  };

  return (
    <div className="admin-products-page">
      <Header title="Products" />

      <div className="page-body">
        <div className="page-toolbar">
          <div>
            <h2>All Products</h2>
            <p className="subtitle">{products.length} products in store</p>
          </div>
          <button className="btn-primary-admin" onClick={() => navigate('/admin/add-product')}>
            Add Product
          </button>
        </div>

        <div className="admin-card">
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-thumb"
                      />
                    </td>
                    <td><span className="admin-product-name">{product.name}</span></td>
                    <td>{product.category}</td>
                    <td>
                      <span className="admin-product-price">
                        ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`stock-badge ${
                          product.stock < 15 ? 'low' : 'ok'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
