'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002
    .children.advertiser001
    .children.advertiserUser001;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency002.children.advertiser001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath +
    '/pages/maverick/platform/login');
let AdvDetsPage = require(rootPath +
    '/pages/maverick/campaign-manager/advertiser-details');
let CampaignDetailsPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-details');
let CampaignCardsPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-cards');
let CampaignFormPage = require(rootPath +
    '/pages/maverick/campaign-manager/campaign-form');
let loginPage;
let advDetsPage;
let campaignDetailsPage;
let campaignCardsPage;
let campaignFormPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

describe('{{MAVERICK}} /campaign-manager/campaign-form {ui}' +
    ' @SS-AGENCY-ADVERTISER >>> ' +
    '(+) verify ui elements - performance - max reach >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        advDetsPage = new AdvDetsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        campaignCardsPage = new CampaignCardsPage(driver);
        campaignFormPage = new CampaignFormPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should contain all elements for ' +
        'performance - max reach', function(done) {
        advDetsPage.navigate(targetServer, 'advertisers', targetAdv.refId);
        advDetsPage.clickNewCam();
        campaignCardsPage.clickPerformance();
        campaignCardsPage.clickMaxReach();

        campaignFormPage.getInputName().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getInputBudget().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getInputBidAmount().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getInputTargetBidAmount().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getInputCateg().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getLinkConvTrack().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getLinkSecCateg().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getLinkFreqCap().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getLinkLabel().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getButtonSaveAndExit().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getButtonCreateLineItem().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.verifyLinkUseBudgetNotPresent();
        campaignFormPage.verifyTextUseBudgetNotPresent();
        campaignFormPage.verifyButtonPlatformNotPresent();
        campaignFormPage.getLinkConvTrack().click();
        campaignFormPage.getLinkSecCateg().click();
        campaignFormPage.getLinkFreqCap().click();
        campaignFormPage.getLinkLabel().click();
        campaignFormPage.getInputSecCateg().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getInputLabel().then(function(element) {
            expect(element).to.exist;
        });
        campaignFormPage.getInputFreqCap().then(function(element) {
            expect(element).to.exist;
        });

        campaignFormPage.clickClose();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should go back to advertiser details', function(done) {
        campaignDetailsPage.getSpan(targetAdv.name);
        campaignDetailsPage
            .getButtonNewCampaign().then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

});
