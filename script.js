// =========================
// Modern Glass Portfolio Interactions
// =========================

// Utilities
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Detect backdrop-filter support and add fallback class
if (!CSS.supports('backdrop-filter', 'blur(10px)')) {
    document.documentElement.classList.add('no-backdrop');
}

// Navigation functionality
class Navigation {
    constructor() {
        this.hamburger = $("#hamburger");
        this.navMenu = $("#nav-menu");
        this.navbar = $("#navbar");
        this.init();
    }

    init() {
        this.setupMobileNav();
        this.setupScrollEffects();
        this.setupSmoothScroll();
    }

    setupMobileNav() {
        if (!this.hamburger || !this.navMenu) return;
        
        const closeMenu = () => {
            this.hamburger.classList.remove("active");
            this.navMenu.classList.remove("active");
        };

        this.hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            this.hamburger.classList.toggle("active");
            this.navMenu.classList.toggle("active");
        });

        // Close on nav link click
        $$(".nav-link").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (
                !this.hamburger.contains(e.target) &&
                !this.navMenu.contains(e.target)
            ) {
                closeMenu();
            }
        });

        // Close on escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeMenu();
        });
    }

    setupScrollEffects() {
        let ticking = false;
        
        const onScroll = () => {
            const scrollY = window.scrollY;
            
            // Navbar scroll effect
            if (this.navbar) {
                if (scrollY > 50) {
                    this.navbar.classList.add("scrolled");
                } else {
                    this.navbar.classList.remove("scrolled");
                }
            }

            // Active section highlighting
            this.updateActiveSection();
            
            // Scroll to top button
            const scrollBtn = $("#scrollToTop");
            if (scrollBtn) {
                scrollBtn.style.display = scrollY > 300 ? "flex" : "none";
            }

            ticking = false;
        };

        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        });
    }

    updateActiveSection() {
        const sections = $$("section[id]");
        const navLinks = $$(".nav-link");
        let current = "";

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom > 100) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }

    setupSmoothScroll() {
      $$('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
          const target = $(anchor.getAttribute("href"));
          if (target) {
            const offset = this.navbar ? this.navbar.offsetHeight + 20 : 20;
            const top =
              target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        });
      });
      // Light hero lift on scroll start
      let heroLiftApplied = false;
      window.addEventListener("scroll", () => {
        if (!heroLiftApplied && window.scrollY > 20) {
          document.body.classList.add("scrolled-hero");
          heroLiftApplied = true;
        }
      });
    }
}

// Animations and Effects
class Animations {
  constructor() {
    this.init();
  }

  init() {
    this.setupRevealAnimation();
    this.setupCounterAnimation();
    this.setupTypingEffect();
    this.setupParallaxEffect();
    this.setupHoverEffects();
  }

  setupRevealAnimation() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Special handling for skill progress bars
            if (entry.target.classList.contains("skill-item")) {
              const progress = entry.target.querySelector(".skill-progress");
              if (progress) {
                setTimeout(() => {
                  progress.style.width =
                    progress.style.getPropertyValue("--progress") || "75%";
                }, 200);
              }
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe elements for animation
    const elementsToAnimate = $$(
      ".project-card, .achievement-card, .education-item, .skill-item, .contact-card, .highlight-item, .timeline-item"
    );

    elementsToAnimate.forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  setupCounterAnimation() {
    const animateCounter = (element, target, duration = 2000) => {
      const start = performance.now();
      const startValue = 0;

      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(
          startValue + (target - startValue) * progress
        );

        element.textContent = currentValue + (target > 10 ? "+" : "");

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statNumbers = $$(".stat-number");
            const targets = [6, 4, 18]; // Projects, Leadership, Technologies
            // Match your stats

            statNumbers.forEach((stat, index) => {
              setTimeout(() => {
                animateCounter(stat, targets[index]);
              }, index * 200);
            });

            heroObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const heroSection = $("#hero");
    if (heroSection) {
      heroObserver.observe(heroSection);
    }
  }

  setupTypingEffect() {
    const typeWriter = (element, text, speed = 100) => {
      if (!element || !text) return;

      let i = 0;
      element.textContent = "";

      const type = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          // Remove blinking caret when typing is complete
          setTimeout(() => {
            element.classList.add("typing-complete");
          }, 1000);
        }
      };

      // Start typing after a short delay
      setTimeout(type, 1000);
    };

    // Auto-activate typing effect for hero
    const typewriterEl = document.getElementById("typewriter");
    if (typewriterEl) {
      const texts = [
        "I'm Yohan Senadheera",
        "Computer Engineering Student",
        "Networking, IoT & AI Enthusiast",
        "Full-Stack Developer",
      ];

      let currentTextIndex = 0;

      const typeNextText = () => {
        if (currentTextIndex < texts.length) {
          typewriterEl.classList.remove("typing-complete");
          typeWriter(typewriterEl, texts[currentTextIndex], 80);
          currentTextIndex++;

          // Type next text after 4 seconds
          setTimeout(typeNextText, 4000);
        } else {
          // Restart the cycle
          currentTextIndex = 0;
          setTimeout(typeNextText, 2000);
        }
      };

      // Start the typing effect
      typeNextText();
    }
  }

  setupParallaxEffect() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallax = $(".hero-particles");

      if (parallax && scrolled < window.innerHeight) {
        parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
      }

      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  setupHoverEffects() {
    // Enhanced card hover effects
    $$(".project-card, .achievement-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-6px) scale(1.01)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
      });
    });

    // Skill item hover effects
    $$(".skill-item").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        item.style.transform = "translateX(15px)";
      });

      item.addEventListener("mouseleave", () => {
        item.style.transform = "translateX(0)";
      });
    });
  }
}

// Image handling
class ImageManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupProfileImageUpload();
        this.setupImageFallbacks();
    }

    setupProfileImageUpload() {
        const profileImg = $("#profile-img");
        if (profileImg) {
            // Create file input for image upload
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.style.display = "none";
            
            fileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profileImg.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Add click handler to image
            profileImg.style.cursor = "pointer";
            profileImg.addEventListener("click", () => {
                fileInput.click();
            });
            
            document.body.appendChild(fileInput);
        }
    }

    setupImageFallbacks() {
        $$("img").forEach((img) => {
            img.addEventListener("error", () => {
                // Create a modern tech-style placeholder
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = 400;
                canvas.height = 500;
                
                // Modern gradient background
                const gradient = ctx.createLinearGradient(0, 0, 400, 500);
                gradient.addColorStop(0, "#38bdf8");
                gradient.addColorStop(0.5, "#a78bfa");
                gradient.addColorStop(1, "#06b6d4");
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 400, 500);
                
                // Text
                ctx.fillStyle = "#001018";
                ctx.font = "bold 32px Inter";
                ctx.textAlign = "center";
                ctx.fillText("Yohan S.", 200, 220);
                ctx.font = "18px Inter";
                ctx.fillText("Computer Engineering", 200, 260);
                ctx.fillText("Student", 200, 285);
                
                img.src = canvas.toDataURL();
            });
        });
    }
}

// Scroll to top functionality
class ScrollManager {
  constructor() {
    this.init();
  }

  init() {
    const scrollBtn = $("#scrollToTop");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }
}

// =========================
// Performance Optimizations
// =========================
class Performance {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupReducedMotion();
  }

  // Lazy-load images with data-src
  setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset && img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove("lazy");
              observer.unobserve(img);
            }
          }
        });
      });

      $$("img[data-src]").forEach((img) => imageObserver.observe(img));
    }
  }
  // show the button on first page load if the user is already scrolled
  if(scrollBtn) {
    scrollBtn.style.display = window.scrollY > 300 ? "flex" : "none";
  }

  // Respect reduced-motion accessibility setting
  setupReducedMotion() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.style.setProperty(
        "--animation-duration",
        "0.01ms"
      );
    }
  }
}

// =========================
// Utility Helpers
// =========================
const utils = {
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  debounce: (func, wait = 250) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
  throttle: (func, limit = 250) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// =========================
// Bootstrapping
// =========================
document.addEventListener("DOMContentLoaded", () => {
  new Navigation();
  new Animations();
  new ImageManager();
  new ScrollManager();
  new Performance();

  // mark page as loaded (for CSS transitions)
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);
});

window.addEventListener("load", () => {
  // remove any explicit loading placeholders
  $$(".loading").forEach((el) => el.classList.remove("loading"));
});

// Console easter-egg
console.log(
  `%c🚀 Yohan's Modern Glass Portfolio%c\nBuilt with Vanilla JS, CSS Glassmorphism, and ❤️`,
  "color:#38bdf8;font-size:16px;font-weight:bold;",
  "color:#a78bfa;font-size:12px;"
);

