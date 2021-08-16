import { MongoClient } from 'mongodb';
import dayjs from 'dayjs-with-plugins';
import 'dayjs/locale/pt-br.js';
import * as cliProgress from 'cli-progress';
import * as util from './utils.js';

const run = async () => {
  const uri = 'mongodb://user_app:pwd_app@localhost:27017/citizenDB';
  const client = new MongoClient(uri);

  const args = process.argv.slice(2);
  const iterations = args.length > 0 ? parseInt(args[0]) : 1;

  dayjs.locale('pt-br');
  const start = new Date();

  try {
    console.log('Conectando...');
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    const citizens = client.db('citizenDB').collection('citizens');

    console.log(`Gerando ${iterations} cidadãos...`);
    const progressBar = new cliProgress.SingleBar(
      {
        hideCursor: true,
        format:
          '[{bar}] {percentage}% | {value}/{total} | {duration_formatted} (tempo restante estimado: {eta_formatted})',
      },
      cliProgress.Presets.rect
    );
    progressBar.start(iterations, 0);

    await populateCitizensCollection(citizens, iterations, progressBar);

    console.log(
      `Tempo de execução: ${+new Date() - start} ms (${dayjs(start).toNow(
        true
      )})`
    );
  } finally {
    await client.close();
  }
};

run().catch(console.dir);

const populateCitizensCollection = async (
  citizenCollection,
  iterations,
  progressBar
) => {
  const researchUnusedCpf = async (citizens) => {
    const cpf = util.randomCPF();
    return citizens
      .findOne({ _id: cpf })
      .then((found) => (found ? researchUnusedCpf(citizens) : cpf));
  };

  const tasks = [];
  for (let i = 1; i <= iterations; i++) {
    tasks.push(
      researchUnusedCpf(citizenCollection).then((cpf) =>
        citizenCollection
          .insertOne(util.createCitizen(cpf))
          .then(() => progressBar.increment())
          .catch((err) => console.log(err))
      )
    );
  }
  return Promise.all(tasks).then(() => {
    progressBar.stop();
  });
};
