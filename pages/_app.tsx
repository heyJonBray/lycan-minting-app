import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

const alchemyAPI = process.env.ALCHEMY_API;
const infuraAPI = process.env.INFURA_API;
const mainnet = chain.mainnet;
const { chains, provider } = configureChains(
  [mainnet],
  [
    alchemyProvider({
      apiKey: alchemyAPI!,
      priority: 0,
    }),
    infuraProvider({
      apiKey: infuraAPI!,
      priority: 1,
    }),
    publicProvider({ priority: 2 }),
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
        return <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
