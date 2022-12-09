import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [chain.mainnet],
  [
    // COMMENTED OUT TO PREVENT RATE LIMIT ON PRODUCTION APP
    // alchemyProvider({
    //   apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API!,
    // }),
    // infuraProvider({
    //   apiKey: process.env.NEXT_PUBLIC_INFURA_API!,
    // }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Lycan Protocol',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
