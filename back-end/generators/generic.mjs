import { faker } from '@faker-js/faker';

const genGenerator = (count) => {
  const items = [];

  for (let i = 0; i < count; i++) {
    const item = {
      id: i+1,
      guid: faker.string.uuid()
    };
    items.push(item);
  }

  return items;
}

export { genGenerator }