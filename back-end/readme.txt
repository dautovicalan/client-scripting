Fake back-end based on JSON server:
  https://github.com/typicode/json-server

*** Install ***

npm install -g json-server

*** Generate fake data ***

npm run seed

*** Start server ***

npm run start-auth

*** Where are users? ***

Open (and edit) mockup-data/User.json

*** Can I register new users and login? ***

Yes, see next section.

*** Which endpoints are supported? ***

User register and login:
- POST http://localhost:3000/auth/register
- POST http://localhost:3000/auth/login

City CRUD:
- GET http://localhost:3000/City
- POST http://localhost:3000/City
- PUT http://localhost:3000/City
- DELETE http://localhost:3000/City

Following endpoints also support GET/POST/PUT/DELETE:
- http://localhost:3000/Customer
- http://localhost:3000/Bill
- http://localhost:3000/CreditCard
- http://localhost:3000/Seller
- http://localhost:3000/Item
- http://localhost:3000/Category
- http://localhost:3000/SubCategory
- http://localhost:3000/Product

All endpoints are secured, except Customer and City.
For more details on how endpoints work, see: https://github.com/typicode/json-server

*** Can I have some examples on how to do basic operations like register, login, GET data and POST data? ***

Register user: POST http://localhost:3000/auth/register
Response example: {
  "name": "test8",
  "email": "test8@email.com",
  "password": "test8"
}

Login user: POST http://localhost:3000/auth/login (returns JWT)
Response example: {
  "email": "test8@email.com",
  "password":"test8"
}

Get cities: GET http://localhost:3000/City
Response example: [
    {
        "id": 1,
        "guid": "6d9c9004-fcec-40af-a6c4-2c5b2b5055ff",
        "name": "Sinj"
    },
    {
        "id": 2,
        "guid": "56e2b3e3-00ca-4280-b8d7-7c71b6b7ccc9",
        "name": "Valpovo"
    },

    ...

    {
        "id": 99,
        "guid": "487f01a0-86ac-43d6-8288-2626f0afb6a0",
        "name": "Vinkovci"
    },
    {
        "id": 100,
        "guid": "2a9c7988-62d1-4d25-80d2-f45fcaff027b",
        "name": "Delnice"
    }
]

Create city: POST http://localhost:3000/City
Request example: {
  "guid": "7cc2f282-6451-490c-a50b-f533ca7284aa",
  "name": "Zagreb"
}

*** Are other operations like paging, filtering, sorting supported? ***

Page cities: GET http://localhost:3000/City?_page=2&_limit=10
Filter cities: GET http://localhost:3000/City?name=Zagreb
Filter using like operator: GET http://localhost:3000/City?name_like=grad
Filter using full-text search: GET http://localhost:3000/Bill?q=atque
Sorting: GET http://localhost:3000/Category?_sort=name&_order=desc

For more operations, see: https://github.com/typicode/json-server

*** Can I get total number of items behind an endpoint? ***

Yes, there is "x-total-count" response header that you can use.
It contains the information you need - total number of items.
See: https://github.com/typicode/json-server/tree/v0?tab=readme-ov-file#slice

*** Enjoy fake REST server! ***
