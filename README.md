# binance-price-watch
Visual Studio Code extension for display coin contract price via binance API

## Installation
Search for **binance-price-watch** in VS Code extensions.

[Visual Studio Code Marketplace page](https://marketplace.visualstudio.com/items?itemName=chenwuai.binance-price-watch)

## Settings
```
  // Enable display price
  "binance-contract-price.enable": true,


  // Configuring coin that need to monitor, "btcusdt" = "btc" + "usdt"
  "binance-contract-price.symbol": "btcusdt", 


  // Abbreviation
  "binance-contract-price.symbolText": "btc", 

  
  // Configure polling requests the latest data time interval, Unit: milliseconds
  "binance-contract-price.updateInterval": 3000
```