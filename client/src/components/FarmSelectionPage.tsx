import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { Farm } from '../types';

const FarmSelectionPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    const result = await ApiService.getFarms();
    
    if (result.success) {
      setFarms(result.farms || []);
    } else {
      setError(result.error || 'Failed to fetch farms');
    }
    setLoading(false);
  };

  const handleFarmSelect = (farmId: string) => {
    // Store selected farm in localStorage for later use
    localStorage.setItem('selectedFarmId', farmId);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading farms...</div>
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
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8">Select Your Farm</h1>
        
        {farms.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">No farms found. Please create a farm first.</p>
            <button
              onClick={() => navigate('/create-farm')}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Create Farm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <div 
                key={farm.id} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                onClick={() => handleFarmSelect(farm.id)}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">{farm.name}</h2>
                <p className="text-gray-600 mb-2">{farm.location}</p>
                <div className="flex justify-between mt-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {farm.totalSheds} Sheds
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {farm.totalBirds} Birds
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmSelectionPage;