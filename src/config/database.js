const mongoose = require("mongoose");

const connectDatabase = async () => {
  await mongoose.connect("");
};

module.exports = connectDatabase;
