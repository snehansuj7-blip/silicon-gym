document.addEventListener('DOMContentLoaded', () => {
// ==========================================
    // 1. LUXURY BLACK PARTICLE WAVE SYSTEM
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let waveCycle = 0;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class WaveParticle {
            constructor(index, total) {
                this.index = index;
                this.total = total;
                this.reset();
                // Randomize initial horizontal placement across the grid
                this.x = (index / total) * canvas.width; 
            }
            reset() {
                this.baseY = canvas.height * 0.7; // Centers the wave near the lower third
                this.amplitude = Math.random() * 45 + 25; // Height of individual wave ripples
                this.speed = Math.random() * 0.015 + 0.005; // Speed of movement
                this.size = Math.random() * 2.5 + 0.8; // Varying particle sizes for deep perspective
                this.phaseShift = Math.random() * Math.PI * 2;
                
                // Luxury Dark Palette: Alternate between pitch black, charcoal, and Deep Cyber Slate
                const colors = ['#050505', '#111115', '#1c1c24', '#0d0d11'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.4 + 0.3; // Elegant translucent visibility
            }
            update() {
                // Progressively move the particle horizontally across the timeline
                this.x += 0.4;
                if (this.x > canvas.width) {
                    this.x = 0;
                    this.reset();
                }

                // Complex multi-layered Sine Wave formula for fluid natural movement
                const wave1 = Math.sin((this.x * 0.003) + waveCycle + this.phaseShift);
                const wave2 = Math.cos((this.x * 0.001) - (waveCycle * 0.5));
                
                this.y = this.baseY + (wave1 * this.amplitude) + (wave2 * (this.amplitude * 0.5));
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                
                // Luxury high-end shadow effect to give deep layer contrast against your cyber-bg
                ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
                ctx.shadowBlur = 6;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize wave density layers (180 elements create a premium ribbon effect)
        const density = 180;
        for (let i = 0; i < density; i++) {
            particles.push(new WaveParticle(i, density));
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Advance global timeline cycle calculation
            waveCycle += 0.004;

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };
        animate();
    }
    // ==========================================
    // 2. SMOOTH SCROLL PROTOCOL
    // ==========================================
    const scrollBtn = document.querySelector('.about-scroll-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = scrollBtn.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==========================================
    // 3. CORE FORM & UI ELEMENTS
    // ==========================================
    const form = document.getElementById('cyberpunkForm');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const fileInput = document.getElementById('profilePhoto');
    const uploadBox = document.querySelector('.cyber-upload-box');
    const uploadMainText = document.querySelector('.upload-main-text');
    const successPopup = document.getElementById('successPopup');
    const submitBtn = document.getElementById('submitBtn');

    // Link form target to hidden iframe to prevent ugly Google Form redirects
    form.setAttribute('target', 'hidden_iframe');

    // Validation patterns & rules
    const validationRules = {
        fullName: (val) => /^[A-Za-z\s]{3,40}$/.test(val.trim()),
        sicCode: (val) => /^[A-Za-z0-9]{8}$/.test(val.trim()),
        academicBranch: (val) => val !== "",
        heightMetric: (val) => val >= 100 && val <= 250,
        weightMetric: (val) => val >= 20 && val <= 250,
        gymExperience: (val) => val !== "" && val >= 0 && val <= 40
    };

    // ==========================================
    // 4. BIOMETRIC CAPTURE (DRAG & DROP)
    // ==========================================
    if (uploadBox && fileInput) {
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadBox.addEventListener(eventName, (e) => {
                e.preventDefault();
                uploadBox.classList.add('highlight');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, (e) => {
                e.preventDefault();
                uploadBox.classList.remove('highlight');
            }, false);
        });

        uploadBox.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length) {
                fileInput.files = files;
                handleFileDisplay(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFileDisplay(e.target.files[0]);
            }
        });
    }

    function handleFileDisplay(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const errorSpan = document.getElementById('photoError');

        if (file.size > maxSize) {
            errorSpan.textContent = "CRITICAL ERROR: Matrix limit exceeded (Max 5MB).";
            errorSpan.style.color = "#ff0055";
            fileInput.value = "";
            uploadMainText.textContent = "DRAG & DROP IMAGE FILE";
        } else {
            errorSpan.textContent = "Valid identification image file loaded.";
            errorSpan.style.color = "#00ffcc";
            uploadMainText.textContent = `READY: ${file.name.substring(0, 20)}...`;
        }
        calculateProgress();
    }

    // ==========================================
    // 5. LIVE MATRIX PROGRESS CALCULATOR
    // ==========================================
    const totalSteps = 11; // 11 distinct data groups to validate
    
    function calculateProgress() {
        let validFields = 0;

        if (validationRules.fullName(document.getElementById('fullName').value)) validFields++;
        if (validationRules.sicCode(document.getElementById('sicCode').value)) validFields++;
        if (validationRules.academicBranch(document.getElementById('academicBranch').value)) validFields++;
        if (document.querySelector('input[name="entry.year_placeholder"]:checked')) validFields++;
        if (document.querySelector('input[name="entry.1858008117"]:checked')) validFields++;
        if (fileInput && fileInput.files.length > 0) validFields++;
        if (validationRules.heightMetric(document.getElementById('heightMetric').value)) validFields++;
        if (validationRules.weightMetric(document.getElementById('weightMetric').value)) validFields++;
        if (document.querySelector('input[name="entry.1691817220"]:checked')) validFields++;
        if (validationRules.gymExperience(document.getElementById('gymExperience').value)) validFields++;
        if (document.querySelector('input[name="entry.38638229"]:checked')) validFields++;

        const percentage = Math.round((validFields / totalSteps) * 100);
        
        if (progressBar && progressPercent) {
            progressBar.style.width = `${percentage}%`;
            progressPercent.textContent = `${percentage}%`;
        }
    }

    // Track state on all input mutations
    form.addEventListener('input', calculateProgress);
    form.addEventListener('change', calculateProgress);

    // ==========================================
    // 6. INTERCEPT AND SUBMIT PROTOCOL
    // ==========================================
    form.addEventListener('submit', (e) => {
        let formIsValid = true;

        // Visual feedback Helper
        const toggleErrorUI = (id, errorId, isValid) => {
            const errorElement = document.getElementById(errorId);
            const inputElement = document.getElementById(id);
            if (!isValid) {
                formIsValid = false;
                if(errorElement) errorElement.style.color = "#ff0055";
                if(inputElement) inputElement.style.borderColor = "#ff0055";
            } else {
                if(errorElement) errorElement.style.color = "";
                if(inputElement) inputElement.style.borderColor = "";
            }
        };

        // Text Validations
        toggleErrorUI('fullName', 'nameError', validationRules.fullName(document.getElementById('fullName').value));
        toggleErrorUI('sicCode', 'sicError', validationRules.sicCode(document.getElementById('sicCode').value));
        toggleErrorUI('academicBranch', 'branchError', validationRules.academicBranch(document.getElementById('academicBranch').value));
        toggleErrorUI('heightMetric', 'heightError', validationRules.heightMetric(document.getElementById('heightMetric').value));
        toggleErrorUI('weightMetric', 'weightError', validationRules.weightMetric(document.getElementById('weightMetric').value));
        toggleErrorUI('gymExperience', 'experienceError', validationRules.gymExperience(document.getElementById('gymExperience').value));

        // Group selections
        toggleErrorUI('', 'yearError', document.querySelector('input[name="entry.year_placeholder"]:checked') !== null);
        toggleErrorUI('', 'genderError', document.querySelector('input[name="entry.1858008117"]:checked') !== null);
        toggleErrorUI('', 'photoError', fileInput && fileInput.files.length > 0);
        toggleErrorUI('', 'permissionError', document.querySelector('input[name="entry.1691817220"]:checked') !== null);
        toggleErrorUI('', 'lockerError', document.querySelector('input[name="entry.38638229"]:checked') !== null);

        if (!formIsValid) {
            e.preventDefault();
            // Scroll to the first structural issue found
            const firstError = document.querySelector('.helper-text[style*="rgb(255, 0, 85)"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Processing animations
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Wait for hidden iframe confirmation layer
        document.getElementById('hidden_iframe').onload = () => {
            submitBtn.classList.remove('loading');
            
            // Trigger UI success modal system
            if (successPopup) {
                successPopup.setAttribute('aria-hidden', 'false');
                successPopup.classList.add('active');
                
                // Clear state matrix smoothly after delay
                setTimeout(() => {
                    form.reset();
                    calculateProgress();
                    successPopup.classList.remove('active');
                    successPopup.setAttribute('aria-hidden', 'true');
                    submitBtn.disabled = false;
                    uploadMainText.textContent = "DRAG & DROP IMAGE FILE";
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 4000);
            }
        };
    });
});
