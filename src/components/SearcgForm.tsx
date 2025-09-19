    1	import React, { useState } from 'react';
     2	import { motion } from 'framer-motion';
     3	import { MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
     4	import { ScanRequest } from '@/types/strategy';
     5	
     6	interface SearchFormProps {
     7	  onScan: (request: ScanRequest) => void;
     8	  loading: boolean;
     9	}
    10	
    11	export default function SearchForm({ onScan, loading }: SearchFormProps) {
    12	  const [ticker, setTicker] = useState('');
    13	  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'moderate_aggressive' | 'aggressive'>('moderate_aggressive');
    14	  const [minDte, setMinDte] = useState(30);
    15	  const [maxDte, setMaxDte] = useState(45);
    16	  const [maxStrategies, setMaxStrategies] = useState(10);
    17	  const [showAdvanced, setShowAdvanced] = useState(false);
    18	
    19	  const handleSubmit = (e: React.FormEvent) => {
    20	    e.preventDefault();
    21	    if (!ticker.trim()) return;
    22	
    23	    const request: ScanRequest = {
    24	      ticker: ticker.toUpperCase().trim(),
    25	      riskProfile,
    26	      minDte,
    27	      maxDte,
    28	      maxStrategies,
    29	    };
    30	
    31	    onScan(request);
    32	  };
    33	
    34	  return (
    35	    <form onSubmit={handleSubmit} className="space-y-8">
    36	      {/* Main Search */}
    37	      <div className="flex flex-col lg:flex-row gap-6">
    38	        <div className="flex-1">
    39	          <label htmlFor="ticker" className="block text-sm font-semibold text-slate-700 mb-3">
    40	            Stock Ticker
    41	          </label>
    42	          <input
    43	            type="text"
    44	            id="ticker"
    45	            value={ticker}
    46	            onChange={(e) => setTicker(e.target.value)}
    47	            placeholder="Enter ticker (e.g., AAPL, SPY, TSLA)"
    48	            className="input text-lg"
    49	            disabled={loading}
    50	            maxLength={10}
    51	          />
    52	        </div>
    53	
    54	        <div className="lg:w-64">
    55	          <label htmlFor="riskProfile" className="block text-sm font-semibold text-slate-700 mb-3">
    56	            Risk Profile
    57	          </label>
    58	          <select
    59	            id="riskProfile"
    60	            value={riskProfile}
    61	            onChange={(e) => setRiskProfile(e.target.value as any)}
    62	            className="select text-lg"
    63	            disabled={loading}
    64	          >
    65	            <option value="conservative">🛡️ Conservative</option>
    66	            <option value="moderate">⚖️ Moderate</option>
    67	            <option value="moderate_aggressive">📊 Moderate Aggressive</option>
    68	            <option value="aggressive">🚀 Aggressive</option>
    69	          </select>
    70	        </div>
    71	
    72	        <div className="lg:w-40">
    73	          <label className="block text-sm font-semibold text-slate-700 mb-3">
    74	            &nbsp;
    75	          </label>
    76	          <motion.button
    77	            whileHover={{ scale: 1.02 }}
    78	            whileTap={{ scale: 0.98 }}
    79	            type="submit"
    80	            disabled={loading || !ticker.trim()}
    81	            className="btn-primary w-full h-[52px] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    82	          >
    83	            {loading ? (
    84	              <div className="flex items-center justify-center space-x-2">
    85	                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
    86	                <span>Scanning...</span>
    87	              </div>
    88	            ) : (
    89	              <>
    90	                <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
    91	                Analyze
    92	              </>
    93	            )}
    94	          </motion.button>
    95	        </div>
    96	      </div>
    97	
    98	      {/* Advanced Options Toggle */}
    99	      <div className="flex items-center justify-center">
   100	        <button
   101	          type="button"
   102	          onClick={() => setShowAdvanced(!showAdvanced)}
   103	          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all duration-200"
   104	          disabled={loading}
   105	        >
   106	          <Cog6ToothIcon className="w-4 h-4" />
   107	          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
   108	        </button>
   109	      </div>
   110	
   111	      {/* Advanced Options */}
   112	      <motion.div
   113	        initial={{ opacity: 0, height: 0 }}
   114	        animate={{ 
   115	          opacity: showAdvanced ? 1 : 0, 
   116	          height: showAdvanced ? 'auto' : 0 
   117	        }}
   118	        transition={{ duration: 0.4, ease: "easeInOut" }}
   119	        className="overflow-hidden"
   120	      >
   121	        {showAdvanced && (
   122	          <div className="pt-6 border-t border-slate-200">
   123	            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
   124	              <div>
   125	                <label htmlFor="minDte" className="block text-sm font-semibold text-slate-700 mb-3">
   126	                  Min Days to Expiration
   127	                </label>
   128	                <input
   129	                  type="number"
   130	                  id="minDte"
   131	                  value={minDte}
   132	                  onChange={(e) => setMinDte(Number(e.target.value))}
   133	                  min="1"
   134	                  max="365"
   135	                  className="input"
   136	                  disabled={loading}
   137	                />
   138	              </div>
   139	
   140	              <div>
   141	                <label htmlFor="maxDte" className="block text-sm font-semibold text-slate-700 mb-3">
   142	                  Max Days to Expiration
   143	                </label>
   144	                <input
   145	                  type="number"
   146	                  id="maxDte"
   147	                  value={maxDte}
   148	                  onChange={(e) => setMaxDte(Number(e.target.value))}
   149	                  min="1"
   150	                  max="365"
   151	                  className="input"
   152	                  disabled={loading}
   153	                />
   154	              </div>
   155	
   156	              <div>
   157	                <label htmlFor="maxStrategies" className="block text-sm font-semibold text-slate-700 mb-3">
   158	                  Max Results
   159	                </label>
   160	                <input
   161	                  type="number"
   162	                  id="maxStrategies"
   163	                  value={maxStrategies}
   164	                  onChange={(e) => setMaxStrategies(Number(e.target.value))}
   165	                  min="1"
   166	                  max="20"
   167	                  className="input"
   168	                  disabled={loading}
   169	                />
   170	              </div>
   171	            </div>
   172	          </div>
   173	        )}
   174	      </motion.div>
   175	    </form>
   176	  );
   177	}
