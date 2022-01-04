import { generateSunflake } from '../src';

const EPOCH: number = 1_640_995_200_000; // January 1st, 2022

it('Exports Sunflake', () => {
    expect(generateSunflake);
});

const snowflake = generateSunflake({ machineID: 1, epoch: EPOCH });

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
        for (let index = 0; index <= 500; index++) {
            hugeList.push(snowflake(time));
        }

        const list = await Promise.all(hugeList);

        expect(new Set(list).size).toBe(list.length);
    });

    it('Generates 5200 snowflake value in sync with same time', async () => {
        const time = Date.now();
        const hugeList = [];
        for (let index = 0; index < 5200; index++) {
            hugeList.push(snowflake(time));
        }

        const list = await Promise.all(hugeList);

        expect(new Set(list).size).toBe(list.length);
    });

    it('Test machineID overflow', () => {
        const some_constant = 83_196_983_689;
        const snowflake = generateSunflake({
            machineID: 1025,
            epoch: 0,
        });
        expect(snowflake(some_constant)).toBe(
            String((BigInt(some_constant) << 22n) + (1n << 12n))
        );
    });
});
