'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

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
const testFixture =
    require(rootPath + '/fixtures/common/bundle/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/bundle/create001-verify');

// shared test variable(s)
let authHeaders;
let res001;
let resOutput001;
let resText001;
let sendBody001;

describe('{{MERLIN}} <SMOKE> /bundle {create} >>> ' +
    '(+) body - minimum required fields >>>', function() {

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

    before('create bundle - minimum required', function(done) {

        sendBody001 = Object.assign({}, testFixture);

        // assign name to bundle
        sendBody001.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.bundleCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 201', function() {
        expect(res001.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText001.notices).to.not.exist;
        expect(resText001.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
        expect(validator.isInt(resOutput001.refId + '')).to.be.true;
        expect(validator.isInt(resOutput001.version + '')).to.be.true;
        expect(resOutput001.name).to.be.a('string');
        expect(resOutput001.name).to.have.length.of.at.most(32);
        if (resOutput001.description !== null) {
            expect(resOutput001.description).to.be.a('string');
            expect(resOutput001.description).to.have.length.of.at.most(255);
        }
        if (resOutput001.publisher !== null) {
            expect(/^[a-f0-9]{32}$/.test(resOutput001.publisher)).to.be.true;
        }
        if (resOutput001.adSlots !== null) {
            expect(resOutput001.adSlots).to.be.an('array');
            resOutput001.adSlots.forEach(function(val) {
                expect(/^[a-f0-9]{32}$/.test(val)).to.be.true;
            });
        }
        if (resOutput001.strategies !== null) {
            expect(resOutput001.strategies).to.be.an('array');
            resOutput001.strategies.forEach(function(val) {
                expect(/^[a-f0-9]{32}$/.test(val)).to.be.true;
            });
        }
        if (resOutput001.isRoadblock !== null) {
            expect(resOutput001.isRoadblock).to.be.a('boolean');
        }
        // created and modified
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput001.name).to.equal(sendBody001.name);
        expect(resOutput001.description).to.equal(verifyFixture.description);
        expect(resOutput001.publisher).to.equal(verifyFixture.publisher);
        expect(resOutput001.adSlots).to.equal(verifyFixture.adSlots);
        expect(resOutput001.strategies).to.equal(verifyFixture.strategies);
        expect(resOutput001.isRoadblock).to.equal(verifyFixture.isRoadblock);
    });

    after('delete bundle', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.bundleDelete, resOutput001.id))
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
});
