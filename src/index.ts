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

export const generateSunflake = (
    config: SunflakeConfig
): ((time?: number) => {}) => {
    let { machineID = 1, epoch = 1640988001000 } = config;

    return (time: number = Date.now()) => {
        // Get the sequence number
        if (lastTime >= time) {
            seq++;

            if (seq > 4095) {
                seq = 0;
                time++;
            }
        } else {
            seq = 0;
        }
        
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
};
