import { cityGen } from './cities.mjs';
import { custGen } from './customers.mjs';
import { rcptGen } from './receipts.mjs';
import { itemGen } from './receiptItems.mjs';
import { catGen } from './categories.mjs';
import { subCatGen } from './subCategories.mjs';
import { prodGen } from './products.mjs';
import { sellGen } from './sellers.mjs';
import { cardGen } from './creditCards.mjs';
import { createJsonFile } from '../utils/create-json-file.mjs';

const cityCount = 100;
const custCount = 1000;
const rcptCount = 5000;
const catCount = 20;
const subCatMinCount = 2;
const subCatMaxCount = 5;
const prodMinCount = 10;
const prodMaxCount = 50;
const itemMinCount = 1;
const itemMaxCount = 10;
const qtyMinCount = 1;
const qtyMaxCount = 3;
const sellCount = 4;
const cardCount = 3000;
const priceMin = 0.99;
const priceMax = 600;

createJsonFile(cityGen(cityCount), 'City');
createJsonFile(custGen(custCount, cityCount), 'Customer');

createJsonFile(catGen(catCount), 'Category');
const subCats = subCatGen(catCount, subCatMinCount, subCatMaxCount);
createJsonFile(subCats, 'SubCategory');
const products = prodGen(subCats, prodMinCount, prodMaxCount, priceMin, priceMax);
createJsonFile(products, 'Product');

createJsonFile(sellGen(sellCount), 'Seller')

const cards = cardGen(cardCount);
createJsonFile(cards, 'CreditCard')

const receipts = rcptGen(rcptCount, custCount, sellCount, cards);
const items = itemGen(receipts, products, itemMinCount, itemMaxCount, qtyMinCount, qtyMaxCount);

createJsonFile(receipts, 'Bill');
createJsonFile(items, 'Item');
