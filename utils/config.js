const assets = {
  BNB: {
    color: '#F5C656 ',
  },
  BTC: {
    color: '#F29236',
  },
  CHSB: {
    color: '#04BB82',
  },
  ETH: { // https://ethereum.org/en/assets/
    color: '#6580E3',
  },
  USDC: { // https://www.centre.io/usdc-brand
    color: '#3975C4',
  },
  USDT: { // https://tether.to/branding/
    color: '#4BB395',
  },
  XRP: { // https://brand.ripple.com/
    color: '#404952',
  }
}

export const colorFor = asset =>
  assets[asset]?.color ?? 'black'

export const multiplierFor = {
  genesis: 1,
  community: .75,
  standard: .5
}
