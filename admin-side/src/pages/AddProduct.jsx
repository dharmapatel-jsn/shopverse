import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { products } from '../data/mockData';
import './ProductForm.css';

const CATEGORIES = ['Clothing', 'Electronics', 'Bags', 'Footwear'];

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim())        errs.name        = 'Product name is required';
    if (!form.price)              errs.price       = 'Price is required';
    else if (isNaN(form.price) || Number(form.price) <= 0)
                                  errs.price       = 'Enter a valid price';
    if (!form.category)           errs.category    = 'Select a category';
    if (!form.stock)              errs.stock       = 'Stock quantity is required';
    else if (isNaN(form.stock) || Number(form.stock) < 0)
                                  errs.stock       = 'Enter a valid stock value';
    if (!form.image.trim())       errs.image       = 'Image URL is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const maxId = products.reduce((max, item) => Math.max(max, item.id), 0);
      const newProduct = {
        id: maxId + 1,
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category,
        stock: Math.floor(Number(form.stock)),
        image: form.image.trim(),
      };
      navigate('/admin/products', { state: { newProduct } });
    }, 800);
  };

  return (
    <div className="add-product-page">
      <Header title="Add Product" />

      <div className="page-body">
        <div className="page-toolbar">
          <div>
            <h2>Add New Product</h2>
            <p className="subtitle">Fill in the details to add a new product</p>
          </div>
        </div>

        <div className="admin-card form-card">
          <form onSubmit={handleSubmit} className="product-form" noValidate>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Classic White T-Shirt"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="err">{errors.category}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (INR)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="err">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  className={errors.stock ? 'error' : ''}
                />
                {errors.stock && <span className="err">{errors.stock}</span>}
              </div>
            </div>

            <div className="form-group full">
              <label>Image URL</label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={handleChange}
                className={errors.image ? 'error' : ''}
              />
              {errors.image && <span className="err">{errors.image}</span>}
              {form.image && (
                <img src={form.image} alt="Preview" className="img-preview" />
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary-admin" disabled={submitting}>
                {submitting ? 'Saving…' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
