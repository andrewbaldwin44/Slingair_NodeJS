const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');

const firstName = document.querySelector('#givenName');
const lastName = document.querySelector('#surname');
const email = document.querySelector('#email');

const seatColumns = ['A', 'B', 'C', 'D', 'E', 'F'];
let selection = '';

function renderSeats(seatAvailibility) {
  showSeatMap();
  createSeats(seatAvailibility);

  let seatMap = document.forms['seats'].elements['seat'];
  seatMap.forEach(seat => seat.addEventListener('click', () => handleSeatSelection(seatMap)));
}

function showSeatMap() {
  document.querySelector('.form-container').style.display = 'block';
}

function isSeatAvailible(seatAvailibility, row, aisle) {
  return seatAvailibility[6 * (row - 1) + aisle].isAvailable;
}

function createSeats(seatAvailibility) {
  for (let r = 1; r <= 10; r++) {
    const row = document.createElement('ol');
    row.classList.add('row');
    row.classList.add('uselage');
    seatsDiv.appendChild(row);

    for (let s = 0; s < 6; s++) {
        const seatNumber = `${r}${seatColumns[s]}`;
        const seat = document.createElement('li');

        const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`
        const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /> \
                               <span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`

        if (isSeatAvailible(seatAvailibility, r, s)) seat.innerHTML = seatAvailable;
        else seat.innerHTML = seatOccupied;

        row.appendChild(seat);
    }
  }
}

function handleSeatSelection(seatMap) {
  const seat = event.target;
  selection = seat.value;

  seatMap.forEach(x => {
      if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove('selected');
      }
  });

  document.getElementById(seat.value).classList.add('selected');
  document.getElementById('seat-number').innerText = `(${selection})`;
  confirmButton.disabled = false;
}

function toggleFormContent(event) {
  const flightNumber = flightInput.value;

  if (flightNumber !== 'undefined') {
    fetch(`/flights/${flightNumber}`)
    .then(res => res.json())
    .then(data => {
      if (data.status == 200) renderSeats(data.flight);
      else console.log(data.message);
    })
  }
  else {
    console.log('Invalid flight number!');
  }
}

function handleConfirmSeat(event) {
  event.preventDefault();

  const customer = {
    'flight': flightInput.value,
    'seat': selection,
    'givenName': firstName.value,
    'surname': lastName.value,
    'email': email.value
  }

  fetch('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
      headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
      }
  })
  .then(response => response.json())
  .then(data => {
    const id = data.confirmation;
    window.location.href = `/flight-confirmed/${id}`;
  })
}

flightInput.addEventListener('change', toggleFormContent);
