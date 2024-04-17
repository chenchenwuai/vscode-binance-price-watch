const vscode = require('vscode');

const configPrefix = 'binance-price-watch'
const util = {

  getConfigurationEnable() {
    const config = vscode.workspace.getConfiguration();
    const configName = 'enable'
    let enable = config.get(`${configPrefix}.${configName}`)
    return enable;
  },

  getConfigurationCoin() {
    const config = vscode.workspace.getConfiguration();
    const configName = 'symbol'
    let coins = config.get(`${configPrefix}.${configName}`)
    if(coins){
      return coins.split(',').map(i=>i.toUpperCase())
    }
    return []
  },
  getConfigurationMapText(coins) {
    const config = vscode.workspace.getConfiguration();
    const configName = 'symbolText'
    let mapText = config.get(`${configPrefix}.${configName}`)
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
    const configName = 'updateInterval'
    const time = config.get(`${configPrefix}.${configName}`)
    return time < 1000 ? 1000 : time;
  },

  getConfigurationBaseURL() {
    const config = vscode.workspace.getConfiguration();
    const configName = 'url'
    const url = config.get(`${configPrefix}.${configName}`)
    return url
  },

  getConfigurationComparisonPrice() {
    const config = vscode.workspace.getConfiguration();
    const configName = 'comparisonPrice'
    const info = config.get(`${configPrefix}.${configName}`)
    let list = []
    try {
      list = JSON.parse(info)
    } catch (error) {
       console.error('error',error)
    }
    return list
  },
  
  getConfigurationUpdateOnFocus() {
    const config = vscode.workspace.getConfiguration();
    const configName = 'updateOnFocus'
    const updateOnFocus = config.get(`${configPrefix}.${configName}`)
    return updateOnFocus
  }
}

module.exports = util;
