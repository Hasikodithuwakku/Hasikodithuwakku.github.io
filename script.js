/*=======taggle icon navbar  ==========*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

 /*=======scroll sections active link ==========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop -150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    /*=======sticky ==========*/
    let header = document.querySelector('header');

    header.classList.toggle('sticky', window.scrollY > 100);

      /*=======remove taggle icon and navbar when click navbar link ==========*/
      menuIcon.classList.remove('bx-x');
      navbar.classList.remove('active');

};

/*======= scroll reveal ==========*/
ScrollReveal({ 
    //reset: true ,
    distance:'80px',
    duration: 2000,
    delay:200

});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact from', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });

/*====typed.js===*/
const typed = new Typed('.multiple-text',{
    strings: ['Hasini Chamalka', 'Project Manager', 'Business Analytics Enthusiast', 'Frontend Developer', 'Content Writter'],
    typeSpeed: 60,
    backSpeed: 60,
    backDelay: 500,
    loop: true
});





document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".portfolio-container");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    prevBtn.addEventListener("click", function () {
        container.scrollBy({ left: -320, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", function () {
        container.scrollBy({ left: 320, behavior: "smooth" });
    });
});

// Flip-card click/tap and keyboard support for skills
function initFlipCards(){
    const flipCards = document.querySelectorAll('.resume-detail.skills .flip-card');
    flipCards.forEach(card => {
        // make focusable for keyboard
        card.setAttribute('tabindex', '0');

        card.addEventListener('click', () => {
            const inner = card.querySelector('.flip-card-inner');
            inner.classList.toggle('is-flipped');
        });

        card.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' || e.key === ' '){
                e.preventDefault();
                const inner = card.querySelector('.flip-card-inner');
                inner.classList.toggle('is-flipped');
            }
        });
    });
}

// initialize after DOM ready
initFlipCards();

// Certifications: if an anchor has data-real-url use it (allows swapping in real posts)
document.addEventListener('click', function(e){
    const a = e.target.closest('.resume-detail.certificates a');
    if(!a) return;
    const real = a.getAttribute('data-real-url');
    if(real && real.trim().length){
        // open real url in new tab
        window.open(real.trim(), '_blank', 'noopener');
        e.preventDefault();
        return;
    }
    // otherwise let default behavior open the href (already target=_blank)
});

// Contact form submission: EmailJS first, Web3Forms fallback. Keeps UX unchanged.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const resultBox = document.getElementById('contact-result');
        const submitBtn = contactForm.querySelector('input[type="submit"]');

        // Helpers
        function setLoadingState(isLoading) {
            if (submitBtn) {
                submitBtn.disabled = isLoading;
                submitBtn.value = isLoading ? 'Sending...' : 'Send Message';
            }
        }

        function showMessage(msg, type = 'info') {
            resultBox.innerHTML = msg;
            resultBox.style.color = type === 'success' ? '#9fffe0' : (type === 'error' ? '#ffd1d1' : '#cce7ff');
        }

        setLoadingState(true);
        showMessage('Sending message...');

        const formData = new FormData(contactForm);

        // If the page was loaded with EMAILJS_* window globals (set in index.html),
        // persist them to localStorage so the same keys are used consistently.
        try {
            if (window.EMAILJS_SERVICE) localStorage.setItem('emailjs_service', window.EMAILJS_SERVICE);
            if (window.EMAILJS_TEMPLATE) localStorage.setItem('emailjs_template', window.EMAILJS_TEMPLATE);
            if (window.EMAILJS_PUBLIC) localStorage.setItem('emailjs_public', window.EMAILJS_PUBLIC);
        } catch (err) {
            // localStorage may be unavailable in some contexts; ignore.
            console.warn('Could not write EmailJS keys to localStorage', err);
        }

        // Read EmailJS configuration from multiple possible places (localStorage, window globals)
        const EMAILJS_SERVICE_ID = (
            localStorage.getItem('emailjs_service') ||
            window.EMAILJS_SERVICE ||
            window.EMAILJS_SERVICE_ID ||
            ''
        ).trim();
        const EMAILJS_TEMPLATE_ID = (
            localStorage.getItem('emailjs_template') ||
            window.EMAILJS_TEMPLATE ||
            window.EMAILJS_TEMPLATE_ID ||
            ''
        ).trim();
        const EMAILJS_PUBLIC_KEY = (
            localStorage.getItem('emailjs_public') ||
            window.EMAILJS_PUBLIC ||
            window.EMAILJS_PUBLIC_KEY ||
            ''
        ).trim();

        const looksLike = {
            service(id) { return !!id && id.startsWith('service_'); },
            template(id) { return !!id && id.startsWith('template_'); }
        };

        const willTryEmailJS = window.emailjs && EMAILJS_PUBLIC_KEY && looksLike.service(EMAILJS_SERVICE_ID) && looksLike.template(EMAILJS_TEMPLATE_ID);

        if (willTryEmailJS) {
            try {
                // init (safe)
                try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch (err) { console.warn('EmailJS init warning', err); }

                const templateParams = {
                    name: formData.get('name') || '',
                    email: formData.get('email') || '',
                    phone: formData.get('phone') || '',
                    subject_field: formData.get('subject_field') || '',
                    message: formData.get('message') || ''
                };

                console.log('📤 Sending via EmailJS', { service: EMAILJS_SERVICE_ID, template: EMAILJS_TEMPLATE_ID, params: templateParams });

                const resp = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
                console.log('✅ EmailJS response', resp);
                showMessage("Thank you! Your message has been sent successfully. I'll get back to you soon!", 'success');
                contactForm.reset();
                setLoadingState(false);
                return;
            } catch (err) {
                console.error('❌ EmailJS failed', err);
                // Fall through to server fallback
                showMessage('EmailJS failed, attempting server fallback...', 'error');
            }
        } else {
            console.warn('EmailJS not configured or SDK missing; will use server fallback if available.');
        }

        // Server fallback - Web3Forms (uses the hidden access_key in the form)
        try {
            // Ensure access_key present
            const accessKey = formData.get('access_key') || '';
            if (!accessKey) {
                showMessage('Message not sent: server access key is missing. Please configure EmailJS or add a server endpoint.', 'error');
                setLoadingState(false);
                return;
            }

            const web3formsUrl = 'https://api.web3forms.com/submit';
            const res = await fetch(web3formsUrl, { method: 'POST', body: formData });
            const text = await res.text().catch(() => '');
            if (res.ok) {
                console.log('Web3Forms response', res.status, text);
                showMessage("Thank you! Your message has been sent successfully. I'll get back to you soon!", 'success');
                contactForm.reset();
                setLoadingState(false);
                return;
            }

            console.error('Web3Forms error', res.status, text);
            showMessage('Server rejected the submission — check console for details.', 'error');
        } catch (networkErr) {
            console.error('Network error sending contact form', networkErr);
            showMessage('Network error — please check your connection and try again.', 'error');
        }

        setLoadingState(false);
    });
}

const resumeBtns = document.querySelectorAll('.resume-btn');

resumeBtns.forEach((btn, idx) => {
    btn.addEventListener('click',() => {
        const resumeDetails = document.querySelectorAll('.resume-detail');

        resumeBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        btn.classList.add('active');

        resumeDetails.forEach(detail => {
            detail.classList.remove('active');
        });
        resumeDetails[idx].classList.add('active');
    });
});




