const express = require('express');
const Gpio = require('onoff').Gpio;
const cors = require('cors');
const play = require('audio-play');
const load = require('audio-loader');

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


app.post('/save', (req, res) => {
    return res.status(200).json("Update");
});

app.post('/input/:id', (req, res) => {
    var gpio1 = new Gpio(17, 'out');
    var gpio2 = new Gpio(18, 'out');
    var gpio3 = new Gpio(22, 'out');
    var button = new Gpio(27, 'in', 'both');
    switch (req.params.id) {
        case 1:
            belueftung = !belueftung;
            if (belueftung) gpio1.write(1).catch((err) => {
                console.log(err);
            });
            if (!belueftung) gpio1.write(0).catch((err) => {
                console.log(err);
            });
            return res.status(200).json({ msg: `Belüftung: ${belueftung}` });
        case 2:
            beleuchtung = !beleuchtung;
            if (beleuchtung) gpio2.write(1).catch((err) => {
                console.log(err);
            });
            if (!beleuchtung) gpio2.write(0).catch((err) => {
                console.log(err);
            });
            return res.status(200).json({ msg: `Beleuchtung: ${beleuchtung}` });
        case 3:
            audiosystem = !audiosystem;
            if (audiosystem) gpio3.write(1).catch((err) => {
                console.log(err);
            });
            if (!audiosystem) gpio3.write(0).catch((err) => {
                console.log(err);
            });
            return res.status(200).json({ msg: `Audio-System: ${audiosystem}` });
        case 4:
            alarm = !alarm;
            if (alarm) {
                button.watch((err, value) => function() {
                    if (value === 1) {
                        return load('./audio/audio.mp3').then(play);
                    }
                });
            }
            return res.status(200).json({ msg: `Alarm: ${alarm}` });
    }
});