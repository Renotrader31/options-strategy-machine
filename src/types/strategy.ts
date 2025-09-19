// Strategy and API types for the Options Strategy Generator

export interface Strategy {
  id?: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral' | 'volatility';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  confidence: number;
  maxProfit: number;
  maxLoss: number;
  capitalRequired: number;
  probabilityOfProfit?: number;
  breakEvenPoints?: number[];
  description?: string;
  legs?: StrategyLeg[];
  timeDecay?: number;
  volatilityImpact?: number;
  currentPrice?: number;
  ticker?: string;
}

export interface StrategyLeg {
  type: 'call' | 'put' | 'stock';
  action: 'buy' | 'sell';
  strike?: number;
  expiry?: string;
  quantity: number;
  premium?: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
}

export interface ScanRequest {
  ticker: string;
  riskProfile: 'conservative' | 'moderate' | 'moderate_aggressive' | 'aggressive';
  minDte?: number;
  maxDte?: number;
  maxStrategies?: number;
  maxCapital?: number;
  preferredPop?: number; // Probability of Profit
}

export interface ScanResponse {
  success: boolean;
  strategies: Strategy[];
  currentPrice?: number;
  ticker: string;
  error?: string;
  timestamp?: string;
}

export interface StockData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  marketCap?: number;
  peRatio?: number;
  impliedVolatility?: number;
}

export interface OptionsChain {
  ticker: string;
  expiry: string;
  calls: OptionsContract[];
  puts: OptionsContract[];
}

export interface OptionsContract {
  strike: number;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  intrinsicValue: number;
  timeValue: number;
}

export interface RiskProfile {
  name: string;
  description: string;
  maxCapitalPerTrade: number;
  preferredPop: number; // 0.0 to 1.0
  volatilityTolerance: 'low' | 'medium' | 'high';
  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
  strategyPreferences: string[];
}

export interface MarketCondition {
  trend: 'bullish' | 'bearish' | 'sideways';
  volatility: 'low' | 'medium' | 'high';
  ivPercentile: number;
  volume: 'low' | 'medium' | 'high';
}

export interface BacktestResult {
  strategy: string;
  ticker: string;
  startDate: string;
  endDate: string;
  totalTrades: number;
  winRate: number;
  avgReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}
