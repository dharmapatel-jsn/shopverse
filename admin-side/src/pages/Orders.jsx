import { useState } from 'react';
import Header from '../components/Header';
import { orders as initialOrders } from '../data/mockData';
import './Orders.css';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="orders-page">
      <Header title="Orders" />

      <div className="page-body">
        <div className="page-toolbar">
          <div>
            <h2>Customer Orders</h2>
            <p className="subtitle">{orders.length} total orders</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusClass = order.status.toLowerCase();
                  return (
                    <tr key={order.id}>
                      <td><strong>#{order.id}</strong></td>
                      <td>{order.customer}</td>
                      <td><strong>₹{order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`status-select ${statusClass}`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
