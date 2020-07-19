const emailInput = document.querySelector('#user-email');
const submitButton = document.querySelector('#submit-user-info');

submitButton.addEventListener('click', () => {
  event.preventDefault();

  const lookupData = {email: emailInput.value}

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
    if (data.status == 201) {
      const id = data.userID;
      window.location.href = `/flight-confirmed/${id}`;
    }
    else {
      console.log('Your flight could not be found!');
    }
  });
})
