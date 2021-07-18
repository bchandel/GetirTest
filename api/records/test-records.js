let setupDb = require('../../config/database');
let config = require('../../config/config.json');
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = require('chai').expect;
let record = require('./records');
let server = require('../../server');

let envConfig = config[config.env];
let db ;

chai.use(chaiHttp);

describe('Record Module', () => {

  describe("Test case test Record service", () => {
		before((done) =>{
			let req = {
				dbPath:  envConfig.mongoURL + envConfig.dbName
			};
			setupDb.getDBConnection(req, {}, done);
			db = req.db;
		});
	
		it("should return all record with in given criteria", () => {
			let recordService =  record.recordService(db);
			let criteria = {
				"startDate": "2016-01-26", 
				"endDate": "2018-02-02", 
				"minCount": 2700, 
				"maxCount": 3000 
			};

			return recordService.getRecords(criteria).then((record) => {
				record.forEach((data) => {
					expect(data).to.have.property("key");
					expect(data).to.have.property("totalCount");
					expect(data.createdAt).to.be.within(new Date(criteria.startDate), new Date(criteria.endDate));
					expect(data.totalCount).to.be.within(criteria.minCount, criteria.maxCount);
				});
			});
		});
		
	});

	describe('Test case to test /api/record/getRecords RESTAPI', () => {

		it('it should validate mandatory fields', (done) => {
			let criteria = {
				"startDate": "",
				"endDate": "2018-02-02", 
				"minCount": 2700, 
				"maxCount": 3000 
			};
			chai.request(server)
			.post('/api/record/getRecords')
			.send(criteria)
			.end((err, record) => {
				expect(record.body).to.have.property("code");
				expect(record.body).to.have.property("msg");
				expect(record.body.code).to.be.equal(400);
				expect(record.body.msg).to.be.equal('Bad request startDate & endDate are mandatory');
				done();
			});
			
		});

		it('it should validate Date formate', (done) => {
			let criteria = {
				"startDate": "20-01-2016", 
				"endDate": "2018-02-02", 
				"minCount": 2700, 
				"maxCount": 3000 
			};
			chai.request(server)
			.post('/api/record/getRecords')
			.send(criteria)
			.end((err, record) => {
				expect(record.body).to.have.property("code");
				expect(record.body).to.have.property("msg");
				expect(record.body.code).to.be.equal(400);
				expect(record.body.msg).to.be.equal("Bad request startDate & endDate should be in 'YYYY-MM-DD' formate");
				done();
			});
			
		});

		it('it should GET all the records', (done) => {
			let criteria = {
				"startDate": "2016-01-26", 
				"endDate": "2018-02-02", 
				"minCount": 2700, 
				"maxCount": 3000 
			};
			chai.request(server)
			.post('/api/record/getRecords')
			.send(criteria)
			.end((err, record) => {
				expect(record.body.code).to.be.equal(0);
				expect(record.body).to.have.property("records");
				expect(record.body).to.have.property("msg");
				expect(record.body).to.have.property("code");
				record.body.records.forEach((record) => {
					expect(new Date(record.createdAt)).to.be.within(new Date(criteria.startDate), new Date(criteria.endDate));
					expect(record.totalCount).to.be.within(criteria.minCount, criteria.maxCount);
				});
				done();
			});
		});
	});
});
