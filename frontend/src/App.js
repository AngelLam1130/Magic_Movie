import { SeiWalletProvider } from '@sei-js/react';
import './App.css';
import Home from './components/Home';
import React from 'react';

function App() {
    return (
    	// Set up SeiWalletProvider for easy wallet connection and to use hooks in @sei-js/react
        <SeiWalletProvider
            chainConfiguration={{
                chainId: 'atlantic-2',
                restUrl: 'https://rest.atlantic-2.seinetwork.io',
                rpcUrl: 'https://rpc.atlantic-2.seinetwork.io'
            }}
            wallets={['compass', 'fin']}>
	            <Home />
                <h1>Welcome to Magic Movie</h1>
                <h1>Welcome to Magic Movie</h1>
	    </SeiWalletProvider>
    );
}

export default App;