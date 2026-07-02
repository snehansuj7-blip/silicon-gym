document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. CYBERPUNK BACKGROUND PARTICLE SYSTEM
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                this.alpha = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = '#00ffcc'; // Neon Cyan accent
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
