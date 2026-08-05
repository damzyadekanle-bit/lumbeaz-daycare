var navbar = document.querySelector('.navbar');
var menuToggle = document.querySelector('.menu-toggle');
var navLinks = document.querySelectorAll('.navbar a, .hero .btn, .program-cta, .sticky-tour');
var contactForm = document.getElementById('contactForm');
var formStatus = document.getElementById('formStatus');
var tourDate = document.getElementById('preferredTourDate');
var tourTime = document.getElementById('preferredTourTime');
var programInterest = document.querySelector('select[name="program_interest"]');
var tourDateError = document.getElementById('tourDateError');
var tourTimeError = document.getElementById('tourTimeError');
var galleryItems = document.querySelectorAll('.gallery-item');
var lightbox = document.getElementById('galleryLightbox');
var year = document.getElementById('year');

function updateHeaderHeight() {
  if (navbar) {
    document.documentElement.style.setProperty('--header-height', navbar.offsetHeight + 'px');
  }
}

updateHeaderHeight();
window.addEventListener('resize', updateHeaderHeight);

if ('ResizeObserver' in window && navbar) {
  new ResizeObserver(updateHeaderHeight).observe(navbar);
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(updateHeaderHeight);
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle) {
  menuToggle.addEventListener('click', function() {
    var isOpen = navbar.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    updateHeaderHeight();
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

    var program = link.getAttribute('data-program');
    if (program && programInterest) {
      programInterest.value = program;
    }

    e.preventDefault();
    if (navbar.classList.contains('nav-open')) {
      navbar.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      updateHeaderHeight();
    }

    window.requestAnimationFrame(function() {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

if (lightbox) {
  var lightboxImage = lightbox.querySelector('img');
  var lightboxFrame = lightbox.querySelector('iframe');
  var lightboxClose = lightbox.querySelector('.lightbox-close');
  var lightboxTrigger = null;

  galleryItems.forEach(function(item) {
    item.addEventListener('click', openGalleryItem);
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGalleryItem.call(item);
      }
    });
  });

  function openGalleryItem() {
    var item = this;
    var image = item.querySelector('img');
    var frame = item.querySelector('iframe');
    var gallerySrc = item.getAttribute('data-gallery-src');
    var galleryTitle = item.getAttribute('data-gallery-title') || 'Daycare photo';

    lightboxTrigger = item;

    if (gallerySrc && lightboxFrame) {
      lightboxImage.hidden = true;
      lightboxFrame.hidden = false;
      lightboxFrame.src = gallerySrc;
      lightboxFrame.title = galleryTitle;
    } else if (image) {
      lightboxFrame.hidden = true;
      lightboxImage.hidden = false;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
    } else if (frame && lightboxFrame) {
      lightboxImage.hidden = true;
      lightboxFrame.hidden = false;
      lightboxFrame.src = frame.src;
      lightboxFrame.title = frame.title;
    }

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose.removeAttribute('tabindex');
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('open')) {
      return;
    }

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      lightboxClose.focus();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxClose.setAttribute('tabindex', '-1');
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
    lightboxImage.alt = '';
    lightboxImage.hidden = false;

    if (lightboxFrame) {
      lightboxFrame.src = '';
      lightboxFrame.title = '';
      lightboxFrame.hidden = true;
    }

    if (lightboxTrigger) {
      lightboxTrigger.focus();
      lightboxTrigger = null;
    }
  }
}

function getLocalDateValue(date) {
  var yearValue = date.getFullYear();
  var monthValue = String(date.getMonth() + 1).padStart(2, '0');
  var dayValue = String(date.getDate()).padStart(2, '0');
  return yearValue + '-' + monthValue + '-' + dayValue;
}

function validateTourDate() {
  if (!tourDate || !tourDate.value) {
    if (tourDate) {
      tourDate.setCustomValidity('');
      tourDate.removeAttribute('aria-invalid');
    }
    if (tourDateError) {
      tourDateError.textContent = '';
    }
    return true;
  }

  var parts = tourDate.value.split('-').map(Number);
  var selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var isUnavailable = selectedDate < today || selectedDate.getDay() === 0;
  var message = isUnavailable ? 'Please choose an available tour date.' : '';
  tourDate.setCustomValidity(message);
  if (isUnavailable) {
    tourDate.setAttribute('aria-invalid', 'true');
  } else {
    tourDate.removeAttribute('aria-invalid');
  }
  tourDateError.textContent = message;
  return !isUnavailable;
}

function validateTourTime() {
  if (!tourTime || !tourTime.value) {
    if (tourTime) {
      tourTime.setCustomValidity('');
      tourTime.removeAttribute('aria-invalid');
    }
    if (tourTimeError) {
      tourTimeError.textContent = '';
    }
    return true;
  }

  var isUnavailable = tourTime.value < '06:00' || tourTime.value > '17:30';
  var message = isUnavailable ? 'Please choose a time between 6:00 AM and 5:30 PM.' : '';
  tourTime.setCustomValidity(message);
  if (isUnavailable) {
    tourTime.setAttribute('aria-invalid', 'true');
  } else {
    tourTime.removeAttribute('aria-invalid');
  }
  tourTimeError.textContent = message;
  return !isUnavailable;
}

if (tourDate) {
  tourDate.min = getLocalDateValue(new Date());
  tourDate.addEventListener('input', validateTourDate);
  tourDate.addEventListener('change', validateTourDate);
}

if (tourTime) {
  tourTime.addEventListener('input', validateTourTime);
  tourTime.addEventListener('change', validateTourTime);
}

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var form = this;
    var button = form.querySelector('button[type="submit"]');
    var isDateValid = validateTourDate();
    var isTimeValid = validateTourTime();

    if (!isDateValid) {
      tourDate.focus();
      return;
    }

    if (!isTimeValid) {
      tourTime.focus();
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      formStatus.textContent = 'Please complete all required fields before submitting.';
      var firstInvalidField = form.querySelector(':invalid');
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    var formData = new FormData(form);

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
