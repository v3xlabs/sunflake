/**
 * A function for converting hex <-> dec w/o loss of precision.
 * By Dan Vanderkam http://www.danvk.org/hex2dec.html
 */

// Typescriptified

// Adds two arrays for the given base (10 or 16), returning the result.
// This turns out to be the only "primitive" operation we need.
const add = (x: number[], y: number[], base: number) => {
    let z = [];
    let n = Math.max(x.length, y.length);
    let carry = 0;
    let i = 0;
    while (i < n || carry) {
        let xi = i < x.length ? x[i] : 0;
        let yi = i < y.length ? y[i] : 0;
        let zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i++;
    }

    return z;
};

// Returns a*x, where x is an array of decimal digits and a is an ordinary
// JavaScript number. base is the number base of the array x.
const multiplyByNumber = (num: number, x: number[], base: number): number[] => {
    if (num == 0 || num < 0) return [];

    let result: number[] = [];
    let power = x;

    while (num !== 0) {
        if (num & 1) {
            result = add(result, power, base);
        }

        num >>= 1;

        if (num === 0) break;

        power = add(power, power, base);
    }

    return result;
};

const parseToDigitsArray = (str: string, base: number) => {
    let digits = str.split('');
    let ary = [];
    for (let i = digits.length - 1; i >= 0; i--) {
        let n = parseInt(digits[i], base);

        if (isNaN(n)) return null;

        ary.push(n);
    }

    return ary;
};

const convertBase = (str: string, fromBase: number, toBase: number) => {
    let digits = parseToDigitsArray(str, fromBase);

    if (digits === null) return null;

    let outArray: number[] = [];
    let power = [1];
    for (let i = 0; i < digits.length; i++) {
        // inletiant: at this point, fromBase^i = power
        if (digits[i]) {
            outArray = add(
                outArray,
                multiplyByNumber(digits[i] as number, power, toBase),
                toBase
            );
        }

        power = multiplyByNumber(fromBase, power, toBase);
    }

    let out = '';
    for (let i = outArray.length - 1; i >= 0; i--) {
        out += outArray[i].toString(toBase);
    }

    return out;
};

export const hexToDec = (hexStr: string) => {
    if (hexStr.startsWith('0x')) hexStr = hexStr.substring(2);
    
    hexStr = hexStr.toLowerCase();
    
    return convertBase(hexStr, 16, 10);
};
