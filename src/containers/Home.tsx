import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { InputGroup, Button, Icon, Spinner } from '@blueprintjs/core';
import TxnTable from '../components/TxnTable';
import Filters from '../components/Filters';
import './stylesheets/home.scss';

import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';

import { injected } from '../connectors';
import { useEagerConnect, useInactiveListener } from '../hooks/web3';

export default function Home() {

  // Web3 Setup (metamask only for now) ============================= ============================= =============

  const context = useWeb3React<Web3Provider>()
  const { connector, chainId, account, active } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  // **END** Web3 Setup ============================= ============================= =============================

  //State

  const [tokenData, setTokenData] = useState<null | {data: any }>(null);
  const [normalData, setNormalData] = useState<null | {data: any }>(null);
  const [bnbPriceData, setBnbPrice] = useState<null | {data: number }>(null);
  const [ethPriceData, setEthPrice] = useState<null | {data: number }>(null);
  const [walletAddress, setWalletAddress] = useState<any>(account || '');
  const [hasSearched, setHasSearched] = useState(false);
  const [startBlock, setStartBlock] = useState('1');
  const [endBlock, setEndBlock] = useState('99999999');
  const [blockchain, setBlockchain] = useState('ether');
  const [txnType, setTxnType] = useState('normal');
  const [isApiError, setApiError] = useState(false);
  const [connectShowing, setConnectShowing] = useState(false);

  // Variables

  const divider = 1000000000000000000;
  let sortOption = 'asc';

  // Component Returns

  const searchIcon = (
    <Icon color={'#000'} intent="primary" icon='search' />
    )
  
  const clearButton = (
    <Button onClick={() => setWalletAddress('')} minimal={true} intent="primary" icon={!walletAddress ? null : 'cross'} />
  )

  // Effects

  useEffect(() => {
    if (active) {
      setConnectShowing(false);
      setWalletAddress(account);
      setHasSearched(true);
      const requestData = async (wallet: any) => {
        try {
          setNormalData(null);
          setTokenData(null);
          setApiError(false);
          const response = await axios({
            method: "POST",
            url: process.env.NODE_ENV === "development" ? "/getBlockExpData" : "https://ubjvphyzza.execute-api.us-east-2.amazonaws.com/prod/getBlockExpData",
            data: {
              startBlock,
              endBlock,
              wallet,
              sortOption,
              blockchain
            }
          })
          const sortedNormalData = response.data.txn.reverse();
          const sortedTokenData = response.data.token.reverse();
          setNormalData({data: sortedNormalData}); 
          setTokenData({data: sortedTokenData}); 
          setApiError(false);
        } catch (err) {
          console.log(err);
          setApiError(true);
        }
      }
      if ((chainId === 1 && blockchain === 'ether') || (chainId === 56 && blockchain === 'bsc')) {
        requestData(account);
      }
      setBlockchain(chainId === 1 ? 'ether' : chainId === 56 ? 'bsc' : '');
    } else {
      setConnectShowing(true);
    }
  },[account, chainId])

  const submitAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.blur();
    setHasSearched(true);
    const requestData = async () => {
      try {
        if (!!!walletAddress) {
          return;
        }
        setNormalData(null);
        setTokenData(null);
        setApiError(false);
        const response = await axios({
          method: "POST",
          url: process.env.NODE_ENV === "development" ? "/getBlockExpData" : "https://ubjvphyzza.execute-api.us-east-2.amazonaws.com/prod/getBlockExpData",
          data: {
            startBlock,
            endBlock,
            wallet: walletAddress,
            sortOption,
            blockchain
          }
        })
        const sortedNormalData = response.data.txn.reverse();
        const sortedTokenData = response.data.token.reverse();
        setNormalData({data: sortedNormalData}); 
        setTokenData({data: sortedTokenData}); 
        setApiError(false);
      } catch (err) {
        console.log(err);
        setApiError(true);
      }
    }
    requestData();
  }

  const { search } = useLocation();
  let params = search.length ? search.replace('?wallet=', '') : null;

  useEffect(() => {
      const checkParams = () => {
      if (params) {
        const paramArr = params.split('&');
        setWalletAddress(paramArr[0].toLowerCase());
        setBlockchain(paramArr[1]);
        setHasSearched(true);
      } else if (!!account) {
        setWalletAddress(account);
        setBlockchain(chainId === 1 ? 'ether' : chainId === 56 ? 'bsc' : '');
        setHasSearched(true);
      }
    }
    checkParams();
  }, [params])

  useEffect(() => {
    const requestData = async () => {
      try {
        if (!!!walletAddress) {
          return;
        }
        setNormalData(null);
        setTokenData(null);
        setApiError(false);
        const response = await axios({
          method: "POST",
          url: process.env.NODE_ENV === "development" ? "/getBlockExpData" : "https://ubjvphyzza.execute-api.us-east-2.amazonaws.com/prod/getBlockExpData",
          data: {
            startBlock,
            endBlock,
            wallet: walletAddress,
            sortOption,
            blockchain
          }
        })
        const sortedNormalData = response.data.txn.reverse();
        const sortedTokenData = response.data.token.reverse();
        setNormalData({data: sortedNormalData}); 
        setTokenData({data: sortedTokenData}); 
        setApiError(false);
      } catch (err) {
        console.log(err);
        setApiError(true);
      }
    }
      requestData();
  }, [blockchain, hasSearched])

  useEffect(() => {
    const fetchData = async () => {
      const bnbAxiosData = await axios(`https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`);
      const ethAxiosData = await axios(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`);
      setBnbPrice({ data: bnbAxiosData.data.binancecoin.usd });
      setEthPrice({ data: ethAxiosData.data.ethereum.usd });
    }
    fetchData();
  }, []);

  // Functions
  const connectWallet = () => {
    context.activate(injected);
  }

  const calculateFee = (gasPrice: number, gasUsed: number) => {
    return (gasPrice / divider) * gasUsed
  }

  const getTotalFees = (txns: any) => {
    let totalFees = 0;
    txns.forEach((txn: any) => {
      if (txn.from.toLowerCase() === walletAddress.toLowerCase()) {
        const fee = calculateFee(txn.gasPrice, txn.gasUsed)
        totalFees += fee;
      }
    })
    totalFees = +parseFloat(totalFees.toString()).toFixed(8);
    return totalFees;
  }

  const handleFilterChange = (filter: string, selection: string) => {
    switch (filter) {
      case 'blockchain': setBlockchain(selection); break;
      case 'startBlock': setStartBlock(selection); break;
      case 'endBlock': setEndBlock(selection); break;
      case 'txnType': setTxnType(selection); break;
      default: break;
    }
    if (walletAddress) {
      setHasSearched(true);
    }
  }

  let dataLoading = !!!tokenData || !!!normalData;
  let showInputAddressMessage = !hasSearched;
  let priceData = !!bnbPriceData && !!ethPriceData;

  return (
    <div className="home-container">
      <div className="search-container">
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => submitAddress(e)}>
          <InputGroup 
          placeholder="Address..."
          leftElement={searchIcon}
          rightElement={clearButton}
          large={true}
          fill={true}
          onSubmit={(e: React.ChangeEvent<HTMLInputElement>) => e.currentTarget.blur()}
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value.toLowerCase())} />
        </form>
      </div>
      <div className="filters">
        <Filters 
          blockchain={blockchain}
          txnType={txnType}
          changeTxnType={(selection: any) => handleFilterChange('txnType', selection)}
          changeBlockchain={(selection: any) => handleFilterChange('blockchain', selection)} 
          changeStartingBlock={(selection: any) => handleFilterChange('startBlock', selection)} 
          changeEndingBlock={(selection: any) => handleFilterChange('endBlock', selection)}
        />
      </div>
      {isApiError && <div className="input-address-message">
        <div>
          <Icon icon="cross" iconSize={60} intent="primary" />
        </div>
        The address you entered has no transactions.
      </div>}
      {showInputAddressMessage && !isApiError && <div className="input-address-message">
        <div>
          <Icon icon="bank-account" iconSize={60} intent="primary" />
        </div>
        Enter a wallet address <span className="no-mobile">or connect to MetaMask</span> to see your transactions.
        {connectShowing && <span className="no-mobile"><Button className="connect-button" onClick={() => connectWallet()}>Connect Wallet</Button></span>}
      </div>}
      {dataLoading && !showInputAddressMessage && !isApiError && <div className="loading">
        <Spinner intent="primary" size={100} />
      </div>}
      {!dataLoading && !showInputAddressMessage && priceData && <div>
        <div className="fees">Total Fees: {getTotalFees(txnType === 'normal' ? normalData!.data : tokenData!.data)} (${((blockchain == 'bsc' ? bnbPriceData!.data : ethPriceData!.data) * getTotalFees(txnType === 'normal' ? normalData!.data : tokenData!.data)).toFixed(2)})</div>
        <TxnTable blockchain={blockchain} txnType={txnType} price={blockchain == 'bsc' ? bnbPriceData!.data : ethPriceData!.data} normalTransactions={normalData!.data} tokenTransactions={tokenData!.data} />
      </div>}
    </div>
  )
}
