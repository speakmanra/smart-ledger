import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Icon, InputGroup } from '@blueprintjs/core';
import './stylesheets/wallets.scss';
import { Toaster } from '@blueprintjs/core';
import TagManager from 'react-gtm-module';

const toaster = Toaster.create({position: 'bottom'});

const blockchainOptions = [
  {
    name: 'Ethereum',
    id: 'ether',
  },
  {
    name: 'BSC',
    id: 'bsc'
  }
]

interface IWallet {
  name: string;
  address: string,
  blockchain: string
}

export default function Wallets() {
  const ls = localStorage.getItem('wallets');
  const parsedLS = ls ? JSON.parse(ls) : null;
  const [walletArray, setWalletArray] = useState<IWallet[]>(ls ? parsedLS : []);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletName, setWalletName] = useState('');
  const [blockchain, setBlockchain] = useState('ether');

  const history = useHistory();

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'pageview',
        pagePath: '/wallets',
        pageTitle: 'Wallets',
      },
    })
  }, [])

  const goToWallet = (wallet: IWallet) => {
    history.push(`/?wallet=${wallet.address}&${wallet.blockchain}`);
  }
  
  const showToast = (message: string) => {
    toaster.show({message, intent: "danger", timeout: 2000});
  }

  const removeWallet = (wallet: IWallet, e: any)=> {
    e.stopPropagation();
    setWalletArray(walletArray.filter(item => item !== wallet));
    localStorage.setItem('wallets', JSON.stringify(walletArray.filter(item => item !== wallet)));
  }

  const addWallet = ()=> {
    const walletToAdd = {name: walletName, address: walletAddress, blockchain};
    if (!walletAddress.length || !walletName.length) {
      showToast('Wallet name and address are required!')
      return;
    }
    const foundWallet = walletArray.filter(item => item.address === walletAddress && item.blockchain === blockchain)
    if (foundWallet.length === 0) {
      setWalletArray([...walletArray, walletToAdd])
      setWalletAddress('');
      setWalletName('');
      localStorage.setItem('wallets', JSON.stringify([...walletArray, walletToAdd]));
    } else {
      showToast('Wallet already added!');
      return;
    }
  }

  return (
    <div className="container">
      <ul>
        <li className="add-container">
          <div className="add-address">
            <div className="top">
              <InputGroup 
                id="name-field"
                placeholder="Name..."
                value={walletName}
                onChange={e => setWalletName(e.target.value)} />
              <select onChange={e => setBlockchain(e.target.value)} className="filter">
                {blockchainOptions.map((bc: any) => {
                  return <option key={bc.id} value={bc.id}>{bc.name}</option>
                })}
              </select>
            </div>
            <InputGroup 
                placeholder="Address..."
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)} />
          </div>
          <Icon iconSize={24} onClick={() => addWallet()} icon="add" />
        </li>
        {walletArray.length < 1 && 
        <div className="input-address-message">
          <div>
          <Icon icon="credit-card" iconSize={60} intent="primary" />
          </div>
          Save a wallet to quickly view your transactions.
        </div>}
        {walletArray.map((wallet: IWallet, i) => {
          return (
            <li className="row" key={i} onClick={() => goToWallet(wallet)}>
              <div className="address-group">
                <p className="name">{wallet.name}</p>
                <p className="address">{wallet.address}</p>
              </div>
              <Icon id="delete-button" onClick={e => removeWallet(wallet, e)} icon="trash" />
            </li>
          )
        })}
        
      </ul>
    </div>
  )
}
