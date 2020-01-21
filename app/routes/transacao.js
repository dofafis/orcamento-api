const Router = require('express').Router()
const service = require('../services/transacao')
const usuarioMiddlewares = require('../middlewares/usuario')
const transacaoMiddlewares = require('../middlewares/categoria')

Router.route('/')
    .post([transacaoMiddlewares.validarPost, usuarioMiddlewares.autenticar, usuarioMiddlewares.autorizar, transacaoMiddlewares.criarUUID], service.cadastrar)
    .put([transacaoMiddlewares.validarPut, usuarioMiddlewares.autenticar, usuarioMiddlewares.autorizar], service.alterar)

Router.route('/procurar-por-usuario/:uuid_usuario')
    .get([usuarioMiddlewares.autenticar, usuarioMiddlewares.autorizar], service.retornarPorUsuarioUUID)

Router.route('/procurar-por-usuario-e-categoria/:uuid_usuario/:uuid_categoria')
    .get([usuarioMiddlewares.autenticar, usuarioMiddlewares.autorizar], service.retornarPorUsuarioECategoriaUUID)


Router.route('/:uuid')
    .get([usuarioMiddlewares.autenticar, transacaoMiddlewares.autorizar], service.retornarPorUUID)
    .delete([usuarioMiddlewares.autenticar, transacaoMiddlewares.autorizar], service.deletar)
module.exports = Router
