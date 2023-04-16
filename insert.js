const names = [{ data: 'Maria' }, { data: 'José' }, { data: 'Antônio' }, { data: 'Carlos' }];
const lastNames = [{ data: 'Oliveira' }, { data: 'Cardoso' }, { data: 'Silva' }, { data: 'Souza' }];

const Datastore = require('nedb');
const dbNames = new Datastore({ filename: 'db-names', autoload: true });
dbNames.ensureIndex({ fieldName: 'data', unique: true }, (error) => {
  if (error) {
    console.error(`[Error] db-name create unique index. ${error}`);
  }
});
const dbLastNames = new Datastore({ filename: 'db-lastNames', autoload: true });
dbLastNames.ensureIndex({ fieldName: 'data', unique: true }, (error) => {
  if (error) {
    console.error(`[Error] db-lastNames create unique index. ${error}`);
  }
});

const run = async () => {
  console.log('Inserting names.')
  for (let item of names) {
    dbNames.insert(item, (error) => {
      if (error && error.errorType === 'uniqueViolated') {
        console.error(`[No Action] already in use ${item.data}`);
      } else if (error) {
        console.error(`[Error] insert name ${item.data}`);
      } else {
        console.log(`[Success] insert name ${item.data}`);
      }
    });
  }

  console.log('Inserting last names.')
  for (let item of lastNames) {
    dbLastNames.insert(item, (error) => {
      if (error && error.errorType === 'uniqueViolated') {
        console.error(`[No Action] already in use ${item.data}`);
      } else if (error) {
        console.error(`[Error] insert last name ${item.data}`);
      } else {
        console.log(`[Success] insert last name ${item.data}`);
      }
    });
  }
};

run();
