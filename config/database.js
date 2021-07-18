/*
* Establish conection to MongoDB and create the schema model 
*/

let mongoose = require('mongoose');
let cache = require('memory-cache');
let utils = require('../api/utils/dbUtils');
let recordSchema = require('../api/records/record-schema');


module.exports = {

  loadSchemasPluginsTemplates: function(req, gtDB) {
    req.db = {
      Record: gtDB.model('Record', recordSchema.Record)
    };
  },
  getDBConnection: function (req, resp, next) {
    let mainDB = 'getir-case-study' ;
    let dbPath = req.dbPath;
    let gtDB = cache.get(dbPath);
    if (!gtDB) {
      let options = {
        poolSize: 50,
        connectTimeoutMS: 30000,
        keepAlive: 300000,
        useNewUrlParser: true
      };
      
      gtDB = utils.dbConnection(dbPath, options);
      gtDB
        .once('openSet', () => console.log('Connected to db'))
        .on('error', function (err) {
          console.error(err);
          console.error('connection error:', mainDB);
          resp.status(500).send('connection error:',err);
        })
        .on('disconnected', function () {
          console.error('connection disconnected:', mainDB);
        });
      cache.put(dbPath, gtDB, 60 * 60 * 1000);
      this.loadSchemasPluginsTemplates(req, gtDB);
    } else {
      gtDB = cache.get(dbPath);
      this.loadSchemasPluginsTemplates(req, gtDB);
    }
    req.db =  gtDB.models;
    next();
  }
 
};
