const assert = require("assert");
const moment = require("moment");

const { calculateAccruedInterest } = require("../helpers/interest");
const { Increment } = require("../models");
const plans = require("../constants/plans");

const almostEqual = (v1, v2, epsilon = 0.001) => Math.abs(v1 - v2) <= epsilon;


describe("function that calculates the accrued interest", function() {
    const biMonthlyExpired = Increment.build({
        id: 1,
        plan: plans.BIMONTHLY,
        principal: 1000,
        // Tuesday, July 20, 2021
        startDate: moment.unix(1626772949).toDate()
    });

    const semiAnnualExpired = Increment.build({
        id: 1,
        plan: plans.SEMIANNUAL,
        principal: 1000,
        // Tuesday, July 20, 2021
        startDate: moment.unix(1626772949).toDate()
    });

    const newIncrement = Increment.build({
        id: 1,
        plan: plans.BIMONTHLY,
        principal: 1000,
        startDate: new Date()
    });

    it("no interest accrued", function() {
        const incrementsArray = [newIncrement];
        const interestResult = calculateAccruedInterest(incrementsArray);

        assert.ok(interestResult.interest <= 0);
        assert.ok(interestResult.expiredIncrements.length == 0);
    });

    it("bi-monthly interest accrued", function() {
        const incrementsArray = [biMonthlyExpired];
        const interestResult = calculateAccruedInterest(incrementsArray);

        assert.ok(almostEqual(interestResult.interest, 73));
        assert.ok(interestResult.expiredIncrements.length == 1);
    });

    it("semi-annually interest accrued", function() {
        const incrementsArray = [semiAnnualExpired];
        const interestResult = calculateAccruedInterest(incrementsArray);

        assert.ok(almostEqual(interestResult.interest, 300));
        assert.ok(interestResult.expiredIncrements.length == 1);
    });

    it("empty array", function() {
        const interestResult = calculateAccruedInterest([]);

        assert.ok(interestResult.interest <= 0);
        assert.ok(interestResult.expiredIncrements.length == 0);
    });

    it("two expired, one not", function() {
        const incrementsArray = [
            semiAnnualExpired,
            biMonthlyExpired,
            newIncrement
        ];

        const interestResult = calculateAccruedInterest(incrementsArray);

        assert.ok(almostEqual(interestResult.interest, 373));
        assert.ok(interestResult.expiredIncrements.length == 2);
    });

    it("barely not expired", function() {
        const barelyNotExpired = Increment.build({
            id: 1,
            plan: plans.BIMONTHLY,
            principal: 1000,
            startDate: moment(new Date()).subtract(2, "months").add(1, "day").toDate()
        });

        const interestResult = calculateAccruedInterest([barelyNotExpired]);

        assert.ok(interestResult.interest <= 0);
        assert.ok(interestResult.expiredIncrements.length == 0);
    });

    it("barely expired", function() {
        const barelyExpired = Increment.build({
            id: 1,
            plan: plans.BIMONTHLY,
            principal: 1000,
            startDate: moment(new Date()).subtract(2, "months").subtract(1, "hour").toDate()
        });

        const interestResult = calculateAccruedInterest([barelyExpired]);

        assert.ok(almostEqual(interestResult.interest, 73));
        assert.ok(interestResult.expiredIncrements.length == 1);
    });
});