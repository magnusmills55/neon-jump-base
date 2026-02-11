import React, { useState, useEffect, useRef } from 'react';
import { Ghost } from 'lucide-react';
import {
  WagmiProvider,
  createConfig,
  http,
  useAccount,
  useDisconnect,
  useSignMessage,
  useSendTransaction
} from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { parseEther } from 'viem';
import {
  RainbowKitProvider,
  ConnectButton,
  getDefaultConfig,
  midnightTheme
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

// 1. Configure Wagmi with RainbowKit (Mobile-Stable v2 Configuration)
const config = getDefaultConfig({
  appName: 'Hextris Base',
  projectId: '3fcc6b446865d9c7251147f2d733fdec', // Verified project ID
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  // Critical for mobile deep linking and injection
  appDescription: "The most addictive version of Hextris built on Base.",
  appUrl: typeof window !== 'undefined' ? window.location.origin : "https://hextris.io",
  appIcon: "https://hextris.io/favicon.ico",
});

const queryClient = new QueryClient();

import sdk from '@farcaster/frame-sdk';

function AppContent() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { sendTransactionAsync } = useSendTransaction();

  const [farcasterUser, setFarcasterUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const iframeRef = useRef(null);

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        const context = await sdk.context;
        if (context?.user) {
          setFarcasterUser(context.user);
          // If in Farcaster, we can auto-auth or semi-auto auth
        }
        sdk.actions.ready();
      } catch (error) {
        console.error("Farcaster SDK init failed:", error);
      }
    };

    initFarcaster();

    const handleMessage = (event) => {
      if (event.data && event.data.type === 'HEXTRIS_GAME_OVER') {
        setScore(event.data.score);
        setShowGameOver(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLoginSignature = async () => {
    setLoading(true);
    // Resume audio context on first user interaction for mobile compatibility
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }
    try {
      const message = `Login to Hextris Base\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      await signMessageAsync({ message });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Signature failed:", error);
      alert("Please sign the message to verify your identity.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setShowGameOver(false);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleDonate = async () => {
    try {
      const hash = await sendTransactionAsync({
        to: '0xa8B7f0ca81F1538482962Ec933b3eb64a8cf054C', // Live Mainnet Contract Address
        value: parseEther('0.001'),
        data: '0xed88c68e', // 'donate()' function selector
      });
      if (hash) alert(`Thanks for donating! TX: ${hash}`);
    } catch (e) {
      console.error(e);
      alert("Donation failed. Check if you are on the right network (Base Mainnet)!");
    }
  };

  if (!isConnected || !isAuthenticated) {
    return (
      <div className="app-container">
        <div className="login-screen">
          {farcasterUser && (
            <div className="farcaster-profile">
              <img src={farcasterUser.pfpUrl} alt="PFP" className="pfp-avatar" />
              <h3>Welcome, {farcasterUser.displayName || farcasterUser.username}!</h3>
            </div>
          )}
          <h1 className="game-title">HEXTRIS BASE</h1>
          <p className="login-text">
            {!isConnected ? "CONNECT WALLET TO START" : "VERIFY IDENTITY TO PLAY"}
          </p>

          <div className="auth-actions">
            {!isConnected ? (
              <ConnectButton
                label="CONNECT TO ARENA"
                showBalance={false}
                chainStatus="none"
              />
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleLoginSignature}
                disabled={loading}
              >
                {loading ? 'VERIFYING...' : 'SIGN & ENTER ARENA'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="game-header">
        <ConnectButton showBalance={false} chainStatus="none" />
      </div>
      <iframe
        ref={iframeRef}
        src="/hextris/index.html"
        title="Hextris"
        className="game-frame"
      />

      {showGameOver && (
        <div className="modal-overlay">
          <div className="game-over-card pulse-magenta">
            <div className="defeat-icon-container">
              <Ghost size={80} className="defeat-icon glitch-flicker" />
            </div>
            <h2 className="game-over-title glitch-text" data-text="YOU LOSE">YOU LOSE</h2>
            <p className="score-score-text">FINAL SCORE: {score}</p>

            <div className="action-buttons">
              <button onClick={handleRestart} className="btn btn-outline">
                RETRY SESSION
              </button>
              <button onClick={handleDonate} className="btn btn-success">
                DONATE 0.001 ETH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={midnightTheme()}
          modalSize="compact"
        >
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
