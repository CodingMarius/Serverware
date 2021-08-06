const express = require("express");

const Gpio = require("onoff").Gpio;

const cors = require("cors");

var player = require('play-sound')(opts = {});

// GLOBAL VARIABLES

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

app.listen(port, function () {
    console.log(`Application backend is listening on port: ${port}`);
});


app.get("/status", (req, res) => {
    class Values {
        constructor(belueftung, beleuchtung, audiosystem, alarm) {

            this.belueftung = belueftung;

            this.beleuchtung = beleuchtung;

            this.audiosystem = audiosystem;

            this.alarm = alarm;
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
            let msg1 = {
                msg: `Belüftung: ${belueftung}`
            };
            let switch1 = new Gpio(23, 'out');
            if (belueftung) {
                switch1.writeSync(0);
            }
            if (!belueftung) {
                switch1.writeSync(1);
            }
            console.log(msg1);
            return res.status(200).json(msg1);

        case "2":
            beleuchtung = !beleuchtung;
            let msg2 = {
                msg: `Beleuchtung: ${beleuchtung}`
            };
            let switch2 = new Gpio(24, 'out');
            if (beleuchtung) {
                switch2.writeSync(0);
            }
            if (!beleuchtung) {
                switch2.writeSync(1);
            }
            console.log(msg2);
            return res.status(200).json(msg2);

        case "3":
            audiosystem = !audiosystem;
            let msg3 = {
                msg: `Audio-System: ${audiosystem}`
            };
            console.log(msg3);
            audiosys();
            res.status(200).json(msg3);
            return;

        case "4":
            alarm = !alarm;
            let msg4 = {
                msg: `Alarm: ${alarm}`
            };
            console.log(msg4);
            alarmsys();
            res.status(200).json(msg4);
            return;
    }
});

function audiosys() {
    if (audiosystem) {
        player.play('audio-system.wav', function (err) {
            if (err) throw err
        });
    }
    return null;
}

function alarmsys() {
    if (alarm) {
        player.play('audio.wav', function (err) {
            if (err) throw err
        });
    }
    return null;
}
