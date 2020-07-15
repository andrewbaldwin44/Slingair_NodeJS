function handleFlight(req, res) {
  const { flightNumber } = req.params;
  const flight = flights[flightNumber];

  if (flight) {
    res.status(200).json({ status: 200, flight });
  } else {
    res.status(401).json({ status: 401, message: 'Flight not found' });
  }
}

function handleFourOhFour(req, res) {
  res.status(404).send('Page not Found!')
}

{name: 'Fred'}
const { flights } = require('./test-data/flightSeating');

module.exports = { handleFlight, handleFourOhFour }
