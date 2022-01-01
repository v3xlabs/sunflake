import { generateSunflake } from '../src';

const EPOCH: number = 1640988001000; // First second of 2022


it('Exports Sunflake', () => {
    expect(generateSunflake);
});

it('Generates two snowflake value', async () => {
    const flake1 = await generateSunflake({ machineID: 1, epoch: EPOCH });
    const flake2 = await generateSunflake({ machineID: 1, epoch: EPOCH });

    expect(flake1 != flake2);
});

it('Generates two snowflake value in sync', async () => {
    const [flake1, flake2] = await Promise.all([
        generateSunflake({ machineID: 1, epoch: EPOCH }),
        generateSunflake({ machineID: 1, epoch: EPOCH }),
    ]);

    expect(flake1 != flake2);
});

it('Generates two snowflake value in sync with same time', async () => {
    const time = Date.now();
    const [flake1, flake2] = await Promise.all([
        generateSunflake({ machineID: 1, epoch: EPOCH, time }),
        generateSunflake({ machineID: 1, epoch: EPOCH, time }),
    ]);

    expect(flake1 !== flake2);
});

it('Generates 500 snowflake value in sync with same time', async () => {
    const time = Date.now();
    const hugeList = [];
    for (let i = 0; i <= 500; i++) {
        hugeList.push(generateSunflake({ machineID: 1, epoch: EPOCH, time }));
    }
    
    const list = await Promise.all(hugeList);

    expect(new Set(list).size === list.length);
});

it('Generates 5200 snowflake value in sync with same time', async () => {
    const time = Date.now();
    const hugeList = [];
    for (let i = 0; i <= 5200; i++) {
        hugeList.push(generateSunflake({ machineID: 1, epoch: EPOCH, time }));
    }

    const list = await Promise.all(hugeList);

    expect(new Set(list).size === list.length);
});