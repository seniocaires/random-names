const names = [{ name: 'Maria' }, { name: 'José' }, { name: 'Antônio' }, { name: 'Carlos' }];

const Datastore = require('nedb');
const db = new Datastore({ filename: 'db-names', autoload: true });
db.ensureIndex({ fieldName: 'name', unique: true }, (error) => {
  if (error) {
    console.error(`[Error] create unique index. ${error}`);
  }
});

const run = async () => {
  for (let item of names) {
    db.insert(item, (error) => {
      if (error && error.errorType === 'uniqueViolated') {
        console.error(`[No Action] already in use ${item.name}`);
      } else if (error) {
        console.error(`[Error] insert name ${item.name}`);
      } else {
        console.log(`[Success] insert name ${item.name}`);
      }
    });
  }
};

run();
