import React, { useEffect } from 'react'
import img from '../assets/qr.png';
import './stylesheets/donations.scss';
import { Toaster } from '@blueprintjs/core';
import TagManager from 'react-gtm-module';

const toaster = Toaster.create({position: 'bottom'});

export default function Donations() {

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'pageview',
        pagePath: '/wallets',
        pageTitle: 'Wallets',
      },
    })
  }, [])  

  const copyAddress = () => {
    const input = document.createElement('textarea');
    input.value = '0xec74205E8A0bF943131e9781229311BeBf3636d8';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    toaster.show({message: "Copied to clipboard!", intent: "success", timeout: 2000});
  }

  return (
    <div onClick={() => copyAddress()} className="address-container">
      <p className="message">If you have enjoyed using Smart Ledger, feel free to donate whatever you can afford to your friendly neighborhood dev. :)</p>
      <img className="qr" src={img} alt=""/>
      <p className="address">0xec74205E8A0bF943131e9781229311BeBf3636d8</p>
    </div>
  )
}
