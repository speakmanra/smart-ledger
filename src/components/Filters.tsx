import React from 'react'
import './stylesheets/filters.scss';

 const blockchainOptions = [
  {
    name: 'Ethereum',
    id: 'ether',
  },
  {
    name: 'Binance Smart Chain',
    id: 'bsc'
  }
]

const getNumbers = (asc: boolean) => {
  let arr = [];
  for(let i = 0; i < 99999999; i += 1000000) {
     arr.push(i.toString());
  }
  return asc ? arr : arr.reverse();
}

export default function Filters(props: any) {

  const ascArr = getNumbers(true);
  const decArr = getNumbers(false);

  return (
    <div className="filter-container">
      <div className="block">
        <p>Blockchain</p>
        <select value={props.blockchain} onChange={e => props.changeBlockchain(e.target.value)} className="filter">
          {blockchainOptions.map((bc: any) => {
            return <option key={bc.id} value={bc.id}>{bc.name}</option>
          })}
        </select>
      </div>
      <div className="block">
        <p>Starting Block</p>
        <select onChange={e => props.changeStartingBlock(e.target.value)} className="filter">
          {ascArr.map(num => {
            return <option key={num} value={num}>{num}</option>})
          }
        </select>
      </div>
      <div className="block">
        <p>Ending Block</p>
        <select onChange={e => props.changeEndingBlock(e.target.value)} className="filter">
          <option key={'99999999'} value={'99999999'}>99999999</option>
          {decArr.map(num => {
            return <option key={num} value={num}>{num}</option>})
          }
        </select>
      </div>
    </div>
  )
}
