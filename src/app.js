const vscode = require('vscode')
const axios = require('axios')
const util = require('./util')
const { BigNumber } = require('bignumber.js')
const { v4: uuidv4 } = require('uuid')

class App {
    constructor(context){
        this.uuid = uuidv4()
        this.activateContext = context
        this.statusBarItemsMap = {}
        this.statusBarItems = []
        this.enable = true
        this.timer = null
        this.updateOnFocus = true
        this.windowActive = !!vscode.window.state.focused
        this.comparisonPrice = {}

        this.init()

        context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => this.handleConfigChange()))
        context.subscriptions.push(vscode.window.onDidChangeWindowState(() => this.handleStateChange()))
    }

    initItems() {
        this.coins.forEach((coin) => {
            const item = this.createStatusBarItem(coin)
            this.statusBarItemsMap[coin] = item
            this.statusBarItems.push(item)
        })
    }

    deleteAllBar(){
        this.statusBarItems.forEach((item) => {
            item.hide()
            item.dispose()
        })
        this.statusBarItems = []
        this.statusBarItemsMap = {}
    }

    clean(){
        this.timer && clearInterval(this.timer)
        this.deleteAllBar()
    }

    init() {
        this.initConfig()
        this.clean()
        if(!this.enable){
            return
        }
        this.initItems()

        if(!this.windowActive){
            return
        }
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
        this.updateOnFocus = util.getConfigurationUpdateOnFocus()

        this.API_ADDRESS = `${this.baseURL}`
    }

    handleConfigChange() {
        this.clean()
        this.init()
    }
    handleStateChange() {
        this.windowActive = !!vscode.window.state.focused
        this.timer && clearInterval(this.timer)

        // FIXME
        let enableFetch = false
        if (!this.updateOnFocus) {
            enableFetch = true
        } else if (this.windowActive) {
            // this.updateGlobalUUID(this.uuid)
            enableFetch = true
        } else {
            enableFetch = false
            // const uuid = this.getGlobalUUID()
            // enableFetch = uuid === this.uuid
        }

        if(enableFetch){
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
                var coins = this.coins
                data.sort((a, b) => {
                    return coins.indexOf(a) - coins.indexOf(b)
                })
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

    createStatusBarItem(text = '',rate = '') {
        const barItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
        if(rate){
            barItem.text = `${text}[${rate}]`
            barItem.tooltip = rate
        }else{
            barItem.text = text
        }
        barItem.show()
        return barItem
    }
    updateBarItem(symbol,price){
        const mapText = this.coinsMapText[symbol] || symbol.substring(0,2).toLowerCase()
        const text = `${mapText}:${price}`
        const rate = this.getEarnRate(symbol,price)
        if (this.statusBarItemsMap[symbol]) {
            if(rate){
                this.statusBarItemsMap[symbol].text = `${text}[${rate}]`
                this.statusBarItemsMap[symbol].tooltip = rate
            }else{
                this.statusBarItemsMap[symbol].text = text
            }
        }
    }
    getEarnRate(symbol, price){
        const find = this.comparisonPrice.find(i=>i.symbol.toUpperCase() == symbol)
        if(find){
            const priceBN = new BigNumber(price);
            const findPriceBN = new BigNumber(find.price);
            const diff = priceBN.minus(findPriceBN)
            const diffAbs = diff.abs()
            const isEarning = find.direction === 'up' ? diff.isGreaterThan(0) : diff.isLessThan(0);
            const diffDivFindPrice = diffAbs.dividedBy(findPriceBN);
            const per = diffDivFindPrice.multipliedBy(100).multipliedBy(find.leverage);
            if(find.cost){
                const value = per.multipliedBy(+find.cost).multipliedBy(0.01)
                return `${isEarning?'+':'-'}${value.toFixed(2)}U`
            }else{
                return `${isEarning?'+':'-'}${per.toFixed(2)}%`
            }
        }
        return ''
    }

    getGlobalState(key){
        return this.activateContext.globalState.get(key)
    }
    updateGlobalState(key,val){
        return this.activateContext.globalState.update(key,val)
    }

    getGlobalUUID(){
        return this.getGlobalState('binance-price-watch_uuid')
    }
    updateGlobalUUID(val){
        return this.updateGlobalState('binance-price-watch_uuid',val)
    }
    
}
module.exports = App
