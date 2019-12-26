module.exports = (sequelize, DataTypes) => {
    const usuario = sequelize.define('usuario', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true
        }, 
        nome: DataTypes.STRING, 
        cpf: DataTypes.STRING, 
        data_nascimento: DataTypes.DATE,
        email: DataTypes.STRING,
        senha: DataTypes.STRING,
        data_hora: DataTypes.DATE,
        ativo: DataTypes.BOOLEAN,
    },
    {
        timestamps: false
    });
  
    return usuario;
}
