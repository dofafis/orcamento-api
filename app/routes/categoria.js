const Router = require('express').Router()
const service = require('../services/categoria')
const usuarioMiddlewares = require('../middlewares/usuario')
const categoriaMiddlewares = require('../middlewares/categoria')

Router.route('/')
    .post([categoriaMiddlewares.validarPost, usuarioMiddlewares.autenticar, usuarioMiddlewares.autorizar, categoriaMiddlewares.criarUUID], service.cadastrar)
    .put([categoriaMiddlewares.validarPut, usuarioMiddlewares.autenticar, usuarioMiddlewares.autorizar], service.alterar)

Router.route('/procurar-por-usuario/:uuid_usuario')
    .get([usuarioMiddlewares.autenticar, usuarioMiddlewares.autorizar], service.retornarPorUsuarioUUID)

Router.route('/:uuid')
    .get([usuarioMiddlewares.autenticar, categoriaMiddlewares.autorizar], service.retornarPorUUID)
    .delete([usuarioMiddlewares.autenticar, categoriaMiddlewares.autorizar], service.deletar)
module.exports = Router
