//require("dotenv").config();
const app = require("./src/server");
const logger = require("./src/logger")(module)
//require("./database");

app.listen(app.get("port"), function () {
  logger.info("======= servidor online ==========");
  logger.info(`======= ${app.get("port")} =======`);
  logger.info("==================================");
});
