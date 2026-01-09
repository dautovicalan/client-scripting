import { genGenerator } from './generic.mjs'
import { faker, Faker, hr } from '@faker-js/faker';

const fakerHr = new Faker({ locale: [hr] });

const custGen = (count, cityCount) => {
  const customers = genGenerator(count).map((customer) => {
    const hasCityId = faker.number.int({ min: 1, max: 100 }) > 20 ? false : true;
    const obj = { 
      name: fakerHr.person.firstName(),
      surname: fakerHr.person.lastName(),
      email: faker.internet.email(),
      telephone: fakerHr.phone.number(),
      cityId: hasCityId ? faker.number.int({ min: 1, max: cityCount }) : null
    };
    return {...customer, ...obj};
  });

  return customers;
}

export { custGen }