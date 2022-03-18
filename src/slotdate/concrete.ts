import AbstractSlotDate from "./abstract";
import {ChainSettingsWindows, Window} from "../chain/chain";

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
        let checkpoint: Window = this.setting.windows[0];
        for (let i = 1; i < this.setting.size(); i++) {
            if (this.setting.windows[i].start.epoch > super.getEpoch()) {
                break;
            }
            checkpoint = this.setting.windows[i];
        }
        return checkpoint.start.totalSlots + (super.getEpoch() - checkpoint.start.epoch)
            * checkpoint.parameters.epochLength + super.getSlot();
    }

    /**
     * Gets the start time of the slot, which this instance represents.
     *
     * @return the start time of the slot.
     */
    getStartTime(): Date {
        let checkpoint: Window = this.setting.windows[0];
        for (let i = 1; i < this.setting.size(); i++) {
            if (this.setting.windows[i].start.epoch > super.getEpoch()) {
                break;
            }
            checkpoint = this.setting.windows[i];
        }
        const startTime = new Date();
        startTime.setTime(checkpoint.start.time.getTime() + checkpoint.parameters.slotLength * (super.getSlot()
            + (super.getEpoch() - checkpoint.start.epoch) * checkpoint.parameters.epochLength));
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
