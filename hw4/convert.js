function convert(dec) {
    let n = Number(dec);

    if (isNaN(n) || n < -128 || n > 127) {
        alert("Decimal number should be between -128 and 127!");
        return undefined;
    }

    let bin;
    if (n >= 0) {
        bin = n.toString(2).padStart(8, "0");
    } else {
        bin = (256 + n).toString(2).padStart(8, "0");
    }

    return bin;
}
console.log(convert("1"))
console.log(convert("-1"))
console.log(convert("-15"))
console.log(convert("-128"))
console.log(convert("127"))
console.log(convert("128"))