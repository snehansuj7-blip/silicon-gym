document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. BLACK METALLIC WAVE PARTICLE RUNTIME
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
                this.x = (index / total) * canvas.width; 
            }
            reset() {
                this.baseY = canvas.height * 0.6; 
                this.amplitude = Math.random() * 60 + 40; 
                this.speed = Math.random() * 0.015 + 0.005; 
                this.size = Math.random() * 3.5 + 2.5; 
                this.phaseShift = Math.random() * Math.PI * 2;
                
                const colors = ['#1a1a1a', '#2d2d30', '#404043', '#111111'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.3 + 0.6; 
            }
            update() {
                this.x += 0.6; 
                if (this.x > canvas.width) {
                    this.x = 0;
                    this.reset();
                }
                const wave1 = Math.sin((this.x * 0.003) + waveCycle + this.phaseShift);
                const wave2 = Math.cos((this.x * 0.001) - (waveCycle * 0.5));
                this.y = this.baseY + (wave1 * this.amplitude) + (wave2 * (this.amplitude * 0.5));
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                let gradient = ctx.createRadialGradient(
                    this.x - this.size * 0.25, this.y - this.size * 0.25, this.size * 0.1, 
                    this.x, this.y, this.size
                );
                gradient.addColorStop(0, '#ffffff'); 
                gradient.addColorStop(0.2, '#666666'); 
                gradient.addColorStop(0.5, this.color); 
                gradient.addColorStop(1, '#000000'); 

                ctx.fillStyle = gradient;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'; 
                ctx.shadowBlur = 8;
                ctx.shadowOffsetY = 3;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const density = Math.min(300, window.innerWidth / 4); 
        for (let i = 0; i < density; i++) {
            particles.push(new WaveParticle(i, density));
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            waveCycle += 0.006;
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ==========================================
    // 2. SMOOTH SECTION NAVIGATOR
    // ==========================================
    const scrollBtn = document.querySelector('.about-scroll-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.getElementById('registrationProtocol');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==========================================
    // 3. SELECTION ACCESS ROUTINES
    // ==========================================
    const form = document.getElementById('cyberpunkForm');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const fileInput = document.getElementById('profilePhoto');
    const uploadBox = document.querySelector('.cyber-upload-box');
    const uploadMainText = document.querySelector('.upload-main-text');
    const submitBtn = document.getElementById('submitBtn');
    const successPopup = document.getElementById('successPopup');

    if (!form) return;

    form.setAttribute('target', 'hidden_iframe');

    const validationRules = {
        fullName: (val) => /^[A-Za-z\s]{3,40}$/.test(val.trim()),
        sicCode: (val) => /^[A-Za-z0-9]{8}$/.test(val.trim()),
        academicBranch: (val) => val !== "" && val !== null,
        heightMetric: (val) => val >= 100 && val <= 250,
        weightMetric: (val) => val >= 20 && val <= 250,
        gymExperience: (val) => val !== "" && !isNaN(val) && val >= 0 && val <= 40
    };

    // ==========================================
    // 4. BIOMETRIC IDENTIFICATION ENGINE
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
        const maxSize = 5 * 1024 * 1024; 
        const errorSpan = document.getElementById('photoError');

        if (file.size > maxSize) {
            if (errorSpan) {
                errorSpan.textContent = "CRITICAL ERROR: Matrix limit exceeded (Max 5MB).";
                errorSpan.style.color = "#ff0055";
            }
            fileInput.value = "";
            if (uploadMainText) uploadMainText.textContent = "DRAG & DROP IMAGE FILE";
        } else {
            if (errorSpan) {
                errorSpan.textContent = "Valid identification image file loaded.";
                errorSpan.style.color = "#00ffcc";
            }
            if (uploadMainText) uploadMainText.textContent = `READY: ${file.name.substring(0, 18)}...`;
        }
        calculateProgress();
    }

    // ==========================================
    // 5. MATRIX COMPUTATION TRACKER
    // ==========================================
    const totalSteps = 11; 
    
    function calculateProgress() {
        let validFields = 0;

        const nameEl = document.getElementById('fullName');
        const sicEl = document.getElementById('sicCode');
        const branchEl = document.getElementById('academicBranch');
        const heightEl = document.getElementById('heightMetric');
        const weightEl = document.getElementById('weightMetric');
        const expEl = document.getElementById('gymExperience');

        if (nameEl && validationRules.fullName(nameEl.value)) validFields++;
        if (sicEl && validationRules.sicCode(sicEl.value)) validFields++;
        if (branchEl && validationRules.academicBranch(branchEl.value)) validFields++;
        if (document.querySelector('input[name="entry.year_placeholder"]:checked')) validFields++;
        if (document.querySelector('input[name="entry.1858008117"]:checked')) validFields++;
        if (fileInput && fileInput.files && fileInput.files.length > 0) validFields++;
        if (heightEl && validationRules.heightMetric(heightEl.value)) validFields++;
        if (weightEl && validationRules.weightMetric(weightEl.value)) validFields++;
        if (document.querySelector('input[name="entry.1691817220"]:checked')) validFields++;
        if (expEl && validationRules.gymExperience(expEl.value)) validFields++;
        if (document.querySelector('input[name="entry.38638229"]:checked')) validFields++;

        const percentage = Math.round((validFields / totalSteps) * 100);
        
        if (progressBar && progressPercent) {
            progressBar.style.width = `${percentage}%`;
            progressPercent.textContent = `${percentage}%`;
        }
    }

    form.addEventListener('input', calculateProgress);
    form.addEventListener('change', calculateProgress);

    // ==========================================
    // 6. FORM CAPTURE & DISPATCH SEQUENCE
    // ==========================================
    form.addEventListener('submit', (e) => {
        let formIsValid = true;

        const toggleErrorUI = (id, errorId, isValid) => {
            const errorElement = document.getElementById(errorId);
            const inputElement = id ? document.getElementById(id) : null;
            if (!isValid) {
                formIsValid = false;
                if(errorElement) errorElement.style.color = "#ff0055";
                if(inputElement) inputElement.style.borderColor = "#ff0055";
            } else {
                if(errorElement) errorElement.style.color = "";
                if(inputElement) inputElement.style.borderColor = "";
            }
        };

        // Fire structural validations
        toggleErrorUI('fullName', 'nameError', validationRules.fullName(document.getElementById('fullName')?.value || ''));
        toggleErrorUI('sicCode', 'sicError', validationRules.sicCode(document.getElementById('sicCode')?.value || ''));
        toggleErrorUI('academicBranch', 'branchError', validationRules.academicBranch(document.getElementById('academicBranch')?.value || ''));
        toggleErrorUI('heightMetric', 'heightError', validationRules.heightMetric(document.getElementById('heightMetric')?.value || ''));
        toggleErrorUI('weightMetric', 'weightError', validationRules.weightMetric(document.getElementById('weightMetric')?.value || ''));
        toggleErrorUI('gymExperience', 'experienceError', validationRules.gymExperience(document.getElementById('gymExperience')?.value || ''));

        // Check group metrics
        toggleErrorUI('', 'yearError', document.querySelector('input[name="entry.year_placeholder"]:checked') !== null);
        toggleErrorUI('', 'genderError', document.querySelector('input[name="entry.1858008117"]:checked') !== null);
        toggleErrorUI('', 'photoError', fileInput && fileInput.files && fileInput.files.length > 0);
        toggleErrorUI('', 'permissionError', document.querySelector('input[name="entry.1691817220"]:checked') !== null);
        toggleErrorUI('', 'lockerError', document.querySelector('input[name="entry.38638229"]:checked') !== null);

        if (!formIsValid) {
            e.preventDefault(); // Halt processing if errors present
            const firstError = document.querySelector('.helper-text[style*="rgb(255, 0, 85)"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Form is legal, display the interface spinner
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        // Trigger native form transmission loop handling success updates smoothly
        setTimeout(() => {
            if (successPopup) {
                successPopup.classList.add('active');
            }

            // Cleanup form inputs
            setTimeout(() => {
                form.reset();
                calculateProgress(); 
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
                if (uploadMainText) uploadMainText.textContent = "DRAG & DROP IMAGE FILE";
            }, 600);

            // Hide overlay window after 4 seconds
            setTimeout(() => {
                if (successPopup) {
                    successPopup.classList.remove('active');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 4000);

        }, 300);
    });
});
