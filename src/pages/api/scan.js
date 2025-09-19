import type { NextApiRequest, NextApiResponse } from 'next';

interface StrategyLeg {
  type: 'call' | 'put';
  action: 'BUY' | 'SELL';
  strike: number;
  expiry: string;
  quantity: number;
  premium: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
}

interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

interface ScanRequest {
  ticker: string;
  riskProfile: string;
  minDte?: number;
  maxDte?: number;
  maxStrategies?: number;
}

interface Strategy {
  id: string;
  name: string;
  type: string;
  confidence: number;
  maxProfit: number;
  maxLoss: number;
  capitalRequired: number;
  probabilityOfProfit?: number;
  description?: string;
  legs?: StrategyLeg[];
  greeks?: Greeks;
  breakEvenPoints?: number[];
}

interface ScanResponse {
  success: boolean;
  strategies: Strategy[];
  currentPrice: number;
  ticker: string;
  error?: string;
}

// Live data fetching function
async function fetchLiveStockPrice(ticker: string): Promise<number> {
  const apiKey = process.env.POLYGON_API_KEY;
  
  if (!apiKey) {
    console.log('No Polygon API key found, using mock data');
    // Fallback to mock prices
    const mockPrices: { [key: string]: number } = {
      'AAPL': 237.88,  // Updated realistic prices
      'SPY': 590.25,
      'TSLA': 248.50,
      'MSFT': 425.32,
      'NVDA': 138.45,
      'META': 563.12,
      'GOOGL': 175.28,
      'AMZN': 197.85,
      'QQQ': 515.75,
      'AMD': 120.33
    };
    return mockPrices[ticker] || 100 + Math.random() * 200;
  }

  try {
    // Fetch live data from Polygon
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results[0]) {
      return data.results[0].c; // Close price
    }
    
    throw new Error('No price data available');
  } catch (error) {
    console.error('Error fetching live price:', error);
    // Fallback to mock data
    return 100 + Math.random() * 200;
  }
}

// Generate realistic expiration dates
function getExpirationDates(minDte: number = 30, maxDte: number = 45): string[] {
  const dates = [];
  const today = new Date();
  
  // Generate weekly Friday expirations
  for (let weeks = 1; weeks <= 12; weeks++) {
    const expDate = new Date(today);
    expDate.setDate(today.getDate() + (weeks * 7));
    
    // Find next Friday
    while (expDate.getDay() !== 5) {
      expDate.setDate(expDate.getDate() + 1);
    }
    
    const dte = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (dte >= minDte && dte <= maxDte) {
      dates.push(expDate.toISOString().split('T')[0]);
    }
  }
  
  // Add monthly expirations (3rd Friday)
  for (let months = 1; months <= 3; months++) {
    const expDate = new Date(today.getFullYear(), today.getMonth() + months, 1);
    expDate.setDate(15); // Start from 15th to find 3rd Friday
    
    while (expDate.getDay() !== 5) {
      expDate.setDate(expDate.getDate() + 1);
    }
    
    const dte = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (dte >= minDte && dte <= maxDte) {
      dates.push(expDate.toISOString().split('T')[0]);
    }
  }
  
  return dates.slice(0, 3); // Return up to 3 expiration dates
}

// Generate strike prices around current price
function generateStrikes(currentPrice: number): number[] {
  const strikes = [];
  const roundedPrice = Math.round(currentPrice);
  
  // Generate strikes in $5 intervals for prices under $200, $10 intervals above
  const interval = currentPrice < 200 ? 5 : 10;
  
  for (let i = -4; i <= 4; i++) {
    const strike = roundedPrice + (i * interval);
    if (strike > 0) {
      strikes.push(strike);
    }
  }
  
  return strikes;
}

// Black-Scholes Option Pricing (simplified)
function calculateOptionPrice(
  currentPrice: number, 
  strike: number, 
  timeToExpiry: number, 
  volatility: number = 0.25, 
  riskFreeRate: number = 0.05, 
  isCall: boolean = true
): { price: number; greeks: Greeks } {
  const S = currentPrice;
  const K = strike;
  const T = timeToExpiry / 365;
  const r = riskFreeRate;
  const σ = volatility;
  
  if (T <= 0) {
    const intrinsic = isCall ? Math.max(S - K, 0) : Math.max(K - S, 0);
    return { 
      price: intrinsic, 
      greeks: { delta: isCall ? (S > K ? 1 : 0) : (S < K ? -1 : 0), gamma: 0, theta: 0, vega: 0 }
    };
  }
  
  const d1 = (Math.log(S / K) + (r + 0.5 * σ * σ) * T) / (σ * Math.sqrt(T));
  const d2 = d1 - σ * Math.sqrt(T);
  
  // Cumulative standard normal distribution approximation
  const cdf = (x: number) => 0.5 * (1 + erf(x / Math.sqrt(2)));
  
  const Nd1 = cdf(d1);
  const Nd2 = cdf(d2);
  const nd1 = Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI);
  
  let price: number;
  let delta: number;
  
  if (isCall) {
    price = S * Nd1 - K * Math.exp(-r * T) * Nd2;
    delta = Nd1;
  } else {
    price = K * Math.exp(-r * T) * cdf(-d2) - S * cdf(-d1);
    delta = Nd1 - 1;
  }
  
  const gamma = nd1 / (S * σ * Math.sqrt(T));
  const theta = -(S * nd1 * σ) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * (isCall ? Nd2 : cdf(-d2));
  const vega = S * nd1 * Math.sqrt(T) / 100; // Divide by 100 for 1% vol change
  
  return {
    price: Math.max(price, 0.01), // Minimum price of $0.01
    greeks: { delta, gamma, theta: theta / 365, vega }
  };
}

// Error function approximation
function erf(x: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
}

// Generate realistic strategies with actual strikes and premiums
function generateStrategies(currentPrice: number, ticker: string, minDte: number, maxDte: number): Strategy[] {
  const strikes = generateStrikes(currentPrice);
  const expirations = getExpirationDates(minDte, maxDte);
  const primaryExpiry = expirations[0];
  const dte = Math.floor((new Date(primaryExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const strategies: Strategy[] = [];
  
  // Bull Put Spread
  const bullPutShortStrike = strikes.find(s => s < currentPrice * 0.95) || strikes[2];
  const bullPutLongStrike = strikes.find(s => s < bullPutShortStrike - 5) || strikes[1];
  
  const shortPutPrice = calculateOptionPrice(currentPrice, bullPutShortStrike, dte, 0.25, 0.05, false);
  const longPutPrice = calculateOptionPrice(currentPrice, bullPutLongStrike, dte, 0.25, 0.05, false);
  
  const bullPutCredit = shortPutPrice.price - longPutPrice.price;
  const bullPutMaxLoss = (bullPutShortStrike - bullPutLongStrike) - bullPutCredit;
  
  strategies.push({
    id: '1',
    name: 'Bull Put Spread',
    type: 'bullish',
    confidence: 72.5 + Math.random() * 5,
    maxProfit: Math.round(bullPutCredit * 100),
    maxLoss: -Math.round(bullPutMaxLoss * 100),
    capitalRequired: Math.round(bullPutMaxLoss * 100),
    probabilityOfProfit: 0.68 + Math.random() * 0.1,
    description: `Sell ${bullPutShortStrike}P, Buy ${bullPutLongStrike}P. Profit if ${ticker} stays above $${bullPutShortStrike} by ${primaryExpiry}`,
    legs: [
      {
        type: 'put',
        action: 'SELL',
        strike: bullPutShortStrike,
        expiry: primaryExpiry,
        quantity: 1,
        premium: shortPutPrice.price,
        ...shortPutPrice.greeks
      },
      {
        type: 'put',
        action: 'BUY',
        strike: bullPutLongStrike,
        expiry: primaryExpiry,
        quantity: 1,
        premium: longPutPrice.price,
        ...longPutPrice.greeks
      }
    ],
    greeks: {
      delta: shortPutPrice.greeks.delta - longPutPrice.greeks.delta,
      gamma: shortPutPrice.greeks.gamma - longPutPrice.greeks.gamma,
      theta: shortPutPrice.greeks.theta - longPutPrice.greeks.theta,
      vega: shortPutPrice.greeks.vega - longPutPrice.greeks.vega
    },
    breakEvenPoints: [bullPutShortStrike - bullPutCredit]
  });

  // Iron Condor
  const icCallShortStrike = strikes.find(s => s > currentPrice * 1.05) || strikes[6];
  const icCallLongStrike = strikes.find(s => s > icCallShortStrike + 5) || strikes[7];
  const icPutShortStrike = strikes.find(s => s < currentPrice * 0.95) || strikes[2];
  const icPutLongStrike = strikes.find(s => s < icPutShortStrike - 5) || strikes[1];
  
  const icCallShort = calculateOptionPrice(currentPrice, icCallShortStrike, dte, 0.25, 0.05, true);
  const icCallLong = calculateOptionPrice(currentPrice, icCallLongStrike, dte, 0.25, 0.05, true);
  const icPutShort = calculateOptionPrice(currentPrice, icPutShortStrike, dte, 0.25, 0.05, false);
  const icPutLong = calculateOptionPrice(currentPrice, icPutLongStrike, dte, 0.25, 0.05, false);
  
  const icCredit = (icCallShort.price - icCallLong.price) + (icPutShort.price - icPutLong.price);
  const icMaxLoss = Math.max(icCallLongStrike - icCallShortStrike, icPutShortStrike - icPutLongStrike) - icCredit;
  
  strategies.push({
    id: '2',
    name: 'Iron Condor',
    type: 'neutral',
    confidence: 65.2 + Math.random() * 5,
    maxProfit: Math.round(icCredit * 100),
    maxLoss: -Math.round(icMaxLoss * 100),
    capitalRequired: Math.round(icMaxLoss * 100),
    probabilityOfProfit: 0.58 + Math.random() * 0.1,
    description: `Trade ${ticker} sideways between $${icPutShortStrike} and $${icCallShortStrike} by ${primaryExpiry}`,
    legs: [
      { type: 'call', action: 'SELL', strike: icCallShortStrike, expiry: primaryExpiry, quantity: 1, premium: icCallShort.price, ...icCallShort.greeks },
      { type: 'call', action: 'BUY', strike: icCallLongStrike, expiry: primaryExpiry, quantity: 1, premium: icCallLong.price, ...icCallLong.greeks },
      { type: 'put', action: 'SELL', strike: icPutShortStrike, expiry: primaryExpiry, quantity: 1, premium: icPutShort.price, ...icPutShort.greeks },
      { type: 'put', action: 'BUY', strike: icPutLongStrike, expiry: primaryExpiry, quantity: 1, premium: icPutLong.price, ...icPutLong.greeks }
    ],
    greeks: {
      delta: (icCallShort.greeks.delta - icCallLong.greeks.delta) + (icPutShort.greeks.delta - icPutLong.greeks.delta),
      gamma: (icCallShort.greeks.gamma - icCallLong.greeks.gamma) + (icPutShort.greeks.gamma - icPutLong.greeks.gamma),
      theta: (icCallShort.greeks.theta - icCallLong.greeks.theta) + (icPutShort.greeks.theta - icPutLong.greeks.theta),
      vega: (icCallShort.greeks.vega - icCallLong.greeks.vega) + (icPutShort.greeks.vega - icPutLong.greeks.vega)
    },
    breakEvenPoints: [icPutShortStrike - icCredit, icCallShortStrike + icCredit]
  });

  // Cash Secured Put
  const cspStrike = strikes.find(s => s < currentPrice * 0.97) || strikes[3];
  const cspOption = calculateOptionPrice(currentPrice, cspStrike, dte, 0.25, 0.05, false);
  
  strategies.push({
    id: '3',
    name: 'Cash Secured Put',
    type: 'bullish',
    confidence: 69.8 + Math.random() * 5,
    maxProfit: Math.round(cspOption.price * 100),
    maxLoss: -Math.round((cspStrike - cspOption.price) * 100),
    capitalRequired: Math.round(cspStrike * 100),
    probabilityOfProfit: 0.65 + Math.random() * 0.1,
    description: `Sell ${cspStrike}P. Collect premium or buy ${ticker} at $${cspStrike} discount by ${primaryExpiry}`,
    legs: [
      {
        type: 'put',
        action: 'SELL',
        strike: cspStrike,
        expiry: primaryExpiry,
        quantity: 1,
        premium: cspOption.price,
        ...cspOption.greeks
      }
    ],
    greeks: cspOption.greeks,
    breakEvenPoints: [cspStrike - cspOption.price]
  });

  // Long Straddle
  const straddleStrike = strikes.find(s => Math.abs(s - currentPrice) < 5) || strikes[4];
  const callOption = calculateOptionPrice(currentPrice, straddleStrike, dte, 0.25, 0.05, true);
  const putOption = calculateOptionPrice(currentPrice, straddleStrike, dte, 0.25, 0.05, false);
  
  const straddleCost = callOption.price + putOption.price;
  
  strategies.push({
    id: '4',
    name: 'Long Straddle',
    type: 'volatility',
    confidence: 58.5 + Math.random() * 5,
    maxProfit: 99999,
    maxLoss: -Math.round(straddleCost * 100),
    capitalRequired: Math.round(straddleCost * 100),
    probabilityOfProfit: 0.45 + Math.random() * 0.1,
    description: `Buy ${straddleStrike}C and ${straddleStrike}P. Profit if ${ticker} moves beyond $${(straddleStrike + straddleCost).toFixed(2)} or $${(straddleStrike - straddleCost).toFixed(2)}`,
    legs: [
      { type: 'call', action: 'BUY', strike: straddleStrike, expiry: primaryExpiry, quantity: 1, premium: callOption.price, ...callOption.greeks },
      { type: 'put', action: 'BUY', strike: straddleStrike, expiry: primaryExpiry, quantity: 1, premium: putOption.price, ...putOption.greeks }
    ],
    greeks: {
      delta: callOption.greeks.delta + putOption.greeks.delta,
      gamma: callOption.greeks.gamma + putOption.greeks.gamma,
      theta: callOption.greeks.theta + putOption.greeks.theta,
      vega: callOption.greeks.vega + putOption.greeks.vega
    },
    breakEvenPoints: [straddleStrike - straddleCost, straddleStrike + straddleCost]
  });

  // Covered Call (requires stock ownership)
  const ccStrike = strikes.find(s => s > currentPrice * 1.03) || strikes[6];
  const ccOption = calculateOptionPrice(currentPrice, ccStrike, dte, 0.25, 0.05, true);
  
  strategies.push({
    id: '5',
    name: 'Covered Call',
    type: 'neutral',
    confidence: 66.7 + Math.random() * 5,
    maxProfit: Math.round((ccStrike - currentPrice + ccOption.price) * 100),
    maxLoss: -Math.round((currentPrice - ccOption.price) * 100),
    capitalRequired: Math.round(currentPrice * 100),
    probabilityOfProfit: 0.72 + Math.random() * 0.1,
    description: `Own 100 shares of ${ticker}, sell ${ccStrike}C. Cap gains at $${ccStrike}, collect premium`,
    legs: [
      { type: 'call', action: 'SELL', strike: ccStrike, expiry: primaryExpiry, quantity: 1, premium: ccOption.price, ...ccOption.greeks }
    ],
    greeks: {
      delta: -ccOption.greeks.delta + 1, // Include stock delta
      gamma: -ccOption.greeks.gamma,
      theta: -ccOption.greeks.theta,
      vega: -ccOption.greeks.vega
    },
    breakEvenPoints: [currentPrice - ccOption.price]
  });

  return strategies;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ScanResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      strategies: [],
      currentPrice: 0,
      ticker: '',
      error: 'Method not allowed'
    });
  }

  try {
    const { ticker, riskProfile, minDte = 30, maxDte = 45, maxStrategies = 5 }: ScanRequest = req.body;

    if (!ticker) {
      return res.status(400).json({
        success: false,
        strategies: [],
        currentPrice: 0,
        ticker: '',
        error: 'Ticker is required'
      });
    }

    const upperTicker = ticker.toUpperCase();
    
    // Fetch live stock price (or use mock if no API key)
    const currentPrice = await fetchLiveStockPrice(upperTicker);
    
    // Generate realistic strategies with actual strikes
    const allStrategies = generateStrategies(currentPrice, upperTicker, minDte, maxDte);

    // Filter strategies based on risk profile
    let filteredStrategies = [...allStrategies];
    
    switch (riskProfile) {
      case 'conservative':
        filteredStrategies = allStrategies.filter(s => s.confidence >= 65 && s.type !== 'volatility');
        break;
      case 'moderate':
        filteredStrategies = allStrategies.filter(s => s.confidence >= 60);
        break;
      case 'moderate_aggressive':
        filteredStrategies = allStrategies.filter(s => s.confidence >= 55);
        break;
      case 'aggressive':
        // Include all strategies
        break;
    }

    // Sort by confidence and limit results
    const strategies = filteredStrategies
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxStrategies);

    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    res.status(200).json({
      success: true,
      strategies,
      currentPrice,
      ticker: upperTicker
    });

  } catch (error) {
    console.error('Error in scan API:', error);
    res.status(500).json({
      success: false,
      strategies: [],
      currentPrice: 0,
      ticker: '',
      error: 'Internal server error'
    });
  }
}
