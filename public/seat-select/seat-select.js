const confirmButton = document.getElementById('confirm-button');

const firstName = document.querySelector('#givenName');
const lastName = document.querySelector('#surname');
const email = document.querySelector('#email');

const submissionError = document.querySelector('#submission-error');

function handleSeatSelection(seatMap) {
  const seat = event.target;

  if (seat.classList.contains('occupied')) return;

  selection = seat.value;

  seatMap.forEach(x => {
      if (!x.classList.contains('occupied') && x.value !== seat.value) {
          document.getElementById(x.value).classList.remove('selected');
      }
  });

  document.getElementById(seat.value).classList.add('selected');
  document.getElementById('seat-number').innerText = `(${selection})`;
  confirmButton.disabled = false;
}

function handleConfirmSeat(event) {
  event.preventDefault();

  const customer = {
    'flight': flightSelect.value,
    'seat': selection,
    'firstName': firstName.value,
    'lastName': lastName.value,
    'email': email.value
  }

  fetch('/new-user', {
      method: 'POST',
      body: JSON.stringify(customer),
      headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
      }
  })
  .then(response => response.json())
  .then(data => {
    if (data.status == 201) {
      const { confirmationNumber } = data;

      window.location.href = `/flight-confirmed/${confirmationNumber}`;
    }
    else {
      submissionError.textContent = data.message;
    }
  })
  .catch(e => console.log(e));
}
