import { genGenerator } from './generic.mjs'
import { faker, Faker, hr } from '@faker-js/faker';

const fakerHr = new Faker({ locale: [hr] });

const cardGen = (count) => {
  const creditCards = genGenerator(count).map((creditCard) => {
    const issuer = faker.finance.creditCardIssuer()
    const obj = {
      type: issuer,
      cardNumber: faker.finance.creditCardNumber(issuer),
      expirationMonth: faker.number.int({ min: 1, max: 12 }),
      expirationYear: faker.number.int({ min: 2023, max: 2028 }),
    };
    return {...creditCard, ...obj};
  });

  return creditCards;
}

export { cardGen }