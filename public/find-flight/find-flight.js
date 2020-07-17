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
    console.log(data)
    if (data.status == 201) {
      const id = data.userID;
      window.location.href = `/flight-confirmed/${id}`;
    }
    else {
      console.log('Your flight could not be found!');
    }
  });
})
