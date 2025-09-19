 1	import React from 'react';
     2	import { motion } from 'framer-motion';
     3	
     4	export default function LoadingSpinner() {
     5	  return (
     6	    <div className="flex items-center justify-center">
     7	      <motion.div
     8	        className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"
     9	        animate={{ rotate: 360 }}
    10	        transition={{
    11	          duration: 1,
    12	          repeat: Infinity,
    13	          ease: "linear"
    14	        }}
    15	      />
    16	    </div>
    17	  );
    18	}
