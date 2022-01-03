import { generateSunflake } from '../src';

const EPOCH: number = 1640988001000; // First second of 2022

it('Exports Sunflake', () => {
    expect(generateSunflake);
});

const snowflake = generateSunflake({ machineID: 1, epoch: EPOCH });

describe('Promise', () => {
    it('Generates two snowflake value', () => {
        const flake1 = snowflake();
        const flake2 = snowflake();
    
        expect(flake1 != flake2);
    });
    
    it('Generates two snowflake value in sync', async () => {
        const [flake1, flake2] = await Promise.all([
            snowflake(),
            snowflake()
        ]);
    
        expect(flake1 != flake2);
    });
    
    it('Generates two snowflake value in sync with same time', async () => {
        const time = Date.now();
        const [flake1, flake2] = await Promise.all([
            snowflake(time),
            snowflake(time),
        ]);
    
        expect(flake1 !== flake2);
    });
    
    it('Generates 500 snowflake value in sync with same time', async () => {
        const time = Date.now();
        const hugeList = [];
        for (let i = 0; i <= 500; i++) {
            hugeList.push(snowflake(time));
        }
        
        const list = await Promise.all(hugeList);
    
        expect(new Set(list).size === list.length);
    });
    
    it('Generates 5200 snowflake value in sync with same time', async () => {
        const time = Date.now();
        const hugeList = [];
        for (let i = 0; i <= 5200; i++) {
            hugeList.push(snowflake(time));
        }
    
        const list = await Promise.all(hugeList);
    
        expect(new Set(list).size === list.length);
    });
});