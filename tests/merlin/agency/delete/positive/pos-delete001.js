'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');

const expect = chai.expect; // use bdd chai
const moment = require('moment');

const request = require('supertest-as-promised');
const util = require('util');

// runtime variables
const rootPath =
    process.env.ROOT_PATH;
const targetEndpoint =
    require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const targetUser =
    usersTargetEnvironment.admin;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;
const timeStamp =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

// fixture(s)
const setupFixture = require(rootPath + '/fixtures/common/agency/create003');

// shared test variable(s)
let authHeaders;
let res003;
let resOutput001;
let resOutput003;
let resText001;
let resText003;
let sendBody001;

describe('{{MERLIN}} <SMOKE> /agency/{id delete} @ADMIN >>> ' +
    '(+) url - basic verification - agency >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create agency - agency', function(done) {
        sendBody001 = {};
        Object.assign(
            sendBody001,
            setupFixture
        );

        sendBody001.name += timeStamp;

        // assign random string to salesforce id
        sendBody001.salesforceId = chance.string({length: 18});

        request(targetServer)
            .post(util.format(targetEndpoint.agencyCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('delete agency', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.agencyDelete, resOutput001.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('get agency details', function(done) {
        request(targetServer)
            .get(util.format(targetEndpoint.agencyDetails, resOutput001.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res003 = res;
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 200', function() {
        expect(res003.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText001.notices).to.not.exist;
        expect(resText001.errors).to.not.exist;
    });

    it('agency status should be deleted', function() {
        expect(resOutput003.status).to.equal('deleted');
    });
});
