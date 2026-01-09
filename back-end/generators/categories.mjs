import { genGenerator } from './generic.mjs'
import { faker, Faker, hr } from '@faker-js/faker';

const fakerHr = new Faker({ locale: [hr] });

const catGen = (count) => {
  const categories = genGenerator(count).map((category) => {
    const obj = { name: faker.commerce.department() };
    return {...category, ...obj};
  });

  return categories;
}

export { catGen }