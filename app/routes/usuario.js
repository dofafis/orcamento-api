const Router = require('express').Router()
const service = require('../services/usuario')
const midlewares = require('../midlewares/usuario')

Router.route('/')
    .post([midlewares.validarPost, midlewares.encriptarSenha, midlewares.criarUUID], service.cadastrar)
    .put([midlewares.validarPut, midlewares.autenticar, midlewares.autorizar], service.alterarDadosNaoSensiveis)
    
Router.route('/ativar-conta/:code')
    .put([midlewares.validarAtivacaoDeConta], service.ativarConta)

Router.route('/alterar-senha')
    .post([midlewares.validarAlteracaoSenha, midlewares.encriptarSenha, midlewares.autenticar, midlewares.autorizar], service.alterarSenha)

Router.route('/:identifier')
    .get([midlewares.autenticar, midlewares.autorizar], service.retornar)
    .delete([midlewares.autenticar, midlewares.autorizar], service.deletar)

Router.route('/login')
    .post([midlewares.validarLogin, midlewares.encriptarSenha], service.login)

module.exports = Router
