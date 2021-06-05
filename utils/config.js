const assets = {
  BNB: {
    color: '#F5C656 ',
  },
  BTC: {
    color: '#F29236',
  },
  CHSB: {
    color: '#54BF91',
  },
  ETH: { // https://ethereum.org/en/assets/
    color: '#6580E3',
  },
  USDC: { // https://www.centre.io/usdc-brand
    color: '#3975C4',
  }
}

export function colorFor(asset) {
  return assets[asset]?.color ?? 'black'
}
