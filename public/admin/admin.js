const passwordInput = document.querySelector('#password-input');
const passwordForm = document.querySelector('#password-form');

function validatePassword() {
  event.preventDefault();
  if (passwordInput.value == 'bacon') {
    window.location.href = '/admin-autheticated'
  }
}

passwordForm.addEventListener('submit', validatePassword);
