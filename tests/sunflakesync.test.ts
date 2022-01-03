import { generateSunflake } from '../src';

const EPOCH: number = 1640988001000; // First second of 2022

const snowflake = generateSunflake({ machineID: 1, epoch: EPOCH }, true);

describe('Sync', () => {
    it('Generates two snowflake value', async () => {
        const flake1 = snowflake();
        const flake2 = snowflake();
    
        expect(flake1 != flake2);
    });
    
    it('Generates two snowflake value in sync', async () => {
        const [flake1, flake2] = [
            snowflake(),
            snowflake()
        ];
    
        expect(flake1 != flake2);
    });
    
    it('Generates two snowflake value in sync with same time', async () => {
        const time = Date.now();
        const [flake1, flake2] = [
            snowflake(time),
            snowflake(time),
        ];
    
        expect(flake1 !== flake2);
    });
    
    it('Generates 500 snowflake value in sync with same time', async () => {
        const time = Date.now();
        const list = [];
        for (let i = 0; i <= 500; i++) {
            list.push(snowflake(time));
        }
        
        expect(new Set(list).size === list.length);
    });
    
    it('Generates 5200 snowflake value in sync with same time', async () => {
        const time = Date.now();
        const list = [];
        for (let i = 0; i <= 5200; i++) {
            list.push(snowflake(time));
        }
    
        expect(new Set(list).size === list.length);
    });
});
