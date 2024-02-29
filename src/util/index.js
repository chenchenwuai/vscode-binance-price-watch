const vscode = require('vscode');
const util = {

  getConfigurationEnable() {
    const config = vscode.workspace.getConfiguration();
    return config.get('binance-price-watch.enable');
  },

  getConfigurationCoin() {
    const config = vscode.workspace.getConfiguration();
    let coins = config.get('binance-price-watch.symbol')
    if(coins){
      return coins.split(',').map(i=>i.toUpperCase())
    }
    return []
  },
  getConfigurationMapText(coins) {
    const config = vscode.workspace.getConfiguration();
    let mapText = config.get('binance-price-watch.symbolText')
    if(mapText){
      mapText = mapText.split(',')
      return mapText.reduce((a,c,index)=>{
        const key = coins[index]
        if(key){
          a[key] = c
        }
        return a
      },{})
    }
    return {}
  },

  getConfigurationTime() {
    const config = vscode.workspace.getConfiguration();
    const time = config.get('binance-price-watch.updateInterval')
    return time < 1000 ? 1000 : time;
  },

  getConfigurationBaseURL() {
    const config = vscode.workspace.getConfiguration();
    return config.get('binance-price-watch.url')
  },

  getConfigurationComparisonPrice() {
    const config = vscode.workspace.getConfiguration();
    let list = []
    let info = config.get('binance-price-watch.comparisonPrice')
    try {
      list = JSON.parse(info)
    } catch (error) {
       console.error('error',error)
    }
    return list
  }
}

module.exports = util;
