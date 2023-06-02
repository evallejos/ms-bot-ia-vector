const { readFileSync, readdirSync } = require("fs");

const removeExtension = (fileName) => {
    return fileName.split('.').shift();
}

const readDocumentMarkdown = () => {

    const arrayMetadata = [];
    const files = readdirSync(__dirname);
    files.forEach((file) => {
        const name = removeExtension(file);
        if (name !== "index") {
            const metadata = readFileSync(`${__dirname}/${file}`, "utf8");
            arrayMetadata.push({ metadata, name });
        }
    });

    return arrayMetadata;
}

module.exports = {
    readDocumentMarkdown
};