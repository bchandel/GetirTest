/*
* Index route file to import all application Route
*/

let record = require('./records/routes');


module.exports = {
  getirRoutes: function (app) {
    app.use('/api/record', record);
  }
};
