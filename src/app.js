const vscode = require('vscode')
const axios = require('axios')
const util = require('./util')

class App {
    constructor(context){
        this.activateContext = context
        this.statusBarItems = {}
        this.timer = null

        this.init()

        context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => this.handleConfigChange()))
    }

    init() {
        this.initConfig()

        if(!this.enable){
            this.clean()
            return
        }

        this.fetchData()
        this.timer = setInterval(() => {
            this.fetchData()
        }, this.updateInterval)
    }
    initConfig(){
        this.coins = util.getConfigurationCoin()
        this.coinsMapText = util.getConfigurationMapText(this.coins)

        this.baseURL = util.getConfigurationBaseURL()
        this.updateInterval = util.getConfigurationTime()
        this.enable = util.getConfigurationEnable()

        this.API_ADDRESS = `${this.baseURL}`
    }

    handleConfigChange() {
        this.clean()
        this.init()
    }

    fetchData() {
        // @ts-ignore
        axios.get(this.API_ADDRESS).then((res) => {
            this.handleData(res.data)
        }).catch((error) => {
            console.error(error)
        })
    }

    handleData(data){
        if(data){
            if(Array.isArray(data)){
                data.forEach(i=>{
                    try {
                        const {symbol, price} = i
                        if(this.coins.includes(symbol)){
                            this.updateBarItem(symbol,price)
                        }
                    } catch (error) {
                        console.error(error)
                    } 
                })
            }else if(typeof data === 'object'){
                try {
                    const {symbol, price} = data
                    this.updateBarItem(symbol,price)
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

    createStatusBarItem(text = '') {
        const barItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
        barItem.text = text
        barItem.show()
        return barItem
    }
    updateBarItem(symbol,price){
        const mapText = this.coinsMapText[symbol] || symbol.substring(0,2).toLowerCase()
        const text = `${mapText}:${price}`
        if (this.statusBarItems[symbol]) {
            this.statusBarItems[symbol].text = text
        } else {
            this.statusBarItems[symbol] = this.createStatusBarItem(text)
        }
    }
    deleteBatItem(symbol){
        if(this.statusBarItems[symbol]){
            this.statusBarItems[symbol].hide()
            this.statusBarItems[symbol].dispose()
            delete this.statusBarItems[symbol]
        }
    }
    deleteAllBar(){
        Object.keys(this.statusBarItems).forEach((item) => {
            this.deleteBatItem(item)
        })
    }
    clean(){
        this.timer && clearInterval(this.timer)
        this.deleteAllBar()
    }
    
}
module.exports = App
