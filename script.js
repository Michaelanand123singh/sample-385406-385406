document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuButton = document.querySelector('[data-mobile-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : []; // Ensure menuLinks is always an array
  let menuOpen = false;

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('hidden');
      menuButton.setAttribute('aria-expanded', menuOpen);

      if (menuOpen) {
        trapFocus(mobileMenu);
      } else {
        untrapFocus(mobileMenu);
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (event) => {
      if (menuOpen && event.key === 'Escape') {
        menuOpen = false;
        mobileMenu.classList.add('hidden');
        menuButton.setAttribute('aria-expanded', false);
        untrapFocus(mobileMenu); // Untrap focus on ESC
        menuButton.focus(); // Return focus to the menu button
      }
    });

      // Close menu when clicking outside the menu
    document.addEventListener('click', (event) => {
        if (menuOpen && !mobileMenu.contains(event.target) && event.target !== menuButton) {
          menuOpen = false;
          mobileMenu.classList.add('hidden');
          menuButton.setAttribute('aria-expanded', false);
          untrapFocus(mobileMenu); // Untrap focus
        }
      });
  }

  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (!firstFocusableElement) {
      return; // No focusable elements
    }

    firstFocusableElement.focus();

    element.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            event.preventDefault();
          }
        }
      }
    });
  }

  function untrapFocus(element) {
    //  Remove event listener if needed.  Currently not removing, but leaving as a possibility.
    //  element.removeEventListener('keydown', focusTrapHandler);
  }


  // Smooth Scroll and Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.querySelector('[data-back-to-top]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  if (backToTopButton) {
    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.remove('hidden');
      } else {
        backToTopButton.classList.add('hidden');
      }
    });
  }

  // Testimonial Slider
  const testimonials = document.querySelectorAll('[data-testimonial]');
  const prevButton = document.querySelector('[data-testimonial-prev]');
  const nextButton = document.querySelector('[data-testimonial-next]');
  let currentIndex = 0;
  let intervalId;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle('hidden', i !== index);
    });
  }

  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function startSlider() {
    intervalId = setInterval(nextTestimonial, 5000);
  }

  function stopSlider() {
    clearInterval(intervalId);
  }


  if (testimonials.length > 0 && prevButton && nextButton) {
    showTestimonial(currentIndex);
    startSlider(); // Start auto-advance

    prevButton.addEventListener('click', () => {
      stopSlider();
      prevTestimonial();
      startSlider();

    });
    nextButton.addEventListener('click', () => {
      stopSlider();
      nextTestimonial();
      startSlider();
    });

    // Pause on hover
    const sliderContainer = document.querySelector('[data-testimonial-slider]');
      if(sliderContainer) {
          sliderContainer.addEventListener('mouseover', stopSlider);
          sliderContainer.addEventListener('mouseleave', startSlider);
      }

  }


  // FAQ Accordion
  const faqItems = document.querySelectorAll('[data-faq-item]');

  faqItems.forEach(item => {
    const button = item.querySelector('[data-faq-button]');
    const content = item.querySelector('[data-faq-content]');

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('[data-faq-content]').style.maxHeight = null;
          otherItem.querySelector('[data-faq-button]').setAttribute('aria-expanded', 'false');

        }
      });

      // Toggle current item
      item.classList.toggle('active');
      button.setAttribute('aria-expanded', !isOpen);

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  // Email Capture
  const emailForm = document.querySelector('[data-email-form]');

  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.querySelector('[data-email-input]');
      const email = emailInput.value;

      if (isValidEmail(email)) {
        console.log('Email submitted:', email);
        // Reset the form after submission (optional)
        emailForm.reset();
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM Tracking (stub)
  const ctaButtons = document.querySelectorAll('[data-cta]');

  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const utmSource = getParameterByName('utm_source');
      const utmMedium = getParameterByName('utm_medium');
      const utmCampaign = getParameterByName('utm_campaign');

      console.log('CTA Clicked:', {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        href: button.href
      });

      // NOTE: In a real implementation, you'd send this data to an analytics service.
    });
  });

  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // Lazy Loading (example implementation for images.  Tailwind can assist with placeholder styling)
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(image => {
    imageObserver.observe(image);
  });

});