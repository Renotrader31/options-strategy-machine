   1	import React, { useState } from 'react';
     2	import { motion } from 'framer-motion';
     3	import { 
     4	  ArrowTrendingUpIcon as TrendingUpIcon, 
     5	  ArrowTrendingDownIcon as TrendingDownIcon, 
     6	  MinusIcon,
     7	  CurrencyDollarIcon,
     8	  ExclamationTriangleIcon,
     9	  ChevronDownIcon,
    10	  ChevronUpIcon,
    11	  CalendarIcon,
    12	  BoltIcon
    13	} from '@heroicons/react/24/outline';
    14	import { Strategy } from '@/types/strategy';
    15	
    16	interface StrategyCardProps {
    17	  strategy: Strategy;
    18	  rank: number;
    19	  confidenceColor: string;
    20	  confidenceIcon: React.ReactNode;
    21	}
    22	
    23	export default function StrategyCard({ strategy, rank, confidenceColor, confidenceIcon }: StrategyCardProps) {
    24	  const [isExpanded, setIsExpanded] = useState(false);
    25	
    26	  const getStrategyTypeIcon = (type: string) => {
    27	    switch (type.toLowerCase()) {
    28	      case 'bullish':
    29	        return <TrendingUpIcon className="w-4 h-4 text-emerald-600" />;
    30	      case 'bearish':
    31	        return <TrendingDownIcon className="w-4 h-4 text-red-600" />;
    32	      case 'neutral':
    33	        return <MinusIcon className="w-4 h-4 text-blue-600" />;
    34	      case 'volatility':
    35	        return <BoltIcon className="w-4 h-4 text-purple-600" />;
    36	      default:
    37	        return <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" />;
    38	    }
    39	  };
    40	
    41	  const getStrategyTypeColor = (type: string) => {
    42	    switch (type.toLowerCase()) {
    43	      case 'bullish':
    44	        return 'text-emerald-600 bg-emerald-50';
    45	      case 'bearish':
    46	        return 'text-red-600 bg-red-50';
    47	      case 'neutral':
    48	        return 'text-blue-600 bg-blue-50';
    49	      case 'volatility':
    50	        return 'text-purple-600 bg-purple-50';
    51	      default:
    52	        return 'text-amber-600 bg-amber-50';
    53	    }
    54	  };
    55	
    56	  const formatCurrency = (amount: number) => {
    57	    if (Math.abs(amount) >= 1000) {
    58	      return `$${(amount / 1000).toFixed(1)}k`;
    59	    }
    60	    return `$${Math.abs(amount).toFixed(0)}`;
    61	  };
    62	
    63	  return (
    64	    <motion.div
    65	      layout
    66	      whileHover={{ y: -2 }}
    67	      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200"
    68	    >
    69	      {/* Compact Header */}
    70	      <div className="p-4 border-b border-slate-100">
    71	        <div className="flex items-center justify-between">
    72	          <div className="flex items-center space-x-3">
    73	            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
    74	              #{rank}
    75	            </div>
    76	            <div>
    77	              <h3 className="font-semibold text-slate-900 text-sm leading-tight">
    78	                {strategy.name}
    79	              </h3>
    80	              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStrategyTypeColor(strategy.type)}`}>
    81	                {getStrategyTypeIcon(strategy.type)}
    82	                <span className="ml-1 capitalize">{strategy.type}</span>
    83	              </div>
    84	            </div>
    85	          </div>
    86	
    87	          <div className="text-right">
    88	            <div className="flex items-center space-x-1">
    89	              <div className="w-3 h-3">{confidenceIcon}</div>
    90	              <span className={`font-bold text-sm ${confidenceColor}`}>
    91	                {strategy.confidence.toFixed(0)}%
    92	              </span>
    93	            </div>
    94	            <span className="text-xs text-slate-400">Score</span>
    95	          </div>
    96	        </div>
    97	      </div>
    98	
    99	      {/* Compact Metrics */}
   100	      <div className="p-4">
   101	        <div className="grid grid-cols-3 gap-3 text-center">
   102	          <div>
   103	            <div className="text-emerald-600 font-bold text-sm">
   104	              {formatCurrency(strategy.maxProfit)}
   105	            </div>
   106	            <div className="text-xs text-slate-500">Max Profit</div>
   107	          </div>
   108	          <div>
   109	            <div className="text-red-600 font-bold text-sm">
   110	              {formatCurrency(strategy.maxLoss)}
   111	            </div>
   112	            <div className="text-xs text-slate-500">Max Loss</div>
   113	          </div>
   114	          <div>
   115	            <div className="text-blue-600 font-bold text-sm">
   116	              {formatCurrency(strategy.capitalRequired)}
   117	            </div>
   118	            <div className="text-xs text-slate-500">Capital</div>
   119	          </div>
   120	        </div>
   121	
   122	        {/* Quick Stats Row */}
   123	        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
   124	          <div className="flex items-center space-x-4 text-xs text-slate-600">
   125	            {strategy.probabilityOfProfit && (
   126	              <div className="flex items-center space-x-1">
   127	                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
   128	                <span>{(strategy.probabilityOfProfit * 100).toFixed(0)}% PoP</span>
   129	              </div>
   130	            )}
   131	            <div className="flex items-center space-x-1">
   132	              <CalendarIcon className="w-3 h-3" />
   133	              <span>30-45 DTE</span>
   134	            </div>
   135	          </div>
   136	
   137	          <motion.button
   138	            whileHover={{ scale: 1.05 }}
   139	            whileTap={{ scale: 0.95 }}
   140	            onClick={() => setIsExpanded(!isExpanded)}
   141	            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
   142	          >
   143	            <span>{isExpanded ? 'Less' : 'More'}</span>
   144	            {isExpanded ? 
   145	              <ChevronUpIcon className="w-3 h-3" /> : 
   146	              <ChevronDownIcon className="w-3 h-3" />
   147	            }
   148	          </motion.button>
   149	        </div>
   150	      </div>
   151	
   152	      {/* Expandable Details */}
   153	      <motion.div
   154	        initial={false}
   155	        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
   156	        transition={{ duration: 0.2 }}
   157	        className="overflow-hidden bg-slate-50"
   158	      >
   159	        <div className="p-4 space-y-3">
   160	          {/* Strategy Description */}
   161	          {strategy.description && (
   162	            <div>
   163	              <div className="text-xs font-medium text-slate-700 mb-1">Strategy Overview</div>
   164	              <p className="text-xs text-slate-600 leading-relaxed">
   165	                {strategy.description}
   166	              </p>
   167	            </div>
   168	          )}
   169	
   170	          {/* Options Legs */}
   171	          {strategy.legs && strategy.legs.length > 0 && (
   172	            <div>
   173	              <div className="text-xs font-medium text-slate-700 mb-2">Options Legs</div>
   174	              <div className="space-y-2">
   175	                {strategy.legs.map((leg, index) => (
   176	                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg text-xs">
   177	                    <div className="flex items-center space-x-2">
   178	                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
   179	                        leg.action === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
   180	                      }`}>
   181	                        {leg.action}
   182	                      </span>
   183	                      <span className="font-medium">{leg.type}</span>
   184	                      <span className="text-slate-500">${leg.strike}</span>
   185	                    </div>
   186	                    <div className="text-right">
   187	                      <div className="font-medium">${leg.premium?.toFixed(2) || '0.00'}</div>
   188	                      <div className="text-xs text-slate-400">Premium</div>
   189	                    </div>
   190	                  </div>
   191	                ))}
   192	              </div>
   193	            </div>
   194	          )}
   195	
   196	          {/* Greeks */}
   197	          {strategy.greeks && (
   198	            <div>
   199	              <div className="text-xs font-medium text-slate-700 mb-2">Greeks</div>
   200	              <div className="grid grid-cols-4 gap-2 text-xs">
   201	                <div className="text-center">
   202	                  <div className="font-medium text-slate-900">{strategy.greeks.delta?.toFixed(2) || '0.00'}</div>
   203	                  <div className="text-slate-500">Delta</div>
   204	                </div>
   205	                <div className="text-center">
   206	                  <div className="font-medium text-slate-900">{strategy.greeks.gamma?.toFixed(3) || '0.000'}</div>
   207	                  <div className="text-slate-500">Gamma</div>
   208	                </div>
   209	                <div className="text-center">
   210	                  <div className="font-medium text-slate-900">{strategy.greeks.theta?.toFixed(2) || '0.00'}</div>
   211	                  <div className="text-slate-500">Theta</div>
   212	                </div>
   213	                <div className="text-center">
   214	                  <div className="font-medium text-slate-900">{strategy.greeks.vega?.toFixed(2) || '0.00'}</div>
   215	                  <div className="text-slate-500">Vega</div>
   216	                </div>
   217	              </div>
   218	            </div>
   219	          )}
   220	
   221	          {/* Action Button */}
   222	          <motion.button
   223	            whileHover={{ scale: 1.02 }}
   224	            whileTap={{ scale: 0.98 }}
   225	            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg text-xs font-semibold hover:shadow-md transition-all duration-200"
   226	          >
   227	            <CurrencyDollarIcon className="w-4 h-4 mr-1.5 inline" />
   228	            Execute Strategy
   229	          </motion.button>
   230	        </div>
   231	      </motion.div>
   232	    </motion.div>
   233	  );
   234	}
