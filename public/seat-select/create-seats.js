const seatsDiv = document.getElementById('seats-section');
const flightSelect = document.getElementById('flight');

const seatColumns = ['A', 'B', 'C', 'D', 'E', 'F'];
let selection = '';

function renderSeats(seatAvailibility) {
  seatsDiv.innerHTML = '';
  showSeatMap();
  createSeats(seatAvailibility);

  const seatMap = document.querySelectorAll('.seat-button');

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

        const seatOccupied = `<label class="seat"><span id="${seatNumber}" class="seat-button occupied">${seatNumber}</span></label>`
        const seatAvailable = `<label class="seat"><input type="radio" class="seat-button" value="${seatNumber}" /> \
                               <span id="${seatNumber}" class="avail">${seatNumber}</span></label>`

        if (isSeatAvailible(seatAvailibility, r, s)) seat.innerHTML = seatAvailable;
        else seat.innerHTML = seatOccupied;

        row.appendChild(seat);
    }
  }
}

function toggleFormContent(event) {
  const flightNumber = flightSelect.value;

  if (flightNumber !== 'undefined') {
    fetch(`/flights/${flightNumber}`)
    .then(res => res.json())
    .then(data => {
      if (data.status == 200) renderSeats(data.flight);
    });
  }
}

flightSelect.addEventListener('change', toggleFormContent);
