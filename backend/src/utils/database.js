/* eslint-disable prettier/prettier */
const { PrismaClient } = require('@prisma/client');

class Database {
  constructor() {
    if (!Database.instance) {
      Database.instance = new PrismaClient();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getInstance() {
    return Database.instance;
  }
}

module.exports = Database;
