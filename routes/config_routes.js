const indexRouter = require("./index");
const usersRouter = require("./users");
const categoriesRouter = require("./categories");
const videosRouter = require("./videos");
const watchLaterRouter = require("./watchLater");

exports.routesInit = (app) => {
  app.use("/",indexRouter);
  app.use("/users",usersRouter);
  app.use("/categories",categoriesRouter);
  app.use("/videos",videosRouter);
  app.use("/watchLater",watchLaterRouter);
}