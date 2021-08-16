import { cidades } from './data/Cidades.js';
import { estados } from './data/Estados.js';

const countries = [
  { code: 'US', name: 'Estados Unidos' },
  { code: 'CA', name: 'Canadá' },
  { code: 'RU', name: 'Russia' },
  { code: 'CN', name: 'China' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'FR', name: 'França' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'IN', name: 'Índia' },
  { code: 'IT', name: 'Itália' },
  { code: 'JP', name: 'Japão' },
  { code: 'MX', name: 'México' },
];

const maleNames = [
  'José',
  'João',
  'Antônio',
  'Francisco',
  'Carlos',
  'Paulo',
  'Pedro',
  'Lucas',
  'Luiz',
  'Marcos',
  'Luis',
  'Gabriel',
  'Rafael',
  'Daniel',
  'Marcelo',
  'Bruno',
  'Eduardo',
  'Felipe',
  'Raimundo',
  'Rodrigo',
];

const femaleNames = [
  'Maria',
  'Ana',
  'Francisca',
  'Antonia',
  'Adriana',
  'Juliana',
  'Márcia',
  'Fernanda',
  'Patrícia',
  'Aline',
  'Sandra',
  'Camila',
  'Amanda',
  'Bruna',
  'Jéssica',
  'Leticia',
  'Júlia',
  'Luciana',
  'Vanessa',
  'Mariana',
];

const lastNames = [
  'Albuquerque',
  'Almeida',
  'Alvares',
  'Alves',
  'Amorim',
  'Andrade',
  'Antunes',
  'Aragão',
  'Araújo',
  'Azevedo',
  'Barbosa',
  'Bastos',
  'Batista',
  'Bernardes',
  'Botelho',
  'Camargo',
  'Cardoso',
  'Carmo',
  'Carvalho',
  'Castro',
  'Coelho',
  'Costa',
  'Coutinho',
  'Couto',
  'Cruz',
  'Cunha',
  'Dias',
  'Duarte',
  'Fernandes',
  'Ferreira',
  'Figueiredo',
  'Fonseca',
  'Freitas',
  'Frota',
  'Furtado',
  'Garcia',
  'Gomes',
  'Gonçalves',
  'de Lima',
  'Lima',
  'Lopes',
  'Machado',
  'Marques',
  'Martins',
  'Mendes',
  'Mesquita',
  'Monteiro',
  'Moraes',
  'Moreira',
  'Moura',
  'do Nascimento',
  'Nascimento',
  'Neves',
  'Nunes',
  'de Oliveira',
  'Oliveira',
  'Pedrosa',
  'Pereira',
  'Pimentel',
  'Pires',
  'Ramos',
  'Ribeiro',
  'Rocha',
  'Rodrigues',
  'Santana',
  'Santiago',
  'dos Santos',
  'Santos',
  'da Silva',
  'Silva',
  'Soares',
  'de Souza',
  'Souza',
  'Simões',
  'Teixeira',
  'Vieira',
];

const allNames = [...maleNames, ...femaleNames];

Array.prototype.pickOne = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const getRandom = (min, max) => (Math.random() * (max - min) + min).toFixed(0);

const getRandomNumbers = (count) => {
  let number = '';
  let n = 0;
  while (n < count) {
    number += getRandom(0, 9);
    n++;
  }
  return number;
};

const randomCPF = () => getRandomNumbers(11);

const randomRG = () => {
  const rg = getRandomNumbers(getRandom(6, 9));
  const digitNum = getRandom(0, 10);
  const digit = digitNum >= 10 ? 'X' : digitNum;
  return `${rg}${digit}`;
};

const createPhotoOptional = (cpf, suffix) => {
  const newPhoto =
    getRandom(0, 4) === 0
      ? null
      : `https://i.pravatar.cc/200?u=${cpf}.${suffix}`;
  return newPhoto;
};

const createNationalIdRGOptional = () =>
  Math.random() > 0.3 ? randomRG() : null;

const createNationalIdIssuerOptional = (rg) =>
  rg && Math.random() > 0.5 ? 'SSP' : null;

const createNationalIdStateOptional = (issuer) =>
  issuer && Math.random() > 0.2 ? estados.pickOne().Sigla : null;

const createForeignerIdRNEOptional = () => {
  if (Math.random() > 0.3) return null;
  const p1 = ['CGPI', 'SLRC', 'DIM'].pickOne();
  const p2 = getRandomNumbers(6);
  const p3 = 'UTO/01';
  return `${p1}-${p2}.${p3}`;
};

const createName = (gender) => {
  const fullNames = [];

  const firstNames = [];
  if (gender === 'male') firstNames.push(...maleNames);
  else if (gender === 'female') firstNames.push(...femaleNames);
  else firstNames.push(...[maleNames, femaleNames].pickOne());

  fullNames.push(firstNames.pickOne());
  let probability = 0.3;
  while (Math.random() < probability) {
    fullNames.push(firstNames.pickOne());
    probability *= 0.5;
  }

  fullNames.push(lastNames.pickOne());
  probability = 0.5;
  while (Math.random() < probability) {
    fullNames.push(lastNames.pickOne());
    probability *= 0.5;
  }

  return fullNames.join(' ');
};

const createVoterIdTituloEleitorOptional = () => {
  const state = Math.random() < 0.05 ? 'ZZ' : estados.pickOne().Sigla;
  return `${getRandomNumbers(7)}${state}${getRandomNumbers(3)}`;
};

const createVoterIdZoneOptional = (titulo) =>
  titulo && Math.random() < 0.8 ? getRandomNumbers(3) : null;

const createVoterIdSectionOptional = (zone) =>
  zone ? getRandomNumbers(4) : null;

const createSocialNameOptional = (gender) => {
  const probability = Math.random();
  if (gender?.includes('male'))
    return probability < 0.05 ? allNames.pickOne() : null;
  else return probability < 0.8 ? allNames.pickOne() : null;
};

const createGenderOptional = () => {
  const naturalGenders = ['male', 'female'];
  const otherGenders = ['non-binary', 'transgender', 'intersex'];
  let probability = Math.random();
  if (probability > 0.2) return naturalGenders.pickOne();
  else if (probability > 0.1) return otherGenders.pickOne();
  else return null;
};

const createDate = (minDate = new Date(1920, 1, 1), maxDate = new Date()) => {
  let date;
  while (true) {
    const year = getRandom(minDate.getFullYear(), maxDate.getFullYear());
    const month = getRandom(1, 12);
    const day = getRandom(1, 28);
    date = new Date(year, month, day);
    if (date >= minDate && date <= maxDate) break;
  }
  return date;
};

const createBirthDateOptional = () =>
  Math.random() > 0.1 ? createDate() : null;

const createBirthPlaceOptional = (foreigner) => {
  let birthPlace;
  if (foreigner) {
    const country = countries.pickOne();
    birthPlace = {
      countryCode: country.code,
      countryName: country.name,
    };
  } else {
    const hasCityPlaceProbability = Math.random();
    if (hasCityPlaceProbability < 0.8) {
      let state, cityName;
      const fromSPCityProbability = Math.random();
      if (fromSPCityProbability < 0.3) {
        state = estados.filter((e) => e.Sigla === 'SP')[0];
        cityName = 'São Paulo';
      } else {
        const fromSPStateProbability = Math.random();
        state =
          fromSPStateProbability < 0.7
            ? estados.pickOne()
            : estados.filter((e) => e.Sigla === 'SP')[0];
        cityName = cidades.filter((c) => c.Estado == state.ID).pickOne().Nome;
      }
      birthPlace = {
        countryCode: 'BR',
        countryName: 'Brasil',
        stateCode: state?.Sigla || undefined,
        stateName: state?.Nome || undefined,
        cityName,
      };
    }
  }

  return birthPlace;
};

const createMotherOptional = () =>
  Math.random() < 0.95
    ? {
        name: createName('female'),
      }
    : null;

const createFatherOptional = () =>
  Math.random() < 0.8
    ? {
        name: createName('male'),
      }
    : null;

const createDeathDateOptional = (birthDate) =>
  Math.random() > 0.95 ? createDate(birthDate) : null;

const createCitizen = (cpf) => {
  const gender = createGenderOptional() || undefined;
  const name = createName(gender);
  const socialName = createSocialNameOptional(gender) || undefined;

  const foreigner = Math.random() > 0.95;
  const nationalIdRG = !foreigner ? createNationalIdRGOptional() : undefined;
  const nationalIdIssuer = createNationalIdIssuerOptional(nationalIdRG);
  const nationalIdState = createNationalIdStateOptional(nationalIdIssuer);

  let nationalId;
  if (nationalIdRG || nationalIdIssuer || nationalIdState) {
    nationalId = {};
    nationalIdRG && (nationalId.rg = nationalIdRG);
    nationalIdIssuer && (nationalId.issuer = nationalIdIssuer);
    nationalIdState && (nationalId.state = nationalIdState);
  }

  const foreignerIdRNE = foreigner ? createForeignerIdRNEOptional() : undefined;

  let foreignerId;
  if (foreignerIdRNE) {
    foreignerId = {};
    foreignerIdRNE && (foreignerId.rne = foreignerIdRNE);
  }

  const voterIdTituloEleitor = !foreigner
    ? createVoterIdTituloEleitorOptional()
    : undefined;
  const voterIdZone = createVoterIdZoneOptional(voterIdTituloEleitor);
  const voterIdSection = createVoterIdSectionOptional(voterIdZone);

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

  const mother = createMotherOptional() || undefined;
  const father = createFatherOptional() || undefined;

  let parents;
  if (mother || father) {
    parents = {};
    mother && (parents.mother = mother);
    father && (parents.father = father);
  }

  const birthDate = createBirthDateOptional() || undefined;
  const birthPlace = createBirthPlaceOptional(foreigner) || undefined;

  let birth;
  if (birthDate || birthPlace || parents) {
    birth = {};
    birthDate && (birth.date = birthDate);
    birthPlace && (birth.place = birthPlace);
    parents && (birth.parents = parents);
  }

  const deathDate = createDeathDateOptional() || undefined;

  let death;
  if (deathDate) {
    death = {};
    death.date = deathDate;
  }

  // Cria um número aleatório de fotos
  let photos = [];
  while (Math.random() > 0.3) {
    photos.push(createPhotoOptional(cpf, photos.length.toString(16)));
  }
  if (photos.length === 0) photos = undefined;

  const newCitizen = {};

  newCitizen._id = cpf;
  gender && (newCitizen.gender = gender);
  newCitizen.name = name;
  socialName && (newCitizen.socialName = socialName);

  documents && (newCitizen.documents = documents);

  birth && (newCitizen.birth = birth);
  death && (newCitizen.death = death);

  photos && (newCitizen.images = { profilePhotos: photos });

  return newCitizen;
};

export {
  randomCPF,
  getRandom,
  createCitizen,
  createPhotoOptional,
  createNationalIdRGOptional,
  createNationalIdIssuerOptional,
  createNationalIdStateOptional,
  createVoterIdTituloEleitorOptional,
  createVoterIdZoneOptional,
  createVoterIdSectionOptional,
  createForeignerIdRNEOptional,
  createName,
  createSocialNameOptional,
  createGenderOptional,
  createBirthDateOptional,
  createBirthPlaceOptional,
  createMotherOptional,
  createFatherOptional,
  createDeathDateOptional,
};
