import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  ArrowTrendingDownIcon as TrendingDownIcon, 
  MinusIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { Strategy } from '@/types/strategy';

interface StrategyCardProps {
  strategy: Strategy;
  rank: number;
  confidenceColor: string;
  confidenceIcon: React.ReactNode;
}

export default function StrategyCard({ strategy, rank, confidenceColor, confidenceIcon }: StrategyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStrategyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bullish':
        return <TrendingUpIcon className="w-4 h-4 text-emerald-600" />;
      case 'bearish':
        return <TrendingDownIcon className="w-4 h-4 text-red-600" />;
      case 'neutral':
        return <MinusIcon className="w-4 h-4 text-blue-600" />;
      case 'volatility':
        return <BoltIcon className="w-4 h-4 text-purple-600" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStrategyTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bullish':
        return 'text-emerald-600 bg-emerald-50';
      case 'bearish':
        return 'text-red-600 bg-red-50';
      case 'neutral':
        return 'text-blue-600 bg-blue-50';
      case 'volatility':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-amber-600 bg-amber-50';
    }
  };

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${Math.abs(amount).toFixed(0)}`;
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      {/* Compact Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              #{rank}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                {strategy.name}
              </h3>
              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStrategyTypeColor(strategy.type)}`}>
                {getStrategyTypeIcon(strategy.type)}
                <span className="ml-1 capitalize">{strategy.type}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3">{confidenceIcon}</div>
              <span className={`font-bold text-sm ${confidenceColor}`}>
                {strategy.confidence.toFixed(0)}%
              </span>
            </div>
            <span className="text-xs text-slate-400">Score</span>
          </div>
        </div>
      </div>

      {/* Compact Metrics */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-emerald-600 font-bold text-sm">
              {formatCurrency(strategy.maxProfit)}
            </div>
            <div className="text-xs text-slate-500">Max Profit</div>
          </div>
          <div>
            <div className="text-red-600 font-bold text-sm">
              {formatCurrency(strategy.maxLoss)}
            </div>
            <div className="text-xs text-slate-500">Max Loss</div>
          </div>
          <div>
            <div className="text-blue-600 font-bold text-sm">
              {formatCurrency(strategy.capitalRequired)}
            </div>
            <div className="text-xs text-slate-500">Capital</div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-4 text-xs text-slate-600">
            {strategy.probabilityOfProfit && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>{(strategy.probabilityOfProfit * 100).toFixed(0)}% PoP</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-3 h-3" />
              <span>30-45 DTE</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <span>{isExpanded ? 'Less' : 'More'}</span>
            {isExpanded ? 
              <ChevronUpIcon className="w-3 h-3" /> : 
              <ChevronDownIcon className="w-3 h-3" />
            }
          </motion.button>
        </div>
      </div>

      {/* Expandable Details */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden bg-slate-50"
      >
        <div className="p-4 space-y-3">
          {/* Strategy Description */}
          {strategy.description && (
            <div>
              <div className="text-xs font-medium text-slate-700 mb-1">Strategy Overview</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {strategy.description}
              </p>
            </div>
          )}

          {/* Options Legs */}
          {strategy.legs && strategy.legs.length > 0 && (
            <div>
              <div className="text-xs font-medium text-slate-700 mb-2">Options Legs</div>
              <div className="space-y-2">
                {strategy.legs.map((leg, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        leg.action === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {leg.action}
                      </span>
                      <span className="font-medium">{leg.type}</span>
                      <span className="text-slate-500">${leg.strike}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${leg.premium?.toFixed(2) || '0.00'}</div>
                      <div className="text-xs text-slate-400">Premium</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Greeks */}
          {strategy.greeks && (
            <div>
              <div className="text-xs font-medium text-slate-700 mb-2">Greeks</div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-slate-900">{strategy.greeks.delta?.toFixed(2) || '0.00'}</div>
                  <div className="text-slate-500">Delta</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-slate-900">{strategy.greeks.gamma?.toFixed(3) || '0.000'}</div>
                  <div className="text-slate-500">Gamma</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-slate-900">{strategy.greeks.theta?.toFixed(2) || '0.00'}</div>
                  <div className="text-slate-500">Theta</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-slate-900">{strategy.greeks.vega?.toFixed(2) || '0.00'}</div>
                  <div className="text-slate-500">Vega</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg text-xs font-semibold hover:shadow-md transition-all duration-200"
          >
            <CurrencyDollarIcon className="w-4 h-4 mr-1.5 inline" />
            Execute Strategy
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
