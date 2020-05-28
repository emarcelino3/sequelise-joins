const mysql2 = require("mysql2")
const Sequelize = require('sequelize')
const cfg = require("./configDb")

//Sequelize
const conn = new Sequelize(cfg.connect.schema, cfg.connect.user, cfg.connect.pass, cfg.params)

//Criar database
var connectionSql = mysql2.createConnection({
    host: cfg.params.host,
    user: cfg.connect.user,
    password: cfg.connect.pass
});

//Verificar se Database existe
connectionSql.connect(err => {
    if (err) {
        console.log(`Erro: ${err}`)
        return
    }
    connectionSql.query("USE sandbox", (err) => {
        if (err) {
            connectionSql.query("CREATE DATABASE IF NOT EXISTS sandbox", (err, result) => {
                if (err) {
                    console.log(`Erro: ${err}`)
                    return
                }
                console.log("Database criada:\n", result);

                connectionSql.close()

                conn.authenticate()
                    .then(() => {
                        console.log(`Sequelize autenticado. Iniciando sincronização`);
                        conn
                            .sync({ force: true })
                            .then(function (err) {
                                console.log('Feito!');
                            }, function (err) {
                                console.log('Erro em sincronização:', err);
                            });
                    })
                    .catch(err => {
                        console.log(err.message);
                        process.exit(0)
                    })

            })
        }
    })
})


//Models

const category = conn.define('category', {
    id:         { type: Sequelize.INTEGER(2), autoIncrement: true, primaryKey: true },
    name:       { type: Sequelize.STRING(80) },
}, { freezeTableName: true });

const parental = conn.define('parental', {
    id:         { type: Sequelize.INTEGER(2), autoIncrement: true, primaryKey: true },
    name:       { type: Sequelize.STRING(80) },
}, { freezeTableName: true });

const movies = conn.define('movies', {
    id:                 { type: Sequelize.INTEGER(2), autoIncrement: true, primaryKey: true },
    name:               { type: Sequelize.STRING(80) },
    categoryId:         { type: Sequelize.INTEGER(2) },
    parentalRatingID:   { type: Sequelize.INTEGER(2) },
    releaseYear:        { type: Sequelize.INTEGER(4), validate: { min: 1800, max: 2100 } },
    directorName:       { type: Sequelize.STRING(80) },
    dubLeg:             { type: Sequelize.STRING(10) },
}, { freezeTableName: true });

movies.belongsTo(category, { foreignKey: 'categoryId', allowNull: true });
movies.belongsTo(parental, { foreignKey: 'parentalRatingID', allowNull: true });

// conn.sync({force: true  }).then(()=>{
// conn.sync({force:true}).then(()=>{
    // console.log("Resincronizando DB");    
// })

module.exports = { movies, category, parental, conn }