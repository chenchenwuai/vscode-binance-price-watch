# binance-price-watch
# 币安价格监控

Visual Studio Code extension for display coin contract price via binance API

通过binance的开放 api 显示币安的交易对价格的VS Code插件

Version 2.0 the configuration structure has been updated. Please reconfigure.

2.0 配置结构已更改，请重新配置

## Installation
安装

Search for **binance-price-watch** in VS Code extensions.

在VS code插件广场搜索 **binance-price-watch**

[Visual Studio Code Marketplace page](https://marketplace.visualstudio.com/items?itemName=chenwuai.binance-price-watch)

## Settings
```
  // Enable display price
  // 开启价格显示
  "binance-contract-price.enable": true,


  // Configuring coin that need to monitor
  // 配置需要监控的币
  "binance-contract-price.symbols": [
    {
      "symbol": "btcusdt", // 要监控的币，必填
      "abbr": "btc", // 币的缩写，默认为去掉usdt的部分，非必填
      "precision": 2, // 保留小数位，非必填
      "buyPrice": 0, // 开单价格，非必填
      "direction": "up", // 开多填 'up'， 开空填 'down'，非必填
      "leverage": 0, // 开多少倍，非必填
      "cost": 0 // 开了多少usdt，非必填
    }
  ],

  
  // Configure polling requests the latest data time interval, Unit: milliseconds
  // 更新间隔，单位:毫秒
  "binance-contract-price.updateInterval": 1500,

  // 获取价格 api 地址
  "binance-contract-price.api": "https://api4.binance.com/api/v3/ticker/price",

  // 只在编辑器焦点时更新数据
  "binance-contract-price.updateOnFocus": true
```
