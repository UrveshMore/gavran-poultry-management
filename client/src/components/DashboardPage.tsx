import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { DashboardStats } from '../types';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    const result = await ApiService.getDashboardStats();
    
    if (result.success) {
      setStats(result.stats || null);
    } else {
      setError(result.error || 'Failed to fetch dashboard stats');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-md max-w-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Farm Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600">Total Farms</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalFarms}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600">Total Sheds</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalSheds}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600">Total Birds</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalBirds}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600">Mortality Rate</h3>
              <p className="text-3xl font-bold text-red-600">{stats.mortalityRate}%</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/sheds')}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-4 px-6 rounded-md transition duration-300 text-center"
            >
              Manage Sheds
            </button>
            <button
              onClick={() => navigate('/batches')}
              className="bg-green-100 hover:bg-green-200 text-green-800 py-4 px-6 rounded-md transition duration-300 text-center"
            >
              Manage Batches
            </button>
            <button
              onClick={() => navigate('/mortality')}
              className="bg-red-100 hover:bg-red-200 text-red-800 py-4 px-6 rounded-md transition duration-300 text-center"
            >
              Record Mortality
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <p className="text-gray-600">This section would show recent activities and alerts.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;