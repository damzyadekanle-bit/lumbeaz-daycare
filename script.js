document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  var form = this;
  var status = document.getElementById('formStatus');
  var button = form.querySelector('button[type="submit"]');
  var formData = new FormData(form);

  status.textContent = 'Sending your message...';
  button.disabled = true;

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  }).then(function(response) {
    if (response.ok) {
      status.textContent = 'Thank you! Your message has been sent.';
      form.reset();
    } else {
      status.textContent = 'Sorry, something went wrong. Please email us directly at lumbeazdaycare@gmail.com.';
    }
  }).catch(function() {
    status.textContent = 'Sorry, something went wrong. Please email us directly at lumbeazdaycare@gmail.com.';
  }).finally(function() {
    button.disabled = false;
  });
});
