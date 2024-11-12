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
    list = list.map(i=>{
      return {
        symbol: i.symbol ? i.symbol.toUpperCase() : null, // 交易对 "btcusdt" 表示 btc + usdt
        abbr: i.abbr || i.symbol.replace('usdt',''), // 交易对缩写 btcusdt 会默认处理为 btc
        precision: Number(i.precision)|| -1, // 小数位数，如果小数位数大于此值后面位数会被过滤掉，默认不处理
        price: 0, // 价格

        buyPrice: i.buyPrice || 0,
        direction: i.direction || 'up', // 方向 up | down，默认up
        leverage: Number(i.leverage) || 10, // 杠杆
        cost: Number(i.cost) || 0 // 成本(usdt)
      }
    })
    this.list = list.filter(i=>i.symbol)
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
        if(i.precision > -1){
          i.price = decimalPlaces(prices[i.symbol], i.precision)
        }else{
          i.price = prices[i.symbol]
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
    if(coin.cost && coin.buyPrice && coin.direction && coin.leverage){
      let info = this.getEarnInfo(coin)
      text = `${coin.abbr}:${coin.price}[${info.percent}]`
      if(info.amount){
        tooltip = info.amount
      }
    }else{
      text = coin.abbr + ':'+ coin.price
    }
    return { text, tooltip }
  }

  getEarnInfo(coin){
    let { price, buyPrice, direction, leverage, cost } = coin

    const priceBN = new BigNumber(price)
    const buyPriceBN = new BigNumber(buyPrice)
    const diff = priceBN.minus(buyPriceBN)
    const diffAbs = diff.abs()
    const isEarning = direction === 'up' ? diff.isGreaterThan(0) : diff.isLessThan(0)
    const diffDivFindPrice = diffAbs.dividedBy(buyPriceBN)
    const per = diffDivFindPrice.multipliedBy(100).multipliedBy(leverage)

    const percent = `${isEarning?'+':'-'}${per.toFixed(2)}%`
    let amount = ''
    if(cost){
        const value = per.multipliedBy(+cost).multipliedBy(0.01)
        amount = `${isEarning?'+':'-'}${value.toFixed(2)}U`
    }
    return {
      percent: percent,
      amount: amount
    }
  }

  gotPrice(list){}
}

module.exports = Coins
