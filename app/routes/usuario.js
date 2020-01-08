const Router = require('express').Router()
const service = require('../services/usuario')
const midlewares = require('../midlewares/usuario')

Router.route('/')
    .post([midlewares.validarPost, midlewares.encriptarSenha, midlewares.criarUUID], service.cadastrar)
    .put([midlewares.validarPut], service.alterarDadosNaoSensiveis)
    
Router.route('/ativar-conta/:code')
    .put([midlewares.validarAtivacaoDeConta], service.ativarConta)

Router.route('/:identifier')
    .get(service.retornar)
    .delete(service.deletar)

Router.route('/login')
    .post(service.login)

module.exports = Router
