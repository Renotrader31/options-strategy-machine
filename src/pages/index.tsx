1	import React, { useState, useEffect } from 'react';
     2	import { motion, AnimatePresence } from 'framer-motion';
     3	import { 
     4	  ArrowTrendingUpIcon as TrendingUpIcon, 
     5	  ChartBarIcon, 
     6	  CurrencyDollarIcon,
     7	  ArrowPathIcon,
     8	  ExclamationTriangleIcon,
     9	  CheckCircleIcon
    10	} from '@heroicons/react/24/outline';
    11	import { toast } from 'react-hot-toast';
    12	
    13	import StrategyCard from '@/components/StrategyCard';
    14	import SearchForm from '@/components/SearchForm';
    15	import LoadingSpinner from '@/components/LoadingSpinner';
    16	import { Strategy, ScanRequest } from '@/types/strategy';
    17	
    18	export default function HomePage() {
    19	  const [strategies, setStrategies] = useState<Strategy[]>([]);
    20	  const [loading, setLoading] = useState(false);
    21	  const [currentTicker, setCurrentTicker] = useState('');
    22	  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    23	
    24	  const handleScan = async (request: ScanRequest) => {
    25	    setLoading(true);
    26	    setCurrentTicker(request.ticker);
    27	
    28	    try {
    29	      const response = await fetch('/api/scan', {
    30	        method: 'POST',
    31	        headers: {
    32	          'Content-Type': 'application/json',
    33	        },
    34	        body: JSON.stringify(request),
    35	      });
    36	
    37	      if (!response.ok) {
    38	        throw new Error(`HTTP error! status: ${response.status}`);
    39	      }
    40	
    41	      const data = await response.json();
    42	
    43	      if (data.success) {
    44	        setStrategies(data.strategies);
    45	        setCurrentPrice(data.currentPrice);
    46	        toast.success(`Found ${data.strategies.length} strategies for ${request.ticker}`);
    47	      } else {
    48	        throw new Error(data.error || 'Failed to fetch strategies');
    49	      }
    50	    } catch (error) {
    51	      console.error('Error scanning strategies:', error);
    52	      toast.error('Failed to fetch strategies. Please try again.');
    53	      setStrategies([]);
    54	      setCurrentPrice(null);
    55	    } finally {
    56	      setLoading(false);
    57	    }
    58	  };
    59	
    60	  const getConfidenceColor = (confidence: number) => {
    61	    if (confidence >= 70) return 'text-green-600';
    62	    if (confidence >= 50) return 'text-yellow-600';
    63	    return 'text-red-600';
    64	  };
    65	
    66	  const getConfidenceIcon = (confidence: number) => {
    67	    if (confidence >= 70) return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    68	    if (confidence >= 50) return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
    69	    return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
    70	  };
    71	
    72	  return (
    73	    <div className="min-h-screen bg-slate-50 bg-grid-pattern">
    74	      {/* Header */}
    75	      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
    76	        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    77	          <div className="flex items-center justify-between h-20">
    78	            <div className="flex items-center space-x-4">
    79	              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
    80	                <TrendingUpIcon className="h-7 w-7 text-white" />
    81	              </div>
    82	              <div>
    83	                <h1 className="text-2xl font-bold text-slate-900">
    84	                  Options Strategy Generator
    85	                </h1>
    86	                <p className="text-sm text-slate-500 font-medium">
    87	                  AI-Powered Options Analysis
    88	                </p>
    89	              </div>
    90	            </div>
    91	            <div className="flex items-center space-x-4">
    92	              <div className="hidden sm:flex items-center px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
    93	                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
    94	                <span className="text-xs font-medium text-emerald-700">Live Data</span>
    95	              </div>
    96	              <span className="text-sm text-slate-400 font-medium">
    97	                Powered by Polygon API
    98	              </span>
    99	            </div>
   100	          </div>
   101	        </div>
   102	      </header>
   103	
   104	      {/* Main Content */}
   105	      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
   106	        {/* Hero Section */}
   107	        <motion.div
   108	          initial={{ opacity: 0, y: 20 }}
   109	          animate={{ opacity: 1, y: 0 }}
   110	          transition={{ duration: 0.6 }}
   111	          className="text-center mb-12"
   112	        >
   113	          <h2 className="text-4xl font-bold text-slate-900 mb-4">
   114	            Find Your Perfect 
   115	            <span className="text-gradient"> Options Strategy</span>
   116	          </h2>
   117	          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
   118	            Discover AI-powered options strategies tailored to your risk profile with real-time market analysis
   119	          </p>
   120	          <div className="mt-4">
   121	            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
   122	              ✨ Updated Design & Fixed APIs
   123	            </span>
   124	          </div>
   125	        </motion.div>
   126	
   127	        {/* Search Section */}
   128	        <motion.div
   129	          initial={{ opacity: 0, y: 20 }}
   130	          animate={{ opacity: 1, y: 0 }}
   131	          transition={{ duration: 0.5, delay: 0.2 }}
   132	          className="mb-12"
   133	        >
   134	          <div className="card-elevated p-8">
   135	            <SearchForm onScan={handleScan} loading={loading} />
   136	          </div>
   137	        </motion.div>
   138	
   139	        {/* Current Stock Info */}
   140	        <AnimatePresence>
   141	          {currentTicker && currentPrice && (
   142	            <motion.div
   143	              initial={{ opacity: 0, y: 10 }}
   144	              animate={{ opacity: 1, y: 0 }}
   145	              exit={{ opacity: 0, y: -10 }}
   146	              className="mb-8"
   147	            >
   148	              <div className="card p-6">
   149	                <div className="flex items-center justify-between">
   150	                  <div className="flex items-center space-x-4">
   151	                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
   152	                      <ChartBarIcon className="h-6 w-6 text-white" />
   153	                    </div>
   154	                    <div>
   155	                      <h3 className="text-2xl font-bold text-slate-900">{currentTicker}</h3>
   156	                      <p className="text-sm text-slate-500 font-medium">Current Analysis</p>
   157	                    </div>
   158	                  </div>
   159	                  <div className="text-right">
   160	                    <div className="flex items-baseline space-x-1">
   161	                      <span className="text-3xl font-bold text-slate-900">
   162	                        ${currentPrice.toFixed(2)}
   163	                      </span>
   164	                      <CurrencyDollarIcon className="h-5 w-5 text-slate-400" />
   165	                    </div>
   166	                    <div className="flex items-center justify-end mt-1">
   167	                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
   168	                      <span className="text-sm text-slate-500 font-medium">Real-time</span>
   169	                    </div>
   170	                  </div>
   171	                </div>
   172	              </div>
   173	            </motion.div>
   174	          )}
   175	        </AnimatePresence>
   176	
   177	        {/* Loading State */}
   178	        <AnimatePresence>
   179	          {loading && (
   180	            <motion.div
   181	              initial={{ opacity: 0, scale: 0.9 }}
   182	              animate={{ opacity: 1, scale: 1 }}
   183	              exit={{ opacity: 0, scale: 0.9 }}
   184	              className="card p-12 text-center"
   185	            >
   186	              <div className="flex flex-col items-center space-y-4">
   187	                <div className="relative">
   188	                  <LoadingSpinner />
   189	                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
   190	                </div>
   191	                <div>
   192	                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
   193	                    Analyzing Strategies
   194	                  </h3>
   195	                  <p className="text-slate-600">
   196	                    Finding the best options strategies for <span className="font-semibold text-blue-600">{currentTicker}</span>...
   197	                  </p>
   198	                </div>
   199	              </div>
   200	            </motion.div>
   201	          )}
   202	        </AnimatePresence>
   203	
   204	        {/* Strategies Grid */}
   205	        <AnimatePresence>
   206	          {strategies.length > 0 && !loading && (
   207	            <motion.div
   208	              initial={{ opacity: 0 }}
   209	              animate={{ opacity: 1 }}
   210	              exit={{ opacity: 0 }}
   211	              className="space-y-8"
   212	            >
   213	              <div className="flex items-center justify-between">
   214	                <div>
   215	                  <h3 className="text-2xl font-bold text-slate-900">
   216	                    Recommended Strategies
   217	                  </h3>
   218	                  <p className="text-slate-600 mt-1">
   219	                    {strategies.length} strategies found, ranked by confidence score
   220	                  </p>
   221	                </div>
   222	                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
   223	                  <ArrowPathIcon className="h-4 w-4 text-blue-600" />
   224	                  <span className="text-sm font-medium text-blue-700">AI Ranked</span>
   225	                </div>
   226	              </div>
   227	
   228	              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
   229	                {strategies.map((strategy, index) => (
   230	                  <motion.div
   231	                    key={strategy.id || index}
   232	                    initial={{ opacity: 0, y: 20 }}
   233	                    animate={{ opacity: 1, y: 0 }}
   234	                    transition={{ duration: 0.4, delay: index * 0.1 }}
   235	                  >
   236	                    <StrategyCard 
   237	                      strategy={strategy} 
   238	                      rank={index + 1}
   239	                      confidenceColor={getConfidenceColor(strategy.confidence)}
   240	                      confidenceIcon={getConfidenceIcon(strategy.confidence)}
   241	                    />
   242	                  </motion.div>
   243	                ))}
   244	              </div>
   245	            </motion.div>
   246	          )}
   247	        </AnimatePresence>
   248	
   249	        {/* Empty State */}
   250	        {!loading && strategies.length === 0 && currentTicker && (
   251	          <motion.div
   252	            initial={{ opacity: 0, scale: 0.95 }}
   253	            animate={{ opacity: 1, scale: 1 }}
   254	            className="card p-12 text-center"
   255	          >
   256	            <div className="p-4 bg-amber-100 rounded-2xl w-fit mx-auto mb-6">
   257	              <ExclamationTriangleIcon className="h-12 w-12 text-amber-600" />
   258	            </div>
   259	            <h3 className="text-xl font-bold text-slate-900 mb-3">
   260	              No Strategies Found
   261	            </h3>
   262	            <p className="text-slate-600 mb-6 max-w-md mx-auto">
   263	              No viable strategies found for <span className="font-semibold text-blue-600">{currentTicker}</span>. 
   264	              Try a different ticker or adjust your risk parameters.
   265	            </p>
   266	            <button 
   267	              onClick={() => {
   268	                setCurrentTicker('');
   269	                setStrategies([]);
   270	                setCurrentPrice(null);
   271	              }}
   272	              className="btn-secondary"
   273	            >
   274	              Search Another Ticker
   275	            </button>
   276	          </motion.div>
   277	        )}
   278	
   279	        {/* Welcome State */}
   280	        {!loading && strategies.length === 0 && !currentTicker && (
   281	          <motion.div
   282	            initial={{ opacity: 0, y: 20 }}
   283	            animate={{ opacity: 1, y: 0 }}
   284	            transition={{ duration: 0.6 }}
   285	            className="py-16"
   286	          >
   287	            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
   288	              <motion.div 
   289	                className="card-elevated p-8 text-center group hover:scale-105 transition-transform duration-300"
   290	                whileHover={{ y: -5 }}
   291	              >
   292	                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-xl transition-shadow">
   293	                  <ChartBarIcon className="h-10 w-10 text-white" />
   294	                </div>
   295	                <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analysis</h3>
   296	                <p className="text-slate-600 leading-relaxed">
   297	                  Live market data and options chains powered by institutional-grade APIs
   298	                </p>
   299	              </motion.div>
   300	
   301	              <motion.div 
   302	                className="card-elevated p-8 text-center group hover:scale-105 transition-transform duration-300"
   303	                whileHover={{ y: -5 }}
   304	              >
   305	                <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-xl transition-shadow">
   306	                  <TrendingUpIcon className="h-10 w-10 text-white" />
   307	                </div>
   308	                <h3 className="text-xl font-bold text-slate-900 mb-3">20+ Strategies</h3>
   309	                <p className="text-slate-600 leading-relaxed">
   310	                  Comprehensive coverage from conservative spreads to advanced multi-leg strategies
   311	                </p>
   312	              </motion.div>
   313	
   314	              <motion.div 
   315	                className="card-elevated p-8 text-center group hover:scale-105 transition-transform duration-300"
   316	                whileHover={{ y: -5 }}
   317	              >
   318	                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl w-fit mx-auto mb-6 group-hover:shadow-xl transition-shadow">
   319	                  <CurrencyDollarIcon className="h-10 w-10 text-white" />
   320	                </div>
   321	                <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Risk Management</h3>
   322	                <p className="text-slate-600 leading-relaxed">
   323	                  AI-powered confidence scoring tailored to your specific risk tolerance
   324	                </p>
   325	              </motion.div>
   326	            </div>
   327	          </motion.div>
   328	        )}
   329	      </main>
   330	    </div>
   331	  );
   332	}
