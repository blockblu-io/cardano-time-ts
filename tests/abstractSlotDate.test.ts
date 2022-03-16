import {assert, expect} from "chai";
import AbstractSlotDate from "../src/slotdate/abstract";

describe('Test constructor of Abstract Slot Date', () => {
    it('testConstructionOfSlotDateWithNegativeEpoch_mustThrowError', () => {
        assert.throws(() => new AbstractSlotDate(-1, 1));
    });
    it('testConstructionOfSlotDateWithNegativeSlot_mustThrowError', () => {
        assert.throws(() => new AbstractSlotDate(1, -1));
    });
    it('testConstructionOfValidSlotDate_mustReturnProperInstance', () => {
        const slotDate = new AbstractSlotDate(322,100);
        expect(slotDate.getEpoch()).to.be.eq(322);
        expect(slotDate.getSlot()).to.be.eq(100);
    });
});

describe('Test "after()" of Abstract Slot Date ', () => {
    it('testAfterOfSameSlotDate_mustBeFalsy', () => {
        const slotDate = new AbstractSlotDate(322,100);
        expect(slotDate.after(slotDate)).to.be.false;
    });
    it('testAfterOfOneSlotBeforeDate_mustBeTrue', () => {
        const slotDate = new AbstractSlotDate(322,100);
        expect(slotDate.after(new AbstractSlotDate(322, 99))).to.be.true;
    });
    it('testAfterOfOneEpochBeforeDate_mustBeTrue', () => {
        const slotDate = new AbstractSlotDate(322,100);
        expect(slotDate.after(new AbstractSlotDate(321, 100))).to.be.true;
    });
});

describe('Test "before()" of Abstract Slot Date ', () => {
    it('testBeforeOfSameSlotDate_mustBeFalsy', () => {
        const slotDate = new AbstractSlotDate(322,100);
        expect(slotDate.before(slotDate)).to.be.false;
    });
    it('testBeforeOfOneSlotAfterDate_mustBeTrue', () => {
        const slotDate = new AbstractSlotDate(322,100);
        expect(slotDate.before(new AbstractSlotDate(322, 101))).to.be.true;
    });
    it('testBeforeOfOneEpochAfterDate_mustBeTrue', () => {
        const slotDate = new AbstractSlotDate(322,100);
        expect(slotDate.before(new AbstractSlotDate(323, 100))).to.be.true;
    });
});

describe('Test "sameAs()" of Abstract Slot Date ', () => {
    it('testSameAsOfSameSlotDate_mustBeTrue', () => {
        const slotDate = new AbstractSlotDate(322, 100);
        expect(slotDate.sameAs(new AbstractSlotDate(322, 100))).to.be.true;
    });
    it('testSameAsOfSameSlotDate_mustBeFalsy', () => {
        const slotDate = new AbstractSlotDate(322, 100);
        expect(slotDate.sameAs(new AbstractSlotDate(322, 99))).to.be.false;
    });
});