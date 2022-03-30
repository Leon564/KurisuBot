const fileDelete = require('./fileDelete');
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffprobe = require("@ffprobe-installer/ffprobe");
const fs = require('fs');
const path = require('path');
const ffmpeg = require("fluent-ffmpeg");




const compress = async (video, options) => {
    const proc = new ffmpeg();
    return new Promise(async (resolve, reject) => {       
        var _video = video;
        var patht = false;
        const pathh = path.join(__dirname,'..', '/temp/' + Date.now() + '.mp4');
        if (!video.includes('.mp4')) {
            _video = path.join(__dirname,'..', '/temp/t' + Date.now() + '.mp4');
            patht = _video;
            fs.writeFileSync(_video, video)

        }
        let resolution = "-s 360*480";
        //let resolution = "-s 120*360";
        if (options) {
            if (options.resolution) {
                resolution = options.resolution
            }
        }

        proc
            .input(_video)
            .noAudio()
            .outputOption([resolution])
            .output(pathh)
            .setDuration('00:00:10')
            .on("end", async () => {
                const buffer = fs.readFileSync(pathh)
                await fileDelete(pathh)
                if (patht) await fileDelete(patht)
                return resolve(buffer)
            })
            .on("error", (e) => { console.log(e); reject('error') })
            .run();
    }).catch(e=>{console.log(e)});
}

module.exports = compress;