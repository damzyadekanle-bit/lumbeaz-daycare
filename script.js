document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  var formData = new FormData(this);
  var name = formData.get('name');
  var email = formData.get('email');
  var message = formData.get('message');
  var subject = encodeURIComponent('Tour request from ' + name);
  var body = encodeURIComponent(
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n\n' +
    message
  );

  window.location.href = 'mailto:lumbeazdaycare@gmail.com?subject=' + subject + '&body=' + body;
  this.reset();
});
