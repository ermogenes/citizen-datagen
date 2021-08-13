import { MongoClient } from 'mongodb';
import * as util from './utils.js';

const uri = 'mongodb://user_app:pwd_app@localhost:27017/citizenDB';
const client = new MongoClient(uri);

const args = process.argv.slice(2);
const iterations = args.length > 0 ? parseInt(args[0]) : 1;

const run = async () => {
  try {
    console.log('Conectando...');
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Conectado. Alocando recursos (pode demorar)...');
    await cadastrar(client, iterations);
  } finally {
    await client.close();
  }
};

run().catch(console.dir);

const cadastrar = async () => {
  const tasks = [];
  for (let i = 1; i <= iterations; i++) {
    tasks.push(addNewCitizen(client.db('citizenDB')));
  }
  return Promise.all(tasks).then(() => {
    console.log('Finalizado.');
  });
};

const addNewCitizen = async (citizenDB) => {
  const citizens = citizenDB.collection('citizens');
  const profilePhotos = citizenDB.collection('profilePhotos');
  let cpf = '';

  // Acha um CPF inexistente
  while (true) {
    cpf = util.randomCPF();
    const citizenFound = await citizens.findOne({ cpf });
    if (!citizenFound) break;
  }

  // Adiciona um número aleatório de fotos
  const photos = [];
  while (Math.random() > 0.3) {
    photos.push(util.createPhotoOptional(cpf, photos.length.toString(16)));
  }

  // Cria um objeto de cidadão, sem foto
  const gender = util.createGenderOptional() || undefined;
  const name = util.createName(gender);
  const socialName = util.createSocialNameOptional(gender) || undefined;

  const foreigner = Math.random() > 0.95;
  const nationalIdRG = !foreigner
    ? util.createNationalIdRGOptional()
    : undefined;
  const nationalIdIssuer = util.createNationalIdIssuerOptional(nationalIdRG);
  const nationalIdState = util.createNationalIdStateOptional(nationalIdIssuer);

  let nationalId;
  if (nationalIdRG || nationalIdIssuer || nationalIdState) {
    nationalId = {};
    nationalIdRG && (nationalId.rg = nationalIdRG);
    nationalIdIssuer && (nationalId.issuer = nationalIdIssuer);
    nationalIdState && (nationalId.state = nationalIdState);
  }

  const foreignerIdRNE = foreigner
    ? util.createForeignerIdRNEOptional()
    : undefined;

  let foreignerId;
  if (foreignerIdRNE) {
    foreignerId = {};
    foreignerIdRNE && (foreignerId.rne = foreignerIdRNE);
  }

  const voterIdTituloEleitor = !foreigner
    ? util.createVoterIdTituloEleitorOptional()
    : undefined;
  const voterIdZone = util.createVoterIdZoneOptional(voterIdTituloEleitor);
  const voterIdSection = util.createVoterIdSectionOptional(voterIdZone);

  let voterId;
  if (voterIdTituloEleitor || voterIdZone || voterIdSection) {
    voterId = {};
    voterIdTituloEleitor && (voterId.tituloEleitor = voterIdTituloEleitor);
    voterIdZone && (voterId.zone = voterIdZone);
    voterIdSection && (voterId.section = voterIdSection);
  }

  let documents;
  if (nationalId || foreignerId || voterId) {
    documents = {};
    nationalId && (documents.nationalId = nationalId);
    foreignerId && (documents.foreignerId = foreignerId);
    voterId && (documents.voterId = voterId);
  }

  const mother = util.createMotherOptional() || undefined;
  const father = util.createFatherOptional() || undefined;

  let parents;
  if (mother || father) {
    parents = {};
    mother && (parents.mother = mother);
    father && (parents.father = father);
  }

  const birthDate = util.createBirthDateOptional() || undefined;
  const birthPlace = util.createBirthPlaceOptional(foreigner) || undefined;

  let birth;
  if (birthDate || birthPlace || parents) {
    birth = {};
    birthDate && (birth.date = birthDate);
    birthPlace && (birth.place = birthPlace);
    parents && (birth.parents = parents);
  }

  const deathDate = util.createDeathDateOptional() || undefined;

  let death;
  if (deathDate) {
    death = {};
    death.date = deathDate;
  }

  const newCitizen = {};

  newCitizen._id = cpf;
  gender && (newCitizen.gender = gender);
  newCitizen.name = name;
  socialName && (newCitizen.socialName = socialName);

  documents && (newCitizen.documents = documents);

  birth && (newCitizen.birth = birth);
  death && (newCitizen.death = death);

  // Adiciona o cidadão
  const result = await citizens.insertOne(newCitizen);
  const citizenId = result.insertedId;
  console.log(`Cidadão ${citizenId} adicionado.`);

  // Adiciona as fotos no cadastro do cidadão
  for await (let photo of photos) {
    photo.owner = citizenId;
    const result = await profilePhotos.insertOne(photo);
    const photoId = result.insertedId;

    // Vincula dados no cidadão
    await citizens.updateOne({ _id: citizenId }, [
      {
        $set: {
          images: {
            profilePhotoUrl: photo.url,
            profilePhoto: photoId,
          },
        },
      },
    ]);

    console.log(`\tFoto ${photoId} adicionada em ${citizenId}.`);
  }
};
