import {
    decode,
    DEFAULT_EPOCH,
    generateSunflake,
    SunflakeConfig,
} from '../src';

const EPOCH: number = 1_640_995_200_000; // January 1st, 2022

it('Exports Sunflake', () => {
    expect(generateSunflake);
});

const snowflake = generateSunflake({ machineId: 1, epoch: EPOCH });

describe('Promise', () => {
    it('Generates two snowflake value', () => {
        const flake1 = snowflake();
        const flake2 = snowflake();

        expect(flake1 != flake2).toBe(true);
    });

    it('Generates two snowflake value in sync', async () => {
        const [flake1, flake2] = await Promise.all([snowflake(), snowflake()]);

        expect(flake1 != flake2).toBe(true);
    });

    it('Generates two snowflake value in sync with same time', async () => {
        const time = Date.now();
        const [flake1, flake2] = await Promise.all([
            snowflake(time),
            snowflake(time),
        ]);

        expect(flake1 !== flake2).toBe(true);
    });

    it('Generates 500 snowflake value in sync with same time', async () => {
        const time = Date.now();
        const hugeList = [];

        for (let inc = 0; inc <= 500; inc++) {
            hugeList.push(snowflake(time));
        }

        const list = await Promise.all(hugeList);

        expect(new Set(list).size).toBe(list.length);
    });

    it('Generates 5200 snowflake value in sync with same time', async () => {
        const time = Date.now();
        const hugeList = [];

        for (let inc = 0; inc < 5200; inc++) {
            hugeList.push(snowflake(time));
        }

        const list = await Promise.all(hugeList);

        expect(new Set(list).size).toBe(list.length);
    });

    it('Tests machineID overflow', () => {
        const some_constant = 83_196_983_689;
        const snowflake = generateSunflake({
            machineId: 1025,
            epoch: 0,
        });

        expect(snowflake(some_constant)).toBe(
            String((BigInt(some_constant) << BigInt(22)) + (BigInt(1) << BigInt(12)))
        );
    });

    describe('decode() tests', () => {
        it('runs with custom input', () => {
            const epoch = BigInt(1_739_461_378);
            const machineID = BigInt(420);
            const time = BigInt(38_735_781_431);
            const config: SunflakeConfig = { epoch, machineId: machineID };
            const sunflake = generateSunflake(config);
            const snowflake = sunflake(time);
            const parsed = decode(snowflake, config);

            expect(parsed.epoch).toBe(config.epoch);
            expect(parsed.machineId).toBe(config.machineId);
            expect(parsed.time).toBe(time);
            expect(parsed.seq).toBe(BigInt(0));
        });
        it('runs with defaults', () => {
            const now = Date.now();
            const sunflake = generateSunflake();
            const snowflake = sunflake(now);
            const { epoch, machineId, seq, time } = decode(snowflake);

            expect(epoch).toBe(DEFAULT_EPOCH);
            expect(machineId).toBe(BigInt(1));
            expect(seq).toBe(BigInt(0));
            expect(time).toBe(BigInt(now));
        });
    });
});
