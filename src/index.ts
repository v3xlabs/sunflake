import { hexToDec } from './hex2dec';

let lastTime: number = 0;
let seq: number = 0;

export type SunflakeConfig = {
    /**
     * Machine ID
     * Must be between 0 and 1023.
     * Used to identify the ID that the snowflake was generated on and prevent collision.
     * @default 1
     */
    machineID?: number;
    /**
     * Epoch
     * is a custom time value for when ID generation should commence.
     * Generally speaking this is set to some date (in the past).
     * @default 1640988001000
     */
    epoch?: number;
};

// if B is true, it will return raw T, else it will return Promise<T>
type MaybePromise<T, B extends boolean> = B extends true ? (time?: number) => T : (time?: number) => Promise<T>;

const generateSnowflakeWithSeq = (config: Required<SunflakeConfig>, time: number, seq: number) => {
    let { machineID, epoch } = config;

    lastTime = time;

    machineID = machineID % 1023;

    const bTime = (time - epoch).toString(2);

    let bSeq = seq.toString(2);
    let bMid = machineID.toString(2);

    // Create sequence binary bit
    while (bSeq.length < 12) bSeq = '0' + bSeq;
    while (bMid.length < 10) bMid = '0' + bMid;

    const bid = bTime + bMid + bSeq;

    let id = '';
    for (let i = bid.length; i > 0; i -= 4) {
        id = parseInt(bid.substring(i - 4, i), 2).toString(16) + id;
    }

    return hexToDec(id);
};

export const generateSunflake = <S extends boolean = false>(config: SunflakeConfig, runSync?: S): MaybePromise<string, S> => {
    const fullConfig = Object.assign({ machineID: 1, epoch: 1640988001000 }, config);

    return (runSync ? 
        (time: number = Date.now()) => {
            // Get the sequence number
            if (lastTime == time) {
                seq++;
                
                if (seq > 4095) {
                    seq = 0;
                }
            } else {
                seq = 0;
            }
            
            return generateSnowflakeWithSeq(fullConfig, time, seq);
        }
        :
        async (time: number = Date.now()) => {
            // Get the sequence number
            if (lastTime == time) {
                seq++;
        
                if (seq > 4095) {
                    seq = 0;
                    
                    // Make system wait till time is been shifted by one millisecond
                    while (Date.now() <= time) {
                        await new Promise<void>((acc) => setImmediate(acc));
                    }
                }
            } else {
                seq = 0;
            }
        
            return generateSnowflakeWithSeq(fullConfig, time, seq);
        }) as MaybePromise<string, S>;
};