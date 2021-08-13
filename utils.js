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
      : {
          format: 'jpeg',
          url: `https://i.pravatar.cc/200?u=${cpf}.${suffix}`,
        };
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
  if (!gender?.includes('male')) return probability < 0.05 ? allNames.pickOne() : null;
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
    let probability = Math.random();
    if (probability < 0.2) {
      let state =
        probability > 0.5
          ? estados.pickOne().Sigla
          : estados.filter((e) => e.Sigla === 'SP')[0].Sigla;
      let city =
        probability > 0.5
          ? cidades.filter((c) => c.Estado == state.ID).pickOne().Nome
          : 'São Paulo';
      birthPlace = {
        countryCode: 'BR',
        countryName: 'Brasil',
        state,
        city,
      };
    }
  }

  return birthPlace;
};

const createMotherOptional = () =>
  Math.random() < 0.95 ? createName('female') : null;

const createFatherOptional = () =>
  Math.random() < 0.8 ? createName('male') : null;

const createDeathDateOptional = (birthDate) =>
  Math.random() > 0.95 ? createDate(birthDate) : null;

export {
  randomCPF,
  getRandom,
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
