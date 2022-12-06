const N = 4;

require("fs").readFile("6.txt", "utf-8", (_, data) => {
    const result = [...data].reduce((acc, elem, idx, arr) => {
        if (idx < N-1) return acc;
        if (acc !== undefined) return acc;
        const values = new Set(arr.slice(idx - N + 1, idx + 1));
        if (values.size === N) return idx + 1;
        return undefined;
    }, undefined);
    console.log(result);
});
