import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { Shed } from '../types';

const ShedsPage: React.FC = () => {
  const [sheds, setSheds] = useState<Shed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newShed, setNewShed] = useState({
    name: '',
    farmId: localStorage.getItem('selectedFarmId') || '',
    capacity: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadSheds();
  }, []);

  const loadSheds = async () => {
    const result = await ApiService.getSheds();
    
    if (result.success) {
      setSheds(result.sheds || []);
    } else {
      setError(result.error || 'Failed to fetch sheds');
    }
    setLoading(false);
  };

  const handleCreateShed = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newShed.farmId) {
      setError('Please select a farm');
      return;
    }

    const result = await ApiService.createShed(newShed);
    
    if (result.success) {
      // Add to list and reset form
      setSheds([...sheds, result.shed!]);
      setNewShed({ name: '', farmId: localStorage.getItem('selectedFarmId') || '', capacity: 0 });
      setShowCreateForm(false);
    } else {
      setError(result.error || 'Failed to create shed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading sheds...</div>
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
          <h1 className="text-3xl font-bold text-gray-800">Sheds Management</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            {showCreateForm ? 'Cancel' : '+ Add New Shed'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Shed</h2>
            <form onSubmit={handleCreateShed}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="shedName" className="block text-gray-700 mb-2">Shed Name</label>
                  <input
                    id="shedName"
                    type="text"
                    value={newShed.name}
                    onChange={(e) => setNewShed({...newShed, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="shedCapacity" className="block text-gray-700 mb-2">Capacity</label>
                  <input
                    id="shedCapacity"
                    type="number"
                    value={newShed.capacity}
                    onChange={(e) => setNewShed({...newShed, capacity: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
              >
                Create Shed
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sheds.map((shed) => (
            <div key={shed.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{shed.name}</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Farm ID: {shed.farmId}</p>
                <p className="text-gray-600">Capacity: {shed.capacity} birds</p>
                <p className="text-gray-600">Current Birds: {shed.currentBirds}</p>
                <p className={`text-sm ${shed.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {shed.status.charAt(0).toUpperCase() + shed.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {sheds.length === 0 && !showCreateForm && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">No sheds found. Create your first shed!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Add First Shed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShedsPage;