function locomotiveAnimations() {
    gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});





// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

}
locomotiveAnimations();

function navbarAnimation() {
    // Swap brand text to logo on scroll using crossfade
    const brand = document.querySelector("#nav-part1 .logo-text");
    if (!brand) return;

    // Build overlayed elements (text + logo image) once
    if (!brand.querySelector('.brand-text')) {
        const original = (brand.textContent || '').trim();
        const textSpan = document.createElement('span');
        textSpan.className = 'brand-text';
        textSpan.textContent = original || 'DRAWBRIDGE';

        const img = document.createElement('img');
        img.className = 'brand-logo';
        img.src = 'logo.png';
        img.alt = 'DRAWBRIDGE logo';
        img.decoding = 'async';
        img.loading = 'eager';

        brand.innerHTML = '';
        brand.appendChild(textSpan);
        brand.appendChild(img);
    }

    const textEl = brand.querySelector('.brand-text');
    const logoEl = brand.querySelector('.brand-logo');

    // Initial state for smooth transition
    gsap.set(textEl, { opacity: 1 });
    gsap.set(logoEl, { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' });

    // Helper to create a timeline with specific start/end
    const createTL = (start, end) => gsap.timeline({
        scrollTrigger: {
            trigger: '#page1',
            scroller: '#main',
            start, end,
            scrub: true,
            // markers: true,
        }
    }).to(textEl, { opacity: 0, duration: 1, ease: 'power2.out' }, 0)
      .to(logoEl, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 0);

    // Different feel for mobile vs desktop
    ScrollTrigger.matchMedia({
        // desktop
        "(min-width: 601px)": function () {
            createTL('bottom 85%', 'bottom 65%');
        },
        // mobile
        "(max-width: 600px)": function () {
            createTL('bottom 92%', 'bottom 72%');
        }
    });
}
navbarAnimation();

function videoconAnimation() {
    const videocon = document.querySelector("#video-container");
    if (!videocon) return; // no video container on this page/state
    const playbtn = document.querySelector("#play");

    if (playbtn) {
        videocon.addEventListener("mouseenter", function () {
            gsap.to(playbtn, { scale: 1, opacity: 1 });
        });

        videocon.addEventListener("mouseleave", function () {
            gsap.to(playbtn, { scale: 0, opacity: 0 });
        });

        videocon.addEventListener("mousemove", function (dets) {
            gsap.to(playbtn, {
                left: dets.x - 85,
                top: dets.y - 80,
            });
        });
    }
}
videoconAnimation();

function loadingAnimation() {
    // Split each #page1 h1 into per-character spans and animate like GSAP SplitText
    const splitText = (el) => {
        const text = el.textContent;
        el.innerHTML = "";
        for (const ch of text) {
            const wrap = document.createElement("span");
            wrap.className = "char-wrap";
            const span = document.createElement("span");
            span.className = "char";
            span.textContent = ch === " " ? "\u00A0" : ch;
            wrap.appendChild(span);
            el.appendChild(wrap);
        }
    };

    const headings = document.querySelectorAll("#page1 h1");
    headings.forEach(splitText);

    const chars = document.querySelectorAll("#page1 h1 .char");
    gsap.from(chars, {
        yPercent: 120,
        opacity: 0,
        ease: "power3.out",
        duration: 0.7,
        stagger: 0.02,
        delay: 0.3
    });

    const videoCon = document.querySelector("#page1 #video-container");
    if (videoCon) {
        gsap.from(videoCon, {
            scale: 0.9,
            opacity: 0,
            delay: 1.1,
            duration: 0.5,
        });
    }
}
loadingAnimation();

function cursorAnimation() {
    document.addEventListener("mousemove", function(dets){
        gsap.to("#cursor", {
            left: dets.x,
            top: dets.y,
        })
    })
    
    document.querySelectorAll(".child").forEach(function(elem) {
        elem.addEventListener("mouseenter", function() {
            const cursor = document.querySelector("#cursor");
            const bgColor = elem.getAttribute("data-color");
    
            gsap.to(cursor, {
                backgroundColor: bgColor,
                transform: 'translate(-50%,-50%) scale(1)'
            });
            
        });
        elem.addEventListener("mouseleave", function() {
            const cursor = document.querySelector("#cursor");
    
            gsap.to(cursor, {
                backgroundColor: 'transparent',
                transform: 'translate(-50%,-50%) scale(0)'
            });
        });
    })
}
cursorAnimation();
