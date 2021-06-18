import './stylesheets/txn-table.scss'

export default function TxnTable(props: any) {

  // TODO: Convert to bignumber.js

  // const cellRenderer = (rowIndex: number) => {
  //   return <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>
  // };

  const divider = 1000000000000000000;
  
  const formatValue = (value: number) => {
    const formattedNumber = value / divider;
    return +parseFloat(formattedNumber.toString()).toFixed(8);
  }

  const formatName = (name: string) => {
    if (name.includes('Coin')) {
      return name.replace('Coin', ''); 
    } else if (name.includes('Token')) {
      return name.replace('Token', '');
    } else {
      return name;
    }
  }

  const calculateFee = (gasPrice: number, gasUsed: number) => {
    return (gasPrice / divider) * gasUsed
  }

  const getTime = (epochTime: number) => {
    const d = new Date(0);
    const time = d.setUTCSeconds(epochTime);
    const date = new Date(time);
    const formattedDate = (
      ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) 
      + '/' + 
      ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) 
      + '/' + 
      date.getFullYear());
    const formattedTime = 
    `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;
    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <div className="table-container">
      <table className="bp3-html-table">
        <thead>
          <tr>
            <th className="time-col">Time</th>
            {props.txnType === 'tokens' && <th className="name-col">Token Name</th>}
            <th className="amount-col">Transaction Amount</th>
            <th className="fee-col">Fees</th>
          </tr>
        </thead>
        <tbody>
          {props.txnType === 'tokens' && props.tokenTransactions.map((txns: any, i: number) => {
            if (txns.value > 0) {
              return (
                <tr key={i}>
                  <td className="time-col">{getTime(txns.timeStamp)}</td>
                  <td className="name-col">{formatName(txns.tokenName)}</td>
                  <td className="amount-col">{formatValue(txns.value)} {txns.tokenSymbol}</td>
                  <td className="fee-col">{calculateFee(txns.gasPrice, txns.gasUsed).toFixed(9)} {props.blockchain === 'bsc' ? 'BNB' : 'ETH'} (${(props.price * calculateFee(txns.gasPrice, txns.gasUsed)).toFixed(2)})</td>
                </tr>
              )
            }
          })}
          {props.txnType === 'normal' && props.normalTransactions.map((txns: any, i: number) => {
            if (txns.value > 0) {
              return (
                <tr key={i}>
                  <td className="time-col">{getTime(txns.timeStamp)}</td>
                  {/* <td className="name-col">{formatName(txns.tokenName)}</td> */}
                  <td className="amount-col">{formatValue(txns.value)} {props.blockchain === 'bsc' ? 'BNB' : 'ETH'}</td>
                  <td className="fee-col">{calculateFee(txns.gasPrice, txns.gasUsed).toFixed(9)} {props.blockchain === 'bsc' ? 'BNB' : 'ETH'} (${(props.price * calculateFee(txns.gasPrice, txns.gasUsed)).toFixed(2)})</td>
                </tr>
              )
            }
          })}
        </tbody>
      </table>
    </div>
  )
}
