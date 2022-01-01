import { hexToDec } from './hex2dec';

let lastTime: number = 0;
let seq: number = 0;

export type SunflakeConfig = {
    machineID: number;
    epoch: number;
    time?: number;
};

export const generateSunflake = async (config: SunflakeConfig) => {
    let { machineID, epoch, time } = Object.assign<
        SunflakeConfig,
        Partial<SunflakeConfig>
    >(
        {
            epoch: 0,
            machineID: 0,
            time: 1,
        },
        config
    ) as Required<SunflakeConfig>;

    lastTime = time;
    machineID = machineID % 1023;

    const bTime = (time - epoch).toString(2);

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

    lastTime = time;

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
