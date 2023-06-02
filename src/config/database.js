const fs = require("fs");

const readDB = ( nameDB ) => {
  const data = fs.readFileSync(nameDB, "utf-8");
  return JSON.parse(data);
}

const writeDB = (obj, dbName = "db.json") => {
    try {
        fs.writeFileSync(dbName, JSON.stringify(obj));
        return console.log("save data");
    } catch (error) {
        console.log("fail save data")
    }
}

module.exports = { readDB, writeDB }