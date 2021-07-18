const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RecordSchema = new Schema(
  {
    key : String, 
    counts: [Number],
    value: String
  },
  { timestamps: true }
);


module.exports = {
  Record: RecordSchema
};
