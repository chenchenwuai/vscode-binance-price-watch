# binance-price-watch

[Visual Studio Code Marketplace page](https://marketplace.visualstudio.com/items?itemName=chenwuai.binance-price-watch)

[中文文档](./README_zh-CN.md)

## Description
binance-price-watch is a Visual Studio Code extension that displays cryptocurrency contract prices using the Binance API.

It's designed for developers and traders who want to keep track of cryptocurrency prices directly in their coding environment.

## Features
- **Real-time Price Display**: Monitor the latest prices of your selected cryptocurrencies.
- **Real-time Display of Profit and Profit Rate**: Calculate and display profit and profit rate based on the configured buy price and current price.
- **Customizable Monitoring**: Configure which coins to monitor and set precision for price display.
- **Polling Interval**: Set how frequently the plugin fetches the latest price data.
- **Focus Update**: Optionally update data only when the editor is in focus.

## Installation
1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar.
3. Search for binance-price-watch.
4. Click the Install button.

## Configuration
After installing the extension, you can configure it by adding the following settings in your settings.json

```js
{
  "binance-price-watch.enable": true,  
  "binance-price-watch.symbols": [
    {      
      "symbol": "btcusdt", // Required: Trading pair symbol    
      "abbr": "btc",       // Optional: Coin abbreviation, defaults to removing 'usdt'
      "precision": 2,      // Optional: Number of decimal places
      "buyPrice": 0,       // Optional: Opening price
      "direction": "up",   // Optional: Opening direction, 'up' for long, 'down' for short
      "leverage": 0,       // Optional: Leverage multiplier
      "cost": 0            // Optional: Cost in USDT. Profit is shown when hovering over the price. If not set, only profit rate will be displayed.
      "amount": 0          // Optional: Amount of the currency(Note: 'amount' takes priority over 'cost').
    }
  ],
  "binance-price-watch.updateInterval": 1500,  // Optional: Update interval in milliseconds
  "binance-price-watch.api": "https://api4.binance.com/api/v3/ticker/price", // Optional: API URL
  "binance-price-watch.updateOnFocus": true     // Optional: Update only when editor is focused}
}
```

### Example Configuration
Here’s a sample configuration to monitor Bitcoin and Ethereum

```json
{  
  "binance-price-watch.symbols": [
    {      
      "symbol": "btcusdt",      
      "precision": 2,
      "abbr": "btc",
      "buyPrice": 10,
      "direction": "up",
      "leverage": 10,
      "cost": 10
    },    
    {      
      "symbol": "ethusdt",      
      "precision": 2
    }  
  ]
}
```
      
## Usage
Once configured, the plugin will display the prices of the specified cryptocurrencies in the status bar. You can monitor multiple trading pairs and calculate and display profit and profit rate in real-time based on the configured buy price. **Profit will be shown when hovering over the price**.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or bugs.

## Repository
For the source code and more information, visit the [GitHub repository](https://github.com/chenchenwuai/vscode-binance-price-watch).
