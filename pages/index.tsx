import { ConnectButton } from '@rainbow-me/rainbowkit';
import lycanGIF from '../public/img/lycan-gif.gif';
import wolfHowlLogo from '../public/img/wolf-howl-logo.png';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import config from '../contractConfig.json';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useAccount,
} from 'wagmi';

const lycanContractConfig = {
  address: config.address,
  abi: config.abi,
};

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const [mintQuantity, setMintQuantity] = useState(0);
  const [totalMinted, setTotalMinted] = useState(0);
  const [mintLoading, setMintLoading] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [freeMintLoading, setFreeMintLoading] = useState(false);
  const [freeMintSuccess, setFreeMintSuccess] = useState(false);

  const { data: maxSupply } = useContractRead({
    ...lycanContractConfig,
    functionName: '_MAX_SUPPLY',
  });
  const { data: totalSupplyData } = useContractRead({
    ...lycanContractConfig,
    functionName: 'totalSupply',
  });

  const { data: mintCost } = useContractRead({
    ...lycanContractConfig,
    functionName: 'PRICE_PER_MINT',
  });

  const { config: mint } = usePrepareContractWrite({
    ...lycanContractConfig,
    functionName: 'mint',
    args: [mintQuantity],
  });

  const { config: freeMint } = usePrepareContractWrite({
    ...lycanContractConfig,
    functionName: 'freeMint',
  });

  const { write: useMint } = useContractWrite(mint);

  const onMintClick = async () => {
    setMintSuccess(false);
    setMintLoading(false);
    try {
      await useMint?.();
      setMintSuccess(true);
    } catch (err) {
      console.error('Mint Error: ', err);
    } finally {
      setMintLoading(false);
    }
  };

  const { write: useFreeMint } = useContractWrite(freeMint);

  const onFreeMintClick = async () => {
    setFreeMintSuccess(false);
    setFreeMintLoading(false);
    try {
      await useFreeMint?.();
      setFreeMintSuccess(true);
    } catch (err) {
      console.error('Free Mint Error: ', err);
    } finally {
      setFreeMintLoading(false);
    }
  };

  const handleDecrement = () => {
    if (mintQuantity <= 1) return;
    setMintQuantity(mintQuantity - 1);
  };

  const handleIncrement = () => {
    if (mintQuantity >= 10) return;
    setMintQuantity(mintQuantity + 1);
  };

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Head>
        <title>Lycan Protocol</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Left */}
      <div className="lg:col-span-4 bg-gradient-to-br from-gray-600 to-gray-800">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl border-solid border-4 border-b-red-500 border-r-red-500 border-t-red-800 border-l-red-800">
            <Image
              className="w-40 rounded-xl object-cover lg:h-96 lg:w-96"
              src={lycanGIF}
              alt="Lycan NFTs"
            />
          </div>
          <div className="space-y-2 text-center p-5">
            <h1 className="text-red-600/70 text-4xl font-bold">
              Lycan Protocol
            </h1>
            <h2 className="text-white text-s">
              6,666 Lycanthropes bound to a cursed land. Journey with them as
              they regain their power and fight their way home.
            </h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          {/* Header Items */}
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            The{' '}
            <span className="font-extrabold underline decoration-red-600/70">
              Lycan Protocol NFT
            </span>{' '}
            Collection
          </h1>
          {/* Rainbowkit Connect Button */}
          <ConnectButton
            label="Web3 Connect"
            chainStatus="none"
            showBalance={false}
            accountStatus={{
              smallScreen: 'address',
              largeScreen: 'full',
            }}
          />
        </header>

        <hr className="my-2 border" />

        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-3 lg:justify-center">
          <Image
            className="w-32 pb-10"
            src={wolfHowlLogo}
            alt="Howling wolf logo"
          />
          <h1 className="text-3xl font-medium lg:text-5xl lg:font-semibold">
            The Lycan Protocol | NFT Minting Drop
          </h1>
          {/* Dynamic NFT Counter */}
          <p className="mt-10 pt-4 text-xl text-red-600/70">
            <>
              {totalMinted?.toString()} / {maxSupply?.toString()} Lycans have
              joined The Pack
            </>
          </p>
        </div>
        {/* Minting Logic Section */}
        {isConnected ? (
          <div className="flex">
            {/* Mint Button */}
            <div className="flex-1 w-1/2 pr-5">
              <button
                disabled={mintLoading}
                onClick={onMintClick}
                className="border-2 border-gray-600 mt-1 h-16 w-full bg-red-600/70 text-white font-bold rounded-full disabled:bg-gray-400"
              >
                <span className="font-bold">Mint NFT</span>
              </button>
              <div className="flex w-full mt-2 p-5">
                <button
                  className="border-2 border-gray-600 flex-1 w-1/3 text-center bg-red-600/70 text-white font-bold rounded-l-full"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <input
                  className="border border-gray-600 flex-1 w-1/3 text-center"
                  type="number"
                  value={mintQuantity}
                />
                <button
                  className="border-2 border-gray-600 flex-1 w-1/3 text-center bg-red-600/70 text-white font-bold rounded-r-full"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
              <p className="text-m text-center my-2">
                <b className="text-red-600/70 text-bold">Price:</b> 0.066 Ξ
              </p>
              <p className="text-m text-center my-2">
                <b className="text-red-600/70 text-bold">Mint Max:</b> 10 NFTs
              </p>
            </div>
            {/* Free Mint Button */}
            <div className="flex-1 pl-5">
              <button
                disabled={freeMintLoading}
                onClick={onFreeMintClick}
                className="border-2 border-gray-600 mt-1 h-16 w-full bg-red-600/70 text-white font-bold rounded-full disabled:bg-gray-400"
              >
                <span className="font-bold">Free Mint (Allow List)</span>
              </button>
              <p className="text-m text-center my-2">
                Holders of the below tokens can claim{' '}
                <b className="text-red-600/70">ONE</b> free mint!
              </p>
              {/* Allow List Dropdown */}
              <div className="w-full dropdown relative inline-block text-left">
                <button className="inline-flex justify-center w-full rounded-md border-3 border-red-600/70 px-4 py-2 bg-gray-200">
                  <span className="mr-10 items-center">Allow List</span>
                  <svg
                    className="align-right fill-current h-4 w-4"
                    xmlns="https://www.w3.org/200/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </button>
                <ul className="w-full dropdown-menu absolute hidden bg-transparent pt-1">
                  <li>
                    <a
                      className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                      href="https://www.fwb.help/"
                    >
                      75 $FWB Tokens
                    </a>
                  </li>
                  <li>
                    <a
                      className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                      href="https://allstarz.world/"
                    >
                      ALLSTARZ NFT
                    </a>
                  </li>
                  <li>
                    <a
                      className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                      href="https://www.denzaglobes.xyz/"
                    >
                      Denzaglobes NFT
                    </a>
                  </li>
                  <li>
                    <a
                      className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                      href="https://impermanent.digital/"
                    >
                      Impermanent Digital NFT
                    </a>
                  </li>
                  <li>
                    <a
                      className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                      href="https://mannys.game/"
                    >
                      mannys.game NFT
                    </a>
                  </li>
                  <li>
                    <a
                      className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                      href="https://p4sd.com/"
                    >
                      ThePossessed NFT
                    </a>
                  </li>
                  <li>
                    <a
                      className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                      href="https://chumchums.io"
                    >
                      Chum Chums NFT
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <button className="border-2 border-gray-600 mt-1 h-16 w-full bg-red-600/70 text-white font-bold rounded-ful">
            Connect Wallet to Mint...
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
