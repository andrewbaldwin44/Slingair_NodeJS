const { getAllUsers, getAllFlights } = require('./handlers');
const request = require('request-promise');
require('dotenv').config();
const ls = require('local-storage');

function isAuthenticatedAdmin() {
  return ls.get('authenticated')
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

    const allUsers = await getAllUsers();

    const user = allUsers.find(user => {
      return user.flight == flight && user.seat == seatNumber;
    });


    res.render(`/flight-confirmed/${user.id}`);
    //res.status(201).json({ status: 201, user });
  } else res.redirect('/');
}

function range(start, end) {
  const range = [];
  for (let i = start; i <= end; i++) {
    if (i > 0) range.push(i);
  }
  return range;
}

async function handleUsers(req, res) {
  if (isAuthenticatedAdmin()) {
    if (Object.keys(req.query).length == 0) {
      res.redirect(`${req.originalUrl}?page=1&limit=3`);
    }

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const paginatedUsers = await getPaginatedUsers(page, limit);

    const paginatedResults = paginate(page, limit, paginatedUsers);
    console.log(paginatedResults)

    res.render('./pages/users', { title: 'Slingair Customers', paginatedResults });
  } else res.redirect('/');
}

async function getPaginatedUsers(page, limit) {
  return await request({
    uri: `https://journeyedu.herokuapp.com/slingair/users?start=${page}&limit=${limit}`,
    json: true
  });
}

function paginate(page, limit, model) {
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

  results.results = model;

  return results;
}

module.exports = { handleAdmin, confirmAuthentication,
                  handleAuthenticated, handleUsers, handleFlights,
                  handleFindUser }
