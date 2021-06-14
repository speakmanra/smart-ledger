import React, { useEffect, useState } from 'react'
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
  const [blockchain, setBlockchain] = useState('ether');

  const bscApiKey = process.env.REACT_APP_BSC_API_KEY;
  const ethApiKey = process.env.REACT_APP_ETH_API_KEY;
  let sortOption = 'asc';

  const searchIcon = (
    <Icon color={'#000'} intent="primary" icon='search' />
    )
  
  const searchButton = (
    <Button onClick={() => setWalletAddress('')} minimal={true} intent="primary" icon="cross" />
  )

  const submitAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.blur();
    setHasSearched(true);
    const apiKey = blockchain === 'bsc' ? bscApiKey : ethApiKey;
    const domain = blockchain === 'bsc' ? 'com' : 'io';
    setQuery(`https://api.${blockchain}scan.${domain}/api?module=account&action=tokentx&address=${walletAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=${sortOption}&apikey=${apiKey}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      setApiData(null);
      if (query.length) {
        const axiosData = await axios(query);
        if (axiosData.data.status > 0) {
          const sortedData = axiosData.data.result.reverse();
          setApiData({ data: sortedData });
        } else {
          console.log('Error')
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

  const divider = 1000000000000000000;

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

  let dataLoading = !!!apiData;
  let showInputAddressMessage = !hasSearched;

  return (
    <div className="home-container">
      <div className="search-container">
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => submitAddress(e)}>
          <InputGroup 
          placeholder="Address..."
          leftElement={searchIcon}
          rightElement={searchButton}
          large={true}
          fill={true}
          onSubmit={(e: React.ChangeEvent<HTMLInputElement>) => e.currentTarget.blur()}
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)} />
        </form>
      </div>
      <div className="filters">
        <Filters 
          changeBlockchain={(selection: any) => setBlockchain(selection)} 
          changeStartingBlock={(selection: any) => setStartBlock(selection)} 
          changeEndingBlock={(selection: any) => setEndBlock(selection)}
        />
      </div>
      {showInputAddressMessage && <div className="input-address-message">
        Enter a wallet address to see your transactions.
        <div>
          <Icon icon="bank-account" iconSize={60} intent="primary" />
        </div>
      </div>}
      {dataLoading && !showInputAddressMessage && <div className="loading">
        <Spinner intent="primary" size={100} />
      </div>}
      {!dataLoading && !showInputAddressMessage && <div>
        <div className="fees">Total Fees: {getTotalFees(apiData!.data)} (${(bnbPriceData * getTotalFees(apiData!.data)).toFixed(2)})</div>
        <TxnTable bnbPrice={bnbPriceData} tokenTransactions={apiData!.data} />
      </div>}
    </div>
  )
}
