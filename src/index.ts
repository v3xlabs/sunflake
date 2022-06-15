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

export const DEFAULT_EPOCH = BigInt(1_640_995_200_000);

export const generateSunflake = (
    config?: SunflakeConfig
): ((time?: bigint | number) => string) => {
    const machineId = BigInt(config?.machineId ?? 1) & BigInt(1023);
    const epoch = BigInt(config?.epoch ?? DEFAULT_EPOCH);

    let lastTime = BigInt(0);
    let seq = BigInt(0);

    return (time: bigint | number = Date.now()) => {
        // subtract epoch from received timestamp
        let currentTime = BigInt(time) - epoch;

        // generate sequence number
        if (currentTime <= lastTime) {
            if (seq < BigInt(4095)) {
                currentTime = lastTime;
                ++seq;
            } else {
                currentTime = ++lastTime;
                seq = BigInt(0);
            }
        } else {
            lastTime = currentTime;
            seq = BigInt(0);
        }

        // generate sunflake
        return String(
            (currentTime << BigInt(22)) | (machineId << BigInt(12)) | seq
        );
    };
};

export const decode = (
    sunflake: bigint | number | string,
    config?: EpochConfig
) => {
    const epoch = BigInt(config?.epoch || DEFAULT_EPOCH);
    let snowflake = BigInt(sunflake);
    const seq = snowflake & BigInt(4095);

    snowflake >>= BigInt(12);
    const machineId = snowflake & BigInt(1023);

    snowflake >>= BigInt(10);
    const time = epoch + snowflake;

    return { time, machineId, seq, epoch };
};
