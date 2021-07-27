const express = require("express");
const bodyParser = require("body-parser");
const { reflect } = require("async");
const cipher = require(__dirname + "/ceaserCipher.js")

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let output = "";
let historyArray = {
    input: [],
    shift: [],
    operation: [],
    output: []
};

app.get("/", function (req, res) {
    res.render("index", {
        outputMsg: output,
        historyArray: historyArray,
        historyInp: historyArray.input,
        historyShift: historyArray.shift,
        historyOut: historyArray.output,
        historyOp: historyArray.operation
    });
});

app.post("/", function (req, res) {
    let input = req.body.input;
    let shift = (req.body.shift) % 26;
    historyArray.input.push(input);
    historyArray.shift.push(shift);

    if (req.body.message === "encrypt") {
        output = cipher.encrypt(input, shift);
        historyArray.operation.push("+");
    }
    else if (req.body.message === "decrypt") {
        output = cipher.decrypt(input, shift);
        historyArray.operation.push("-");
    }
    historyArray.output.push(output);

    if (req.body.reset === "doit") {
        historyArray = {
            input: [],
            shift: [],
            operation: [],
            output: []
        };
    }
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("server running on port 3000");
});