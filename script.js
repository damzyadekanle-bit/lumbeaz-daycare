var childCount = document.getElementById('childCount');
var childFields = document.getElementById('childFields');

function updateChildFields() {
  var count = parseInt(childCount.value, 10) || 1;
  count = Math.max(1, Math.min(count, 6));
  childCount.value = count;
  childFields.innerHTML = '';

  for (var i = 1; i <= count; i++) {
    var entry = document.createElement('div');
    entry.className = 'form-row child-entry';
    entry.innerHTML =
      '<label class="form-field">Child ' + i + ' Full Name' +
      '<input type="text" name="child_' + i + '_name" />' +
      '</label>' +
      '<label class="form-field">Child ' + i + ' Age' +
      '<input type="text" name="child_' + i + '_age" />' +
      '</label>';
    childFields.appendChild(entry);
  }
}

childCount.addEventListener('input', updateChildFields);
updateChildFields();

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
      status.textContent = "Thank you! Your tour request has been received. We'll contact you soon to confirm your visit.";
      form.reset();
      updateChildFields();
    } else {
      status.textContent = 'Something went wrong. Please try again later.';
    }
  }).catch(function() {
    status.textContent = 'Something went wrong. Please try again later.';
  }).finally(function() {
    button.disabled = false;
  });
});
