const { getConfiguration, decimalPlaces, SYMBOLS_KEY, API_KEY, DURATION_KEY } = require('./utils')
const axios = require('axios')
const { BigNumber } = require('bignumber.js')

class Coins {
  constructor(){
    this.list = []
    this.api = ''
    this.duration = 1500
    this.initConfig()
  }

  // 初始化配置
  initConfig(){
    this.api = getConfiguration(API_KEY)
    this.duration = getConfiguration(DURATION_KEY) || 1500

    this.getConfigCoins()
  }

  // 获取交易对
  getConfigCoins(){
    let list = getConfiguration(SYMBOLS_KEY)
    if(typeof list === 'string'){
      list = list.split(',')
    }
    if(Array.isArray(list)){
      list = list.map(i=>{
        if(typeof i === 'object'){
          return i
        }else{
          return { symbol: i }
        }
      })
    }
    list = list.map(i=>{
      return {
        symbol: i.symbol ? i.symbol.toUpperCase() : null, // 交易对 "btcusdt" 表示 btc + usdt
        abbr: i.abbr || i.symbol.replace('usdt',''), // 交易对缩写 btcusdt 会默认处理为 btc
        precision:  typeof i.precision !== 'undefined' ? Number(i.precision): -1, // 小数位数，如果小数位数大于此值后面位数会被过滤掉，默认不处理
        price: 0, // 价格

        buyPrice: i.buyPrice || 0,
        direction: i.direction || 'up', // 方向 up | down，默认up
        leverage: Number(i.leverage) || 1, // 杠杆
        cost: Number(i.cost) || 0, // 成本(usdt)
        amount: Number(i.amount) || 0 // 币数量
      }
    })
    this.list = list.filter(i=>i.symbol && /USDT$/.test(i.symbol))
  }

  // 开启获取price
  startGetPrice(){
    clearInterval(this.priceTimer)
    this.priceTimer = setInterval(() => {
      this.getCoinsPrice()
    }, this.duration)
  }

  // 停止获取price
  stopGetPrice(){
    clearInterval(this.priceTimer)
  }

  // 请求交易对price
  getCoinsPrice(){
    const symbols = this.list.map(i=>`%22${i.symbol}%22`).join(',')
    const query = `?symbols=%5B${symbols}%5D`
    // @ts-ignore
    axios.get(this.api+query).then((res) => {
      const prices = res.data.reduce((a,c)=>{
        a[c.symbol] = c.price
        return a
      },{})
      this.handlePrice(prices)
    }).catch((error) => {
      console.error(error)
    })
  }

  handlePrice(prices){
    this.list.forEach(i=>{
      if(typeof prices[i.symbol] !== 'undefined'){
        i.price = prices[i.symbol]
        i.showPrice = prices[i.symbol]
        if(i.precision > -1){
          i.showPrice = decimalPlaces(i.price, i.precision)
        }
        let info = this.getText(i)
        i.text = info.text
        i.tooltip = info.tooltip
      }
    })
    this.gotPrice(this.list)
  }

  getText(coin){
    let text = ''
    let tooltip = ''
    if(coin.buyPrice && coin.direction && coin.leverage){
      let info = this.getEarnInfo(coin)
      text = `${coin.abbr}:${coin.showPrice}[${info.percent}]`
      if(info.usdt){
        tooltip = info.usdt
      }
    }else{
      text = coin.abbr + ':'+ coin.showPrice
    }
    return { text, tooltip }
  }

  getEarnInfo(coin){
    let { price, buyPrice, direction, leverage, cost, amount } = coin

    const priceBN = new BigNumber(price)
    const buyPriceBN = new BigNumber(buyPrice)
    const diff = priceBN.minus(buyPriceBN)
    const diffAbs = diff.abs()
    const isEarning = direction === 'up' ? diff.isGreaterThan(0) : diff.isLessThan(0)
    const diffDivFindPrice = diffAbs.dividedBy(buyPriceBN)
    const per = diffDivFindPrice.multipliedBy(100).multipliedBy(leverage)

    const percent = `${isEarning?'+':'-'}${per.toFixed(2)}%`
    let usdt = ''
    if(cost){
        const value = per.multipliedBy(+cost).multipliedBy(0.01)
        usdt = `${isEarning?'+':'-'}${value.toFixed(2)}U`
    }
    if(amount){
        const value = diffAbs.multipliedBy(+amount)
        usdt = `${isEarning?'+':'-'}${value.toFixed(2)}U`
    }
    return { percent, usdt }
  }

  gotPrice(list){}
}

module.exports = Coins
