import { faker, Faker, hr } from '@faker-js/faker';

const fakerHr = new Faker({ locale: [hr] });

const itemGen = (receipts, products, itemMinCount, itemMaxCount, qtyMinCount, qtyMaxCount) => {
  const items = [];
  let itemsTotal = 0;
  
  let productDict = {};
  products.forEach((el, _) => productDict[el.id] = el);
  const lastProductId = products.slice(-1)[0].id;
  console.log(`Using last product id: ${lastProductId}`);

  let receiptDict = {};
  receipts.forEach((el, _) => receiptDict[el.id] = el);
  const lastReceiptId = receipts.slice(-1)[0].id;
  console.log(`Using last receipt id: ${lastReceiptId}`);

  for(let i=1; i<=lastReceiptId; i++) {
    const itemCount = faker.number.int({ min: itemMinCount, max: itemMaxCount });
    let receiptTotal = 0;
    for(let j=1; j<=itemCount; j++) {
      itemsTotal++;
      const productId = faker.number.int({ min: 1, max: lastProductId });
      const quantity = faker.number.int({ min: qtyMinCount, max: qtyMaxCount });
      const product = productDict[productId];
      const totalPrice = product.price * quantity;

      const item = { 
        id: itemsTotal,
        guid: faker.string.uuid(),
        billId: i,
        quantity: quantity,
        productId: productId,
        totalPrice: totalPrice
      };
      items.push(item);

      receiptTotal += totalPrice;
    }

    receiptDict[i].total = receiptTotal;
  }

  return items;
}

export { itemGen }