# binance-price-watch
Visual Studio Code extension for display coin contract price via binance API

## Installation
Search for **binance-price-watch** in VS Code extensions.

[Visual Studio Code Marketplace page](https://marketplace.visualstudio.com/items?itemName=chenwuai.binance-price-watch)

## Settings
```
  // Enable display price
  "binance-contract-price.enable": true,


  // Configuring coin that need to monitor, "btcusdt" = "btc" + "usdt", multiple use "," segmentation.
  "binance-contract-price.symbol": "btcusdt",


  // Abbreviation,  multiple use "," segmentation.
  "binance-contract-price.symbolText": "btc", 

  
  // Configure polling requests the latest data time interval, Unit: milliseconds
  "binance-contract-price.updateInterval": 3000


  // Calculate the real-time price and what the profit is for the price you set。(direction:up|down)
  //  example:
  //  [{"symbol":"btcusdt","price":60000,"leverage":25,"direction":"up"}]
  //  or
  //  [{"symbol":"btcusdt","price":60000,"leverage":25,"direction":"up","cost":52}]
  "binance-contract-price.comparisonPrice": "[]"
```
