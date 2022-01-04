import { generateSnowflake } from '../src';

const EPOCH: number = 1640995200000; // January 1st, 2022

it('Exports Sunflake', () => {
    expect(generateSnowflake);
});

const snowconfig = { machineID: 1, epoch: EPOCH };

describe('Promise', () => {
    it('Generates two snowflake value', () => {
        const flake1 = generateSnowflake(snowconfig);
        const flake2 = generateSnowflake(snowconfig);

        expect(flake1 != flake2).toBe(true);
    });

    it('Generates two snowflake value in sync', async () => {
        const [flake1, flake2] = [generateSnowflake(snowconfig), generateSnowflake(snowconfig)];

        expect(flake1 != flake2).toBe(true);
    });

    it('Generates two snowflake value in sync with same time', async () => {
        const time = Date.now();
        const [flake1, flake2] = [
            generateSnowflake(snowconfig, time),
            generateSnowflake(snowconfig, time)
        ];

        expect(flake1 !== flake2).toBe(true);
    });

    it('Generates 500 snowflake value in sync with same time', async () => {
        const time = Date.now();
        const list = [];

        for (let i = 0; i <= 500; i++) {
            list.push(generateSnowflake(snowconfig, time));
        }

        expect(new Set(list).size === list.length);
    });

    it('Generates 5200 snowflake value in sync with same time', async () => {
        const time = Date.now();
        const list = [];
        for (let i = 0; i <= 5200; i++) {
            list.push(generateSnowflake(snowconfig, time));
        }

        expect(new Set(list).size === list.length);
    });
});
