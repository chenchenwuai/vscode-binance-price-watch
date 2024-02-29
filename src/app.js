const vscode = require('vscode')
const axios = require('axios')
const util = require('./util')
const { BigNumber } = require('bignumber.js')

class App {
    constructor(context){
        this.activateContext = context
        this.statusBarItems = {}
        this.enable = true
        this.timer = null
        this.windowActive = !!vscode.window.state.focused
        this.comparisonPrice = {}

        this.init()

        context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => this.handleConfigChange()))
        context.subscriptions.push(vscode.window.onDidChangeWindowState(() => this.handleStateChange()))
    }

    init() {
        this.initConfig()

        if(!this.enable){
            this.clean()
            return
        }

        if(!this.windowActive){
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
        this.comparisonPrice = util.getConfigurationComparisonPrice()

        this.baseURL = util.getConfigurationBaseURL()
        this.updateInterval = util.getConfigurationTime()
        this.enable = util.getConfigurationEnable()

        this.API_ADDRESS = `${this.baseURL}`
    }

    handleConfigChange() {
        this.clean()
        this.init()
    }
    handleStateChange() {
        this.windowActive = !!vscode.window.state.focused
        this.timer && clearInterval(this.timer)
        if(this.windowActive){
            this.fetchData()
            this.timer = setInterval(() => {
                this.fetchData()
            }, this.updateInterval)
        }
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

    createStatusBarItem(text = '',tooltip = '') {
        const barItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
        if(tooltip){
            barItem.text = `${text}[${tooltip}]`
            barItem.tooltip = text
        }else{
            barItem.text = text
        }
        barItem.show()
        return barItem
    }
    updateBarItem(symbol,price){
        const mapText = this.coinsMapText[symbol] || symbol.substring(0,2).toLowerCase()
        const text = `${mapText}:${price}`
        const tooltip = this.getTooltip(symbol,price)
        if (this.statusBarItems[symbol]) {
            if(tooltip){
                this.statusBarItems[symbol].text = `${text}[${tooltip}]`
                this.statusBarItems[symbol].tooltip = tooltip
            }else{
                this.statusBarItems[symbol].text = text
            }
        } else {
            this.statusBarItems[symbol] = this.createStatusBarItem(text,tooltip)
        }
    }
    getTooltip(symbol, price){
        const find = this.comparisonPrice.find(i=>i.symbol.toUpperCase() == symbol)
        if(find){
            const priceBN = new BigNumber(price);
            const findPriceBN = new BigNumber(find.price);
            const diff = priceBN.minus(findPriceBN).abs()
            const isEarning = find.direction === 'up' ? diff.isGreaterThan(0) : diff.isLessThan(0);
            const diffDivFindPrice = diff.dividedBy(findPriceBN);
            const per = diffDivFindPrice.multipliedBy(100).multipliedBy(find.leverage);
            return `${isEarning?'+':'-'}${per.toFixed(2)}%`
        }
        return ''
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
