const vscode = require('vscode')
const fs = require('fs');
const path = require('path');

class StatusBars {
  constructor(context){
    this.activateContext = context
    this.settingBar = null
    this.barItemsMap = {}
    this.barItems = []

    this.createSettingBarItem()
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

  createSettingBarItem(){
    if(this.settingBar) return
    const settingBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
    settingBar.text = ' ₿ '
    settingBar.tooltip = 'Open Coins Setting'
    settingBar.show()
    settingBar.command = 'extension.openCoinsSettings';

    this.activateContext.subscriptions.push(settingBar)
    this.activateContext.subscriptions.push(vscode.commands.registerCommand(settingBar.command, () => openSettings()))
  }
}

function openSettings(){
  // 获取用户设置的路径
  let settingsPath;
  
  // 获取用户全局设置路径（根据操作系统）
  const os = process.platform;
  if (os === 'win32') {
      settingsPath = path.join(process.env.APPDATA, 'Code', 'User', 'settings.json');
  } else if (os === 'darwin') {
      settingsPath = path.join(process.env.HOME, 'Library', 'Application Support', 'Code', 'User', 'settings.json');
  } else {
      settingsPath = path.join(process.env.HOME, '.config', 'Code', 'User', 'settings.json');
  }

  // 检查文件是否存在
  if (!fs.existsSync(settingsPath)) {
      vscode.window.showErrorMessage('Settings file not found!');
      return;
  }

  // 读取 settings.json 文件
  const settingsContent = fs.readFileSync(settingsPath, 'utf8').split('\n');

  // 定义要查找的属性名
  const propertyName = "binance-price-watch.symbols"; // 替换为你要查找的属性名
  let lineNumber = -1;

  // 查找属性行
  for (let i = 0; i < settingsContent.length; i++) {
      if (settingsContent[i].includes(propertyName)) {
          lineNumber = i;
          break;
      }
  }

  if (lineNumber === -1) {
      vscode.window.showErrorMessage(`Property "${propertyName}" not found in settings!`);
      return;
  }

  // 打开 settings.json 文件
  vscode.workspace.openTextDocument(settingsPath).then(document=>{
    vscode.window.showTextDocument(document).then(()=>{
      // 跳转到指定行
      const position = new vscode.Position(lineNumber, 0); // 行号和列号（0 表示行首）
      const editor = vscode.window.activeTextEditor;
      if (editor) {
          editor.selection = new vscode.Selection(position, position);
          editor.revealRange(new vscode.Range(position, position));
      }
    })
  })
}

module.exports = StatusBars
