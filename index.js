const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const serverPort = process.env.PORT ? process.env.PORT : 3000;
const app = express();
const Datastore = require('nedb');
const db = new Datastore({ filename: 'db-names', autoload: true });
let totalDatabase = 0;

const find = () => {
  return new Promise((resolve, reject) => {
    const skipCount = Math.floor(Math.random() * totalDatabase);
    db.find({})
      .skip(skipCount)
      .limit(1)
      .exec((errorFind, itens) => {
        if (!errorFind && itens && itens.length > 0) {
          resolve(itens[0]);
        } else {
          console.error(errorFind);
          reject(false);
        }
      });
  });
};

app.get('/names', async (request, response) => {
  let total = 1;
  try {
    total = parseInt(request.query.total);
    if (total < 0 || isNaN(total)) {
      return response.status(400).send(`Param 'total' is not a positive number;`);
    }
  } catch (error) {
    return response.status(400).send(`Param 'total' is not a number;`);
  }

  let responseItens = [];
  for (let index = 1; index <= total; index++) {
    const item = await find();
    if (item) {
      responseItens.push(item);
    } else {
      return response.status(500).send(`Error. Try again later;`);
    }
  }

  return response.send(responseItens.map((item) => item.name));
});

app.listen(serverPort, function () {
  db.count({}, (errorCount, count) => {
    if (errorCount || count <= 0) {
      console.error(`[Error] Error on load database. Is database empty?`);
    }
    totalDatabase = count;
    console.info(`Server started on port ${serverPort}`);
  });
});
