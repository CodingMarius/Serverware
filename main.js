const express = require("express");
const Gpio = require("onoff").Gpio;
const cors = require("cors");
const play = require("audio-sink");
const load = require("audio-loader");

var belueftung = false;
var beleuchtung = false;
var audiosystem = false;
var alarm = false;

//LOAD EXPRESS
const app = express();

//EXPRESS PORT
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/views`));
app.listen(port, function() {

    console.log(`Application backend is listening on port: ${port}`);

});

app.get("/status", (req, res) => {
    class Values {
        constructor(belueftung, beleuchtung, audiosystem, alarm) {
            belueftung = belueftung;
            beleuchtung = beleuchtung;
            audiosystem = audiosystem;
            alarm = alarm;
        }
    }
    const status = new Values(belueftung, beleuchtung, audiosystem, alarm);
    return res.status(200).json(status);
});

app.post("/input/:id", (req, res) => {
    var id = req.params.id;
    switch (id) {

        case "1":
            belueftung = !belueftung;
            let switch1 = new Gpio(23, 'out');
            if (belueftung) {
                switch1.writeSync(1);
            }
            if (!belueftung) {
                switch1.writeSync(0);
            }
            console.log({ msg: `Belüftung: ${belueftung}` });
            return res.status(200).json({ msg: `Belüftung: ${belueftung}` });

        case "2":
            beleuchtung = !beleuchtung;
            let switch2 = new Gpio(24, 'out');
            if (beleuchtung) {
                switch2.writeSync(1);
            }
            if (!beleuchtung) {
                switch2.writeSync(0);
            }
            console.log({ msg: `Beleuchtung: ${beleuchtung}` });
            return res.status(200).json({ msg: `Beleuchtung: ${beleuchtung}` });

        case "3":
            audiosystem = !audiosystem;
            res.status(200).json({ msg: `Audio-System: ${audiosystem}` });

            return;
        case "4":
            alarm = !alarm;
            res.status(200).json({ msg: `Alarm: ${alarm}` });
            return;
    }
});