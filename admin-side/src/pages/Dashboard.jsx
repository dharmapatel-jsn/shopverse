import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import { products, orders } from '../data/mockData';
import './Dashboard.css';

const Dashboard = () => {
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const lowStockProducts = products.filter((product) => product.stock <= 15).length;

  return (
    <div className="dashboard-page">
      <Header title="Dashboard" />

      <div className="page-body">
        <div className="stats-grid">
          <DashboardCard title="Total Products" value={totalProducts} icon="PR" color="#ffc107" />
          <DashboardCard title="Total Orders" value={totalOrders} icon="OR" color="#4caf50" />
          <DashboardCard title="Total Revenue" value={`₹${Math.round(totalRevenue).toLocaleString('en-IN')}`} icon="RV" color="#9c27b0" />
          <DashboardCard title="Low Stock Products" value={lowStockProducts} icon="LS" color="#f44336" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
