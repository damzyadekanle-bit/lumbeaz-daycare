var navbar = document.querySelector('.navbar');
var menuToggle = document.querySelector('.menu-toggle');
var navLinks = document.querySelectorAll('.navbar a, .hero .btn, .sticky-tour');
var contactForm = document.getElementById('contactForm');
var formStatus = document.getElementById('formStatus');
var galleryItems = document.querySelectorAll('.gallery-item img');
var lightbox = document.getElementById('galleryLightbox');
var year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle) {
  menuToggle.addEventListener('click', function() {
    var isOpen = navbar.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
}

navLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    var targetId = link.getAttribute('href');

    if (!targetId || targetId.charAt(0) !== '#') {
      return;
    }

    var target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (navbar.classList.contains('nav-open')) {
      navbar.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

if (lightbox) {
  var lightboxImage = lightbox.querySelector('img');
  var lightboxClose = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(function(image) {
    image.parentElement.addEventListener('click', function() {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      lightboxClose.focus();
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    lightboxImage.alt = '';
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var form = this;
    var button = form.querySelector('button[type="submit"]');
    var formData = new FormData(form);

    if (!form.checkValidity()) {
      form.reportValidity();
      formStatus.textContent = 'Please complete all required fields before submitting.';
      return;
    }

    formStatus.textContent = 'Sending your tour request...';
    button.disabled = true;

    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(function(response) {
      if (response.ok) {
        formStatus.textContent = "Thank you! Your tour request has been received. We'll contact you soon to confirm your visit.";
        form.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again later.';
      }
    }).catch(function() {
      formStatus.textContent = 'Something went wrong. Please try again later.';
    }).finally(function() {
      button.disabled = false;
    });
  });
}
