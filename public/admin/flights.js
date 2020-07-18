function handleSeatSelection() {
  const seat = event.target;

  if (!seat.classList.contains('occupied')) return;

  const seatInfo = {
    flight: flightSelect.value,
    seatNumber: seat.id
  }

  fetch('/admin-authenticated/find-user', {
      method: 'POST',
      body: JSON.stringify(seatInfo),
      headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
      }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
  });
}
