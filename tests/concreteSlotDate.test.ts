import {assert, expect} from "chai";
import ConcreteSlotDate from "../src/slotdate/concrete";
import {ChainSettingsWindows, MainNetworkSetting} from "../src/chain/chain";

const TestnetDummy = new ChainSettingsWindows(new Date("2017-09-23T21:44:51Z"),
    {epochLength: 21600, slotLength: 20000});

describe('Test constructor of Concrete Slot Date', () => {
    it('testConstructionOfSlotDateWithNegativeEpoch_mustThrowError', () => {
        assert.throws(() => new ConcreteSlotDate(-1, 1, MainNetworkSetting));
    });
    it('testConstructionOfSlotDateWithNegativeSlot_mustThrowError', () => {
        assert.throws(() => new ConcreteSlotDate(1, -1, MainNetworkSetting));
    });
    it('testConstructionOfValidSlotDate_mustReturnProperInstance', () => {
        const slotDate = new ConcreteSlotDate(322,100, MainNetworkSetting);
        expect(slotDate.getEpoch()).to.be.eq(322);
        expect(slotDate.getSlot()).to.be.eq(100);
    });
});

describe('Test "getSlotsFromGenesis()" of Concrete Slot Date', () => {
    it('testSlotsFromGenesisFirstEpoch_mustReturnCorrectTotalNumber', () => {
        const slotDate = new ConcreteSlotDate(0,100, MainNetworkSetting);
        expect(slotDate.getSlotsFromGenesis()).to.be.eq(100);
    });
    it('testSlotsFromGenesisFifthEpochTestnetDummy_mustReturnCorrectTotalNumber', () => {
        const slotDate = new ConcreteSlotDate(5,100, TestnetDummy);
        expect(slotDate.getSlotsFromGenesis()).to.be.eq(108100);
    });
    it('testSlotsFromGenesisBeforeParamChange_mustReturnCorrectTotalNumber', () => {
        const slotDate = new ConcreteSlotDate(207,21599, MainNetworkSetting);
        expect(slotDate.getSlotsFromGenesis()).to.be.eq(4492799);
    });
    it('testSlotsFromGenesisAfterParamChange_mustReturnCorrectTotalNumber', () => {
        const slotDate = new ConcreteSlotDate(208,0, MainNetworkSetting);
        expect(slotDate.getSlotsFromGenesis()).to.be.eq(4492800);
    });
});

describe('Test "getStartTime()" of Concrete Slot Date', () => {
    it('testGetStartTimeFirstEpochSlot_mustReturnCorrectDate', () => {
        const slotDate = new ConcreteSlotDate(0,100, MainNetworkSetting);
        expect(slotDate.getStartTime().getTime()).to.be.eq(new Date("2017-09-23T22:18:11Z").getTime());
    });
    it('testSlotsFromGenesisFifthEpochTestnetDummy_mustReturnCorrectTotalNumber', () => {
        const slotDate = new ConcreteSlotDate(5,100, TestnetDummy);
        expect(slotDate.getStartTime().getTime()).to.be.eq(new Date("2017-10-18T22:18:11Z").getTime());
    });
    it('testGetStartTimeBeforeParamChange_mustReturnCorrectDate', () => {
        const slotDate = new ConcreteSlotDate(207,21599, MainNetworkSetting);
        expect(slotDate.getStartTime().getTime()).to.be.eq(new Date("2020-07-29T21:44:31Z").getTime());
    });
    it('testGetStartTimeAfterParamChange_mustReturnCorrectDate', () => {
        const slotDate = new ConcreteSlotDate(208,0, MainNetworkSetting);
        expect(slotDate.getStartTime().getTime()).to.be.eq(new Date("2020-07-29T21:44:51Z").getTime());
    });
});

describe('Test "getEndTime()" of Concrete Slot Date', () => {
    it('testGetEndTimeBeforeParamChange_mustReturnCorrectDate', () => {
        const slotDate = new ConcreteSlotDate(207,21599, MainNetworkSetting);
        expect(slotDate.getEndTime().getTime()).to.be.eq(new Date("2020-07-29T21:44:51Z").getTime());
    });
    it('testGetEndTimeAfterParamChange_mustReturnCorrectDate', () => {
        const slotDate = new ConcreteSlotDate(208,0, MainNetworkSetting);
        expect(slotDate.getEndTime().getTime()).to.be.eq(new Date("2020-07-29T21:44:52Z").getTime());
    });
});
