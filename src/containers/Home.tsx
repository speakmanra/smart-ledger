import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { InputGroup, Button, Icon, Spinner } from '@blueprintjs/core';
import TxnTable from '../components/TxnTable';
import Filters from '../components/Filters';
import './stylesheets/home.scss'


export default function Home() {

  //State

  const [tokenData, setTokenData] = useState<null | {data: any }>(null);
  const [normalData, setNormalData] = useState<null | {data: any }>(null);
  const [bnbPriceData, setBnbPrice] = useState<null | {data: number }>(null);
  const [ethPriceData, setEthPrice] = useState<null | {data: number }>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [startBlock, setStartBlock] = useState('1');
  const [endBlock, setEndBlock] = useState('99999999');
  const [blockchain, setBlockchain] = useState('');
  const [txnType, setTxnType] = useState('normal');
  const [isApiError, setApiError] = useState(false);

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
          url: "/getBlockExpData",
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
        setBlockchain(paramArr[1]);
        setWalletAddress(paramArr[0].toLowerCase());
        setHasSearched(true);
      }
    }
    checkParams();
  }, [])

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
          url: "/getBlockExpData",
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
      } catch (err) {
        console.log(err);
        setApiError(true);
      }
    }
      requestData();
  }, [blockchain, startBlock, endBlock])

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

  const calculateFee = (gasPrice: number, gasUsed: number) => {
    return (gasPrice / divider) * gasUsed
  }

  const getTotalFees = (txns: any) => {
    let totalFees = 0;
    txns.forEach((txn: any) => {
      if (txn.from === walletAddress) {
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
        Enter a wallet address to see your transactions.
      </div>}
      {dataLoading && !showInputAddressMessage && !isApiError && <div className="loading">
        <Spinner intent="primary" size={100} />
      </div>}
      {!dataLoading && !showInputAddressMessage && priceData && <div>
        <div className="fees">Total Fees: {getTotalFees(txnType === 'normal' ? normalData!.data : tokenData!.data)} ({((blockchain == 'bsc' ? bnbPriceData!.data : ethPriceData!.data) * getTotalFees(txnType === 'normal' ? normalData!.data : tokenData!.data)).toFixed(2)})</div>
        <TxnTable blockchain={blockchain} txnType={txnType} price={blockchain == 'bsc' ? bnbPriceData!.data : ethPriceData!.data} normalTransactions={normalData!.data} tokenTransactions={tokenData!.data} />
      </div>}
    </div>
  )
}
