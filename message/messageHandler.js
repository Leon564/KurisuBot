const config = require("../config/config.js");
const makeWASocket = require("@adiwajshing/baileys");
const {
  fun,
  greeting,
  imageSearch,
  youtube,
  translate,
  speech,
  zodiac,
  simi,
  stickers,
  nfsw,
  menus,
  sfw,
  misc,
  imagesEfects,
} = require("../lib");
const { group } = require("../utils");

module.exports = async (m, sock) => {
  const prefix = config.prefix;

  var messageType = Object.keys(m.message)[0];
  var key = m.key.remoteJid;

  const isGroup = key.includes("g.us");

  const botId = config["Bot-Number"]
    ? config["Bot-Number"] + "@s.whatsapp.net"
    : sock.user.id.includes(":")
    ? sock.user.id.split(":")[0] + "@s.whatsapp.net"
    : sock.user.id;

  var message = "";
  var lowerMessage = "";
  var outPrefixMessage = false;
  var args = false;
  var media = false;
  var canonicalUrl = false;
  var msgMentions = [];
  var command = "";

  if (messageType == "conversation") {
    message = m.message.conversation;
  } else if (messageType == "imageMessage") {
    message = m.message.imageMessage.caption;
    media = m.message.imageMessage;
  } else if (messageType == "videoMessage") {
    message = m.message.videoMessage.caption;
    media = m.message.videoMessage;
  } else if (messageType == "stickerMessage") {
    console.log("m.key.remoteJid");
  } else if (messageType == "extendedTextMessage") {
    message = m.message.extendedTextMessage.text;
    try {
      if (
        m.message.extendedTextMessage.contextInfo &&
        m.message.extendedTextMessage.contextInfo.quotedMessage
      )
        messageType = Object.keys(
          m.message.extendedTextMessage.contextInfo.quotedMessage
        )[0];
      if (
        m.message.extendedTextMessage.contextInfo &&
        m.message.extendedTextMessage.contextInfo.participant
      )
        msgMentions.push(m.message.extendedTextMessage.contextInfo.participant);
      if (
        m.message.extendedTextMessage.contextInfo &&
        m.message.extendedTextMessage.contextInfo.quotedMessage &&
        m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage
      ) {
        media =
          m.message.extendedTextMessage.contextInfo.quotedMessage
            .stickerMessage;
        messageType = "stickerMessage";
      }
    } catch (e) {
      console.log(e);
    }

    if (
      m.message.extendedTextMessage.contextInfo &&
      m.message.extendedTextMessage.contextInfo.mentionedJid
    )
      for (var mention of m.message.extendedTextMessage.contextInfo
        .mentionedJid)
        msgMentions.push(mention);
    canonicalUrl = m.message.extendedTextMessage.canonicalUrl
      ? m.message.extendedTextMessage.canonicalUrl
      : false;
    if (messageType == "videoMessage")
      media =
        m.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
    if (messageType == "imageMessage")
      media =
        m.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
  } else if (
    messageType == "listResponseMessage" ||
    messageType == "messageContextInfo"
  ) {
    if (m.message.listResponseMessage) {
      message = m.message.listResponseMessage.singleSelectReply.selectedRowId;
    }
  } else if (messageType == "buttonsResponseMessage") {
    message = m.message.buttonsResponseMessage.selectedButtonId;
  } else if (messageType == "messageContextInfo") {
    if (m.message.buttonsResponseMessage)
      message = m.message.buttonsResponseMessage.selectedButtonId;
  }
  //verificar que si es comando
  if (!message.startsWith(prefix)) return;

  lowerMessage = message.toLocaleLowerCase();
  command = lowerMessage.split(" ")[0].slice(1);
  outPrefixMessage = message.slice(message.split(" ")[0].length + 1);
  args = outPrefixMessage.split(" ");

  console.log(key + " " + command);

  //COMMANDS
  if (messageType == "imageMessage" && command == "stickerbg") {
    await sock.sendPresenceUpdate("composing", key);
    var stream = false;
    var sticker = false;
    var type = "deafult";
    for (const t of config.stickerTypes) {
      if (lowerMessage.includes("$" + t)) {
        type = t;
        outPrefixMessage = outPrefixMessage.replace(
          new RegExp(`\\$${t}`, "gi"),
          ""
        );
      }
    }
    const values = outPrefixMessage.split("$");
    stream = await makeWASocket.downloadContentFromMessage(media, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    sticker = await stickers.stickerBGFromImage(
      buffer,
      values[1],
      values[2],
      type
    );

    console.log("enviando sticker BG" + type + " a: " + m.key.remoteJid);
    sock.sendMessage(m.key.remoteJid, { sticker: sticker }, { quoted: m });
    //sock.sendMessage(m.key.remoteJid, { sticker: {url:'./aa9d75c6-7fd5-429a-bbde-fa60ccaf0959.webp'} }, { quoted: m });
  } else if (command == "sticker" || command == "stiker") {
    await sock.sendPresenceUpdate("composing", key);
    var stream = "";
    var sticker = false;
    var type = "deafult";
    for (const t of config.stickerTypes) {
      if (lowerMessage.includes("$" + t)) {
        type = t;
        outPrefixMessage = outPrefixMessage.replace(
          new RegExp(`\\$${t}`, "gi"),
          ""
        );
      }
    }

    if (messageType == "imageMessage")
      stream = await makeWASocket.downloadContentFromMessage(media, "image");
    if (messageType == "videoMessage")
      stream = await makeWASocket.downloadContentFromMessage(media, "video");
    if (stream == "")
      return sock.sendMessage(m.key.remoteJid, {
        text: "adjunta este comando a una imagen o video",
      });

    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    const values = outPrefixMessage.split("$");
    if (messageType == "imageMessage")
      sticker = await stickers.stickerFromImage(
        buffer,
        values[1],
        values[2],
        type
      );
    if (messageType == "videoMessage")
      sticker = await stickers.stickerFromVideo(
        buffer,
        values[1],
        values[2],
        type
      );

    console.log(
      "enviando sticker " + messageType + " " + type + " a: " + m.key.remoteJid
    );
    console.log(sticker);
    sock.sendMessage(m.key.remoteJid, { sticker: sticker }, { quoted: m });
  } else if (command == "wasted" && messageType == "imageMessage") {
    await sock.sendPresenceUpdate("composing", key);
    stream = await makeWASocket.downloadContentFromMessage(media, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    sock.sendMessage(
      key,
      { image: { url: await imagesEfects.wasted(buffer) } },
      { quoted: m }
    );
  } else if (command == "meme") {
    await sock.sendPresenceUpdate("composing", key);
    sock.sendMessage(key, { image: { url: await fun.meme() } }, { quoted: m });
  } else if (messageType == "stickerMessage" && command == "img") {
    stream = await makeWASocket.downloadContentFromMessage(media, "sticker");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    imagesEfects.sticBufferToImage(buffer, async (result, err) => {
      if (err)
        sock.sendMessage(key, { text: "ocurrio un error" }, { quoted: m });
      await sock.sendMessage(key, { image: { url: result } }, { quoted: m });
    });
  } else if (command == "hola" || command == "hi") {
    await sock.sendPresenceUpdate("composing", key);
    sock.sendMessage(key, { text: await greeting() }, { quoted: m });
  } else if (command == "frase" || command == "f") {
    await sock.sendPresenceUpdate("composing", key);
    sock.sendMessage(key, { text: await fun.phrase() }, { quoted: m });
  } else if (
    (messageType == "imageMessage" && command == "search") ||
    command == "image"
  ) {
    await sock.sendPresenceUpdate("composing", key);

    stream = await makeWASocket.downloadContentFromMessage(media, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    var rand = false;
    if (outPrefixMessage.includes("$")) {
      outPrefixMessage = outPrefixMessage.replace("$", "");
      rand = true;
    }

    sock.sendMessage(key, await imageSearch.searchByImg(buffer, rand), {
      quoted: m,
      detectLinks: true,
    });
  } else if (
    (messageType == "conversation" && command == "search") ||
    command == "image"
  ) {
    await sock.sendPresenceUpdate("composing", key);
    var rand = false;
    if (outPrefixMessage.includes("$")) {
      outPrefixMessage = outPrefixMessage.replace("$", "");
      rand = true;
    }
    imageSearch
      .searchByText(outPrefixMessage, rand)
      .then(async (result, err) => {
        if (err) return await sock.sendMessage(key, err, { quoted: m });
        if (!result.url)
          await sock.sendMessage(
            key,
            { text: "Ocurrio un error en tu busqueda" },
            { quoted: m }
          );

        await sock
          .sendMessage(key, { image: { url: result.url } }, { quoted: m })
          .catch(async (err) => {
            await sock.sendMessage(
              key,
              {
                text: "Ocurrio un error al procesar la imagen, prueba agregando el simbolo $ antes o despues de lo que quieras buscar para mostrar otro resutado.",
              },
              { quoted: m }
            );
          });
      })
      .catch(async (err) => {
        await sock.sendMessage(
          key,
          { text: "Ocurrio un error en tu busqueda" },
          { quoted: m }
        );
      });
  } else if (command == "music") {
    if (!args[0])
      return await sock.sendMessage(
        key,
        { text: "ingrese el nombre de la cancion o un enlace de youtube" },
        { quoted: m }
      );
    await sock.sendPresenceUpdate("recording", key);
    await youtube.youtubeMp32(outPrefixMessage, async (result) => {
      //const msgTitle = await sock.sendMessage(key, { text: result.videoTitle }, { quoted: m })
      await sock.sendMessage(
        m.key.remoteJid,
        { audio: { url: result.file }, mimetype: "audio/mp4" },
        {
          quoted: {
            key: { participant: botId },
            message: { conversation: result.videoTitle },
          },
        }
      );
    });
  } else if (command == "musicsearch" || command == "ms") {
    if (!args[0])
      return await sock.sendMessage(
        key,
        { text: "ingrese el nombre de la cancion o un enlace de youtube" },
        { quoted: m }
      );
    await sock.sendPresenceUpdate("recording", key);
    youtube
      .musicSearch(outPrefixMessage)
      .then(async (results) => {
        var buttons = results.map((result) => ({
          buttonId: `${prefix}music ${result.id}`,
          buttonText: { displayText: result.title },
          type: 1,
        }));
        sock.sendMessage(key, {
          caption: `*Resultados para:* ${outPrefixMessage}`,
          image: {
            url: results[0].thumbnail,
          },
          buttons: buttons,
          footer: "Kurisu-WBot",
        });
      })
      .catch(async (err) => {
        console.log(err);
        await sock.sendMessage(key, {
          text: "Ocurrio un error y no se obtuvieron resultados.",
        });
      });
  } else if (command == "translate") {
    await sock.sendPresenceUpdate("composing", key);
    if (!args[0])
      return await sock.sendMessage(
        key,
        { text: "ingrese el idioma y texto a traducir" },
        { quoted: m }
      );
    const tr = await translate(
      outPrefixMessage.split(" ")[0],
      outPrefixMessage.slice(outPrefixMessage.split(" ")[0].length + 1)
    );
    await sock.sendMessage(key, { text: tr }, { quoted: m });
  } else if (command == "say") {
    if (!args[0])
      return await sock.sendMessage(
        key,
        { text: "ingrese el texto que deseas que diga" },
        { quoted: m }
      );
    var lang = "es";
    if (!outPrefixMessage)
      return await sock.sendMessage(
        key,
        { text: "Escribe lo que quieras que diga" },
        { quoted: m }
      );
    if (outPrefixMessage.split(" ")[0].includes("$")) {
      lang = outPrefixMessage.split(" ")[0].replace("$", "");
      outPrefixMessage = outPrefixMessage.slice(
        outPrefixMessage.split(" ")[0].length + 1
      );
    }
    await sock.sendPresenceUpdate("recording", key);
    speech(lang, outPrefixMessage, Date.now(), async function (path, error) {
      if (error)
        return await sock.sendMessage(
          key,
          {
            text: "ocurri un error, puede que el lenguaje no este soportado o este mal escrito.",
          },
          { quoted: m }
        );
      let mimetype =
        makeWASocket.getDevice(m.key.id) == "ios" ? "audio/mpeg" : "audio/mp4";
      await sock.sendMessage(
        key,
        { ptt: true, audio: { url: path }, mimetype },
        { quoted: m }
      );
    });
  } else if (command == "ws") {
    await sock.sendPresenceUpdate("composing", key);
    var fullpage = false;
    if (!args[0])
      return await sock.sendMessage(
        key,
        { text: "Escribe el enlace a buscar luego del comando" },
        { quoted: m }
      );
    if (lowerMessage.includes("$f")) {
      outPrefixMessage = outPrefixMessage
        .replace(new RegExp(`\\$f`, "gi"), "")
        .trim();
      fullpage = true;
    }
    outPrefixMessage =
      outPrefixMessage.includes("http://") ||
      outPrefixMessage.includes("https://")
        ? outPrefixMessage
        : "https://" + outPrefixMessage;

    const result = await misc.WebShot(outPrefixMessage, fullpage);
    await sock.sendMessage(key, { image: { url: result } }, { quoted: m });
  } else if (command == "lyrics" || command == "lyric") {
    if (!args[0])
      await sock.sendMessage(
        key,
        { text: "Escriba el nombre de la cancion que desea buscar." },
        { quoted: m }
      );
    await sock.sendPresenceUpdate("composing", key);
    await sock.sendMessage(
      key,
      { text: await misc.lyrics(outPrefixMessage) },
      { quoted: m }
    );
  } else if (command == "hub") {
    await sock.sendPresenceUpdate("composing", key);
    if (!args[0])
      return await sock.sendMessage(
        key,
        { text: "Escribe dos palabras luego del comando." },
        { quoted: m }
      );
    fun.hub(args[0], args[1], async function (result, err) {
      if (err)
        return await sock.sendMessage(
          key,
          { text: "ocurrio un error, intenta mas tarde." },
          { quoted: m }
        );
      await sock.sendMessage(key, { image: { url: result } }, { quoted: m });
    });
  } else if (command == "zodiac") {
    await sock.sendPresenceUpdate("composing", key);
    await sock.sendMessage(
      key,
      { text: await zodiac.zodiac(args[0] ? args[0] : "signs") },
      { quoted: m }
    );
  } else if (command == "love") {
    await sock.sendPresenceUpdate("composing", key);
    const names = outPrefixMessage.split("$");
    if (!names[1])
      return await sock.sendMessage(
        key,
        { text: "ingrese los nombres separados por $" },
        { quoted: m }
      );
    await sock.sendMessage(
      key,
      { image: { url: await zodiac.loveCalc(names[1], names[2]) } },
      { quoted: m }
    );
  } else if (command == "simi") {
    await sock.sendPresenceUpdate("composing", key);
    await sock.sendMessage(
      key,
      { text: await simi(outPrefixMessage ? outPrefixMessage : "hola") },
      { quoted: m }
    );
  } else if (command == "8ball") {
    await sock.sendPresenceUpdate("composing", key);
    if (!outPrefixMessage)
      return await sock.sendMessage(
        key,
        { text: "Preguntame algo" },
        { quoted: m }
      );

    await sock.sendMessage(
      key,
      { text: await fun.ball(outPrefixMessage) },
      { quoted: m }
    );
  } else if (command == "roll") {
    await sock.sendPresenceUpdate("composing", key);
    await sock.sendMessage(
      key,
      { sticker: { url: await fun.roll() } },
      { quoted: m }
    );
  } else if (command == "ch" || command == "character") {
    await sock.sendPresenceUpdate("composing", key);
    if (!args[0])
      return await sock.sendMessage(
        key,
        { text: "Ingresa el nombre del personaje que deseas buscar." },
        { quoted: m }
      );
    let byId = lowerMessage.includes("$id");
    outPrefixMessage = outPrefixMessage
      .replace(new RegExp(`\\$id`, "gi"), "")
      .trim();
    await sock.sendMessage(key, await fun.character(outPrefixMessage, byId), {
      quoted: m,
    });
  } else if (command == "anime") {
    await sock.sendPresenceUpdate("composing", key);
    if (!args[0])
      return await sock.sendMessage(key, await fun.RandomAnime(), {
        quoted: m,
      });
    await sock.sendPresenceUpdate("composing", key);

    let byId = lowerMessage.includes("$id");
    outPrefixMessage = outPrefixMessage
      .replace(new RegExp(`\\$id`, "gi"), "")
      .trim();
    await sock.sendMessage(key, await fun.SearchAnime(outPrefixMessage, byId), {
      quoted: m,
    });
  } else if (command == "movie") {
    await sock.sendPresenceUpdate("composing", key);
    if (!args[0])
      return await sock.sendMessage(
        key,
        { text: "Ingrese el nombre de la pelicula que busca." },
        { quoted: m }
      );
    let byId = lowerMessage.includes("$id");
    outPrefixMessage = outPrefixMessage
      .replace(new RegExp(`\\$id`, "gi"), "")
      .trim();
    await sock.sendMessage(key, await fun.movie(outPrefixMessage, byId), {
      quoted: m,
    });
  } else if (command == "doge") {
    await sock.sendPresenceUpdate("composing", key);
    await sock.sendMessage(
      key,
      { sticker: await stickers.doge() },
      { quoted: m }
    );
  } else if (command == "snime") {
    await sock.sendPresenceUpdate("composing", key);
    await sock.sendMessage(
      key,
      { sticker: await stickers.snime() },
      { quoted: m }
    );
  } else if (command == "waifu") {
    await sock.sendPresenceUpdate("composing", key);
    sfw.randomSFW(async (result) => {
      await sock.sendMessage(
        key,
        { image: { url: result.image }, caption: result.name },
        { quoted: m }
      );
    });
  } else if (command == "husb") {
    await sock.sendPresenceUpdate("composing", key);
    sfw.randomhusb(async (result) => {
      await sock.sendMessage(
        key,
        { image: { url: result.image }, caption: result.name },
        { quoted: m }
      );
    });
  } else if (command == "waifuh") {
    await sock.sendPresenceUpdate("composing", key);
    nfsw.randomnfsw(async (result) => {
      await sock.sendMessage(
        key,
        { image: { url: result.image }, caption: result.name, viewOnce: true },
        { quoted: m }
      );
    });
  } else if (command == "yaoi") {
    await sock.sendPresenceUpdate("composing", key);
    nfsw.randomyaoinfsw(async (result) => {
      await sock.sendMessage(
        key,
        { image: { url: result.image }, caption: result.name, viewOnce: true },
        { quoted: m }
      );
    });
  } else if (command == "ytsearch") {
    await sock.sendPresenceUpdate("composing", key);
    await youtube.ytsearch(outPrefixMessage, async function (err, result) {
      if (err) return sock.sendMessage(key, { text: err }, { quoted: m });
      sock.sendMessage(key, { text: result }, { quoted: m });
    });
  } else if (command == "help" || command == "menu") {
    await sock.sendPresenceUpdate("composing", key);
    if (lowerMessage == prefix + "help")
      return await sock.sendMessage(key, await menus.help(), { quoted: m });
    await sock.sendMessage(
      key,
      { text: await menus.command(outPrefixMessage) },
      { quoted: m }
    );
  } else if (command == "profile") {
    await sock.sendPresenceUpdate("composing", key);
    var ppUrl = false;
    console.log(msgMentions[0]);
    try {
      if (messageType == "conversation")
        ppUrl = await sock.profilePictureUrl(m.key.participant, "image");
      if (msgMentions[0])
        ppUrl = await sock.profilePictureUrl(msgMentions[0], "image");
    } catch (e) {
      return await sock.sendMessage(
        key,
        { text: "No tengo acceso a la foto de perfil de esta persona :c" },
        { quoted: m }
      );
    }
    if (ppUrl)
      await sock.sendMessage(key, { image: { url: ppUrl } }, { quoted: m });
  } else if (isGroup && command == "info") {
    await sock.sendPresenceUpdate("composing", key);
    var ppUrl = false;
    const metadata = await sock.groupMetadata(key);
    console.log(metadata.participants);

    try {
      ppUrl = await sock.profilePictureUrl(key, "image");
    } catch (e) {
      return await sock.sendMessage(
        key,
        {
          text: `*Informacion del grupo*\n\n*Titulo:* ${metadata.subject}\n\n*Descripción:* ${metadata.desc}`,
        },
        { quoted: m }
      );
    }
    return await sock.sendMessage(
      key,
      {
        image: { url: ppUrl },
        caption: `*Informacion del grupo*\n\n*Titulo:* ${metadata.subject}\n\n*Descripción:* ${metadata.desc}`,
      },
      { quoted: m }
    );
  } else if (isGroup && command == "op") {
    await sock.sendPresenceUpdate("composing", key);
    if (!(await group.isGroupAdmin(m, sock)))
      return await sock.sendMessage(
        key,
        { text: `No tienes permiso para usar este comando.` },
        { quoted: m }
      );
    if (!(await group.botIsAdmin(m, sock)))
      return await sock.sendMessage(
        key,
        { text: `Para hacer esto debes darme permisos de administrador.` },
        { quoted: m }
      );
    if (!msgMentions[0])
      return await sock.sendMessage(
        key,
        { text: `Menciona a quien quieres hacer administrador.` },
        { quoted: m }
      );
    const response = await sock.groupParticipantsUpdate(
      key,
      [msgMentions[0]],
      "promote"
    );
    const author = m.key.participant;
    const mss = await sock.sendMessage(
      key,
      {
        text: `@${author.split("@")[0]} designo como administrador a @${
          msgMentions[0].split("@")[0]
        }`,
        contextInfo: { mentionedJid: [author, msgMentions[0]] },
      },
      { quoted: m }
    );
  } else if (isGroup && command == "deop") {
    await sock.sendPresenceUpdate("composing", key);
    if (!(await group.isGroupAdmin(m, sock)))
      return await sock.sendMessage(
        key,
        { text: `No tienes permiso para usar este comando.` },
        { quoted: m }
      );
    if (!(await group.botIsAdmin(m, sock)))
      return await sock.sendMessage(
        key,
        { text: `Para hacer esto debes darme permisos de administrador.` },
        { quoted: m }
      );
    if (!msgMentions[0])
      return await sock.sendMessage(
        key,
        { text: `Menciona a quien quieres quitar de administrador.` },
        { quoted: m }
      );
    const response = await sock.groupParticipantsUpdate(
      key,
      [msgMentions[0]],
      "demote"
    );
    const author = m.key.participant;
    const mss = await sock.sendMessage(
      key,
      {
        text: `@${author.split("@")[0]} designo quito administrador a @${
          msgMentions[0].split("@")[0]
        }`,
        contextInfo: { mentionedJid: [author, msgMentions[0]] },
      },
      { quoted: m }
    );
  } else if (isGroup && command == "kick") {
    await sock.sendPresenceUpdate("composing", key);
    if (!(await group.isGroupAdmin(m, sock)))
      return await sock.sendMessage(
        key,
        { text: `No tienes permiso para usar este comando.` },
        { quoted: m }
      );
    if (!(await group.botIsAdmin(m, sock)))
      return await sock.sendMessage(
        key,
        { text: `Para hacer esto debes darme permisos de administrador.` },
        { quoted: m }
      );
    if (!msgMentions[0])
      return await sock.sendMessage(
        key,
        { text: `Menciona a quien quieres expulsar.` },
        { quoted: m }
      );
    const response = await sock.groupParticipantsUpdate(
      key,
      [msgMentions[0]],
      "remove"
    );
    const author = m.key.participant;
    const mss = await sock.sendMessage(
      key,
      {
        text: `@${author.split("@")[0]} expulso a @${
          msgMentions[0].split("@")[0]
        }`,
        contextInfo: { mentionedJid: [author, msgMentions[0]] },
      },
      { quoted: m }
    );
  } else if (isGroup && command == "tagall") {
    await sock.sendPresenceUpdate("composing", key);
    if (!(await group.isGroupAdmin(m, sock)))
      return await sock.sendMessage(
        key,
        { text: `No tienes permiso para usar este comando.` },
        { quoted: m }
      );

    const metadata = await sock.groupMetadata(m.key.remoteJid);
    var usersId = [];
    var users = "";

    for (var x of metadata.participants) {
      if (x.id != botId) {
        usersId.push(x.id);
        users += `@${x.id.split("@")[0]} `;
      }
    }
    const mss = await sock.sendMessage(
      key,
      { text: users, contextInfo: { mentionedJid: usersId } },
      { quoted: m }
    );
  } else if ((isGroup && command == "grouplink") || command == "gl") {
    await sock.sendPresenceUpdate("composing", key);
    if (!(await group.isGroupAdmin(m, sock)))
      return await sock.sendMessage(
        key,
        { text: `No tienes permiso para usar este comando.` },
        { quoted: m }
      );
    if (!(await group.botIsAdmin(m, sock)))
      return await sock.sendMessage(
        key,
        { text: `Para hacer esto debes darme permisos de administrador.` },
        { quoted: m }
      );

    const code = await sock.groupInviteCode(key);
    await sock.sendMessage(
      key,
      { text: `https://chat.whatsapp.com/${code}`, detectLinks: true },
      { quoted: m }
    );
  } else if (command == "tmp") {
    await sock.chatModify({ markRead: true, lastMessages: [m] }, key);
  } else if (command == "calendar" && messageType == "imageMessage") {
    await sock.sendPresenceUpdate("composing", key);
    stream = await makeWASocket.downloadContentFromMessage(media, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    sock.sendMessage(
      key,
      { image: { url: await imagesEfects.calendar(buffer) } },
      { quoted: m }
    );
  } else if (command == "cmeme" && messageType == "imageMessage") {
    await sock.sendPresenceUpdate("composing", key);
    stream = await makeWASocket.downloadContentFromMessage(media, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let mtext = outPrefixMessage.split("$");
    sock.sendMessage(
      key,
      {
        image: {
          url: await imagesEfects.customMeme(buffer, mtext[1], mtext[2]),
        },
      },
      { quoted: m }
    );
  } else if (command == "news") {
    await sock.sendPresenceUpdate("composing", key);
    if (!args[0]) {
      return await sock.sendMessage(key, await misc.news(), {
        quoted: m,
      });
    }
    if (lowerMessage.includes("$id")) {
      outPrefixMessage = outPrefixMessage
        .replace(new RegExp(`\\$id`, "gi"), "")
        .trim();
      await sock.sendMessage(key, await misc.news(outPrefixMessage), {
        quoted: m,
      });
    }
  }
};
