import React from 'react'
import img from '../assets/qr.png';
import './stylesheets/donations.scss';
import { Toaster } from '@blueprintjs/core';

const toaster = Toaster.create({position: 'bottom'});

export default function Donations() {
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
      <p className="address">0xec74205E8A0bF943131e9781229311BeBf3636d8</p>
      <img className="qr" src={img} alt=""/>
    </div>
  )
}
