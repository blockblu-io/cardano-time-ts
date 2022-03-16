import AbstractSlotDate from "./abstract";
import {ChainSettingsWindows} from "../chain/chain";

/**
 * A concrete slot date contains all information of an abstract slot date,
 * but has additionally information about the time settings of a concrete
 * blockchain (it exists in).
 */
class ConcreteSlotDate extends AbstractSlotDate {

    readonly setting: ChainSettingsWindows

    constructor(epoch: number, slot: number, setting: ChainSettingsWindows) {
        super(epoch, slot);
        this.setting = setting;
    }

    /**
     * Gets the number of slots to this slot date counted from the genesis.
     *
     * @return the number of slots to this slot date counted from the genesis, which
     * cannot be negative or zero.
     */
    getSlotsFromGenesis(): number {
        switch (this.setting.size()) {
            case 0:
                throw new Error("the chain settings for this slot date hasn't been created properly");
            case 1:
                const initialEpochLength = this.setting.windows[0].parameters.epochLength;
                return super.getEpoch() * initialEpochLength + super.getSlot();
            default:
                break;
        }
        let totalSlots = 0;
        for (let i = 0; i < this.setting.size(); i++) {
            const s0 = this.setting.windows[i];
            if (s0.start > super.getEpoch()) {
                break;
            }
            const sNext = (i + 1 !== this.setting.size()) ? this.setting.windows[i + 1] : null;
            const nextStart = Math.min(super.getEpoch(), sNext !== null ? sNext.start : Infinity);
            totalSlots += s0.parameters.epochLength * (nextStart - s0.start);
        }
        return totalSlots + this.getSlot();
    }

    /**
     * Gets the start time of the slot, which this instance represents.
     *
     * @return the start time of the slot.
     */
    getStartTime(): Date {
        const startTime = new Date();
        switch (this.setting.size()) {
            case 0:
                throw new Error("the chain settings for this slot date hasn't been created properly");
            case 1:
                const sInit = this.setting.windows[0];
                const initialEpochLength = sInit.parameters.epochLength;
                const initialSlotLength = sInit.parameters.slotLength;
                startTime.setTime(this.setting.genesisBlockTime.getTime() +
                    initialSlotLength * (initialEpochLength * super.getEpoch() + super.getSlot()));
                return startTime;
            default:
                break;
        }
        let checkpoint = this.setting.genesisBlockTime.getTime();
        let latestSlotLength = 0;
        for (let i = 0; i < this.setting.size(); i++) {
            const s0 = this.setting.windows[i];
            if (s0.start > super.getEpoch()) {
                break;
            }
            latestSlotLength = s0.parameters.slotLength;
            const sNext = (i + 1 !== this.setting.size()) ? this.setting.windows[i + 1] : null;
            const nextStart = Math.min(super.getEpoch(), sNext !== null ? sNext.start : Infinity);
            checkpoint += s0.parameters.epochLength * latestSlotLength * (nextStart - s0.start);
        }
        startTime.setTime(checkpoint + latestSlotLength * super.getSlot());
        return startTime;
    }

    /**
     * Gets the start time of the slot, which this instance represents.
     *
     * @return the start time of the slot.
     */
    getEndTime(): Date {
        const endDate = new Date();
        const epochSetting = this.setting.getSettingsFor(super.getEpoch());
        endDate.setTime(this.getStartTime().getTime() + epochSetting.slotLength);
        return endDate;
    }

}

export default ConcreteSlotDate;
