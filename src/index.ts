export type SunflakeConfig = {
    /**
     * Machine ID
     * Must be between 0 and 1023.
     * Used to identify the ID that the snowflake was generated on and prevent collision.
     * @default 1
     */
    machineID?: bigint | number;
    /**
     * Epoch
     * is a custom time value for when ID generation should commence.
     * Generally speaking this is set to some date (in the past).
     * @default 1640995200000
     */
    epoch?: bigint | number;
};

export const generateSunflake = (
    config: SunflakeConfig
): ((time?: bigint | number) => string) => {
    const machineID = BigInt(config?.machineID ?? 1) & 1023n;
    const epoch = BigInt(config?.epoch ?? 1640995200000);

    let lastTime = 0n;
    let seq = 0n;

    return (time: bigint | number = Date.now()) => {
        // subtract epoch from received timestamp
        let currentTime = BigInt(time) - epoch;

        // generate sequence number
        if (currentTime <= lastTime) {
            if (seq < 4095n) {
                currentTime = lastTime;
                ++seq;
            } else {
                currentTime = ++lastTime;
                seq = 0n;
            }
        } else {
            lastTime = currentTime;
            seq = 0n;
        }

        // generate sunflake
        return String((currentTime << 22n) | (machineID << 12n) | seq);
    };
};
