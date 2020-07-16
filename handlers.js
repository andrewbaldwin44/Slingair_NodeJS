const { v4: uuidv4 } = require('uuid');
const { flights } = require('./test-data/flightSeating');
const { reservations } = require('./test-data/reservations');
const request = require('request-promise');

function findCustomer(value, match = 'id') {
  return reservations.find(customer => customer[match] == value);
}

function handleHomepage(req, res) {
  res.render('./pages/homepage.ejs', { title: 'Sling Air' });
}

async function handleSeatSelection(req, res) {
  const response = await request({ uri: 'https://journeyedu.herokuapp.com/slingair/flights',
                                     json: true });
  const allFlights = response.flights

  res.render('./pages/seat-select', { title: 'Seat Selection', allFlights });
}

async function handleFlight(req, res) {
  const { flightNumber } = req.params;
  const response = await request({
    uri: `https://journeyedu.herokuapp.com/slingair/flights/${flightNumber}`,
    json: true
  });

  const flight = response[flightNumber]

  if (response.status == 200) {
    res.status(200).json({ status: 200, flight });
  } else {
    res.status(401).json({ status: 401, message: 'Flight not found' });
  }
}

async function newFlightPurchase(req, res) {
  const customerInfo = req.body;

  try {
    const registerUser = await request({
      uri: 'https://journeyedu.herokuapp.com/slingair/users',
      method: 'POST',
      body: customerInfo,
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
      },
      json: true
    });

    confirmationNumber = registerUser.reservation.id;

    res.status(201).json({ status: 201, confirmationNumber });
  }
  catch (e) {
    res.status(401).json({ status: 401, e });
  }
}

async function confirmedFlightPurchase(req, res, next) {
  const { id } = req.params;
  const response = await request({
    uri: `https://journeyedu.herokuapp.com/slingair/users/${id}`,
    json: true
  });

  const customer = response.data;
  console.log(response, response.data);

  if (response.status == 200) {
    res.render('./pages/flight-confirmed', { title: 'Take to the Skies!', customer })
  } else next();
}

function findFlight(req, res) {
  res.render('./pages/find-flight', { title: 'Find your Flight!' });
}

function flightLookup(req, res) {
  const { name } = req.body;
  const confirmation = findCustomer(name, 'givenName');

  res.status(201).json({ status: 201, confirmation });
}

function handleAdmin(req, res) {
  res.render('./pages/admin', { title: 'Admin' })
}

function handleFourOhFour(req, res) {
  res.status(404).send('Page not Found!')
}

module.exports = { handleHomepage, handleSeatSelection, handleFlight,
                   newFlightPurchase, confirmedFlightPurchase,
                   findFlight, flightLookup, handleAdmin, handleFourOhFour }
