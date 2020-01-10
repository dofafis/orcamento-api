

module.exports = function (app) {
    app.use('/usuario', require('./usuario'))
    app.use('/categoria', require('./categoria'))    
}