document.addEventListener('DOMContentLoaded', () => {

    // ===== NAV TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ===== AUDIO SYST – SPARKLE/POPS =====
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    window.playPop = function () {
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.07);
            gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.07);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.07);
        } catch (e) { }
    };

    window.playSparkleStream = function () {
        for (let i = 0; i < 7; i++) {
            setTimeout(() => {
                try {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(700 + Math.random() * 900, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.1);
                } catch (e) { }
            }, i * 60);
        }
    };

    // ===== PORTFOLIO FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ===== MODAL HOOK REFERENCES =====
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    const modalTag = document.getElementById('modalTag');
    const textContainer = document.getElementById('modalTextContent');
    const embedContainer = document.getElementById('instagramEmbedContainer');
    const localGalleryContainer = document.getElementById('localGalleryContainer');
    const gridContainer = document.getElementById('instagramPostsGrid');

    window.openModal = function (title, desc, tag) {
        playSparkleStream();
        modal.classList.remove('instagram-active'); 
        textContainer.style.display = 'block';
        embedContainer.style.display = 'none';
        localGalleryContainer.style.display = 'none';
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modalTag.innerText = tag;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // ===== PRELOAD INSTAGRAM/REELS DATA ON SITE OPEN =====
    const postUrls = [
        'https://www.instagram.com/p/DA6Qm52q9jE/?img_index=1',
        'https://www.instagram.com/p/DHZt-QjtXal/',
        'https://www.instagram.com/p/DIeaoF5tX54/',
        'https://www.instagram.com/p/Crs7lMWKTx7/',
        'https://www.instagram.com/p/DNZArBstxhQ/'
    ];

    const reelUrls = [
        'https://www.instagram.com/p/DNg0H-TNPpN/',
        'https://www.instagram.com/p/DNtJZU8WnL6/',
        'https://www.instagram.com/p/DOoLXoujc1_/',
        'https://www.instagram.com/p/DXRawnNjeIx/',
        'https://www.instagram.com/p/DUYHPUMDZ9M/',
        'https://www.instagram.com/p/DYekb6XtjZ5/',
        'https://www.instagram.com/p/DPHCFFKjXtg/'
    ];

    function buildInstagramEmbeds(urls, typeClass) {
        if (!gridContainer) return;
        urls.forEach(url => {
            const blockquote = document.createElement('blockquote');
            blockquote.className = `instagram-media ${typeClass}`;
            blockquote.setAttribute('data-instgrm-permalink', url);
            blockquote.setAttribute('data-instgrm-version', '14');
            blockquote.innerHTML = `<a href="${url}" target="_blank">View this post on Instagram</a>`;
            gridContainer.appendChild(blockquote);
        });
    }

    // Initialize the assets immediately when the page finishes loading
    if (gridContainer) {
        buildInstagramEmbeds(postUrls, 'ig-image-post');
        buildInstagramEmbeds(reelUrls, 'ig-reel-post');

        // Load Instagram's embed layout script right away
        if (!document.querySelector('script[src="//platform.instagram.com/en_US/embeds.js"]')) {
            const script = document.createElement('script');
            script.src = '//platform.instagram.com/en_US/embeds.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }

    // ===== MODAL (INSTAGRAM EMBED GRID VIEW - IMAGES) =====
    window.openInstagramModal = function() {
        playSparkleStream();

        textContainer.style.display = 'none';
        localGalleryContainer.style.display = 'none';
        embedContainer.style.display = 'block';

        document.getElementById('instagramHeaderTitle').innerText = 'Original Painting Sales';
        document.getElementById('instagramHeaderDesc').innerText = 'Real projects shared on Instagram';

        // Toggle visibility: show images, hide reels
        gridContainer.querySelectorAll('.ig-image-post').forEach(el => el.style.display = '');
        gridContainer.querySelectorAll('.ig-reel-post').forEach(el => el.style.display = 'none');

        // Force layout processing if Instagram script is ready (prevents 0px height iframe bugs)
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
        }

        modal.classList.add('active');
        modal.classList.add('instagram-active'); 
        document.body.style.overflow = 'hidden';
    };

    // ===== MODAL (INSTAGRAM EMBED GRID VIEW - REELS) =====
    window.openReelModal = function() {
        playSparkleStream();

        textContainer.style.display = 'none';
        localGalleryContainer.style.display = 'none';
        embedContainer.style.display = 'block';

        document.getElementById('instagramHeaderTitle').innerText = 'Personal Brand & Content Creation';
        document.getElementById('instagramHeaderDesc').innerText = 'Storytelling through reels, tutorials & daily life.';

        // Toggle visibility: hide images, show reels
        gridContainer.querySelectorAll('.ig-image-post').forEach(el => el.style.display = 'none');
        gridContainer.querySelectorAll('.ig-reel-post').forEach(el => el.style.display = '');

        // Force layout processing if Instagram script is ready (prevents 0px height iframe bugs)
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
        }

        modal.classList.add('active');
        modal.classList.add('instagram-active'); 
        document.body.style.overflow = 'hidden';
    };

    // ===== MODAL (LOCAL GALLERY VIEWER - NEW FOR COMMUNITY GROWTH) =====
    window.openCommunityGrowthModal = function() {
        playSparkleStream();

        textContainer.style.display = 'none';
        embedContainer.style.display = 'none';
        localGalleryContainer.style.display = 'block';

        const localGridContainer = document.getElementById('localGalleryGrid');
        localGridContainer.innerHTML = '';

        const images = [
            'img/1.jpeg',
            'img/2.jpeg',
            'img/3.jpeg',
            'img/4.jpeg',
            'img/5.jpeg',
            'img/6.jpeg'
        ];

        images.forEach(src => {
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-item-wrapper';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Community Growth Campaign Metric';
            img.onerror = function() {
                this.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80';
            };

            wrapper.appendChild(img);
            localGridContainer.appendChild(wrapper);
        });

        modal.classList.add('active');
        modal.classList.add('instagram-active'); 
        document.body.style.overflow = 'hidden';
    };

    // ===== CLOSE MODAL =====
    window.closeModal = function () {
        modal.classList.remove('active');
        modal.classList.remove('instagram-active'); 
        document.body.style.overflow = '';
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ===== ARTISTIC MOUSE TRAIL SPARKLE CANVAS =====
    const canvas = document.getElementById('sparkle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const colorSet = ['#ff3366', '#00b4d8', '#ffb703', '#06d6a0', '#9b5de5', '#ff5e6c', '#00f5d4'];

        window.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.4) {
                particles.push({
                    x: e.clientX,
                    y: e.clientY,
                    size: 3 + Math.random() * 8,
                    color: colorSet[Math.floor(Math.random() * colorSet.length)],
                    alpha: 1,
                    vx: (Math.random() - 0.5) * 4.5,
                    vy: (Math.random() - 0.5) * 4.5
                });
            }
        });

        function animateSparkles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.016;
                if (p.alpha <= 0) { particles.splice(i, 1); continue; }
                ctx.globalAlpha = p.alpha * 0.9;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0; 
            requestAnimationFrame(animateSparkles);
        }
        animateSparkles();
    }
});