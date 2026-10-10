import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api.service';
import { BirdBatch, MortalityRecord } from '../types';

const MortalityPage: React.FC = () => {
  const [batches, setBatches] = useState<BirdBatch[]>([]);
  const [records, setRecords] = useState<MortalityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [newMortality, setNewMortality] = useState({
    batchId: '',
    count: 0,
    reason: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    loadBatches();
    loadMortalityRecords();
  }, []);

  const loadBatches = async () => {
    const result = await ApiService.getBatches();
    
    if (result.success) {
      setBatches(result.batches || []);
    } else {
      setError(result.error || 'Failed to fetch batches');
    }
  };

  const loadMortalityRecords = async () => {
    // For this demo, just fetch a placeholder
    setLoading(false);
  };

  const handleRecordMortality = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMortality.batchId) {
      setError('Please select a batch');
      return;
    }

    const result = await ApiService.recordMortality(newMortality);
    
    if (result.success) {
      // Add to records list and reset form
      setRecords([result.record!, ...records]);
      setNewMortality({
        batchId: '',
        count: 0,
        reason: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowRecordForm(false);
    } else {
      setError(result.error || 'Failed to record mortality');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading data...</div>
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
          <h1 className="text-3xl font-bold text-gray-800">Mortality Recording</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowRecordForm(!showRecordForm)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            {showRecordForm ? 'Cancel' : '+ Record Mortality'}
          </button>
        </div>

        {showRecordForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Record Mortality</h2>
            <form onSubmit={handleRecordMortality}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="batchId" className="block text-gray-700 mb-2">Select Batch</label>
                  <select
                    id="batchId"
                    value={newMortality.batchId}
                    onChange={(e) => setNewMortality({...newMortality, batchId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a batch</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name} ({batch.breed})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="mortalityCount" className="block text-gray-700 mb-2">Number of Birds</label>
                  <input
                    id="mortalityCount"
                    type="number"
                    value={newMortality.count}
                    onChange={(e) => setNewMortality({...newMortality, count: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mortalityReason" className="block text-gray-700 mb-2">Reason</label>
                  <select
                    id="mortalityReason"
                    value={newMortality.reason}
                    onChange={(e) => setNewMortality({...newMortality, reason: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select reason</option>
                    <option value="Disease">Disease</option>
                    <option value="Accident">Accident</option>
                    <option value="Starvation">Starvation</option>
                    <option value="Cold Weather">Cold Weather</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="mortalityDate" className="block text-gray-700 mb-2">Date</label>
                  <input
                    id="mortalityDate"
                    type="date"
                    value={newMortality.date}
                    onChange={(e) => setNewMortality({...newMortality, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="mortalityNotes" className="block text-gray-700 mb-2">Notes</label>
                <textarea
                  id="mortalityNotes"
                  value={newMortality.notes}
                  onChange={(e) => setNewMortality({...newMortality, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
              >
                Record Mortality
              </button>
            </form>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Mortality Records</h2>
          <p className="text-gray-600">This section would display your mortality records.</p>
          {/* For this demo, we're not actually fetching real records */}
        </div>
      </div>
    </div>
  );
};

export default MortalityPage;