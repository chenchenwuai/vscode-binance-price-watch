const vscode = require('vscode')
const { getConfiguration } = require('./utils')
const Coins = require('./coins')
const StatusBar = require('./statusBar')

class App {
    constructor(context){
        this.isFirstLoad = true
        this.activateContext = context
        this.enable = false
        this.updateOnFocus = true
        this.windowActive = !!vscode.window.state.focused

        this.coins = new Coins()
        this.coins.gotPrice = this.gotPrice.bind(this)

        this.statusBar = new StatusBar(context)
        this.statusBar.init(this.coins.list)

        this.init()

        context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => this.handleConfigChange()))
        context.subscriptions.push(vscode.window.onDidChangeWindowState(() => this.handleStateChange()))
    }

    init() {
        this.initConfig()
        if(!this.enable || !this.windowActive){
            return
        }

        this.coins.initConfig()
        this.coins.startGetPrice()
    }

    initConfig(){
        this.enable = getConfiguration('enable')
        this.updateOnFocus = getConfiguration('updateOnFocus')
    }

    gotPrice(list){
        if(this.statusBar){
            this.statusBar.show(list)
        }
    }

    clean(){
        this.coins.stopGetPrice()
        this.statusBar.clean()
    }

    handleConfigChange() {
        if(this.isFirstLoad){
            this.isFirstLoad = false
            return
        }
        this.clean()
        this.init()
    }
    
    handleStateChange() {
        this.windowActive = !!vscode.window.state.focused
        
        this.coins.stopGetPrice()

        // FIXME
        let enableFetch = false
        if (!this.updateOnFocus || this.windowActive) {
            enableFetch = true
        }

        if(enableFetch){
            this.coins.startGetPrice()
        }
    }
}

module.exports = App
