import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

import StrategyCard from '../components/StrategyCard';
import SearchForm from '../components/SearchForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { Strategy, ScanRequest } from '../types/strategy';

export default function HomePage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTicker, setCurrentTicker] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handleScan = async (request: ScanRequest) => {
    setLoading(true);
    setCurrentTicker(request.ticker);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStrategies(data.strategies);
        setCurrentPrice(data.currentPrice);
        toast.success(`Found ${data.strategies.length} strategies for ${request.ticker}`);
      } else {
        throw new Error(data.error || 'Failed to fetch strategies');
      }
    } catch (error) {
      console.error('Error scanning strategies:', error);
      toast.error('Failed to fetch strategies. Please try again.');
      setStrategies([]);
      setCurrentPrice(null);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600';
    if (confidence >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 70) return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    if (confidence >= 50) return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
    return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <TrendingUpIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Options Strategy Generator
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  AI-Powered Options Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs font-medium text-emerald-700">Live Data</span>
              </div>
              <span className="text-sm text-slate-400 font-medium">
                Powered by Polygon API
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Find Your Perfect 
            <span className="text-gradient"> Options Strategy</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover AI-powered options strategies tailored to your risk profile with real-time market analysis
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              ✨ Updated Design & Fixed APIs
            </span>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="card-elevated p-8">
            <SearchForm onScan={handleScan} loading={loading} />
          </div>
        </motion.div>

        {/* Current Stock Info */}
        <AnimatePresence>
          {currentTicker && currentPrice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <ChartBarIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{currentTicker}</h3>
                      <p className="text-sm text-slate-500 font-medium">Current Analysis</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold text-slate-900">
                        ${currentPrice.toFixed(2)}
                      </span>
                      <CurrencyDollarIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="flex items-center justify-end mt-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                      <span className="text-sm text-slate-500 font-medium">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card p-12 text-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <LoadingSpinner />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Analyzing Strategies
                  </h3>
                  <p className="text-slate-600">
                    Finding the best options strategies for <span className="font-semibold text-blue-600">{currentTicker}</span>...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Strategies Grid */}
        <AnimatePresence>
          {strategies.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Recommended Strategies
                  </h3>
                  <p className="text-slate-600 mt-1">
                    {strategies.length} strategies found, ranked by confidence score
                  </p>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
                  <ArrowPathIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">AI Ranked</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {strategies.map((strategy, index) => (
                  <motion.div
                    key={strategy.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <StrategyCard 
                      strategy={strategy} 
                      rank={index + 1}
                      confidenceColor={getConfidenceColor(strategy.confidence)}
                      confidenceIcon={getConfidenceIcon(strategy.confidence)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && strategies.length === 0 && currentTicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-12 text-center"
          >
            <div className="p-4 bg-amber-100 rounded-2xl w-fit mx-auto mb-6">
              <ExclamationTriangleIcon className="h-12 w-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              No Strategies Found
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              No viable strategies found for <span className="font-semibold text-blue-600">{currentTicker}</span>. 
              Try a different ticker or adjust your risk parameters.
            </p>
            <button 
              onClick={() => {
                setCurrentTicker('');
                setStrategies([]);
                setCurrentPrice(null);
              }}
              className="btn-secondary"
            >
              Search Another Ticker
            </button>
          </motion.div>
        )}

        {/* Welcome State */}
        {!loading && strategies.length === 0 && !currentTicker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div 
                className="card-elevated p-8 text-center group hover:scale-105 transition-transform duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                  <ChartBarIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analysis</h3>
                <p className="text-slate-600 leading-relaxed">
                  Live market data and options chains powered by institutional-grade APIs
                </p>
              </motion.div>

              <motion.div 
                className="card-elevated p-8 text-center group hover:scale-105 transition-transform duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                  <TrendingUpIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">20+ Strategies</h3>
                <p className="text-slate-600 leading-relaxed">
                  Comprehensive coverage from conservative spreads to advanced multi-leg strategies
                </p>
              </motion.div>

              <motion.div 
                className="card-elevated p-8 text-center group hover:scale-105 transition-transform duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                  <CurrencyDollarIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Risk Management</h3>
                <p className="text-slate-600 leading-relaxed">
                  AI-powered confidence scoring tailored to your specific risk tolerance
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
