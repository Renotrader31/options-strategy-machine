 1	import '@/styles/globals.css';
     2	import type { AppProps } from 'next/app';
     3	import { Toaster } from 'react-hot-toast';
     4	
     5	export default function App({ Component, pageProps }: AppProps) {
     6	  return (
     7	    <>
     8	      <Component {...pageProps} />
     9	      <Toaster
    10	        position="top-right"
    11	        toastOptions={{
    12	          duration: 4000,
    13	          style: {
    14	            background: '#363636',
    15	            color: '#fff',
    16	          },
    17	          success: {
    18	            duration: 3000,
    19	            iconTheme: {
    20	              primary: '#4ade80',
    21	              secondary: '#fff',
    22	            },
    23	          },
    24	          error: {
    25	            duration: 5000,
    26	            iconTheme: {
    27	              primary: '#ef4444',
    28	              secondary: '#fff',
    29	            },
    30	          },
    31	        }}
    32	      />
    33	    </>
    34	  );
    35	}
