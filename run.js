const timed =
    func =>
    (...args) => {
        console.time();
        const res = func(...args);
        console.timeLog();
        return res;
    };

const run = day => solution =>
    require("fs").readFile(day + ".txt", "utf-8", (err, data) =>
        console.log(err || timed(solution)(data)),
    );

module.exports = run;
