const sequelize = require('sequelize')

const cfg = {
    connect:{
        schema  : 'sandbox',
        user    : 'root' ,
        pass    : '',    
    },
    params:{
        timezone: '-03:00',
        dialectOptions: {
            // useUTC: true, //for reading from database
            dateStrings: true,
            typeCast: true
        },
        host    : 'localhost',
        port    : '3306'   ,
        logging: console.log,  
        pool: { 
        maxConnections: 20,
        maxIdleTime: 130000
        },
        dialect: 'mysql',
    }
}

module.exports = cfg

