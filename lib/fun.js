const { fetchJson } = require("fetch-json");
const { imageDownloadAndResize, fileDelete } = require("../utils");
const { rollDice } = require("../data/stickers/rollDice");
const answers = require("../data/answers8Ball.json");
const fs = require("fs");
const { prefix } = require("../config/config");

const meme = async () => {
  const meme = await fetchJson.get("http://amadeus-api.herokuapp.com/api/meme");

  return meme.url;
};

async function phrase() {
  try {
    const phrase = await fetchJson.get(
      "http://amadeus-api.herokuapp.com/api/frase"
    );

    return phrase.phrase;
  } catch (err) {
    return "Ocurrio un error";
  }
}

const hub = async (p1, p2, callback) => {
  try {
    const logohub = await imageDownloadAndResize(
      `https://logohub.appspot.com/${p1}-${p2}.png`
    );
    await callback(logohub, false);
    fs.unlinkSync(logohub);
    return true;
  } catch (err) {
    callback(false, true);
    return false;
  }
};

const ball = async (question) => {
  if (question && question.split(" ").length > 0) {
    const res = answers[Math.floor(Math.random() * answers.length)];
    return "Respuesta: " + res;
  } else {
    return "Realice una pregunta ";
  }
};

const roll = async () => {
  return await rollDice();
};

const SearchAnime = async (query, byId = false) => {
  if (byId) {
    var anime = await fetchJson.get(
      `http://amadeus-api.herokuapp.com/api/anime/search?url=${query}`
    );
    if (anime.results.error) return { text: "No se encontraron resultados" };
      
    var puntuacion = "";
    for (
      var i = 0;
      i < parseInt(parseInt(anime.results[0].vote_average) / 2);
      i++
    ) {
      puntuacion += "⭐";
    }
    return {
      image: { url: anime.results[0].poster },
      caption:
        "\n*🗡️Titulo🗡️:* " +
        anime.results[0].title +
        "\n\n*🕘Año de estreno🕘:* " +
        anime.results[0].relase_date +
        "\n\n*⚔Generos⚔:* " +
        anime.results[0].genres.join("✔ ") +
        "✔\n\n*💠Episodios💠:* " +
        anime.results[0].episodes +
        "\n*puntuacion:*" +
        puntuacion +
        "\n\n*Estado:* " +
        anime.results[0].state +
        "✅  *Tipo:* " +
        anime.results[0].type +
        "✅\n\n*Puedes verlo en:* " +
        anime.results[0].url +
        "\n\n*Sinopsis:* " +
        anime.results[0].about,
    };
  }
  var anime = await fetchJson.get(
    `http://amadeus-api.herokuapp.com/api/anime/search?q=${query}`
  );
  if(anime.results.error || !anime.results[0])return{text:'No se encontraron resultados'}
  if (anime.results.length > 1) {
    let rows = anime.results.map((x) => ({
      title: x.title,
      rowId: prefix + "anime $id" + x.url,
    }));
    return {
      title: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tResultados",
      text: `Selecciona una opcion en el menu a continuacion para ver los detalles del anime.`,
      footer: "Kurisu-BotV2.0.0 by Leon564",
      buttonText: "Animes",
      sections: [{ title: "Resultados", rows }],
    };
  }
  
  var puntuacion = "";
    for (
      var i = 0;
      i < parseInt(parseInt(anime.results[0].vote_average) / 2);
      i++
    ) {
      puntuacion += "⭐";
    }
    return {
      image: { url: anime.results[0].poster },
      caption:
        "\n*🗡️Titulo🗡️:* " +
        anime.results[0].title +
        "\n\n*🕘Año de estreno🕘:* " +
        anime.results[0].relase_date +
        "\n\n*⚔Generos⚔:* " +
        anime.results[0].genres.join("✔ ") +
        "✔\n\n*💠Episodios💠:* " +
        anime.results[0].episodes +
        "\n*puntuacion:*" +
        puntuacion +
        "\n\n*Estado:* " +
        anime.results[0].state +
        "✅  *Tipo:* " +
        anime.results[0].type +
        "✅\n\n*Puedes verlo en:* " +
        anime.results[0].url +
        "\n\n*Sinopsis:* " +
        anime.results[0].about,
    };
};
const RandomAnime = async () => {
  var anime = await fetchJson.get(`http://amadeus-api.herokuapp.com/api/anime`);
  if (anime.results.error) return { text: "Ocurrio un error inesperado" };
  var puntuacion = "";
    for (
      var i = 0;
      i < parseInt(parseInt(anime.results[0].vote_average) / 2);
      i++
    ) {
      puntuacion += "⭐";
    }
    return {
      image: { url: anime.results[0].poster },
      caption:
        "\n*🗡️Titulo🗡️:* " +
        anime.results[0].title +
        "\n\n*🕘Año de estreno🕘:* " +
        anime.results[0].relase_date +
        "\n\n*⚔Generos⚔:* " +
        anime.results[0].genres.join("✔ ") +
        "✔\n\n*💠Episodios💠:* " +
        anime.results[0].episodes +
        "\n*puntuacion:*" +
        puntuacion +
        "\n\n*Estado:* " +
        anime.results[0].state +
        "✅  *Tipo:* " +
        anime.results[0].type +
        "✅\n\n*Puedes verlo en:* " +
        anime.results[0].url +
        "\n\n*Sinopsis:* " +
        anime.results[0].about,
    };
};
const movie = async (query, byId = false) => {
  if (byId) {
    var peli = await fetchJson.get(
      `http://amadeus-api.herokuapp.com/api/movie?url=${query}`
    );
    if (peli.error || peli.results.length < 1)
      return { text: "No se encontaron resultados" };
    var puntuacion = "";
    for (var i = 0; i < parseInt(parseInt(peli.results.score / 2)); i++) {
      puntuacion += "⭐";
    }
    return {
      image: { url: peli.results.poster },
      caption:
        "\n*🗡️Titulo🗡️:* " +
        peli.results.title +
        "\n*💠Titulo Original💠:* " +
        peli.results.original_title +
        "\n\n*🕘Fecha de estreno🕘:* " +
        peli.results.relase_date +
        "\n\n*⚔Generos⚔:* " +
        peli.results.genres.join("✔ ") +
        "✔\n\n*puntuacion:*" +
        puntuacion +
        "\n\n*sinopsis:* " +
        peli.results.overview +
        "\n\n*Zelda:* " +
        peli.results.url,
    };
  }
  var peli = await fetchJson.get(
    `http://amadeus-api.herokuapp.com/api/movie?q=${query}`
  );
  if (peli.error || peli.results.length < 1)
    return { text: "Ocurrio un error inesperado" };

  if (peli.results.length > 1) {
    let rows = peli.results.map((x) => ({
      title: x.title,
      rowId: prefix + "movie $id" + x.url,
    }));
    return {
      title: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tResultados",
      text: `Selecciona una opcion en el menu a continuacion para ver los detalles de la pelicula.`,
      footer: "Kurisu-BotV2.0.0 by Leon564",
      buttonText: "Personajes",
      sections: [{ title: "Resultados", rows }],
    };
  }
  var puntuacion = "";
  for (var i = 0; i < parseInt(parseInt(peli.results[0].score / 2)); i++) {
    puntuacion += "⭐";
  }
  return {
    image: { url: peli.results[0].poster },
    caption:
      "\n*🗡️Titulo🗡️:* " +
      peli.results[0].title +
      "\n*💠Titulo Original💠:* " +
      peli.results[0].original_title +
      "\n\n*🕘Fecha de estreno🕘:* " +
      peli.results[0].relase_date +
      "\n\n*⚔Generos⚔:* " +
      peli.results[0].genres.join("✔ ") +
      "✔\n\n*puntuacion:*" +
      puntuacion +
      "\n\n*sinopsis:* " +
      peli.results[0].overview +
      "\n\n*Zelda:* " +
      peli.results.url,
  };
};
const character = async (query, byId = false) => {
  if (byId) {
    var result = await fetchJson.get(
      `http://amadeus-api.herokuapp.com/api/anime/character?id=${query}`
    );
    if (result.error) return { text: "No se encontraron resultados" };
    return {
      image: { url: result.image.image_url },
      caption:
        "\n*Nombre:* " + result.name + "\n*Descripción* \n" + result.about,
    };
  }
  var result = await fetchJson.get(
    `http://amadeus-api.herokuapp.com/api/anime/character?name=${query}`
  );
  if (result.error) return { text: "No se encontraron resultados" };
  if (result.length > 1) {
    let rows = result.map((x) => ({
      title: x.name,
      rowId: prefix + "ch $id" + x.id,
    }));
    return {
      title: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tResultados",
      text: `Selecciona una opcion en el menu a continuacion para ver los detalles del personaje.`,
      footer: "Kurisu-BotV2.0.0 by Leon564",
      buttonText: "Personajes",
      sections: [{ title: "Resultados", rows }],
    };
  }
  return {
    image: { url: result.image.image_url },
    caption: "\n*Nombre:* " + result.name + "\n*Descripción* \n" + result.about,
  };
};

module.exports = {
  meme,
  phrase,
  hub,
  ball,
  roll,
  SearchAnime,
  RandomAnime,
  movie,
  character,
};
