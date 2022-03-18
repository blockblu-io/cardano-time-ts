import ConcreteSlotDate from "../slotdate/concrete";

/**
 * Chain settings is a map of values of a certain instance of the
 * Cardano blockchain.
 */
type ChainSettings = { slotLength: number, epochLength: number, [key: string]: any };

/**
 * A window key states the epoch, total slots from genesis and time from
 * which the parameter updates of this window become active.
 */
type WindowKey = { epoch: number, totalSlots: number, time: Date };

/**
 *
 */
type Window = { start: WindowKey, parameters: ChainSettings };

/**
 * Settings can change over time on the chain, and a window allows the
 * overriding of a previously specified value beginning from a given
 * starting time.
 */
class ChainSettingsWindows {

    readonly genesisBlockTime: Date
    readonly windows: Window[]

    /**
     * Creates a new time setting object for a certain Cardano blockchain instance
     * with the specified settings.
     *
     * @param genesisBlockTime exact time of the genesis block (i.e. the start time
     * of slot 1 in epoch 1)
     * @param initialSetting the chain settings that have been active at start.
     */
    constructor(genesisBlockTime: Date, initialSetting: ChainSettings) {
        this.genesisBlockTime = genesisBlockTime;
        this.windows = [{start: {epoch: 0, totalSlots: 0, time: this.genesisBlockTime}, parameters: initialSetting}]
    }

    /**
     * Checks whether the given slot is valid considering
     * this time setting.
     *
     * @param slot which shall be checked for validity.
     */
    isSlotValid(slot: number): boolean {
        return this.isSlotOfEpochValid(slot);
    }

    /**
     * Considers the chain settings of the specified epoch to check
     * whether the given slot is valid or not. If no epoch is specified,
     * then the latest settings will be considered.
     *
     * @param epoch in which the slot validity shall be checked.
     * @param slot for which the validity shall be checked.
     */
    isSlotOfEpochValid(slot: number, epoch?: number,): boolean {
        const settings = this.getSettingsFor(epoch);
        const epochLength: number = settings.epochLength;
        return 0 <= slot && slot < epochLength;
    }

    /**
     * Checks whether the given date is after the inception of
     * the genesis block or exactly at the same time, i.e. the
     * time is not strictly before the inception of the genesis
     * block.
     *
     * @param oDate which shall be checked.
     */
    isAfterOrSameAsGenesis(oDate: Date): boolean {
        return oDate >= this.genesisBlockTime;
    }

    /**
     * Gets the concrete slot date for the given time. The given time
     * must not be before the genesis block.
     *
     * @param time for which the slot date shall be returned.
     * @return the concrete slot date of the passed time.
     * @throws an error, if the time is strictly before the genesis time.
     */
    getSlotDateOf(time: Date): ConcreteSlotDate {
        if (time < this.genesisBlockTime) {
            throw new Error("the specified time must not be before the inception of genesis block")
        }
        let start: WindowKey = this.windows[0].start;
        for (let i = 1; i < this.size(); i++) {
            if (this.windows[i].start.time.getTime() > time.getTime()) {
                break;
            }
            start = this.windows[i].start;
        }
        const relSetting = this.getSettingsFor(start.epoch);
        const diffInMs = time.getTime() - start.time.getTime();
        const diffEpoch = Math.floor(diffInMs / (relSetting.slotLength * relSetting.epochLength));
        const diffSlot = Math.floor((diffInMs / relSetting.slotLength)) % relSetting.epochLength;
        return new ConcreteSlotDate(start.epoch + diffEpoch, diffSlot, this);
    }

    /**
     * Adds an update to the chain settings in the specified epoch. The specified
     * epoch must be
     *
     * @param epoch in which the chain settings shall be updated.
     * @param setting which shall be updated in specified epoch.
     */
    addParameterUpdate(epoch: number, setting: ChainSettings): ChainSettingsWindows {
        const w0 = this.windows[this.windows.length - 1];
        if (epoch <= w0.start.epoch) {
            throw new Error("the setting update must strictly start after the epoch of the last update");
        }
        const diffSlots = w0.parameters.epochLength * (epoch - w0.start.epoch);
        const totalSlots = w0.start.totalSlots + diffSlots;
        const time = new Date();
        time.setTime(w0.start.time.getTime() + w0.parameters.slotLength * diffSlots);
        this.windows.push({start: {epoch, totalSlots, time}, parameters: setting})
        return this;
    }

    /**
     * Get the settings on the chain that are active at the specified epoch. If
     * no epoch is specified, then the latest settings will be returned.
     *
     * @param epoch for which the settings shall be gathered (optionally).
     * @return the chain settings.
     */
    getSettingsFor(epoch?: number): ChainSettings {
        let settings: ChainSettings = {slotLength: 0, epochLength: 0}
        for (let i = 0; i < this.size(); i++) {
            const window = this.windows[i];
            if (epoch !== undefined && epoch !== null && epoch < window.start.epoch) {
                break;
            }
            settings = {...settings, ...window.parameters}
        }
        return settings;
    }

    /**
     * Checks whether a setting under the specified key has been specified
     * from the inception of this blockchain. This method doesn't check whether
     * a setting has been added later.
     *
     * @param key of the setting that shall be checked.
     */
    hasSettingFromInception(key: string): boolean {
        return key in this.windows[0].parameters;
    }

    /**
     * Gets the number of windows.
     *
     * @return the number of windows.
     */
    size(): number {
        return this.windows.length;
    }
}

const MainNetworkSetting = new ChainSettingsWindows(new Date("2017-09-23T21:44:51Z"),
    {epochLength: 21600, slotLength: 20000}).addParameterUpdate(208, {epochLength: 432000, slotLength: 1000});

export {
    ChainSettings,
    Window,
    ChainSettingsWindows,
    MainNetworkSetting
};
