/**
 * An abstract slot date is only determined by its epoch and slot number.
 * It is missing further information about the time settings of the Cardano
 * blockchain.
 */
class AbstractSlotDate {

    readonly epoch: number;
    readonly slot: number;

    /**
     * Creates a new instance of an abstract slot date with a specified epoch
     * and slot. Both must be a positive number.
     *
     * @param epoch is the epoch number of this date.
     * @param slot is the slot number of this date.
     */
    constructor(epoch: number, slot: number) {
        if (epoch < 0) {
            throw new Error('the specified epoch must be a positive number');
        }
        if (slot < 0) {
            throw new Error('the specified slot must be a positive number');
        }
        this.epoch = epoch;
        this.slot = slot;
    }

    /**
     * Gets the number of the epoch of this slot date.
     *
     * @return the number of the epoch, which cannot be negative or zero.
     */
    getEpoch(): number {
        return this.epoch;
    }

    /**
     * Gets the number of the slot of this slot date, which is counted from
     * the start of the epoch.
     *
     * @return the number  of the slot, which cannot be negative or zero.
     */
    getSlot(): number {
        return this.slot;
    }

    /**
     * Checks whether this slot date is strictly after the given slot date.
     *
     * @param otherPlain which shall be compared to this slot date.
     * @return true, if this slot date is strictly after the given slot date,
     * otherwise false.
     */
    after(otherPlain: AbstractSlotDate): boolean {
        return this.epoch > otherPlain.getEpoch()
            || (this.epoch === otherPlain.getEpoch() && this.slot > otherPlain.getSlot());
    }

    /**
     * Checks whether this slot date is strictly before the given slot date.
     *
     * @param otherPlain which shall be compared to this slot date.
     * @return true, if this slot date is strictly before the given slot date,
     * otherwise false.
     */
    before(otherPlain: AbstractSlotDate): boolean {
        return this.epoch < otherPlain.getEpoch()
            || (this.epoch === otherPlain.getEpoch() && this.slot < otherPlain.getSlot());
    }

    /**
     * Checks whether this slot date is exactly the same as
     * the given date.
     *
     * @param otherPlain which shall be compared to this slot date.
     * @return true, if the slot dates are the same, otherwise false.
     */
    sameAs(otherPlain: AbstractSlotDate): boolean {
        return this.epoch === otherPlain.getEpoch()
            && this.slot === otherPlain.getSlot();
    }
}

export default AbstractSlotDate;
