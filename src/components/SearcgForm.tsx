import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { ScanRequest } from '@/types/strategy';

interface SearchFormProps {
  onScan: (request: ScanRequest) => void;
  loading: boolean;
}

export default function SearchForm({ onScan, loading }: SearchFormProps) {
  const [ticker, setTicker] = useState('');
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'moderate_aggressive' | 'aggressive'>('moderate_aggressive');
  const [minDte, setMinDte] = useState(30);
  const [maxDte, setMaxDte] = useState(45);
  const [maxStrategies, setMaxStrategies] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    const request: ScanRequest = {
      ticker: ticker.toUpperCase().trim(),
      riskProfile,
      minDte,
      maxDte,
      maxStrategies,
    };

    onScan(request);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Main Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <label htmlFor="ticker" className="block text-sm font-semibold text-slate-700 mb-3">
            Stock Ticker
          </label>
          <input
            type="text"
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter ticker (e.g., AAPL, SPY, TSLA)"
            className="input text-lg"
            disabled={loading}
            maxLength={10}
          />
        </div>

        <div className="lg:w-64">
          <label htmlFor="riskProfile" className="block text-sm font-semibold text-slate-700 mb-3">
            Risk Profile
          </label>
          <select
            id="riskProfile"
            value={riskProfile}
            onChange={(e) => setRiskProfile(e.target.value as any)}
            className="select text-lg"
            disabled={loading}
          >
            <option value="conservative">🛡️ Conservative</option>
            <option value="moderate">⚖️ Moderate</option>
            <option value="moderate_aggressive">📊 Moderate Aggressive</option>
            <option value="aggressive">🚀 Aggressive</option>
          </select>
        </div>

        <div className="lg:w-40">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            &nbsp;
          </label>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !ticker.trim()}
            className="btn-primary w-full h-[52px] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Scanning...</span>
              </div>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
                Analyze
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all duration-200"
          disabled={loading}
        >
          <Cog6ToothIcon className="w-4 h-4" />
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
        </button>
      </div>

      {/* Advanced Options */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: showAdvanced ? 1 : 0, 
          height: showAdvanced ? 'auto' : 0 
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {showAdvanced && (
          <div className="pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="minDte" className="block text-sm font-semibold text-slate-700 mb-3">
                  Min Days to Expiration
                </label>
                <input
                  type="number"
                  id="minDte"
                  value={minDte}
                  onChange={(e) => setMinDte(Number(e.target.value))}
                  min="1"
                  max="365"
                  className="input"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="maxDte" className="block text-sm font-semibold text-slate-700 mb-3">
                  Max Days to Expiration
                </label>
                <input
                  type="number"
                  id="maxDte"
                  value={maxDte}
                  onChange={(e) => setMaxDte(Number(e.target.value))}
                  min="1"
                  max="365"
                  className="input"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="maxStrategies" className="block text-sm font-semibold text-slate-700 mb-3">
                  Max Results
                </label>
                <input
                  type="number"
                  id="maxStrategies"
                  value={maxStrategies}
                  onChange={(e) => setMaxStrategies(Number(e.target.value))}
                  min="1"
                  max="20"
                  className="input"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </form>
  );
}
