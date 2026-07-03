/* ==========================================================================
   SILICON GYM // INTERFACE ENGINE & VALIDATION PROTOCOL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cyberpunkForm');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const successPopup = document.getElementById('successPopup');

    if (!form) return;

    // List of input names used for radio cluster grouping checks
    const radioGroups = [
        'entry.1858008117', // Gender Identity
        'entry.year_placeholder', // Academic Cycle (Year)
        'entry.1691817220', // Parental Clearance
        'entry.38638229'    // Locker Allocation
    ];

    /* ==========================================================================
       01. DYNAMIC PROGRESS TRACKER MATRIX
       ========================================================================== */
    function updateProgress() {
        let totalMetrics = 0;
        let completedMetrics = 0;

        // Track regular text, numbers, and dropdown selection fields
        const standardFields = form.querySelectorAll('input[type="text"], input[type="number"], select');
        standardFields.forEach(field => {
            totalMetrics++;
            if (field.value.trim() !== "" && field.value !== "SELECT ACADEMIC BRANCH") {
                completedMetrics++;
            }
        });

        // Track custom file upload block field
        const fileField = document.getElementById('profilePhoto');
        if (fileField) {
            totalMetrics++;
            if (fileField.files && fileField.files.length > 0) {
                completedMetrics++;
            }
        }

        // Track radio button cluster choices
        radioGroups.forEach(groupName => {
            const radios = form.querySelectorAll(`input[name="${groupName}"]`);
            if (radios.length > 0) {
                totalMetrics++;
                const isChecked = Array.from(radios).some(r => r.checked);
                if (isChecked) completedMetrics++;
            }
        });

        // Compute percentage output matrix
        const percentage = totalMetrics > 0 ? Math.round((completedMetrics / totalMetrics) * 100) : 0;
        
        // Update DOM elements layout smoothly
        progressBar.style.width = `${percentage}%`;
        progressPercent.innerText = `${percentage}%`;
    }

    // Attach passive listeners to calculate system progress on user activity
    form.addEventListener('input', updateProgress);
    form.addEventListener('change', updateProgress);


    /* ==========================================================================
       02. STAGE VALIDATION CRITERIA ENGINE
       ========================================================================== */
    form.addEventListener('submit', (event) => {
        let isFormValid = true;

        // A. Validate Text & Number Inputs
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            let isValid = true;

            // Handle standard string structures
            if (!input.value.trim()) {
                isValid = false;
            } 
            // Target numeric ranges safely (Height, Weight, Experience ranges)
            else if (input.type === "number") {
                const val = parseFloat(input.value);
                const min = parseFloat(input.getAttribute('min'));
                const max = parseFloat(input.getAttribute('max'));
                if (val < min || val > max) {
                    isValid = false;
                }
            }

            if (!isValid) {
                isFormValid = false;
                applyErrorState(input);
            } else {
                clearErrorState(input);
            }
        });

        // B. Validate Radio Cluster Formulations
        radioGroups.forEach(groupName => {
            const radios = form.querySelectorAll(`input[name="${groupName}"]`);
            if (radios.length > 0) {
                const isGroupChecked = Array.from(radios).some(radio => radio.checked);
                const container = radios[0].closest('.input-group') || radios[0].parentElement;
                const errorText = container.querySelector('.helper-text');

                if (!isGroupChecked) {
                    isFormValid = false;
                    if (errorText) errorText.style.color = 'var(--neon-error)';
                } else {
                    if (errorText) errorText.style.color = 'var(--text-muted)';
                }
            }
        });

        // C. Validate Hidden/Custom File Inputs Matrix
        const fileInput = document.getElementById('profilePhoto');
        if (fileInput && fileInput.hasAttribute('required')) {
            const uploadBox = fileInput.closest('.cyber-upload-box');
            const errorText = document.getElementById('photoError');

            if (!fileInput.files || fileInput.files.length === 0) {
                isFormValid = false;
                if (uploadBox) uploadBox.style.borderColor = 'var(--neon-error)';
                if (errorText) errorText.style.color = 'var(--neon-error)';
            } else {
                if (uploadBox) uploadBox.style.borderColor = 'var(--border-dim)';
                if (errorText) errorText.style.color = 'var(--text-muted)';
            }
        }

        // D. Intercept Form Redirection if Validation Fails
        if (!isFormValid) {
            event.preventDefault();
            triggerSubmitButtonError();
        } else {
            // Form is completely valid! Trigger secure submission processing feedback loop
            executeTerminalSubmission();
        }
    });

    /* ==========================================================================
       03. INTERACTIVE FEEDBACK UTILITIES
       ========================================================================== */
    function applyErrorState(element) {
        element.style.borderColor = 'var(--neon-error)';
        element.style.boxShadow = '0 0 10px rgba(255, 0, 85, 0.2)';
        
        // Turn corresponding helper text tag red
        const group = element.closest('.form-group, .input-group');
        if (group) {
            const helper = group.querySelector('.form-help-text, .helper-text');
            if (helper) helper.style.color = 'var(--neon-error)';
        }
    }

    function clearErrorState(element) {
        element.style.borderColor = 'var(--border-dim)';
        element.style.boxShadow = 'none';

        const group = element.closest('.form-group, .input-group');
        if (group) {
            const helper = group.querySelector('.form-help-text, .helper-text');
            if (helper) helper.style.color = 'var(--text-muted)';
        }
    }

    function triggerSubmitButtonError() {
        const originalText = submitBtn.querySelector('.btn-text').innerText;
        submitBtn.style.background = 'var(--neon-error)';
        submitBtn.querySelector('.btn-text').innerText = "CRITICAL ERROR // CRITERIA MISSING";
        
        setTimeout(() => {
            submitBtn.style.background = '#ffffff';
            submitBtn.querySelector('.btn-text').innerText = originalText;
        }, 2500);
    }

    function executeTerminalSubmission() {
        // Show loading animations
        if (btnSpinner) btnSpinner.style.display = 'block';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.8';

        // Direct submission target stream routing to hidden iframe to prevent default blank redirection pages
        form.setAttribute('target', 'hidden_iframe');

        // Handle target frame state load to trigger our elegant custom success popup card
        const iframe = document.getElementById('hidden_iframe');
        if (iframe) {
            iframe.onload = () => {
                if (btnSpinner) btnSpinner.style.display = 'none';
                
                // Active custom success modal popup layout wrapper
                successPopup.classList.add('active');
                successPopup.setAttribute('aria-hidden', 'false');
                
                // Clear state parameters back to baseline default data matrix
                form.reset();
                updateProgress();
                
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.opacity = '1';
            };
        }
    }

    // Dynamic clean update on file text visual assignment row layout box
    const fileSelector = document.getElementById('profilePhoto');
    if (fileSelector) {
        fileSelector.addEventListener('change', function() {
            const mainText = this.closest('.cyber-upload-box').querySelector('.upload-main-text');
            if (this.files && this.files.length > 0) {
                mainText.innerText = `READY: ${this.files[0].name.toUpperCase()}`;
                mainText.style.color = 'var(--neon-accent)';
            } else {
                mainText.innerText = "DRAG & DROP IMAGE FILE";
                mainText.style.color = 'var(--text-main)';
            }
            updateProgress();
        });
    }
});
