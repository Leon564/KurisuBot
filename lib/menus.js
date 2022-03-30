var commands = require('../config/commands.json');
const { prefix } = require('../config/config');
const { listMessageFormat } = require('../utils')

exports.help = async () => {
    var sections = [];


    for (var category of Object.keys(commands.categories)) {
        var section = { title: "", rows: [] };
        section.title = category;
        for (var command of Object.keys(commands.categories[category])) {
            let row = { title: "", rowId: "", description: "" };
            row.rowId = prefix+'!help '+prefix + command;
            row.title = prefix+command;
            row.description = commands.categories[category][command];
            section.rows.push(row);
        }
        sections.push(section);
    }


    const listMessage = {
        title: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tKurisu-Bot",
        text: `Selecciona una opcion en el menu a continuacion para ver los detalles\nTambien puedes usar ${prefix}help <<comando>>`,
        footer: "V2.0.0 by Leon564",
        buttonText: "Comandos",
        sections
    };

    return listMessage;

}

exports.command = async (scommand) => {
    var find = false;
    for (var category of Object.keys(commands.categories)) {

        for (var command of Object.keys(commands.categories[category])) {
            if (scommand.toLowerCase() == command || scommand.toLowerCase() == prefix + command) {
                find = `*${prefix}${command}*\n\n${commands.categories[category][command]}`;
            }
        }
    }
    return find ? find : 'comando no encontrado';
}

