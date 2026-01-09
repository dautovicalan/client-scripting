import { genGenerator } from './generic.mjs'
import { faker, Faker, hr } from '@faker-js/faker';

const fakerHr = new Faker({ locale: [hr] });

const sellGen = (count) => {
  const sellers = genGenerator(count).map((seller) => {
    const perm = faker.number.int({ min: 1, max: 100 }) > 20 ? true : false;
    const obj = { 
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      permanentEmployee: perm
    };
    return {...seller, ...obj};
  });

  return sellers;
}

export { sellGen }