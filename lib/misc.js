const shorturl = require("short-urls");
const solenolyrics = require("solenolyrics");
const { fetchJson } = require("fetch-json");
const { prefix } = require("../config/config");
const fs = require("fs");
const utils = require("../utils");

const short = async (link) => {
  const x = await shorturl(link, "l-o-l");
  return x.short;
};

const WebShot = async (url, fullpage) => {
  return fullpage
    ? `http://amadeus-api.herokuapp.com//api/ws?url=${url}&full_page=true`
    : `http://amadeus-api.herokuapp.com//api/ws?url=${url}`;
};

const lyrics = async (query) => {
  try {
    var lyrics = await solenolyrics.requestLyricsFor(query);
    var tittle = await solenolyrics.requestTitleFor(query);
    var autor = await solenolyrics.requestAuthorFor(query);
    if (!lyrics) return "Cancion no encontrada.";
    return `*${tittle}*\n${autor}\n\n${lyrics}`;
  } catch (err) {
    return "Cancion no encontrada.";
  }
};

const news = async (id) => {
  if (id) {
    return fetchJson
      .get(`http://amadeus-api.herokuapp.com/api/news/anime?id=${id}`)
      .then(async function (result) {
        if (result.error) return { text: "Ocurrio un error" };
        let image = { url: result.mainImage };
        if (result.mainImage.includes("webp")) {
          const x = await utils.imageDownloadAndResize(result.mainImage);
          image = fs.readFileSync(x);
          fs.unlinkSync(x);
        }

        return {
          image: image,
          caption: `*${result.title}*\n\n${result.news}${
            result.videos.length > 0 ? "\n\nVideo:" + result.videos[0].url : ""
          }\n\n${result.post}`,
        };
      });
  }

  return fetchJson
    .get(`http://amadeus-api.herokuapp.com/api/news/anime`)
    .then(function (result) {
      if (result.error) return { text: "Ocurrio un error" };
      let rows = result.results.map((x) => ({
        title: x.title,
        rowId: prefix + "news $id" + x.id,
      }));

      return {
        title: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tResultados",
        text: `Selecciona una opcion en el menu a continuacion para ver los detalles de la noticia.`,
        footer: "Kurisu-BotV2.0.0 by Leon564",
        buttonText: "Noticias Anime",
        sections: [{ title: "Resultados", rows }],
      };
    });
};
module.exports = {
  short,
  WebShot,
  lyrics,
  news,
};
