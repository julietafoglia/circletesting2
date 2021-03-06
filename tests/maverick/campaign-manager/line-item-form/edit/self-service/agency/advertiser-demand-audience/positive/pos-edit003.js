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
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdvertiser = entitiesObj.agency002.children.advertiser001;
const targetIo = targetAdvertiser.children.insertionOrder001;
const targetCampaign = targetIo.children.campaign001;
const targetLineItem = 'strat-li (targets negative)';
const targetPublisher = 'pkaiTestPub001';

// selenium runtime variables
let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let IoDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/insertion-order-details');
let CampaignDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/campaign-details');
let LineItemDetailsPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-details');
let LineItemPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-form');
let LineItemReviewPage = require(rootPath +
     '/pages/maverick/campaign-manager/line-item-review-form');
let loginPage;
let ioDetailsPage;
let campaignDetailsPage;
let lineItemDetailsPage;
let lineItemPage;
let lineItemReviewPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/strategy/create001');
let testData001 = Object.assign({}, testFixture);
testData001.name = targetLineItem + ' (edit)';

describe('{{MAVERICK}} /line-item {edit} @SS-AGENCY-ADVERTISER >>> ' +
    '(+) edit negative targets for positive >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        ioDetailsPage = new IoDetailsPage(driver);
        campaignDetailsPage = new CampaignDetailsPage(driver);
        lineItemDetailsPage = new LineItemDetailsPage(driver);
        lineItemPage = new LineItemPage(driver);
        lineItemReviewPage = new LineItemReviewPage(driver);
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

    it('should navigate to new line item create', function(done) {
        ioDetailsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        ioDetailsPage.waitUntilLoaderNotVisible();
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.clickNewLineItem();
        campaignDetailsPage.waitOverlayUntilStale();
        lineItemPage.waitUntilLoaderNotVisible();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should set detailed line item', function(done) {
        lineItemPage.clickLinkAdvancedTargeting();
        lineItemPage.selectAdvancedTargeting('Browser');
        lineItemPage.selectAdvancedTargeting('Bundle');
        lineItemPage.selectAdvancedTargeting('Category');
        lineItemPage.selectAdvancedTargeting('Day & Time');
        lineItemPage.selectAdvancedTargeting('Device Maker');
        lineItemPage.selectAdvancedTargeting('ISP');
        lineItemPage.selectAdvancedTargeting('OS');
        lineItemPage.selectAdvancedTargeting('Domains Whitelist/Blacklist');
        lineItemPage.setLocationTargetExclude();
        lineItemPage.setAgeTargetExclude();
        lineItemPage.setGenderTargetExclude();
        lineItemPage.setDeviceTargetExclude();
        lineItemPage.setBrowserTargetExclude();
        lineItemPage.setCategoryTargetExclude();
        lineItemPage.setDayTimeTargetExclude();
        lineItemPage.setDeviceMakerTargetExclude();
        lineItemPage.setIspTargetExclude();
        lineItemPage.setOsTargetExclude();
        lineItemPage.setName(targetLineItem);
        lineItemPage.setBudget(testData001.budget);
        lineItemPage.clickLinkUseCampaignDates();
        lineItemPage.getInputName().click();
        lineItemPage.setInputSearchLocations('United');
        lineItemPage.clickSpan('country');
        lineItemPage.selectAgeTargeting('18-20');
        lineItemPage.selectGenderTargeting('Female');
        lineItemPage.selectDeviceTargeting('PC');
        lineItemPage.setInputBrowsers('Chrome');
        lineItemPage.setInputBundles('Hispanic');
        lineItemPage.setInputCategories('IAB2:');
        lineItemPage.getInputName().click();
        lineItemPage.selectDayTargeting('Sunday');
        lineItemPage.selectTimeTargeting('12AM');
        lineItemPage.setInputDeviceMakers('Motorola');
        lineItemPage.setInputIsp('Covad');
        lineItemPage.setInputOs('Windows');
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should create test line item', function(done) {
        lineItemPage.clickReview();
        lineItemReviewPage.clickSave();
        lineItemReviewPage.waitUntilOverlayNotVisible();
        lineItemDetailsPage.getLineItemTitleName(targetLineItem)
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should edit line item - all targets Include', function(done) {
        ioDetailsPage.navigate(targetServer, 'advertisers',
            targetAdvertiser.refId);
        ioDetailsPage.waitUntilLoaderNotVisible();
        ioDetailsPage.clickCampaign(targetCampaign.name);
        campaignDetailsPage.waitUntilLoaderNotVisible();
        campaignDetailsPage.clickLineItem(targetLineItem);
        lineItemDetailsPage.clickLinkEdit();
        lineItemDetailsPage.waitUntilLoaderNotVisible();

        lineItemPage.waitUntilOverlayNotVisible();
        lineItemPage.setName(testData001.name);
        lineItemPage.setLocationTargetInclude();
        lineItemPage.setAgeTargetInclude();
        lineItemPage.setGenderTargetInclude();
        lineItemPage.setDeviceTargetInclude();
        lineItemPage.setBrowserTargetInclude();
        lineItemPage.setCategoryTargetInclude();
        lineItemPage.setDayTimeTargetInclude();
        lineItemPage.setDeviceMakerTargetInclude();
        lineItemPage.setIspTargetInclude();
        lineItemPage.setOsTargetInclude();
        // lineItemPage.setWhitelistTargetInclude();
        lineItemPage.clickReview();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should save line item' , function(done) {
        lineItemReviewPage.clickSave();
        lineItemReviewPage.waitUntilOverlayNotVisible();
        lineItemDetailsPage.getButtonAdLineItem()
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('line item should display correct target options', function(done) {
        lineItemDetailsPage.clickLinkEdit();
        lineItemDetailsPage.waitUntilLoaderNotVisible();

        lineItemPage.waitUntilOverlayNotVisible();
        lineItemPage.getSpanLocationTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanAgeTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanGenderTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanDeviceTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanBrowserTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanBundleTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanCategoryTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanDayTimeTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanDeviceMakerTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanIspTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        lineItemPage.getSpanOsTarget().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Target');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('line item should display correct targets', function(done) {
        lineItemPage.getTextSelectedLocation().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .contain('United');
            });
        lineItemPage.getSpanAgeOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('18-20');
            });
        lineItemPage.getSpanGenderOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Female');
            });
        lineItemPage.getSpanDeviceOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('PC');
            });
        lineItemPage.getSpanBrowserOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Chrome');
            });
        lineItemPage.getSpanBundleOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Hispanic Readers');
            });
        lineItemPage.getSpanCategoryOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('IAB2: Automotive');
            });
        lineItemPage.getSpanDayOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Sunday');
            });
        lineItemPage.getSpanTimeOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('12AM-1AM');
            });
        lineItemPage.getSpanDeviceMakerOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Motorola');
            });
        lineItemPage.getSpanIspOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Covad Communications');
            });
        lineItemPage.getSpanOsOption().getAttribute('innerHTML').
            then(function(innerHTML) {
                expect(innerHTML).to
                    .equal('Windows');
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should re edit - minimum required', function(done) {
        lineItemPage.setName(targetLineItem);
        lineItemPage.clickReview();
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('should save line item' , function(done) {
        lineItemReviewPage.clickSave();
        lineItemDetailsPage.getButtonAdLineItem()
            .then(function(element) {
                expect(element).to.exist;
            });
        driver.sleep(driverTimeOut)
            .then(() => done());
    });

    it('line item should exist in adv details list', function(done) {
        lineItemDetailsPage.getLineItemTitleName(targetLineItem)
            .then(function(element) {
                expect(element).to.exist;
                done();
            });
    });

});

