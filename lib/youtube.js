const scrape = require("scrape-yt");
const ytmp3 = require("youtube-mp3-downloader");
const path = require("path");
const fs = require("fs"),
  request = require("request");
const utils = require("../utils");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

async function youtubeMp32(msg, callback) {
  const scraping = await scrape.search(msg, { type: "video", limit: 5 });
  const video = scraping.filter((vid) => vid.duration < 600)[0];
  if (!!!video) return await callback("error");
  const videoid = video.id;
  var dir = path.join(__dirname, "..", "temp", "song-");
  var tempdir = fs.mkdtempSync(dir);

  try {
    const downloadOptions = {
      outputPath: tempdir,
      youtubeVideoQuality: "highestaudio",
      queueParallelism: 2,
      progressTimeout: 2000,
      allowWebm: false,
    };

    const downloader = new ytmp3(downloadOptions, video.title + ".mp3");
    downloader.download(videoid);
    await downloader.on("finished", async function (err, data) {
      await callback(data); //send song

      fs.rmSync(tempdir, { recursive: true }); //delete temp file and folder

      return { success: true }; //Return
    });
    downloader.on("error", async function (err, errr) {
      await callback(null, true);
    });
    downloader.on("progress", async function (p, err) {
      process.stdout.write("\033c");
      console.log(`song msg: ${msg} \nProgress:${p.progress.percentage}%`);
    });
  } catch (exception) {
    console.log(exception);
    return callback(null, exception);
  }
}
async function musicSearch(msg) {
  return new Promise(async (resolve, reject) => {
    const scraping = await scrape.search(msg, { type: "video", limit: 3 });
    if (!scraping[0]) reject({ error: true });
    const videos = scraping.map((x) => ({
      title: x.title,
      thumbnail: x.thumbnail,
      id: x.id,
    }));
    resolve(videos);
  });
}
async function ytsearch(msg, callback) {
  new Promise(async (resolve, reject) => {
    const scraping = await scrape.search(msg, { type: "video", limit: 5 });
    const video = scraping[0];
    try {
      const videourl = `https://www.youtube.com/watch?v=${video.id}`;
      await callback(false, videourl);
    } catch (err) {
      await callback(true, err);
    }
  });
}

module.exports = {
  youtubeMp32,
  ytsearch,
  musicSearch,
};
