import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { InputGroup, Button, Icon, Spinner } from '@blueprintjs/core';
import TxnTable from '../components/TxnTable';
import Filters from '../components/Filters';
import './stylesheets/home.scss'


export default function Home() {

  const [apiData, setApiData] = useState<null | {data: any }>(null);
  // const [bnbPriceData, setBnbPrice] = useState<null | {data: number }>(null);
  const [bnbPriceData, setBnbPrice] = useState(300);
  const [query, setQuery] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [startBlock, setStartBlock] = useState('1');
  const [endBlock, setEndBlock] = useState('99999999');
  const [blockchain, setBlockchain] = useState('');
  const [isApiError, setApiError] = useState(false);

  const divider = 1000000000000000000;

  const bscApiKey = '2MDRS9PJ1M4TYXHIKMIPP5WQF9F1A85ITG';
  const ethApiKey = 'FRGT3H8E4TFNM3G55MT1QHMBV7KP2DRDXT';
  let sortOption = 'asc';

  const searchIcon = (
    <Icon color={'#000'} intent="primary" icon='search' />
    )
  
  const clearButton = (
    <Button onClick={() => setWalletAddress('')} minimal={true} intent="primary" icon={!walletAddress ? null : 'cross'} />
  )

  const submitAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.blur();
    setHasSearched(true);
    const apiKey = blockchain === 'bsc' ? bscApiKey : ethApiKey;
    const domain = blockchain === 'bsc' ? 'com' : 'io';
    setQuery(`https://api.${blockchain}scan.${domain}/api?module=account&action=tokentx&address=${walletAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=${sortOption}&apikey=${apiKey}`);
  }

  const { search } = useLocation();
  let params = search.length ? search.replace('?wallet=', '') : null;

  useEffect(() => {
      const checkParams = () => {
      if (params) {
        const paramArr = params.split('&');
        setBlockchain(paramArr[1]);
        setWalletAddress(paramArr[0]);
        setHasSearched(true);
      }
    }
    checkParams();
  }, [])

  useEffect(() => {
    const queryChange = () => {
      const apiKey = blockchain === 'bsc' ? bscApiKey : ethApiKey;
      const domain = blockchain === 'bsc' ? 'com' : 'io';
      setQuery(`https://api.${blockchain}scan.${domain}/api?module=account&action=tokentx&address=${walletAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=${sortOption}&apikey=${apiKey}`);
    }
    queryChange();
  }, [blockchain, startBlock, endBlock])

  useEffect(() => {
    const fetchData = async () => {
      if (!!!walletAddress) {
        return;
      }
      setApiData(null);
      setApiError(false);
      if (query.length) {
        const axiosData = await axios(query);
        if (axiosData.data.status > 0) {
          const sortedData = axiosData.data.result.reverse();
          setApiData({ data: sortedData });
        } else {
          console.log('error')
          setApiError(true);
        }
      }
    }
    fetchData();
  }, [query]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const axiosData = await axios(`https://coinograph.io/ticker/?symbol=binance:bnbusdt`);
  //     setBnbPrice({ data: axiosData.data.price });
  //   }
  //   fetchData();
  // }, []);

  const calculateFee = (gasPrice: number, gasUsed: number) => {
    return (gasPrice / divider) * gasUsed
  }

  const getTotalFees = (txns: any) => {
    let totalFees = 0;
    txns.forEach((txn: any) => {
      const fee = calculateFee(txn.gasPrice, txn.gasUsed)
      totalFees += fee;
    })
    totalFees = +parseFloat(totalFees.toString()).toFixed(8);
    return totalFees;
  }

  const handleFilterChange = (filter: string, selection: string) => {
    switch (filter) {
      case 'blockchain': setBlockchain(selection); break;
      case 'startBlock': setStartBlock(selection); break;
      case 'endBlock': setEndBlock(selection); break;
      default: break;
    }
    if (walletAddress) {
      setHasSearched(true);
    }
  }

  let dataLoading = !!!apiData;
  let showInputAddressMessage = !hasSearched;

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
          onChange={e => setWalletAddress(e.target.value)} />
        </form>
      </div>
      <div className="filters">
        <Filters 
          blockchain={blockchain}
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
      {!dataLoading && !showInputAddressMessage && <div>
        <div className="fees">Total Fees: {getTotalFees(apiData!.data)} (${(bnbPriceData * getTotalFees(apiData!.data)).toFixed(2)})</div>
        <TxnTable bnbPrice={bnbPriceData} tokenTransactions={apiData!.data} />
      </div>}
    </div>
  )
}
