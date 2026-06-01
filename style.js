document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  alert('Message sent! We will contact you soon.');
  this.reset();
});
