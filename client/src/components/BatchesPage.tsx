import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { BirdBatch } from '../types';

const BatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<BirdBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: '',
    farmId: localStorage.getItem('selectedFarmId') || '',
    shedId: '',
    breed: '',
    startDate: new Date().toISOString().split('T')[0],
    initialCount: 0
  });
  const [sheds, setSheds] = useState<{id: string, name: string}[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadBatches();
    // We could also load sheds here if needed for batch creation form
  }, []);

  const loadBatches = async () => {
    const result = await ApiService.getBatches();
    
    if (result.success) {
      setBatches(result.batches || []);
    } else {
      setError(result.error || 'Failed to fetch batches');
    }
    setLoading(false);
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBatch.farmId || !newBatch.shedId) {
      setError('Please select farm and shed');
      return;
    }

    const result = await ApiService.createBatch(newBatch);
    
    if (result.success) {
      // Add to list and reset form
      setBatches([...batches, result.batch!]);
      setNewBatch({
        name: '',
        farmId: localStorage.getItem('selectedFarmId') || '',
        shedId: '',
        breed: '',
        startDate: new Date().toISOString().split('T')[0],
        initialCount: 0
      });
      setShowCreateForm(false);
    } else {
      setError(result.error || 'Failed to create batch');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading batches...</div>
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
          <h1 className="text-3xl font-bold text-gray-800">Bird Batches Management</h1>
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
            {showCreateForm ? 'Cancel' : '+ Add New Batch'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Batch</h2>
            <form onSubmit={handleCreateBatch}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="batchName" className="block text-gray-700 mb-2">Batch Name</label>
                  <input
                    id="batchName"
                    type="text"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="batchBreed" className="block text-gray-700 mb-2">Breed</label>
                  <input
                    id="batchBreed"
                    type="text"
                    value={newBatch.breed}
                    onChange={(e) => setNewBatch({...newBatch, breed: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="batchInitialCount" className="block text-gray-700 mb-2">Initial Count</label>
                  <input
                    id="batchInitialCount"
                    type="number"
                    value={newBatch.initialCount}
                    onChange={(e) => setNewBatch({...newBatch, initialCount: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="batchStartDate" className="block text-gray-700 mb-2">Start Date</label>
                  <input
                    id="batchStartDate"
                    type="date"
                    value={newBatch.startDate}
                    onChange={(e) => setNewBatch({...newBatch, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
              >
                Create Batch
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{batch.name}</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Breed: {batch.breed}</p>
                <p className="text-gray-600">Start Date: {batch.startDate}</p>
                <p className="text-gray-600">Initial Count: {batch.initialCount}</p>
                <p className="text-gray-600">Current Count: {batch.currentCount}</p>
                <p className="text-gray-600">Mortality: {batch.mortalityCount}</p>
                <p className={`text-sm ${batch.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {batches.length === 0 && !showCreateForm && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">No batches found. Create your first batch!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Add First Batch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchesPage;