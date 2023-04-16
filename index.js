const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const serverPort = process.env.PORT ? process.env.PORT : 3000;
const app = express();
const Datastore = require('nedb');
const dbNames = new Datastore({ filename: 'db-names', autoload: true });
const dbLastNames = new Datastore({ filename: 'db-lastNames', autoload: true });
let totalNames = 0;
let totalLastNames = 0;

const find = () => {
  return new Promise((resolve, reject) => {
    const skipCount = Math.floor(Math.random() * totalNames);
    dbNames.find({})
      .skip(skipCount)
      .limit(1)
      .exec((errorFind, items) => {
        if (!errorFind && items && items.length > 0) {
          resolve(items[0]);
        } else {
          console.error(errorFind);
          reject(false);
        }
      });
  });
};

const findLastName = () => {
  return new Promise((resolve, reject) => {
    const skipCount = Math.floor(Math.random() * totalLastNames);
    dbLastNames.find({})
      .skip(skipCount)
      .limit(2)
      .exec((errorFind, items) => {
        if (!errorFind && items && items.length > 0) {
          resolve(items);
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
    const name = await find();
    const lastName = await findLastName();
    if (name) {
      responseItens.push({data: `${name.data} ${lastName.map(item => item.data).join(' ')}`});
    } else {
      return response.status(500).send(`Error. Try again later;`);
    }
  }

  return response.send(responseItens.map((item) => item.data));
});

app.listen(serverPort, function () {
  dbNames.count({}, (errorCountNames, countNames) => {
    if (errorCountNames || countNames <= 0) {
      console.error(`[Error] Error on load database 'names'. Is database empty?`);
    }
    totalNames = countNames;
    dbLastNames.count({}, (errorCountLastNames, countLastNames) => {
      if (errorCountLastNames || countLastNames <= 0) {
        console.error(`[Error] Error on load database 'lastNames'. Is database empty?`);
      }
      totalLastNames = countLastNames;
      console.info(`Server started on port ${serverPort}`);
    });
  });
});
