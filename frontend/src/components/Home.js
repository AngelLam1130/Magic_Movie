import { useCallback, useEffect, useState } from 'react';
import React from 'react'
import { useCosmWasmClient, useSigningCosmWasmClient, useWallet, WalletConnectButton } from '@sei-js/react';

const CONTRACT_ADDRESS = 'sei18g4g35mhy5s88nshpa6flvpj9ex6u88l6mhjmzjchnrfa7xr00js0gswru'; // (atlantic-2 example) sei18g4g35mhy5s88nshpa6flvpj9ex6u88l6mhjmzjchnrfa7xr00js0gswru

function Home() {
	const [count, setCount] = useState<number | undefined>(2);
	const [error, setError] = useState<string>('');
	const [isIncrementing, setIsIncrementing] = useState<boolean>(false);

	// Helpful hook for getting the currently connected wallet and chain info
	const { connectedWallet, accounts } = useWallet();

	// For querying cosmwasm smart contracts
	const { cosmWasmClient: queryClient } = useCosmWasmClient();
	
	// For executing messages on cosmwasm smart contracts
	const { signingCosmWasmClient: signingClient } = useSigningCosmWasmClient();

	const fetchCount = useCallback(async () => {
		console.log(queryClient);
	    const response = await queryClient?.queryContractSmart(CONTRACT_ADDRESS, { get_count: {} });
	    return response?.count;
	}, [queryClient]);

	useEffect(() => {
	    fetchCount().then(setCount);
	}, [connectedWallet, fetchCount]);

	const incrementCounter = async () => {
	    setIsIncrementing(true);
		try {
		    const senderAddress = accounts[0].address;

		    // Build message content
		    const msg = { increment: {} };
			
		   // Define gas price and limit
		    const fee = {
			amount: [{ amount: '0.1', denom: 'usei' }],
			gas: '200000'
		    };

		    // Call smart contract execute msg
		    await signingClient?.execute(senderAddress, CONTRACT_ADDRESS, msg, fee);

		    // Updates the counter state again
		    const updatedCount = await fetchCount();
		    setCount(updatedCount);
		
		    setIsIncrementing(false);
		    setError('');
		} catch (error) {
		    if (error instanceof Error) {
			setError(error.message);
		    } else {
			setError('unknown error');
		    }
		    setIsIncrementing(false);
		}
	};

	// Helpful component for wallet connection
	if (!connectedWallet) return <WalletConnectButton />;

	return (
	    <div>
		<h1>Count is: {count ? count : '---'}</h1>
		<button disabled={isIncrementing} onClick={incrementCounter}>
		    {isIncrementing ? 'incrementing...' : 'increment'}
		</button>
		{error && <p style={{ color: 'red' }}>{error}</p>}
	    </div>
	);
}

export default Home;
