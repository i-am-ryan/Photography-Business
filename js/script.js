// Performance optimized loading and initialization
        document.addEventListener('DOMContentLoaded', function() {
            initializeWebsite();
        });

        function initializeWebsite() {
            // Loading Screen
            window.addEventListener('load', function() {
                const loader = document.getElementById('loader');
                setTimeout(() => {
                    loader.classList.add('hidden');
                    // Initialize animations after loading
                    initializeAnimations();
                }, 2500);
            });

            // Mobile Navigation
            const menuBtn = document.getElementById('menuBtn');
            const closeBtn = document.getElementById('closeBtn');
            const nav = document.getElementById('nav');

            function toggleNav() {
                nav.classList.toggle('active');
                document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
                
                // Focus management for accessibility
                if (nav.classList.contains('active')) {
                    nav.querySelector('a').focus();
                } else {
                    menuBtn.focus();
                }
            }

            menuBtn.addEventListener('click', toggleNav);
            closeBtn.addEventListener('click', toggleNav);

            // Close nav when clicking on a link
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            });

            // Keyboard navigation for menu button
            menuBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleNav();
                }
            });

            // Header scroll effect with performance optimization
            const header = document.getElementById('header');
            let ticking = false;

            function updateHeader() {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            }

            function requestHeaderUpdate() {
                if (!ticking) {
                    requestAnimationFrame(updateHeader);
                    ticking = true;
                }
            }

            window.addEventListener('scroll', requestHeaderUpdate);

            // Scroll progress bar with throttling
            const scrollProgress = document.getElementById('scrollProgress');
            let progressTicking = false;

            function updateScrollProgress() {
                const scrollTop = document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = (scrollTop / scrollHeight) * 100;
                scrollProgress.style.width = scrollPercent + '%';
                progressTicking = false;
            }

            function requestProgressUpdate() {
                if (!progressTicking) {
                    requestAnimationFrame(updateScrollProgress);
                    progressTicking = true;
                }
            }

            window.addEventListener('scroll', requestProgressUpdate);

            // Parallax effect for hero background with performance optimization
            const heroImg = document.getElementById('heroImg');
            let parallaxTicking = false;

            function updateParallax() {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                heroImg.style.transform = `translate3d(0, ${rate}px, 0)`;
                parallaxTicking = false;
            }

            function requestParallaxUpdate() {
                if (!parallaxTicking) {
                    requestAnimationFrame(updateParallax);
                    parallaxTicking = true;
                }
            }

            window.addEventListener('scroll', requestParallaxUpdate);

            // Intersection Observer for animations
            const observerOptions = {
                threshold: 0.15,
                rootMargin: '0px 0px -80px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Add staggered animation delay for multiple elements
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200;
                        entry.target.style.transitionDelay = delay + 'ms';
                    }
                });
            }, observerOptions);

            // Observe all feature elements
            document.querySelectorAll('.feature').forEach(feature => {
                observer.observe(feature);
            });

            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Enhanced hover effects for images with performance optimization
            document.querySelectorAll('.feature img').forEach(img => {
                img.addEventListener('mouseenter', function() {
                    this.style.filter = 'brightness(1.1) contrast(1.1) saturate(1.1)';
                });
                
                img.addEventListener('mouseleave', function() {
                    this.style.filter = 'brightness(1) contrast(1) saturate(1)';
                });
            });

            // Add loading states for images
            document.querySelectorAll('img').forEach(img => {
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                    this.style.transform = 'scale(1)';
                });
                
                img.addEventListener('error', function() {
                    this.style.opacity = '0.5';
                    this.alt = 'Image failed to load';
                    console.warn('Failed to load image:', this.src);
                });
            });

            // Add focus management for accessibility
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    menuBtn.focus();
                }
            });

            // Preload critical images for better performance
            function preloadImages() {
                const imageUrls = [
                    'Images/Image4.jpeg',
                    'Images/image2.jpeg',
                    'Images/Image1.jpeg',
                    'Images/Logo.jpeg',
                    'Images/Close.jpeg'
                ];
                
                imageUrls.forEach(url => {
                    const img = new Image();
                    img.src = url;
                });
            }

            // Initialize preloading
            preloadImages();

            // Add resize handler for responsive adjustments
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    // Close mobile nav on resize to desktop
                    if (window.innerWidth > 1024 && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                }, 250);
            });

            // Add touch support for mobile interactions
            let touchStartY = 0;
            let touchEndY = 0;

            document.addEventListener('touchstart', e => {
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            document.addEventListener('touchend', e => {
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 80;
                const diff = touchStartY - touchEndY;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe up - scroll to next section
                        const currentSection = getCurrentSection();
                        const nextSection = getNextSection(currentSection);
                        if (nextSection) {
                            nextSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
                        // Swipe down - scroll to previous section
                        const currentSection = getCurrentSection();
                        const prevSection = getPreviousSection(currentSection);
                        if (prevSection) {
                            prevSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            }

            function getCurrentSection() {
                const sections = document.querySelectorAll('section');
                const scrollPosition = window.scrollY + window.innerHeight / 2;
                
                for (let section of sections) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                        return section;
                    }
                }
                return sections[0];
            }

            function getNextSection(currentSection) {
                return currentSection ? currentSection.nextElementSibling : null;
            }

            function getPreviousSection(currentSection) {
                return currentSection ? currentSection.previousElementSibling : null;
            }

            // Add performance monitoring
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        if (perfData) {
                            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                            console.log('DOM content loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
                        }
                    }, 0);
                });
            }
        }

        // Initialize animations after page load
        function initializeAnimations() {
            // Add entrance animations to elements
            const animatedElements = document.querySelectorAll('.hero h1, .hero .subhead, .hero .arrow-wrapper');
            animatedElements.forEach((element, index) => {
                element.style.animationDelay = (index * 0.2 + 0.5) + 's';
            });

            // Initialize floating elements animation
            const floatingElements = document.querySelectorAll('.floating-element');
            floatingElements.forEach((element, index) => {
                element.style.animationDelay = (index * 2) + 's';
            });
        }

        // Utility functions for enhanced functionality
        const Utils = {
            // Debounce function for performance optimization
            debounce: function(func, wait, immediate) {
                let timeout;
                return function executedFunction() {
                    const context = this;
                    const args = arguments;
                    const later = function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    const callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            },

            // Check if element is in viewport
            isInViewport: function(element) {
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            },

            // Smooth scroll to element with offset
            scrollToElement: function(element, offset = 100) {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            },

            // Get scroll percentage
            getScrollPercentage: function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                return Math.round((scrollTop / scrollHeight) * 100);
            },

            // Throttle function for scroll events
            throttle: function(func, limit) {
                let inThrottle;
                return function() {
                    const args = arguments;
                    const context = this;
                    if (!inThrottle) {
                        func.apply(context, args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                }
            }
        };

        // Add error handling for better user experience
        window.addEventListener('error', function(e) {
            console.error('JavaScript error:', e.error);
            // Could implement user-friendly error reporting here
        });

        // Add visibility change handler for performance optimization
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Pause animations when tab is not visible
                document.body.style.animationPlayState = 'paused';
            } else {
                // Resume animations when tab becomes visible
                document.body.style.animationPlayState = 'running';
            }
        });