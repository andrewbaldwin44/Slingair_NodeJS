const nameInput = document.querySelector('#customer-name');
const submitButton = document.querySelector('#submit-name');

submitButton.addEventListener('click', () => {
  event.preventDefault();

  const lookupData = {name: nameInput.value}

  fetch('/flight-lookup', {
    method: 'POST',
    body: JSON.stringify(lookupData),
    headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    const id = data.confirmation.id;
    window.location.href = `/flight-confirmed/${id}`;
  });
})
