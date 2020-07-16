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

  const paginatedUsers = paginatedResults(req.query, allUsers);

  res.render('./pages/users', { title: 'Slingair Customers', paginatedUsers });
}

async function handleFlights(req, res) {
  
}

function paginatedResults(query, model) {
  const page = Number(query.page);
  const limit = Number(query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < model.length) {
    results.next = {
      page: page + 1,
      limit: limit
    }
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    }
  }

  results.results = model.slice(startIndex, endIndex);

  return results;
}

module.exports = { handleAdmin, confirmAuthentication,
                  handleAuthenticated, handleUsers, handleFlights }
