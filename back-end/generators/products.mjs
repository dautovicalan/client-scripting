import { faker, Faker, hr } from '@faker-js/faker';

const fakerHr = new Faker({ locale: [hr] });

const prodGen = (subCats, prodMinCount, prodMaxCount, priceMin, priceMax) => {
  const products = [];
  let productsTotal = 0;
  
  let subCatsDict = {};
  subCats.forEach((el, _) => subCatsDict[el.id] = el);
  const lastSubCatId = subCats.slice(-1)[0].id;
  console.log(`Using last subcategory id: ${lastSubCatId}`);

  for(let i=1; i<=lastSubCatId; i++) {
    const productsCount = faker.number.int({ min: prodMinCount, max: prodMaxCount });
    for(let j=1; j<=productsCount; j++) {
      productsTotal++;
      const pn1 = faker.string.alpha({ length: 2, casing: 'upper'});
      const pn2 = faker.string.numeric(4);
      const pn3 = faker.string.numeric(2);
      const product = { 
        id: productsTotal,
        guid: faker.string.uuid(),
        name: faker.commerce.productName(),
        productNumber: `${pn1}-${pn2}-${pn3}`,
        color: faker.color.human(),
        subCategoryId: i,
        price: faker.number.float({ min: priceMin, max: priceMax, precision: 0.01 })
      };
      products.push(product);
    }
  }

  return products;
}

export { prodGen }