import mongoose from "mongoose";

/**
 * Connection to MongoDB
 * @param {string} user user host for connect to MongoDB
 * @param {string} passwd password for user host
 * @param {string} server address server mongodb
 * @param {string} dbName name to database
 */
export async function ConnectDB(user, passwd, server, dbName) {
  await mongoose.connect(
    `mongodb+srv://${user}:${passwd}@${server}/${dbName}?retryWrites=true&w=majority`
  );
}
