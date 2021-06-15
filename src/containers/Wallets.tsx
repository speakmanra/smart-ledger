import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Icon, InputGroup } from '@blueprintjs/core';
import './stylesheets/wallets.scss';
import { Toaster } from '@blueprintjs/core';
import { withRouter } from "react-router";

const toaster = Toaster.create({position: 'bottom'});

interface IWallet {
  name: string;
  address: string
}

export default function Wallets() {
  const ls = localStorage.getItem('wallets');
  const parsedLS = ls ? JSON.parse(ls) : null;
  const [walletArray, setWalletArray] = useState<IWallet[]>(ls ? parsedLS : []);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletName, setWalletName] = useState('');

  const history = useHistory();

  const goToWallet = (wallet: IWallet) => {
    history.push(`/?wallet=${wallet.address}`);
  }
  
  const showToast = (message: string) => {
    toaster.show({message, intent: "danger", timeout: 2000});
  }

  const removeWallet = (wallet: IWallet, e: any)=> {
    e.stopPropagation();
    setWalletArray(walletArray.filter(item => item.address !== wallet.address));
    localStorage.setItem('wallets', JSON.stringify(walletArray.filter(item => item.address !== wallet.address)));
  }

  const addWallet = ()=> {
    const walletToAdd = {name: walletName, address: walletAddress};
    if (!walletAddress.length || !walletName.length) {
      showToast('Wallet name and address are required!')
      return;
    }
    const foundWallet = walletArray.filter(item => item.address === walletAddress)
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
        <li>
          <div className="add-address">
            <InputGroup 
              id="name-field"
              placeholder="Name..."
              value={walletName}
              onChange={e => setWalletName(e.target.value)} />
            <InputGroup 
                placeholder="Address..."
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)} />
          </div>
          <Icon onClick={() => addWallet()} icon="add" />
        </li>
        {walletArray.map((wallet: IWallet, i) => {
          return (
            <li key={i} onClick={() => goToWallet(wallet)}>
              <div className="address-group">
                <p className="address">{wallet.name}</p>
                <p className="address">{wallet.address}</p>
              </div>
              <Icon onClick={e => removeWallet(wallet, e)} icon="trash" />
            </li>
          )
        })}
        
      </ul>
    </div>
  )
}
