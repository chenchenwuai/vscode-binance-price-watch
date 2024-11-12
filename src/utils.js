const vscode = require('vscode')
const { BigNumber } = require('bignumber.js')

const CONFIG_KEY = 'binance-price-watch'
const SYMBOLS_KEY = 'symbols' // coins
const API_KEY = 'api' // binance price api
const DURATION_KEY = 'updateInterval' // binance price api

function getConfiguration(key = ''){
  const config = vscode.workspace.getConfiguration();
  if(key){
    return config.get(`${CONFIG_KEY}.${key}`) || null
  }else{
    return config.get(`${CONFIG_KEY}`)
  }
}

function decimalPlaces(number, decimal){
  return Number(new BigNumber(number).decimalPlaces(decimal).toString())
}

module.exports = {
  SYMBOLS_KEY,
  API_KEY,
  DURATION_KEY,
  getConfiguration,
  decimalPlaces
}
