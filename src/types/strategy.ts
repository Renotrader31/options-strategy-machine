 1	// Strategy and API types for the Options Strategy Generator
     2	
     3	export interface Strategy {
     4	  id?: string;
     5	  name: string;
     6	  type: 'bullish' | 'bearish' | 'neutral' | 'volatility';
     7	  complexity: 'beginner' | 'intermediate' | 'advanced';
     8	  confidence: number;
     9	  maxProfit: number;
    10	  maxLoss: number;
    11	  capitalRequired: number;
    12	  probabilityOfProfit?: number;
    13	  breakEvenPoints?: number[];
    14	  description?: string;
    15	  legs?: StrategyLeg[];
    16	  timeDecay?: number;
    17	  volatilityImpact?: number;
    18	  currentPrice?: number;
    19	  ticker?: string;
    20	}
    21	
    22	export interface StrategyLeg {
    23	  type: 'call' | 'put' | 'stock';
    24	  action: 'buy' | 'sell';
    25	  strike?: number;
    26	  expiry?: string;
    27	  quantity: number;
    28	  premium?: number;
    29	  delta?: number;
    30	  gamma?: number;
    31	  theta?: number;
    32	  vega?: number;
    33	}
    34	
    35	export interface ScanRequest {
    36	  ticker: string;
    37	  riskProfile: 'conservative' | 'moderate' | 'moderate_aggressive' | 'aggressive';
    38	  minDte?: number;
    39	  maxDte?: number;
    40	  maxStrategies?: number;
    41	  maxCapital?: number;
    42	  preferredPop?: number; // Probability of Profit
    43	}
    44	
    45	export interface ScanResponse {
    46	  success: boolean;
    47	  strategies: Strategy[];
    48	  currentPrice?: number;
    49	  ticker: string;
    50	  error?: string;
    51	  timestamp?: string;
    52	}
    53	
    54	export interface StockData {
    55	  ticker: string;
    56	  price: number;
    57	  change: number;
    58	  changePercent: number;
    59	  volume: number;
    60	  high: number;
    61	  low: number;
    62	  marketCap?: number;
    63	  peRatio?: number;
    64	  impliedVolatility?: number;
    65	}
    66	
    67	export interface OptionsChain {
    68	  ticker: string;
    69	  expiry: string;
    70	  calls: OptionsContract[];
    71	  puts: OptionsContract[];
    72	}
    73	
    74	export interface OptionsContract {
    75	  strike: number;
    76	  bid: number;
    77	  ask: number;
    78	  last: number;
    79	  volume: number;
    80	  openInterest: number;
    81	  impliedVolatility: number;
    82	  delta: number;
    83	  gamma: number;
    84	  theta: number;
    85	  vega: number;
    86	  rho: number;
    87	  intrinsicValue: number;
    88	  timeValue: number;
    89	}
    90	
    91	export interface RiskProfile {
    92	  name: string;
    93	  description: string;
    94	  maxCapitalPerTrade: number;
    95	  preferredPop: number; // 0.0 to 1.0
    96	  volatilityTolerance: 'low' | 'medium' | 'high';
    97	  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
    98	  strategyPreferences: string[];
    99	}
   100	
   101	export interface MarketCondition {
   102	  trend: 'bullish' | 'bearish' | 'sideways';
   103	  volatility: 'low' | 'medium' | 'high';
   104	  ivPercentile: number;
   105	  volume: 'low' | 'medium' | 'high';
   106	}
   107	
   108	export interface BacktestResult {
   109	  strategy: string;
   110	  ticker: string;
   111	  startDate: string;
   112	  endDate: string;
   113	  totalTrades: number;
   114	  winRate: number;
   115	  avgReturn: number;
   116	  maxDrawdown: number;
   117	  sharpeRatio: number;
   118	  profitFactor: number;
   119	}
   120	
   121	export interface ApiError {
   122	  error: string;
   123	  code?: string;
   124	  details?: any;
   125	}
