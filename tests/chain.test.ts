import {assert, expect} from "chai";
import {ChainSettingsWindows, MainNetworkSetting} from "../src/chain/chain";

const TestnetDummy = new ChainSettingsWindows(new Date("2017-09-23T21:44:51Z"),
    {epochLength: 21600, slotLength: 20000});

describe('Test "isSlotValid()" of TimeSetting', () => {
    it('testNegativeSlotNumberIsValid_mustBeFalsy', () => {
        expect(MainNetworkSetting.isSlotValid(-1)).to.be.false;
    });
    it('testSlotZeroIsNegative_mustBeTrue', () => {
        expect(MainNetworkSetting.isSlotValid(0)).to.be.true;
    });
    it('testSlotOverEpochLengthIsValid_mustBeFalsy', () => {
        expect(MainNetworkSetting.isSlotValid(432000)).to.be.false;
    });
});

describe('Test "isAfterOrSameAsGenesis()" of TimeSetting', () => {
    it('testDateBeforeGenesis_mustBeFalsy', () => {
        expect(MainNetworkSetting.isAfterOrSameAsGenesis(new Date("2017-09-23T21:44:50Z"))).to.be.false;
    });
    it('testDateExactlyAtGenesis_mustBeFalsy', () => {
        expect(MainNetworkSetting.isAfterOrSameAsGenesis(new Date("2017-09-23T21:44:51Z"))).to.be.true;
    });
    it('testDateExactlyAtGenesis_mustBeFalsy', () => {
        expect(MainNetworkSetting.isAfterOrSameAsGenesis(new Date("2017-09-23T20:44:51-01:00"))).to.be.true;
    });
});

describe('Test "getSlotDateOf()" of TimeSetting', () => {
    it('testGetSlotDateOfTimeBeforeGenesis_mustThrowError', () => {
        assert.throws(() => MainNetworkSetting.getSlotDateOfTime(new Date("2017-09-23T22:44:50+01:00")));
    })
    it('testGetSlotDateOfTimeInFifthEpochChange_mustReturnCorrectDate', () => {
        const slotDate = TestnetDummy.getSlotDateOfTime(new Date("2017-10-18T22:18:11Z"));
        expect(slotDate.getEpoch()).to.be.eq(5);
        expect(slotDate.getSlot()).to.be.eq(100);
    })
    it('testGetSlotDateOfTimeBeforeParamChange_mustReturnCorrectDate', () => {
        const slotDate = MainNetworkSetting.getSlotDateOfTime(new Date("2020-07-29T21:44:31Z"));
        expect(slotDate.getEpoch()).to.be.eq(207);
        expect(slotDate.getSlot()).to.be.eq(21599);
    })
    it('testGetSlotDateOfTimeAfterParamChange_mustReturnCorrectDate', () => {
        const slotDate = MainNetworkSetting.getSlotDateOfTime(new Date("2020-07-29T21:44:51Z"));
        expect(slotDate.getEpoch()).to.be.eq(208);
        expect(slotDate.getSlot()).to.be.eq(0);
    })
});
