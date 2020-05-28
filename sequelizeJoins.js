const sequelize = require("sequelize")
const db = require("./modules")

var attributes = { exclude: ['createdAt', 'updatedAt'] }

const joinType = {
    _SELECT_TWO_TABLES: 'SELECT TWO TABLES',
    _INNER_JOIN: 'INNER JOIN',
    _LEFT_OUTER_JOIN: 'LEFT OUTER JOIN',
    _RIGHT_OUTER_JOIN: 'RIGHT OUTER JOIN',
    _SEMI_JOIN: 'SEMI JOIN',
    _ANTI_SEMI_JOIN: 'ANTI SEMI JOIN',
    _FULL_OUTER_JOIN: 'FULL OUTER JOIN',
    _FULL_OUTER_JOIN_EXCLUSION: 'FULL OUTER JOIN EXCLUSION'
}

const join = joinType._FULL_OUTER_JOIN_EXCLUSION

if ('SELECT TWO TABLES' == join) {

    db.parental.findAll({ attributes: attributes, raw: true, })
        .then(parent => { console.table(parent) })

    db.category.findAll({ attributes: attributes, raw: true, limit:10})
        .then(categs => { console.table(categs) })

}
attributes = { exclude: ['createdAt', 'updatedAt', 'directorName', 'parentalRatingID', 'releaseYear'] }

if ('INNER JOIN' == join) {

    db.movies.findAll({
        raw: true,
        attributes: attributes,
        include: [{
            model: db.parental,
            required: true,
            attributes: ['name'],
        }],
        order: [['id', 'ASC']],
    }).then(movies => console.table(movies))
}

if ('LEFT OUTER JOIN' == join) {

    db.movies.findAll({
        raw: true,
        attributes: attributes,
        include: [{
            model: db.parental,
            required: false,
            attributes: ['name'],
        }],
        order: [['id', 'ASC']],
    }).then(movies => console.table(movies))
}

if ('RIGHT OUTER JOIN' == join) {

    db.movies.findAll({
        raw: true,
        attributes: attributes,
        include: [{
            model: db.parental,
            required: false,
            right: true,   
            attributes: ['name'],
        }],
        order: [['id', 'ASC']]
    }).then(movies => console.table(movies))
}


if ('SEMI JOIN' == join) { //Similar ao INNER JOIN sem a coluna da tab 1

    db.movies.findAll({
        raw: true,
        attributes: attributes,
        where:{
            $and: sequelize.literal(`exists (
                                        select 1 from parental 
                                           where id = parentalRatingID )`)
        },
        order: [['id', 'ASC']],
    }).then(movies => console.table(movies))
}

if ('ANTI SEMI JOIN' == join) { //Similar ao INNER JOIN 

    db.movies.findAll({
        raw: true,
        attributes: attributes,
        where:{
            $and: sequelize.literal(`not exists (
                                        select 1 from parental 
                                           where id = parentalRatingID )`)
        },
        order: [['id', 'ASC']],
    }).then(movies => console.table(movies))
}


if ('FULL OUTER JOIN' == join) {
    db.conn.query(
            `SELECT t1.id, t1.name as Categ, t2.name as Rating 
               FROM category t1                                 
                 LEFT OUTER JOIN parental t2 ON t1.id = t2.id          
               UNION 
             SELECT t1.id, t1.name as Categ, t2.name as Rating 
               FROM category as t1
                 RIGHT OUTER JOIN  parental as t2 ON t1.id = t2.id                
        `.replace(/\s{2,}/g,' ')
    ).then(function(rows){
        console.table(rows[0].map(w=> w  ))
    })
}

if ('FULL OUTER JOIN EXCLUSION' == join) {

    db.conn.query( 
           `SELECT t1.id, t1.name as Categ, t2.name as Rating 
              FROM category t1                                 
                LEFT OUTER JOIN parental t2 ON t1.id = t2.id          
                WHERE t2.id is not null  
                UNION 
            SELECT t1.id, t1.name as Categ, t2.name as Rating 
              FROM category as t1
                RIGHT OUTER JOIN  parental as t2 ON t1.id = t2.id                
                WHERE t1.id is not null                
            `.replace(/\s{2,}/g,' ')
    )
    .then(function(rows){
        console.table(rows[0].map(w=> w  ))
    })
}
