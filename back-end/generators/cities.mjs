import { genGenerator } from './generic.mjs'
import { faker, Faker, hr } from '@faker-js/faker';

const fakerHr = new Faker({ locale: [hr] });

const cityGen = (count) => {
  const cities = genGenerator(count).map((city) => {
    const obj = { name: fakerHr.location.city() };
    return {...city, ...obj};
  });

  return cities;
}

export { cityGen }