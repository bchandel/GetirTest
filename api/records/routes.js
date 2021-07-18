const router = require('express').Router();
const record = require('./records');
const validation = require('../utils/validation');

/*
* Route file to add all routes related to Records RestAPI
*/


/**
 * @api {post} /getRecords Get Records
 * @apiName Get Records
 * @apiGroup Records
 *
 * @apiParamExample {json} Request-Example for Records:
 *  {
 *      "startDate": "2016-01-26", 
 *      "endDate": "2018-02-02", 
 *      "minCount": 2700,
 *      "maxCount": 3000 
 *  }
 *
 * @apiHeader {String} x-access-token User unique access-token.
 *
 * @apiSuccess {Object} Records details
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "code": 0,
 *         "msg": "success",
 *         "records": [
 *            {
 *                "key": "ibfRLaFT",
 *                "createdAt": "2016-12-25T16:43:27.909Z",
 *                "totalCount": 2892
 *            },
 *            {
 *                "key": "pxClAvll",
 *                "createdAt": "2016-12-19T10:00:40.050Z",
 *                 "totalCount": 2772
 *            }
 *          ]
 *     }
 *
 * @apiError Bad Request
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 
 *     {
 *          "status": 500
 *     }
 */


const getRecords = async (req, res) => {
  try {
    let error = validation.recordPayloadValidation(req.body);
    if(error && error.length >0){
      return res.status(400).json({code : 400, msg: error[0].error});
    }
    else{
      let data = await record.recordService(req.db).getRecords(req.body);
      // console.log("data is ******",data.length)
      return res.json({ code: 0, msg: 'success', records: data});
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

router
  .post('/getRecords', getRecords);
  
module.exports = router;
