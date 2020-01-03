const { usuario } = require('../models')
const Op = require('sequelize').Op

const usuarioService = {
    cadastrar: async function(req, res) {
        usuario.create(req.body)
            .then(function (usuarioCadastrado) {
                res.end(JSON.stringify(usuarioCadastrado))
            })
            .catch(function (error) {
                if(error.name === 'SequelizeUniqueConstraintError')
                    res.end(JSON.stringify({
                        status: 400,
                        message: 'O usuario ja foi cadastrado'
                    }))
                else
                    res.end(JSON.stringify({
                        status: 500,
                        message: 'Nao foi possivel cadastrar o usuario, verifique as informaçoes e tente novamente'
                    }))
            })
    },
    retornar: function(req, res) {

        usuario.findAll({
            where: {
                [Op.or]: [
                    {
                        cpf: { 
                            [Op.eq]: req.params.identifier 
                        }
                    },
                    {
                        uuid: { 
                            [Op.eq]: req.params.identifier 
                        }
                    },
                    {
                        email: { 
                            [Op.eq]: req.params.identifier 
                        }
                    }
                ],
                ativo: {
                    [Op.eq]: true
                }
            }
        })
        .then(function (usuarios) {
            usuarios = usuarios.length === 0 ? { status: 400, message: 'Usuario nao encontrado, verifique as informaçoes e tente novamente'} : usuarios[0]
            res.end(JSON.stringify(usuarios))
        })
        .catch(function (error) {
            res.end(JSON.stringify({
                status: 500,
                message: error.name
            }))
        })

    },
    alterar: function(req, res) {
        
        res.end('Alterar usuario especificado')

    },
    deletar: function(req, res) {
        usuario.destroy({
            where: {
                [Op.or]: [
                    {
                        cpf: { 
                            [Op.eq]: req.params.identifier 
                        }
                    },
                    {
                        uuid: { 
                            [Op.eq]: req.params.identifier 
                        }
                    },
                    {
                        email: { 
                            [Op.eq]: req.params.identifier 
                        }
                    }
                ],
                ativo: {
                    [Op.eq]: true
                }
            }
        })
        .then(function(affectedRows) {
            if(affectedRows === 1)
                res.end({status: 200, message: 'Usuario excluido com sucesso'})
            else
                res.end({status: 400, message: 'O usuario que deseja excluir nao existe na base de dados'})
        })
        .catch(function(error) {
            res.end({
                status: 500,
                message: error.name
            })
        })
    },
    login: function(req, res) {
        res.end('Logar usuario')
    }
}

module.exports = usuarioService