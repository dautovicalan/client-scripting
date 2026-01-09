const jsonServer = require("json-server");
const fs = require("fs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const server = jsonServer.create();
server.use(cors());
const router = jsonServer.router(require("./db.js")());
router.use(cors());

const lowdb = router.db;
const dbUsers = () => lowdb.get("User");

const middlewares = jsonServer.defaults();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

function isAuthenticated({ email, password }) {
  return !!dbUsers()
    .find((u) => u.email == email && u.password == password)
    .value();
}

const SECRET_KEY = "123456789";
const expiresIn = "1h";
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

server.post("/auth/login", (req, res) => {
  console.log("POST /auth/login");
  const { email, password } = req.body;
  const isAuth = isAuthenticated({ email, password });
  if (!isAuth) {
    const status = 401;
    const respJson = { status: status, message: "Incorrect email or password" };
    res.status(status).json(respJson);
    console.log(respJson);
    return;
  }
  const status = 200;
  const access_token = createToken({ email, password });
  res.status(status).json({ access_token });
});

server.post("/auth/register", (req, res) => {
  console.log("POST /auth/register");

  // Add authenticated user to database
  const resource = dbUsers().insert(req.body).value();

  const status = 200;
  res.status(status).json(resource);
});

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  const allowedUrls = ["city", "customer"];
  for (const url of allowedUrls) {
    const token = req.baseUrl.split("/")[1].toLowerCase();
    if (token.includes(url)) {
      console.log("*allowed endpoint*");
      next();
      return;
    }
  }

  console.log("*protected endpoint*");

  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    const msg = "Bad authorization header";
    res.status(status).json({ status, message: msg });
    console.log(msg);
    return;
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, res) => {
      if (err) {
        return res.status(401).json({ error: err.message });
      } else {
        next();
      }
    });
  } catch (err) {
    const status = 401;
    const errJson = { status, message: "Error: access_token is not valid" };
    console.error(err, errJson);
    res.status(status).json(errJson);
  }
});

server.use(middlewares);
server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running");
});
