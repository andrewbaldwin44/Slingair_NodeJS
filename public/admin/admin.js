const passwordInput = document.querySelector('#password-input');
const passwordForm = document.querySelector('#password-form');

function validatePassword() {
  event.preventDefault();

  fetch('/confirm-authentication', {
    method: 'POST',
    body: JSON.stringify({ password: passwordInput.value }),
    headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.status == 201) {
      window.location.replace('/admin-authenticated');
    }
    else console.log(data.message);
  });
}

passwordForm.addEventListener('submit', validatePassword);
