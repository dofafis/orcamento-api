const Router = require('express').Router()
const service = require('../services/categoria')
const usuarioMiddlewares = require('../middlewares/usuario')
const categoriaMiddlewares = require('../middlewares/categoria')

Router.route('/')
    .post([middlewares.validarPost, middlewares.encriptarSenha, middlewares.criarUUID], service.cadastrar)
    .put([middlewares.validarPut, middlewares.autenticar, middlewares.autorizar], service.alterarDadosNaoSensiveis)
    
Router.route('/ativar-conta/:code')
    .put([middlewares.validarAtivacaoDeConta], service.ativarConta)

Router.route('/alterar-senha')
    .post([middlewares.validarAlteracaoSenha, middlewares.encriptarSenha, middlewares.autenticar, middlewares.autorizar], service.alterarSenha)

Router.route('/:identifier')
    .get([middlewares.autenticar, middlewares.autorizar], service.retornar)
    .delete([middlewares.autenticar, middlewares.autorizar], service.deletar)

Router.route('/login')
    .post([middlewares.validarLogin, middlewares.encriptarSenha], service.login)

module.exports = Router
