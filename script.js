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
var galleryItems = document.querySelectorAll('.gallery-open');
var galleryCarousel = document.querySelector('.gallery-carousel');
var galleryTrack = document.querySelector('.gallery-carousel .gallery');
var suppressGalleryClick = false;
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
  var lightboxPrev = lightbox.querySelector('.lightbox-prev');
  var lightboxNext = lightbox.querySelector('.lightbox-next');
  var lightboxTrigger = null;
  var currentGalleryIndex = 0;
  var touchStartX = null;
  var carouselTouchStartX = null;
  var carouselNudgeTimer = null;

  var gallerySlides = [];
  galleryItems.forEach(function(item) {
    var gallerySrc = item.getAttribute('data-gallery-src');
    if (!gallerySrc || gallerySlides.some(function(slide) { return slide.src === gallerySrc; })) {
      return;
    }

    gallerySlides.push({
      src: gallerySrc,
      title: item.getAttribute('data-gallery-title') || 'Daycare photo',
      trigger: item
    });
  });

  galleryItems.forEach(function(item) {
    item.addEventListener('click', openGalleryItem);
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGalleryItem.call(item);
      }
    });
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function() {
      showGallerySlide(currentGalleryIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function() {
      showGallerySlide(currentGalleryIndex + 1);
    });
  }

  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function(e) {
    if (touchStartX === null) {
      return;
    }

    var deltaX = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;

    if (Math.abs(deltaX) < 45) {
      return;
    }

    if (deltaX < 0) {
      showGallerySlide(currentGalleryIndex + 1);
    } else {
      showGallerySlide(currentGalleryIndex - 1);
    }
  }, { passive: true });

  function openGalleryItem() {
    if (suppressGalleryClick) {
      suppressGalleryClick = false;
      return;
    }

    var item = this;
    var gallerySrc = item.getAttribute('data-gallery-src');
    var nextIndex = gallerySlides.findIndex(function(slide) {
      return slide.src === gallerySrc;
    });

    lightboxTrigger = item;
    showGallerySlide(nextIndex === -1 ? 0 : nextIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose.removeAttribute('tabindex');
    if (lightboxPrev) {
      lightboxPrev.removeAttribute('tabindex');
    }
    if (lightboxNext) {
      lightboxNext.removeAttribute('tabindex');
    }
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  }

  function showGallerySlide(index) {
    if (!gallerySlides.length) {
      return;
    }

    currentGalleryIndex = (index + gallerySlides.length) % gallerySlides.length;
    var slide = gallerySlides[currentGalleryIndex];

    if (lightboxFrame) {
      lightboxImage.hidden = true;
      lightboxFrame.hidden = false;
      lightboxFrame.src = slide.src;
      lightboxFrame.title = slide.title;
    }
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
    } else if (e.key === 'ArrowLeft') {
      showGallerySlide(currentGalleryIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showGallerySlide(currentGalleryIndex + 1);
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxClose.setAttribute('tabindex', '-1');
    if (lightboxPrev) {
      lightboxPrev.setAttribute('tabindex', '-1');
    }
    if (lightboxNext) {
      lightboxNext.setAttribute('tabindex', '-1');
    }
    document.body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = '';
    lightboxImage.hidden = true;

    if (lightboxFrame) {
      lightboxFrame.removeAttribute('src');
      lightboxFrame.title = 'Daycare photo preview';
      lightboxFrame.hidden = true;
    }

    if (lightboxTrigger) {
      lightboxTrigger.focus();
      lightboxTrigger = null;
    }
  }
}

if (galleryCarousel && galleryTrack) {
  var carouselTouchStartX = null;
  var carouselStartTranslateX = 0;
  var carouselLastDeltaX = 0;
  var carouselResumeTimer = null;

  galleryCarousel.addEventListener('touchstart', function(e) {
    carouselTouchStartX = e.changedTouches[0].clientX;
    carouselStartTranslateX = getGalleryTranslateX();
    carouselLastDeltaX = 0;
    window.clearTimeout(carouselResumeTimer);
    galleryTrack.style.animation = 'none';
    galleryTrack.style.transition = 'none';
    galleryTrack.style.transform = 'translateX(' + carouselStartTranslateX + 'px)';
  }, { passive: true });

  galleryCarousel.addEventListener('touchmove', function(e) {
    if (carouselTouchStartX === null) {
      return;
    }

    carouselLastDeltaX = e.changedTouches[0].clientX - carouselTouchStartX;
    galleryTrack.style.transform = 'translateX(' + (carouselStartTranslateX + carouselLastDeltaX) + 'px)';
  }, { passive: true });

  galleryCarousel.addEventListener('touchend', function() {
    if (carouselTouchStartX === null) {
      return;
    }

    var firstItem = galleryTrack.querySelector('.gallery-item');
    var slideDistance = firstItem ? firstItem.offsetWidth + getGalleryGap() : 0;
    var shouldAdvance = slideDistance && Math.abs(carouselLastDeltaX) > 45;
    var targetTranslateX = carouselStartTranslateX;

    if (shouldAdvance) {
      suppressGalleryClick = true;
      targetTranslateX += carouselLastDeltaX < 0 ? -slideDistance : slideDistance;
    }

    carouselTouchStartX = null;
    galleryTrack.style.transition = 'transform 0.35s ease';
    galleryTrack.style.transform = 'translateX(' + targetTranslateX + 'px)';

    carouselResumeTimer = window.setTimeout(function() {
      galleryTrack.style.transition = '';
      galleryTrack.style.transform = '';
      galleryTrack.style.animation = '';
      suppressGalleryClick = false;
    }, 380);
  }, { passive: true });

  galleryCarousel.addEventListener('touchcancel', resumeGalleryAutoplay, { passive: true });

  function getGalleryGap() {
    return parseFloat(window.getComputedStyle(galleryTrack).gap) || 0;
  }

  function getGalleryTranslateX() {
    var transform = window.getComputedStyle(galleryTrack).transform;
    if (!transform || transform === 'none') {
      return 0;
    }

    var values = transform.match(/matrix\(([^)]+)\)/);
    if (!values) {
      return 0;
    }

    return Number(values[1].split(',')[4]) || 0;
  }

  function resumeGalleryAutoplay() {
    carouselTouchStartX = null;
    galleryTrack.style.transition = '';
    galleryTrack.style.transform = '';
    galleryTrack.style.animation = '';
    suppressGalleryClick = false;
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
