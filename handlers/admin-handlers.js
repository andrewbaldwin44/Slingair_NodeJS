const { getAllUsers, getAllFlights, BASE_URL } = require('./handlers');

const request = require('request-promise');
require('dotenv').config();
const ls = require('local-storage');

function isAuthenticatedAdmin() {
  return ls.get('authenticated')
}

async function getPaginatedUsers(page, limit) {
  return await request({
    uri: `${BASE_URL}users?page=${page}&limit=${limit}`,
    json: true
  });
}

async function findUserBySeat(flight, seat) {
  try {
    return await request({
      uri: `${BASE_URL}flights/${flight}/${seat}`,
      json: true
    });
  }
  catch {
    return { status: 401, message: 'User not found!' };
  }
}

function handleAdmin(req, res) {
  res.render('./pages/admin', { title: 'Admin' });
}

function confirmAuthentication(req, res) {
  const password = req.body.password;

  if (password == process.env.PASSWORD) {
    ls.set('authenticated', true);
    res.status(201).json({ status: 201 });
  } else res.status(401).json({ status: 401, message: 'Wrong password!' });
}

function handleAuthenticated(req, res) {
  if (isAuthenticatedAdmin()) {
    res.render('./pages/authenticated-admin', { title: 'Admin' });
  } else res.redirect('/');
}

async function handleFlights(req, res) {
  if (isAuthenticatedAdmin()) {
    const allFlights = await getAllFlights();

    res.render('./pages/flights', { title: 'Slingair Flights', allFlights });
  } else res.redirect('/');
}

async function handleFindUser(req, res) {
  if (isAuthenticatedAdmin()) {
    const { flight, seatNumber } = req.body;

    const response = await findUserBySeat(flight, seatNumber);

    if (response.status == 200) {
      const user = response.user;
      res.status(201).json({ status: 201, userID: user.id });
    } else res.status(401).json({ status: 401, message: response.message });
  } else res.redirect('/');
}

async function handleUsers(req, res) {
  if (isAuthenticatedAdmin()) {
    const page = getQueryValue(req.query.page, 1);
    const limit = getQueryValue(req.query.limit, 3);

    if (Object.keys(req.query).length < 2) {
      res.redirect(`./users?page=${page}&limit=${limit}`);
    }

    try {
      const response = await getPaginatedUsers(page, limit);
      const paginatedUsers = response.users;
      const usersRegistered = response.usersRegistered;

      const paginatedResults = paginate(page, limit, paginatedUsers, usersRegistered);

      res.render('./pages/users', { title: 'Slingair Customers', paginatedResults });
    }
    catch (e) {console.log(e)};
  } else res.redirect('/');
}

function range(start, end) {
  const range = [];
  for (let i = start; i <= end; i++) {
    if (i > 0) range.push(i);
  }
  return range;
}

function getQueryValue(queryValue, defaultValue) {
  return queryValue !== undefined ? Number(queryValue) : defaultValue;
}

function paginate(page, limit, model, modelLength) {
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

  results.results = model;

  return results;
}

module.exports = {
  handleAdmin,
  confirmAuthentication,
  handleAuthenticated,
  handleUsers,
  handleFlights,
  handleFindUser
}
