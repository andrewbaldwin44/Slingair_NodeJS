const { getAllUsers } = require('./handlers');
require('dotenv').config();

function handleAdmin(req, res) {
  res.render('./pages/admin', { title: 'Admin' });
}

function confirmAuthentication(req, res) {
  const password = req.body.password;

  if (password == process.env.PASSWORD) {
    res.status(201).json({ status: 201 });
  } else res.status(401).json({ status: 401, message: 'Wrong password!' });
}

function handleAuthenticated(req, res) {
  res.render('./pages/authenticated-admin', { title: 'Admin' });
  json: true
}

async function handleUsers(req, res) {
  const allUsers = await getAllUsers();

  const paginatedResults = paginate(req.query, allUsers);

  res.render('./pages/users', { title: 'Slingair Customers', paginatedResults });
}

async function handleFlights(req, res) {
  const allFlights = await getAllFlights();

  const paginatedResults = paginate(req.query, allFlights);

  res.render('./pages/flights', { title: 'Slingair Flights', paginatedResults });
}

function range(start, end) {
  const range = [];
  for (let i = start; i <= end; i++) {
    if (i > 0) range.push(i);
  }
  return range;
}

function paginate(query, model) {
  const page = Number(query.page);
  const limit = Number(query.limit);

  const modelLength = model.length

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  results.limit = limit;
  results.page = page;
  results.pages = Math.ceil(modelLength / limit);
  results.upperRange = range(page + 1, page + 3);
  results.lowerRange = range(page - 3, page - 1);

  if (endIndex < modelLength) {
    results.next = page + 1;
  }

  if (startIndex > 0) {
    results.previous = page - 1
  }

  results.results = model.slice(startIndex, endIndex);

  return results;
}

module.exports = { handleAdmin, confirmAuthentication,
                  handleAuthenticated, handleUsers, handleFlights }
