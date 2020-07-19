const request = require('request-promise');
const BASE_URL = 'https://slingairflights.herokuapp.com/';

async function findUser(email) {
  const response = await request({
    uri: `${BASE_URL}users/${email}`,
    json: true
  });

  if (response.status == 200) {
    return response.user;
  }
}

async function getAllFlights() {
  const response = await request({ uri: `${BASE_URL}flights`,
                                   json: true });
  return response.flights;
}

function handleHomepage(req, res) {
  res.render('./pages/homepage.ejs', { title: 'Sling Air' });
}

async function handleSeatSelection(req, res) {
  const allFlights = await getAllFlights();

  res.render('./pages/seat-select', { title: 'Seat Selection', allFlights });
}

async function getFlight(req, res) {
  const { flightNumber } = req.params;

  const response = await request({
    uri: `${BASE_URL}flights/${flightNumber}`,
    json: true
  });

  const flight = response.flight

  if (response.status == 200) {
    res.status(200).json({ status: 200, flight });
  } else {
    res.status(401).json({ status: 401, message: 'Flight not found' });
  }
}

async function newFlightPurchase(req, res) {
  const customerInfo = req.body;

  try {
    const response = await request({
      uri: `${BASE_URL}users`,
      method: 'POST',
      body: customerInfo,
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
      },
      json: true
    });

    confirmationNumber = response.data.id;

    res.status(201).json({ status: 201, confirmationNumber });
  }
  catch (e) {
    res.status(409).json(e.error);
  }
}

async function confirmedFlightPurchase(req, res, next) {
  const { id } = req.params;
  const response = await request({
    uri: `${BASE_URL}users/${id}`,
    json: true
  });

  const user = response.user;

  if (response.status == 200) {
    res.render('./pages/flight-confirmed', { title: 'Take to the Skies!', user })
  } else next();
}

function findFlight(req, res) {
  res.render('./pages/find-flight', { title: 'Find your Flight!' });
}

async function flightLookup(req, res) {
  const { email } = req.body;

  const user = await findUser(email);

  if (user) {
    res.status(201).json({ status: 201, userID: user.id });
  } else res.status(401).json({ status: 401, message: 'Reservation not found!' });
}

function handleFourOhFour(req, res) {
  res.status(404).send('Page not Found!')
}

module.exports = {
  handleHomepage,
  handleSeatSelection,
  getFlight,
  newFlightPurchase,
  confirmedFlightPurchase,
  findFlight,
  flightLookup,
  handleFourOhFour,
  findUser,
  getAllFlights,
  BASE_URL
}
