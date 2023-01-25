import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../libs/theme';
import createEmotionCache from '../libs/createEmotionCache';
import Router from 'next/router';
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import { ToastContainer } from 'react-toastify';
import AOS from 'aos'
import 'aos/dist/aos.css';
import 'react-toastify/dist/ReactToastify.css';
 
const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <WagmiConfig client={client}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps}  />
          <ToastContainer />
        </ThemeProvider>
      </CacheProvider>
    </WagmiConfig>
  );
}