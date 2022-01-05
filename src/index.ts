export type EpochConfig = {
    /**
     * Epoch
     * is a custom time value for when ID generation should commence.
     * Generally speaking this is set to some date (in the past).
     * @default 1640995200000
     */
    epoch?: bigint | number | string;
};

export type SunflakeConfig = EpochConfig & {
    /**
     * Machine ID
     * Must be between 0 and 1023.
     * Used to identify the ID that the snowflake was generated on and prevent collision.
     * @default 1
     */
    machineId?: bigint | number | string;
};

export const DEFAULT_EPOCH = 1_640_995_200_000n;

export const generateSunflake = (
    config?: SunflakeConfig
): ((time?: bigint | number) => string) => {
    const machineId = BigInt(config?.machineId ?? 1) & 1023n;
    const epoch = BigInt(config?.epoch ?? DEFAULT_EPOCH);

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
        return String((currentTime << 22n) | (machineId << 12n) | seq);
    };
};

export const decode = (
    sunflake: bigint | number | string,
    config?: EpochConfig
) => {
    const epoch = BigInt(config?.epoch || DEFAULT_EPOCH);
    let snowflake = BigInt(sunflake);
    const seq = snowflake & 4095n;

    snowflake >>= 12n;
    const machineId = snowflake & 1023n;

    snowflake >>= 10n;
    const time = epoch + snowflake;

    return { time, machineId, seq, epoch };
};
