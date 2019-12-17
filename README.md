Uma API REST para um sistema de controle de finanças pessoais. A API deve possibilitar as seguintes açoes:

- Cadastro e Login
- Cadastrar, editar, visualizar e excluir gastos
- Cadastrar, editar, visualizar e excluir categorias de gastos
- Associar cada gasto a uma categoria (opcional)
- Estabelecer limites de gastos mensais para cada categoria
- Visualizar a situaçao de gastos por categoria em relaçao aos limites associados as mesmas
- Deve existir uma categoria padrao chamada "Outros"
- Caso um gasto nao seja associado a um categoria pelo usuario, deve ser associado a categoria padrao "Outros"

Ferramentas utilizadas:

- Express 4.x (Framework Nodejs)
- MySQL (Banco de dados relacional)
- Sequelize (ORM para conectar a API ao banco e executar consultas)