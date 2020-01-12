const { usuario } = require('../models')
const { categoria } = require('../models')
const Op = require('sequelize').Op
const transporter = require('../mailer')
const myCache = require('../cache')
const crypto = require('crypto')
const jwt = require('jwt-simple')
const environment = require('../../config/environment')


const usuarioService = {
    cadastrar: function(req, res) {
        usuario.create(req.body)
            .then(function (usuarioCadastrado) {

                crypto.randomBytes(30, function(err, buffer) {
                    if(!err) {
                        var code = buffer.toString('hex')
                        
                        myCache.set(code, usuarioCadastrado.uuid, 86400)

                        const mailOptions = {
                            from: 'programandotododia@gmail.com', // sender address
                            to: 'oliveirafarias.lucas@gmail.com', // list of receivers
                            subject: 'Confirmaçao de email', // Subject line
                            html: '<p style="font-size: larger;">Copie este codigo <bold>' + code + '</bold> na tela de cadastro ou tente logar e o codigo sera solicitado</p>'// plain text body
                        }

                        transporter.sendMail(mailOptions, function(err, info) {
                            if(err)
                                console.log(err)
                            else
                                res.end(JSON.stringify(usuarioCadastrado))
                        })
        

                    }
                })


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
            usuarios = usuarios.length === 0 ? { 
                status: 400, 
                message: 'Usuario nao encontrado, verifique as informaçoes e tente novamente'
            } : usuarios[0];

            if(typeof(usuarios.senha) !== 'undefined')
                usuarios.senha = '';
            res.end(JSON.stringify(usuarios))
        })
        .catch(function (error) {
            res.end(JSON.stringify({
                status: 500,
                message: error.name
            }))
        })

    },
    alterarDadosNaoSensiveis: function(req, res) {
        
        let nonSensitiveFields = ['nome', 'data_nascimento', 'ativo']
        let updates = {}
        nonSensitiveFields.forEach(field => {
            if(typeof(req.body[field]) !== 'undefined')
                updates[field] = req.body[field]
        })

        usuario.update(updates, {
            where: {
                [Op.or]: [
                    {
                        cpf: { 
                            [Op.eq]: req.body.cpf 
                        }
                    },
                    {
                        uuid: { 
                            [Op.eq]: req.body.uuid 
                        }
                    },
                    {
                        email: { 
                            [Op.eq]: req.body.email 
                        }
                    }
                ]
            }
        })
        .then(
            result => {
                if(result[0] === 1)
                    res.end(JSON.stringify({
                        status: 200,
                        message: 'Usuario alterado com sucesso'
                    }))
            }
        )
        .catch(
            error => {
                res.end(JSON.stringify({
                    status: 500,
                    message: error.name
                }))
            }
        )

    },
    alterarSenha: function(req, res) {
        usuario.update({ senha: req.body.senha }, {
            where: {
                [Op.or]: [
                    {
                        cpf: { 
                            [Op.eq]: req.body.cpf 
                        }
                    },
                    {
                        uuid: { 
                            [Op.eq]: req.body.uuid 
                        }
                    },
                    {
                        email: { 
                            [Op.eq]: req.body.email 
                        }
                    }
                ]
            }
        })
        .then(
            result => {
                if(result[0] === 1)
                    res.end(JSON.stringify({
                        status: 200,
                        message: 'Senha alterada com sucesso'
                    }))
                else   
                    res.end(JSON.stringify({
                        status: 400,
                        message: 'O usuario que deseja alterar a senha nao existe na base de dados'
                    }))
            }
        )
        .catch(
            error => {
                res.end(JSON.stringify({
                    status: 500,
                    message: error.name
                }))
            }
        )
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
                ]
            }
        })
        .then(function(affectedRows) {
            if(affectedRows === 1)
                res.end(JSON.stringify({
                    status: 200, 
                    message: 'Usuario excluido com sucesso'
                }))
            else
                res.end(JSON.stringify({
                    status: 400, 
                    message: 'O usuario que deseja excluir nao existe na base de dados'
                }))
        })
        .catch(function(error) {
            res.end(JSON.stringify({
                status: 500,
                message: error.name
            }))
        })
    },
    login: function(req, res) {
        
        usuario.findAll({
            where: {
                [Op.or]: [
                    {
                        cpf: { 
                            [Op.eq]: req.body.cpf 
                        }
                    },
                    {
                        uuid: { 
                            [Op.eq]: req.body.uuid 
                        }
                    },
                    {
                        email: { 
                            [Op.eq]: req.body.email 
                        }
                    }
                ],
                ativo: {
                    [Op.eq]: true
                }
            }
        })
        .then(function (usuarios) {
            if(usuarios.length === 0) 
                res.end(JSON.stringify({ 
                    status: 400, 
                    message: 'Usuario nao encontrado, verifique as informaçoes e tente novamente'
                }))
            else {
                usuarioRegistrado = usuarios[0]
                if(usuarioRegistrado.senha === req.body.senha) {
                    let token = jwt.encode({
                        uuid: usuarioRegistrado.uuid,
                        exp: Date.now()
                    }, environment.API_SECRET)

                    res.end(JSON.stringify({
                        status: 200,
                        access_token: token
                    }))
                } else
                    res.end(JSON.stringify({
                        status: 400,
                        message: "Senha incorreta"
                    }))
            }
            
        })
        .catch(function (error) {
            res.end(JSON.stringify({
                status: 500,
                message: error.name
            }))
        })


    },
    ativarConta: function(req, res) {
        usuario.update({ ativo: true }, {
            where: {
                [Op.or]: [
                    {
                        uuid: { 
                            [Op.eq]: myCache.get(req.params.code) 
                        }
                    }
                ]
            }
        })
        .then(
            result => {
                if(result[0] === 1)
                    res.end(JSON.stringify({
                        status: 200,
                        message: 'Usuario ativado com sucesso'
                    }))
                else   
                    res.end(JSON.stringify({
                        status: 400,
                        message: 'O usuario que deseja ativar nao existe no banco de dados'
                    }))
            }
        )
        .catch(
            error => {
                res.end(JSON.stringify({
                    status: 500,
                    message: error.name
                }))
            }
        )

    }
}

module.exports = usuarioService