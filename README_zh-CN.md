# binance-price-watch

[插件市场链接](https://marketplace.visualstudio.com/items?itemName=chenwuai.binance-price-watch)

[英文](./README.md)

## 描述

`binance-price-watch` 是一个 Visual Studio Code 扩展，允许您通过 Binance API 显示币种合约价格。这个插件非常适合想要在编程环境中实时跟踪加密货币价格的开发者和交易者。

## 特性

- **实时价格显示**：监控您选择的加密货币的最新价格。
- **实时显示收益及收益率**：根据配置的开单价格和当前价格，实时计算并显示收益及收益率。
- **可自定义监控**：配置需要监控的币种，并设置价格显示精度。
- **轮询间隔**：设置插件获取最新价格数据的频率。
- **聚焦更新**：可选只在编辑器聚焦时更新数据。

## 安装

1. 打开 Visual Studio Code。
2. 点击活动栏中的扩展图标，打开扩展视图。
3. 搜索 `binance-price-watch`。
4. 点击安装按钮。

## 配置

安装扩展后，您可以通过在 `settings.json` 文件中添加以下设置来配置它：

```js
{
  "binance-price-watch.enable": true,
  "binance-price-watch.symbols": [
    {
      "symbol": "btcusdt", // 必填：交易对符号
      "abbr": "btc",       // 可选：币的缩写，默认为去掉 'usdt'
      "precision": 2,      // 可选：小数位数
      "buyPrice": 0,       // 可选：开单价格
      "direction": "up",   // 可选：开单方向，'up' 表示开多，'down' 表示开空
      "leverage": 0,       // 可选：杠杆倍数
      "cost": 0            // 可选：成本（以 USDT 计）。如果不设置 cost，则只显示收益率，鼠标放在价格上才显示收益。
    }
  ],
  "binance-price-watch.updateInterval": 1500, // 可选：更新间隔，单位：毫秒
  "binance-price-watch.api": "https://api4.binance.com/api/v3/ticker/price", // 可选：API URL
  "binance-price-watch.updateOnFocus": true     // 可选：只在编辑器聚焦时更新
}
```

## 示例配置

以下是一个监控比特币和以太坊的示例配置：

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

## 使用

配置完成后，插件将在状态栏中显示指定加密货币的价格。您可以监控多个交易对，并根据配置的开单价格实时计算并显示收益及收益率。**鼠标放在价格上时，将显示收益**。

## 许可证

该项目遵循 MIT 许可证。有关更多信息，请参见 LICENSE 文件。

## 贡献

欢迎贡献！如果您有任何建议或发现错误，请随时提交拉取请求或打开问题。

## 仓库

有关源代码和更多信息，请访问 [GitHub 仓库](https://github.com/chenchenwuai/vscode-binance-price-watch)。
