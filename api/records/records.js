const moment = require('moment');

/*
* Record service to handel the business logic to get the records
*/

class RecordService {
  constructor(db) {
    this.db = db;
  }

  async getRecords(data) {
    // console.log("data is ", data, data.endDate);

    var pipeline = [
      {
        "$match": {
          "createdAt": {
            "$gte": new Date(data.startDate),
            "$lte": new Date(data.endDate)
          }
        }
      }, 
      {
        "$addFields": {
          "totalCount": { "$sum": "$counts" }
        }
      }, 
      {
        "$match": {
          "totalCount": {
            "$gte": data.minCount,
            "$lte": data.maxCount
          }
        }
      }, 
      {
        "$project": {
          "_id": 0,
          "key": 1,
          "createdAt": 1,
          "totalCount": 1
        }
      }
    ];

    let matchingData = await this.db.Record.aggregate(pipeline);
    return matchingData; 
  }


}
module.exports = {
  recordService: function (db) {
    return new RecordService(db);
  }
};
