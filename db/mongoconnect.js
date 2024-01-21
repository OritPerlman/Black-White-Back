const mongoose = require('mongoose');
const {config}= require("../config/secret")

main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery', false);
  mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@users.wd851k6.mongodb.net/users`)
  console.log("connected to MongoDB");
}