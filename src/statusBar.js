const vscode = require('vscode')

class StatusBars {
  constructor(){
    this.barItemsMap = {}
    this.barItems = []
  }

  init(list = []){
    this.clean()
    list.forEach(({symbol}) => {
      if(!this.barItemsMap[symbol]){
        const item = this.createStatusBarItem(symbol)
        this.barItemsMap[symbol] = item
        this.barItems.push(item)
      }
    })
  }

  createStatusBarItem(text = '',tooltip = '') {
    const barItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
    barItem.text = text
    barItem.tooltip = tooltip
    barItem.show()
    return barItem
  }

  show(list){
    if(list.length !== this.barItems.length){
      this.init(list)
    }
    list.forEach(i=>{
      if(this.barItemsMap[i.symbol]){
        this.barItemsMap[i.symbol].text = i.text
        this.barItemsMap[i.symbol].tooltip = i.tooltip
      }
    })
  }

  clean(){
    this.barItems.forEach((item) => {
      item.hide()
      item.dispose()
    })
    this.barItems = []
    this.barItemsMap = {}
  }
}

module.exports = StatusBars
