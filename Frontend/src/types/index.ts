export interface WholeBlockMarket {
  marketId: number
  slot: number
  instrumentId: string
  name: string
  priceStep: string
  minPrice: string
  maxPrice: string
  availablePreconf: number
  direction: boolean
  price: string
  midPrice: string
  status: number
  maturityTime: number
  blockTime: number
  finalityTime: number
  updateDate: number
  ofac: boolean
}

export interface PreconfMarket {
  marketId: number
  slot: number
  instrumentId: string
  name: string
  quantityStep: string
  minQuantity: string
  maxQuantity: string
  priceStep: string
  minPrice: string
  maxPrice: string
  totalPreconf: number
  availablePreconf: number
  midPrice: string
  status: number
  maturityTime: number
  trxSubmitTime: number
  blockTime: number
  finalityTime: number
  totalGas: number
  validatorType: number
  updateDate: number
  ofac: boolean
}

export interface MarketResponse {
  market: {
    marketType: 'wholeblock' | 'inclusion-preconf'
    success: boolean
    data: {
      markets: (WholeBlockMarket | PreconfMarket)[]
    }
    normalized: boolean
    timestamp: string
  }
}
