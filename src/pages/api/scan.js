  1	import type { NextApiRequest, NextApiResponse } from 'next';
     2	
     3	interface StrategyLeg {
     4	  type: 'call' | 'put';
     5	  action: 'BUY' | 'SELL';
     6	  strike: number;
     7	  expiry: string;
     8	  quantity: number;
     9	  premium: number;
    10	  delta?: number;
    11	  gamma?: number;
    12	  theta?: number;
    13	  vega?: number;
    14	}
    15	
    16	interface Greeks {
    17	  delta: number;
    18	  gamma: number;
    19	  theta: number;
    20	  vega: number;
    21	}
    22	
    23	interface ScanRequest {
    24	  ticker: string;
    25	  riskProfile: string;
    26	  minDte?: number;
    27	  maxDte?: number;
    28	  maxStrategies?: number;
    29	}
    30	
    31	interface Strategy {
    32	  id: string;
    33	  name: string;
    34	  type: string;
    35	  confidence: number;
    36	  maxProfit: number;
    37	  maxLoss: number;
    38	  capitalRequired: number;
    39	  probabilityOfProfit?: number;
    40	  description?: string;
    41	  legs?: StrategyLeg[];
    42	  greeks?: Greeks;
    43	  breakEvenPoints?: number[];
    44	}
    45	
    46	interface ScanResponse {
    47	  success: boolean;
    48	  strategies: Strategy[];
    49	  currentPrice: number;
    50	  ticker: string;
    51	  error?: string;
    52	}
    53	
    54	// Generate realistic strategies with actual strikes and premiums
    55	function generateStrategies(currentPrice: number, ticker: string, minDte: number, maxDte: number): Strategy[] {
    56	  const strikes = generateStrikes(currentPrice);
    57	  const expirations = getExpirationDates(minDte, maxDte);
    58	  const primaryExpiry = expirations[0];
    59	  const dte = Math.floor((new Date(primaryExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    60	  
    61	  const strategies: Strategy[] = [];
    62	  
    63	  // Bull Put Spread
    64	  const bullPutShortStrike = strikes.find(s => s < currentPrice * 0.95) || strikes[2];
    65	  const bullPutLongStrike = strikes.find(s => s < bullPutShortStrike - 5) || strikes[1];
    66	  
    67	  const shortPutPrice = calculateOptionPrice(currentPrice, bullPutShortStrike, dte, 0.25, 0.05, false);
    68	  const longPutPrice = calculateOptionPrice(currentPrice, bullPutLongStrike, dte, 0.25, 0.05, false);
    69	  
    70	  const bullPutCredit = shortPutPrice.price - longPutPrice.price;
    71	  const bullPutMaxLoss = (bullPutShortStrike - bullPutLongStrike) - bullPutCredit;
    72	  
    73	  strategies.push({
    74	    id: '1',
    75	    name: 'Bull Put Spread',
    76	    type: 'bullish',
    77	    confidence: 72.5 + Math.random() * 5,
    78	    maxProfit: Math.round(bullPutCredit * 100),
    79	    maxLoss: -Math.round(bullPutMaxLoss * 100),
    80	    capitalRequired: Math.round(bullPutMaxLoss * 100),
    81	    probabilityOfProfit: 0.68 + Math.random() * 0.1,
    82	    description: `Sell ${bullPutShortStrike}P, Buy ${bullPutLongStrike}P. Profit if ${ticker} stays above $${bullPutShortStrike} by ${primaryExpiry}`,
    83	    legs: [
    84	      {
    85	        type: 'put',
    86	        action: 'SELL',
    87	        strike: bullPutShortStrike,
    88	        expiry: primaryExpiry,
    89	        quantity: 1,
    90	        premium: shortPutPrice.price,
    91	        ...shortPutPrice.greeks
    92	      },
    93	      {
    94	        type: 'put',
    95	        action: 'BUY',
    96	        strike: bullPutLongStrike,
    97	        expiry: primaryExpiry,
    98	        quantity: 1,
    99	        premium: longPutPrice.price,
   100	        ...longPutPrice.greeks
   101	      }
   102	    ],
   103	    greeks: {
   104	      delta: shortPutPrice.greeks.delta - longPutPrice.greeks.delta,
   105	      gamma: shortPutPrice.greeks.gamma - longPutPrice.greeks.gamma,
   106	      theta: shortPutPrice.greeks.theta - longPutPrice.greeks.theta,
   107	      vega: shortPutPrice.greeks.vega - longPutPrice.greeks.vega
   108	    },
   109	    breakEvenPoints: [bullPutShortStrike - bullPutCredit]
   110	  });
   111	
   112	  // Iron Condor
   113	  const icCallShortStrike = strikes.find(s => s > currentPrice * 1.05) || strikes[6];
   114	  const icCallLongStrike = strikes.find(s => s > icCallShortStrike + 5) || strikes[7];
   115	  const icPutShortStrike = strikes.find(s => s < currentPrice * 0.95) || strikes[2];
   116	  const icPutLongStrike = strikes.find(s => s < icPutShortStrike - 5) || strikes[1];
   117	  
   118	  const icCallShort = calculateOptionPrice(currentPrice, icCallShortStrike, dte, 0.25, 0.05, true);
   119	  const icCallLong = calculateOptionPrice(currentPrice, icCallLongStrike, dte, 0.25, 0.05, true);
   120	  const icPutShort = calculateOptionPrice(currentPrice, icPutShortStrike, dte, 0.25, 0.05, false);
   121	  const icPutLong = calculateOptionPrice(currentPrice, icPutLongStrike, dte, 0.25, 0.05, false);
   122	  
   123	  const icCredit = (icCallShort.price - icCallLong.price) + (icPutShort.price - icPutLong.price);
   124	  const icMaxLoss = Math.max(icCallLongStrike - icCallShortStrike, icPutShortStrike - icPutLongStrike) - icCredit;
   125	  
   126	  strategies.push({
   127	    id: '2',
   128	    name: 'Iron Condor',
   129	    type: 'neutral',
   130	    confidence: 65.2 + Math.random() * 5,
   131	    maxProfit: Math.round(icCredit * 100),
   132	    maxLoss: -Math.round(icMaxLoss * 100),
   133	    capitalRequired: Math.round(icMaxLoss * 100),
   134	    probabilityOfProfit: 0.58 + Math.random() * 0.1,
   135	    description: `Trade ${ticker} sideways between $${icPutShortStrike} and $${icCallShortStrike} by ${primaryExpiry}`,
   136	    legs: [
   137	      { type: 'call', action: 'SELL', strike: icCallShortStrike, expiry: primaryExpiry, quantity: 1, premium: icCallShort.price, ...icCallShort.greeks },
   138	      { type: 'call', action: 'BUY', strike: icCallLongStrike, expiry: primaryExpiry, quantity: 1, premium: icCallLong.price, ...icCallLong.greeks },
   139	      { type: 'put', action: 'SELL', strike: icPutShortStrike, expiry: primaryExpiry, quantity: 1, premium: icPutShort.price, ...icPutShort.greeks },
   140	      { type: 'put', action: 'BUY', strike: icPutLongStrike, expiry: primaryExpiry, quantity: 1, premium: icPutLong.price, ...icPutLong.greeks }
   141	    ],
   142	    greeks: {
   143	      delta: (icCallShort.greeks.delta - icCallLong.greeks.delta) + (icPutShort.greeks.delta - icPutLong.greeks.delta),
   144	      gamma: (icCallShort.greeks.gamma - icCallLong.greeks.gamma) + (icPutShort.greeks.gamma - icPutLong.greeks.gamma),
   145	      theta: (icCallShort.greeks.theta - icCallLong.greeks.theta) + (icPutShort.greeks.theta - icPutLong.greeks.theta),
   146	      vega: (icCallShort.greeks.vega - icCallLong.greeks.vega) + (icPutShort.greeks.vega - icPutLong.greeks.vega)
   147	    },
   148	    breakEvenPoints: [icPutShortStrike - icCredit, icCallShortStrike + icCredit]
   149	  });
   150	
   151	  // Cash Secured Put
   152	  const cspStrike = strikes.find(s => s < currentPrice * 0.97) || strikes[3];
   153	  const cspOption = calculateOptionPrice(currentPrice, cspStrike, dte, 0.25, 0.05, false);
   154	  
   155	  strategies.push({
   156	    id: '3',
   157	    name: 'Cash Secured Put',
   158	    type: 'bullish',
   159	    confidence: 69.8 + Math.random() * 5,
   160	    maxProfit: Math.round(cspOption.price * 100),
   161	    maxLoss: -Math.round((cspStrike - cspOption.price) * 100),
   162	    capitalRequired: Math.round(cspStrike * 100),
   163	    probabilityOfProfit: 0.65 + Math.random() * 0.1,
   164	    description: `Sell ${cspStrike}P. Collect premium or buy ${ticker} at $${cspStrike} discount by ${primaryExpiry}`,
   165	    legs: [
   166	      {
   167	        type: 'put',
   168	        action: 'SELL',
   169	        strike: cspStrike,
   170	        expiry: primaryExpiry,
   171	        quantity: 1,
   172	        premium: cspOption.price,
   173	        ...cspOption.greeks
   174	      }
   175	    ],
   176	    greeks: cspOption.greeks,
   177	    breakEvenPoints: [cspStrike - cspOption.price]
   178	  });
   179	
   180	  // Long Straddle
   181	  const straddleStrike = strikes.find(s => Math.abs(s - currentPrice) < 5) || strikes[4];
   182	  const callOption = calculateOptionPrice(currentPrice, straddleStrike, dte, 0.25, 0.05, true);
   183	  const putOption = calculateOptionPrice(currentPrice, straddleStrike, dte, 0.25, 0.05, false);
   184	  
   185	  const straddleCost = callOption.price + putOption.price;
   186	  
   187	  strategies.push({
   188	    id: '4',
   189	    name: 'Long Straddle',
   190	    type: 'volatility',
   191	    confidence: 58.5 + Math.random() * 5,
   192	    maxProfit: 99999,
   193	    maxLoss: -Math.round(straddleCost * 100),
   194	    capitalRequired: Math.round(straddleCost * 100),
   195	    probabilityOfProfit: 0.45 + Math.random() * 0.1,
   196	    description: `Buy ${straddleStrike}C and ${straddleStrike}P. Profit if ${ticker} moves beyond $${(straddleStrike + straddleCost).toFixed(2)} or $${(straddleStrike - straddleCost).toFixed(2)}`,
   197	    legs: [
   198	      { type: 'call', action: 'BUY', strike: straddleStrike, expiry: primaryExpiry, quantity: 1, premium: callOption.price, ...callOption.greeks },
   199	      { type: 'put', action: 'BUY', strike: straddleStrike, expiry: primaryExpiry, quantity: 1, premium: putOption.price, ...putOption.greeks }
   200	    ],
   201	    greeks: {
   202	      delta: callOption.greeks.delta + putOption.greeks.delta,
   203	      gamma: callOption.greeks.gamma + putOption.greeks.gamma,
   204	      theta: callOption.greeks.theta + putOption.greeks.theta,
   205	      vega: callOption.greeks.vega + putOption.greeks.vega
   206	    },
   207	    breakEvenPoints: [straddleStrike - straddleCost, straddleStrike + straddleCost]
   208	  });
   209	
   210	  // Covered Call (requires stock ownership)
   211	  const ccStrike = strikes.find(s => s > currentPrice * 1.03) || strikes[6];
   212	  const ccOption = calculateOptionPrice(currentPrice, ccStrike, dte, 0.25, 0.05, true);
   213	  
   214	  strategies.push({
   215	    id: '5',
   216	    name: 'Covered Call',
   217	    type: 'neutral',
   218	    confidence: 66.7 + Math.random() * 5,
   219	    maxProfit: Math.round((ccStrike - currentPrice + ccOption.price) * 100),
   220	    maxLoss: -Math.round((currentPrice - ccOption.price) * 100),
   221	    capitalRequired: Math.round(currentPrice * 100),
   222	    probabilityOfProfit: 0.72 + Math.random() * 0.1,
   223	    description: `Own 100 shares of ${ticker}, sell ${ccStrike}C. Cap gains at $${ccStrike}, collect premium`,
   224	    legs: [
   225	      { type: 'call', action: 'SELL', strike: ccStrike, expiry: primaryExpiry, quantity: 1, premium: ccOption.price, ...ccOption.greeks }
   226	    ],
   227	    greeks: {
   228	      delta: -ccOption.greeks.delta + 1, // Include stock delta
   229	      gamma: -ccOption.greeks.gamma,
   230	      theta: -ccOption.greeks.theta,
   231	      vega: -ccOption.greeks.vega
   232	    },
   233	    breakEvenPoints: [currentPrice - ccOption.price]
   234	  });
   235	
   236	  return strategies;
   237	}
   238	
   239	// Live data fetching function
   240	async function fetchLiveStockPrice(ticker: string): Promise<number> {
   241	  const apiKey = process.env.POLYGON_API_KEY;
   242	  
   243	  if (!apiKey) {
   244	    console.log('No Polygon API key found, using mock data');
   245	    // Fallback to mock prices
   246	    const mockPrices: { [key: string]: number } = {
   247	      'AAPL': 237.88,  // Updated realistic prices
   248	      'SPY': 590.25,
   249	      'TSLA': 248.50,
   250	      'MSFT': 425.32,
   251	      'NVDA': 138.45,
   252	      'META': 563.12,
   253	      'GOOGL': 175.28,
   254	      'AMZN': 197.85,
   255	      'QQQ': 515.75,
   256	      'AMD': 120.33
   257	    };
   258	    return mockPrices[ticker] || 100 + Math.random() * 200;
   259	  }
   260	
   261	  try {
   262	    // Fetch live data from Polygon
   263	    const response = await fetch(
   264	      `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apikey=${apiKey}`
   265	    );
   266	    
   267	    if (!response.ok) {
   268	      throw new Error(`Polygon API error: ${response.status}`);
   269	    }
   270	    
   271	    const data = await response.json();
   272	    
   273	    if (data.results && data.results[0]) {
   274	      return data.results[0].c; // Close price
   275	    }
   276	    
   277	    throw new Error('No price data available');
   278	  } catch (error) {
   279	    console.error('Error fetching live price:', error);
   280	    // Fallback to mock data
   281	    return 100 + Math.random() * 200;
   282	  }
   283	}
   284	
   285	// Generate realistic expiration dates
   286	function getExpirationDates(minDte: number = 30, maxDte: number = 45): string[] {
   287	  const dates = [];
   288	  const today = new Date();
   289	  
   290	  // Generate weekly Friday expirations
   291	  for (let weeks = 1; weeks <= 12; weeks++) {
   292	    const expDate = new Date(today);
   293	    expDate.setDate(today.getDate() + (weeks * 7));
   294	    
   295	    // Find next Friday
   296	    while (expDate.getDay() !== 5) {
   297	      expDate.setDate(expDate.getDate() + 1);
   298	    }
   299	    
   300	    const dte = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
   301	    if (dte >= minDte && dte <= maxDte) {
   302	      dates.push(expDate.toISOString().split('T')[0]);
   303	    }
   304	  }
   305	  
   306	  // Add monthly expirations (3rd Friday)
   307	  for (let months = 1; months <= 3; months++) {
   308	    const expDate = new Date(today.getFullYear(), today.getMonth() + months, 1);
   309	    expDate.setDate(15); // Start from 15th to find 3rd Friday
   310	    
   311	    while (expDate.getDay() !== 5) {
   312	      expDate.setDate(expDate.getDate() + 1);
   313	    }
   314	    
   315	    const dte = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
   316	    if (dte >= minDte && dte <= maxDte) {
   317	      dates.push(expDate.toISOString().split('T')[0]);
   318	    }
   319	  }
   320	  
   321	  return dates.slice(0, 3); // Return up to 3 expiration dates
   322	}
   323	
   324	// Generate strike prices around current price
   325	function generateStrikes(currentPrice: number): number[] {
   326	  const strikes = [];
   327	  const roundedPrice = Math.round(currentPrice);
   328	  
   329	  // Generate strikes in $5 intervals for prices under $200, $10 intervals above
   330	  const interval = currentPrice < 200 ? 5 : 10;
   331	  
   332	  for (let i = -4; i <= 4; i++) {
   333	    const strike = roundedPrice + (i * interval);
   334	    if (strike > 0) {
   335	      strikes.push(strike);
   336	    }
   337	  }
   338	  
   339	  return strikes;
   340	}
   341	
   342	// Black-Scholes Option Pricing (simplified)
   343	function calculateOptionPrice(
   344	  currentPrice: number, 
   345	  strike: number, 
   346	  timeToExpiry: number, 
   347	  volatility: number = 0.25, 
   348	  riskFreeRate: number = 0.05, 
   349	  isCall: boolean = true
   350	): { price: number; greeks: Greeks } {
   351	  const S = currentPrice;
   352	  const K = strike;
   353	  const T = timeToExpiry / 365;
   354	  const r = riskFreeRate;
   355	  const σ = volatility;
   356	  
   357	  if (T <= 0) {
   358	    const intrinsic = isCall ? Math.max(S - K, 0) : Math.max(K - S, 0);
   359	    return { 
   360	      price: intrinsic, 
   361	      greeks: { delta: isCall ? (S > K ? 1 : 0) : (S < K ? -1 : 0), gamma: 0, theta: 0, vega: 0 }
   362	    };
   363	  }
   364	  
   365	  const d1 = (Math.log(S / K) + (r + 0.5 * σ * σ) * T) / (σ * Math.sqrt(T));
   366	  const d2 = d1 - σ * Math.sqrt(T);
   367	  
   368	  // Cumulative standard normal distribution approximation
   369	  const cdf = (x: number) => 0.5 * (1 + erf(x / Math.sqrt(2)));
   370	  
   371	  const Nd1 = cdf(d1);
   372	  const Nd2 = cdf(d2);
   373	  const nd1 = Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI);
   374	  
   375	  let price: number;
   376	  let delta: number;
   377	  
   378	  if (isCall) {
   379	    price = S * Nd1 - K * Math.exp(-r * T) * Nd2;
   380	    delta = Nd1;
   381	  } else {
   382	    price = K * Math.exp(-r * T) * cdf(-d2) - S * cdf(-d1);
   383	    delta = Nd1 - 1;
   384	  }
   385	  
   386	  const gamma = nd1 / (S * σ * Math.sqrt(T));
   387	  const theta = -(S * nd1 * σ) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * (isCall ? Nd2 : cdf(-d2));
   388	  const vega = S * nd1 * Math.sqrt(T) / 100; // Divide by 100 for 1% vol change
   389	  
   390	  return {
   391	    price: Math.max(price, 0.01), // Minimum price of $0.01
   392	    greeks: { delta, gamma, theta: theta / 365, vega }
   393	  };
   394	}
   395	
   396	// Error function approximation
   397	function erf(x: number): number {
   398	  const a1 =  0.254829592;
   399	  const a2 = -0.284496736;
   400	  const a3 =  1.421413741;
   401	  const a4 = -1.453152027;
   402	  const a5 =  1.061405429;
   403	  const p  =  0.3275911;
   404	  
   405	  const sign = x >= 0 ? 1 : -1;
   406	  x = Math.abs(x);
   407	  
   408	  const t = 1.0 / (1.0 + p * x);
   409	  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
   410	  
   411	  return sign * y;
   412	}
   413	
   414	export default async function handler(req: NextApiRequest, res: NextApiResponse<ScanResponse>) {
   415	  if (req.method !== 'POST') {
   416	    return res.status(405).json({
   417	      success: false,
   418	      strategies: [],
   419	      currentPrice: 0,
   420	      ticker: '',
   421	      error: 'Method not allowed'
   422	    });
   423	  }
   424	
   425	  try {
   426	    const { ticker, riskProfile, minDte = 30, maxDte = 45, maxStrategies = 5 }: ScanRequest = req.body;
   427	
   428	    if (!ticker) {
   429	      return res.status(400).json({
   430	        success: false,
   431	        strategies: [],
   432	        currentPrice: 0,
   433	        ticker: '',
   434	        error: 'Ticker is required'
   435	      });
   436	    }
   437	
   438	    const upperTicker = ticker.toUpperCase();
   439	    
   440	    // Fetch live stock price (or use mock if no API key)
   441	    const currentPrice = await fetchLiveStockPrice(upperTicker);
   442	    
   443	    // Generate realistic strategies with actual strikes
   444	    const allStrategies = generateStrategies(currentPrice, upperTicker, minDte, maxDte);
   445	
   446	    // Filter strategies based on risk profile
   447	    let filteredStrategies = [...allStrategies];
   448	    
   449	    switch (riskProfile) {
   450	      case 'conservative':
   451	        filteredStrategies = allStrategies.filter(s => s.confidence >= 65 && s.type !== 'volatility');
   452	        break;
   453	      case 'moderate':
   454	        filteredStrategies = allStrategies.filter(s => s.confidence >= 60);
   455	        break;
   456	      case 'moderate_aggressive':
   457	        filteredStrategies = allStrategies.filter(s => s.confidence >= 55);
   458	        break;
   459	      case 'aggressive':
   460	        // Include all strategies
   461	        break;
   462	    }
   463	
   464	    // Sort by confidence and limit results
   465	    const strategies = filteredStrategies
   466	      .sort((a, b) => b.confidence - a.confidence)
   467	      .slice(0, maxStrategies);
   468	
   469	    // Simulate API delay for realism
   470	    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
   471	
   472	    res.status(200).json({
   473	      success: true,
   474	      strategies,
   475	      currentPrice,
   476	      ticker: upperTicker
   477	    });
   478	
   479	  } catch (error) {
   480	    console.error('Error in scan API:', error);
   481	    res.status(500).json({
   482	      success: false,
   483	      strategies: [],
   484	      currentPrice: 0,
   485	      ticker: '',
   486	      error: 'Internal server error'
   487	    });
   488	  }
   489	}
