/* ==========================================================================
   💖 UPDATED INTERACTIVE SURPRISE SCRIPT (GATED PROGRESSION)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Select DOM elements
    const preloader = document.getElementById('preloader');
    const startJourneyBtn = document.getElementById('start-journey-btn');
    const mainContent = document.getElementById('main-content');
    
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    
    const loveEnvelope = document.getElementById('love-envelope');
    const envelopeWrapNode = document.getElementById('envelope-wrap-node');
    const envelopeHint = document.getElementById('envelope-hint');
    
    const letterFlow = document.getElementById('love-letter-flow');
    const letterScrollPrompt = document.getElementById('letter-scroll-prompt');
    
    const cakeSection = document.getElementById('cake-section');
    const interactiveCake = document.getElementById('interactive-cake');
    const birthdayCandle = document.getElementById('birthday-candle');
    const candleInstruction = document.getElementById('candle-instruction');
    const candleMessage = document.getElementById('candle-message');
    
    const knifeWrapper = document.getElementById('knife-wrapper');
    const knifeHandle = document.getElementById('knife-handle');
    const knifeFill = document.querySelector('.knife-fill');
    const knifeSliderTrack = document.querySelector('.knife-slider-track');
    const cakeCutMessage = document.getElementById('cake-cut-message');

    const gallerySection = document.getElementById('gallery-section');
    const finalSection = document.getElementById('final-section');

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Track states
    let musicPlaying = false;
    let envelopeOpened = false;
    let candleBlown = false;
    let cakeCut = false;
    let galleryUnlocked = false;
    let finalUnlocked = false;

    /* ==========================================================================
       🎵 BACKGROUND MUSIC & WEBAUDIO SFX ENGINE
       ========================================================================== */
    class SurprisesAudioEngine {
        constructor() {
            this.ctx = null;
            this.masterGain = null;
        }

        initWebAudio() {
            if (this.ctx) return;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.5;
            this.masterGain.connect(this.ctx.destination);
        }

        midiToFreq(midi) {
            return 440 * Math.pow(2, (midi - 69) / 12);
        }

        playChimeNote(midi, time, duration = 1.0) {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = this.midiToFreq(midi);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.2, time + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(time);
            osc.stop(time + duration);
        }

        playPaperSFX() {
            this.initWebAudio();
            if (!this.ctx || this.ctx.state === 'suspended') return;
            const time = this.ctx.currentTime;
            
            // Generate paper friction noise
            const bufferSize = this.ctx.sampleRate * 0.3;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            filter.Q.value = 0.8;
            
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.06, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            noise.start(time);
            noise.stop(time + 0.3);
            
            // Sweet opening chime arpeggio
            [64, 67, 72, 76].forEach((note, index) => {
                this.playChimeNote(note, time + index * 0.08, 0.8);
            });
        }

        playBlowSFX() {
            this.initWebAudio();
            if (!this.ctx || this.ctx.state === 'suspended') return;
            const time = this.ctx.currentTime;
            
            const bufferSize = this.ctx.sampleRate * 0.4;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, time);
            filter.frequency.exponentialRampToValueAtTime(80, time + 0.35);
            
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.25, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            noise.start(time);
            noise.stop(time + 0.4);
        }

        playCheerSFX() {
            this.initWebAudio();
            if (!this.ctx || this.ctx.state === 'suspended') return;
            const time = this.ctx.currentTime;
            
            // Major pentatonic joy chimes C5 -> E5 -> G5 -> C6
            [72, 76, 79, 84].forEach((note, index) => {
                this.playChimeNote(note, time + index * 0.08, 1.0);
            });
        }

        playCakeSwellSFX() {
            this.initWebAudio();
            if (!this.ctx || this.ctx.state === 'suspended') return;
            const time = this.ctx.currentTime;
            
            // Slicing swoosh sound
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, time);
            osc.frequency.exponentialRampToValueAtTime(500, time + 0.3);
            
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(time);
            osc.stop(time + 0.35);
            
            // Sweet chord swell F5 -> A5 -> C6 -> F6
            [77, 81, 84, 89].forEach((note, index) => {
                this.playChimeNote(note, time + 0.05 + index * 0.07, 1.5);
            });
        }
    }

    const sfx = new SurprisesAudioEngine();

    // Toggle bg-music
    function toggleBackgroundMusic() {
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
            musicToggle.classList.remove('playing');
            musicToggle.querySelector('i').className = 'fas fa-volume-mute';
        } else {
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.classList.add('playing');
                musicToggle.querySelector('i').className = 'fas fa-volume-up';
            }).catch(err => {
                console.log("Audio play failed:", err);
            });
        }
    }

    musicToggle.addEventListener('click', toggleBackgroundMusic);

    /* ==========================================================================
       🌸 CANVAS DYNAMIC PARTICLE SYSTEM
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, targetX: 0, targetY: 0 };
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = (e.clientX - width / 2) * 0.05;
        mouse.targetY = (e.clientY - height / 2) * 0.05;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.targetX = (e.touches[0].clientX - width / 2) * 0.05;
            mouse.targetY = (e.touches[0].clientY - height / 2) * 0.05;
        }
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Petal {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }
        reset() {
            this.x = Math.random() * width;
            this.y = -20;
            this.size = 8 + Math.random() * 10;
            this.speedY = 1.0 + Math.random() * 1.5;
            this.speedX = -0.5 + Math.random() * 1.0;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = -0.02 + Math.random() * 0.04;
            this.color = `rgba(255, ${190 + Math.floor(Math.random() * 40)}, ${200 + Math.floor(Math.random() * 30)}, ${0.6 + Math.random() * 0.3})`;
        }
        update() {
            mouse.x += (mouse.targetX - mouse.x) * 0.1;
            this.x += this.speedX + (mouse.x || 0) * 0.2;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.size * 0.5, -this.size * 0.8, 0, -this.size * 1.5);
            ctx.quadraticCurveTo(-this.size * 0.5, -this.size * 0.8, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }

    class Heart {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }
        reset() {
            this.x = Math.random() * width;
            this.y = height + 20;
            this.size = 5 + Math.random() * 10;
            this.speedY = -(0.8 + Math.random() * 1.2);
            this.swaySpeed = 0.01 + Math.random() * 0.02;
            this.swayDist = 0.5 + Math.random() * 1.5;
            this.time = Math.random() * 100;
            this.opacity = 0.2 + Math.random() * 0.6;
            this.color = `rgba(255, ${100 + Math.floor(Math.random() * 80)}, ${120 + Math.floor(Math.random() * 60)}, ${this.opacity})`;
        }
        update() {
            this.time += this.swaySpeed;
            this.y += this.speedY;
            this.x += Math.sin(this.time) * this.swayDist + (mouse.x || 0) * 0.15;
            if (this.y < -20) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size);
            ctx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }

    class Sparkle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = 2 + Math.random() * 4;
            this.maxSize = 6 + Math.random() * 6;
            this.growSpeed = 0.1 + Math.random() * 0.15;
            this.growing = true;
            this.color = `rgba(255, 223, 100, ${0.4 + Math.random() * 0.5})`;
        }
        update() {
            if (this.growing) {
                this.size += this.growSpeed;
                if (this.size >= this.maxSize) this.growing = false;
            } else {
                this.size -= this.growSpeed;
                if (this.size <= 0.1) this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                ctx.rotate(Math.PI / 2);
                ctx.lineTo(0, -this.size);
                ctx.lineTo(this.size * 0.2, 0);
            }
            ctx.fill();
            ctx.restore();
        }
    }

    class Smoke {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 4 + Math.random() * 5;
            this.speedY = -(0.5 + Math.random() * 0.8);
            this.speedX = -0.3 + Math.random() * 0.6;
            this.opacity = 0.8;
            this.fadeSpeed = 0.015 + Math.random() * 0.01;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.size += 0.2;
            this.opacity -= this.fadeSpeed;
        }
        draw() {
            ctx.save();
            ctx.fillStyle = `rgba(220, 220, 220, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const pCount = width < 600 ? 25 : 55;
    for (let i = 0; i < pCount; i++) {
        particles.push(new Petal());
        particles.push(new Heart());
        if (i % 2 === 0) particles.push(new Sparkle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        const rect = finalSection.getBoundingClientRect();
        if (!finalSection.classList.contains('locked-section') && rect.top < height) {
            const transitionHeight = Math.max(0, height - rect.top);
            ctx.fillStyle = `rgba(26, 10, 27, ${transitionHeight / height})`;
            ctx.fillRect(0, height - transitionHeight, width, transitionHeight);
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            
            if (p instanceof Smoke && p.opacity <= 0) {
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* ==========================================================================
       ⏳ PRELOADER UNLOCK EXPERIENCE
       ========================================================================== */
    startJourneyBtn.addEventListener('click', () => {
        sfx.initWebAudio();
        
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicToggle.classList.add('playing');
            musicToggle.querySelector('i').className = 'fas fa-volume-up';
        }).catch(err => {
            console.log("Browser blocked auto-play.", err);
        });
        
        gsap.to(preloader, {
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
                preloader.classList.add('hidden');
                mainContent.classList.remove('hidden');
                musicToggle.classList.remove('hidden');
                
                // Show hero texts
                gsap.from('.hero-title', { opacity: 0, y: -45, duration: 1, delay: 0.2, ease: 'back.out(1.5)' });
                gsap.from('.hero-subtitle', { opacity: 0, y: -20, duration: 1, delay: 0.5 });
                gsap.from('.envelope-wrapper', { opacity: 0, scale: 0.5, duration: 1.2, delay: 0.8, ease: 'elastic.out(1, 0.75)' });
                gsap.from('#envelope-hint', { opacity: 0, y: 10, duration: 0.8, delay: 1.2 });
            }
        });
    });

    /* ==========================================================================
       💌 IN-PAGE ENVELOPE OPENING -> UNLOCKS CAKE SECTION
       ========================================================================== */
    loveEnvelope.addEventListener('click', () => {
        if (envelopeOpened) return;
        envelopeOpened = true;
        
        sfx.playPaperSFX();
        
        loveEnvelope.classList.add('open');
        envelopeHint.classList.add('hidden');
        
        const envelopeRect = loveEnvelope.getBoundingClientRect();
        const startX = envelopeRect.left + envelopeRect.width / 2;
        const startY = envelopeRect.top + 30;
        
        for (let i = 0; i < 18; i++) {
            const h = new Heart();
            h.x = startX + (Math.random() * 40 - 20);
            h.y = startY;
            h.speedY = -(2.5 + Math.random() * 3);
            h.speedX = (Math.random() * 6 - 3);
            particles.push(h);
        }
        
        // Reveal letter & UNLOCK CAKE SECTION
        setTimeout(() => {
            // Remove locked class so it appears in the DOM
            cakeSection.classList.remove('locked-section');
            
            // Refresh GSAP scroll metrics because page height changed
            ScrollTrigger.refresh();

            letterFlow.classList.remove('hidden-letter');
            letterFlow.classList.add('open-letter');
            
            // Fade-in letter items
            gsap.to('.fade-in-para', {
                opacity: 1,
                y: 0,
                stagger: 0.7,
                duration: 1.2,
                ease: 'power2.out'
            });
            
            // Shrink envelope wrapper
            gsap.to(envelopeWrapNode, {
                scale: 0.8,
                marginTop: '30px',
                duration: 1.0,
                ease: 'power2.inOut'
            });
        }, 700);
    });

    letterScrollPrompt.addEventListener('click', () => {
        cakeSection.scrollIntoView({ behavior: 'smooth' });
    });

    /* ==========================================================================
       🕯️ CAKE SURPRISE & CANDLE BLOWING
       ========================================================================== */
    birthdayCandle.addEventListener('click', () => {
        if (candleBlown) return;
        candleBlown = true;
        
        birthdayCandle.classList.add('blown');
        candleInstruction.textContent = "🕯️ Flame went out! Now, cut the cake below.";
        candleInstruction.classList.remove('pulse-text');
        candleMessage.classList.add('show');
        
        sfx.playBlowSFX();
        setTimeout(() => sfx.playCheerSFX(), 150);
        
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.55 }
        });
        
        const candleRect = birthdayCandle.getBoundingClientRect();
        const startX = candleRect.left + candleRect.width / 2;
        const startY = candleRect.top;
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                particles.push(new Smoke(startX, startY));
            }, i * 65);
        }
        
        knifeWrapper.classList.remove('disabled');
        knifeWrapper.classList.add('active');
    });

    /* ==========================================================================
       👉 KNIFE SLIDER DRAG MECHANICS -> UNLOCKS MEMORY GALLERY
       ========================================================================== */
    let isDragging = false;
    let dragStartX = 0;
    let handleOffsetLeft = 0;
    
    function getDragX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX;
    }
    
    function onDragStart(e) {
        if (!candleBlown || cakeCut) return;
        isDragging = true;
        dragStartX = getDragX(e);
        handleOffsetLeft = knifeHandle.offsetLeft;
        document.body.style.userSelect = 'none';
    }
    
    function onDragMove(e) {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();
        
        const trackWidth = knifeSliderTrack.clientWidth;
        const handleWidth = knifeHandle.clientWidth;
        const maxDrag = trackWidth - handleWidth;
        
        const currentX = getDragX(e);
        const deltaX = currentX - dragStartX;
        
        let newLeft = handleOffsetLeft + deltaX;
        newLeft = Math.max(0, Math.min(newLeft, maxDrag));
        
        knifeHandle.style.left = newLeft + 'px';
        
        const pct = (newLeft / maxDrag) * 100;
        knifeFill.style.width = pct + '%';
        
        if (pct >= 96) {
            triggerCakeCut();
        }
    }
    
    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';
        
        if (!cakeCut) {
            gsap.to(knifeHandle, { left: 0, duration: 0.35, ease: 'power2.out' });
            gsap.to(knifeFill, { width: '0%', duration: 0.35, ease: 'power2.out' });
        }
    }
    
    function triggerCakeCut() {
        cakeCut = true;
        isDragging = false;
        
        interactiveCake.classList.add('cut');
        cakeCutMessage.classList.add('show');
        
        sfx.playCakeSwellSFX();
        
        gsap.to(knifeHandle, { opacity: 0, scale: 0.5, duration: 0.4 });
        gsap.to(knifeSliderTrack, { opacity: 0.3, duration: 0.4 });
        
        const end = Date.now() + (1.2 * 1000);
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.65 } });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.65 } });
            
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
        
        knifeHandle.removeEventListener('mousedown', onDragStart);
        knifeHandle.removeEventListener('touchstart', onDragStart);

        // UNLOCK MEMORY GALLERY SECTION AFTER A SHORT CELEBRATION DELAY
        setTimeout(() => {
            galleryUnlocked = true;
            gallerySection.classList.remove('locked-section');
            ScrollTrigger.refresh();

            // Auto-scroll to the newly unlocked memories section
            gallerySection.scrollIntoView({ behavior: 'smooth' });
        }, 1600);
    }
    
    knifeHandle.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    
    knifeHandle.addEventListener('touchstart', onDragStart, { passive: true });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);

    /* ==========================================================================
       🖼️ 3D FLIPPING POLAROID CARDS -> UNLOCKS FINAL NOTES SECTION
       ========================================================================== */
    const polaroidCards = document.querySelectorAll('.polaroid-card');
    
    polaroidCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            
            if (card.classList.contains('flipped')) {
                const rect = card.getBoundingClientRect();
                
                if (sfx.ctx) {
                    sfx.playChimeNote(67 + Math.floor(Math.random() * 8), sfx.ctx.currentTime, 0.6);
                }
                
                for (let i = 0; i < 5; i++) {
                    const h = new Heart();
                    h.x = rect.left + rect.width / 2 + (Math.random() * 30 - 15);
                    h.y = rect.top + rect.height / 2;
                    h.speedY = -(1.5 + Math.random() * 1.5);
                    particles.push(h);
                }

                // UNLOCK FINAL SECTION AFTER FLIPPING A PHOTO CARD
                if (!finalUnlocked) {
                    finalUnlocked = true;
                    setTimeout(() => {
                        finalSection.classList.remove('locked-section');
                        ScrollTrigger.refresh();

                        // Visual scroll helper to indicate more content is available
                        const footRect = finalSection.getBoundingClientRect();
                        if (footRect.top > window.innerHeight) {
                            window.scrollBy({ top: 120, behavior: 'smooth' });
                        }
                    }, 800);
                }
            }
        });
    });

    /* ==========================================================================
       💫 GSAP SCROLL-TRIGGERED ENTRANCE REVEALS
       ========================================================================== */
    // Reveal cake section components (triggers when cake section unlocks and is scrolled to)
    gsap.from('#cake-section .section-title, #cake-section .section-subtitle', {
        scrollTrigger: {
            trigger: '#cake-section',
            start: 'top 80%',
        },
        opacity: 0,
        y: 35,
        duration: 1,
        stagger: 0.2
    });
    
    gsap.from('.cake-container, .pedestal', {
        scrollTrigger: {
            trigger: '#cake-section',
            start: 'top 70%',
        },
        opacity: 0,
        scale: 0.9,
        y: 40,
        duration: 1.2,
        ease: 'back.out(1.2)'
    });
    
    // Reveal polaroids stagger (triggers when gallery unlocks and is scrolled to)
    gsap.from('.polaroid-card', {
        scrollTrigger: {
            trigger: '#gallery-section',
            start: 'top 75%',
        },
        opacity: 0,
        y: 45,
        scale: 0.9,
        stagger: 0.15,
        duration: 1.0,
        ease: 'power3.out'
    });
    
    // Final section reveals (triggers when final note unlocks and is scrolled to)
    gsap.from('.final-card', {
        scrollTrigger: {
            trigger: '#final-section',
            start: 'top 70%',
        },
        opacity: 0,
        scale: 0.92,
        y: 40,
        duration: 1.4,
        ease: 'power3.out'
    });
    
    gsap.from('.side-images.left-side .side-photo-frame', {
        scrollTrigger: {
            trigger: '#final-section',
            start: 'top 70%',
        },
        opacity: 0,
        x: -50,
        scale: 0.8,
        stagger: 0.2,
        duration: 1.2,
        ease: 'back.out(1.2)'
    });
    
    gsap.from('.side-images.right-side .side-photo-frame', {
        scrollTrigger: {
            trigger: '#final-section',
            start: 'top 70%',
        },
        opacity: 0,
        x: 50,
        scale: 0.8,
        stagger: 0.2,
        duration: 1.2,
        ease: 'back.out(1.2)'
    });

    gsap.from('.final-para', {
        scrollTrigger: {
            trigger: '#final-section',
            start: 'top 60%',
        },
        opacity: 0,
        y: 20,
        stagger: 0.25,
        duration: 1.0
    });
});
