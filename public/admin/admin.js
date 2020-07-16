const passwordInput = document.querySelector('#password-input');
const passwordForm = document.querySelector('#password-form');

function validatePassword() {
  event.preventDefault();

  console.log(passwordInput.value)

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
    console.log(data)
    if (data.status == 201) {
      console.log('cool')
      window.location.href = '/admin-authenticated';
    }
    else console.log(data.message);
  });
}

passwordForm.addEventListener('submit', validatePassword);
