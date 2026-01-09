import { faker, Faker, hr } from '@faker-js/faker';

const fakerHr = new Faker({ locale: [hr] });

const subCatGen = (catCount, subCatMinCount, subCatMaxCount) => {
  const subCategories = [];
  let subCategoriesTotal = 0;
  for(let i=1; i<=catCount; i++) {
    const subCategoriesCount = faker.number.int({ min: subCatMinCount, max: subCatMaxCount });
    for(let j=1; j<=subCategoriesCount; j++) {
      subCategoriesTotal++;
      const subCategory = { 
        id: subCategoriesTotal,
        guid: faker.string.uuid(),
        categoryId: i,
        name: faker.commerce.product()
      };
      subCategories.push(subCategory);
    }
  }

  return subCategories;
}

export { subCatGen }