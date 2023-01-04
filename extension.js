const App = require('./src/app');
exports.activate = function(context) {
    new App(context);
};

exports.deactivate = function() {
    console.log('extension has been released!')
};
