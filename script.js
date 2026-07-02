/* ==========================================================================
   01. INITIALIZATION & STATE MATRIX
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cyberpunkForm");
    const inputs = form.querySelectorAll("input[required], select[required]");
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    const uploadBox = document.querySelector(".cyber-upload-box");
    const fileInput = document.getElementById("profilePhoto");

    // Initialize immediate metrics calculations
    calculateProgress();

    /* ==========================================================================
       02. DYNAMIC PROGRESS HUD TRACKING
       ========================================================================== */
    function calculateProgress() {
        let filledFields = 0;
        let totalFields = inputs.length;

        // Special handling groups (radios are evaluated collectively)
        const radioGroups = {};
        
        inputs.forEach(input => {
            if (input.type === "radio") {
                if (!radioGroups[input.name]) {
                    radioGroups[input.name] = false;
                }
                if (input.checked) {
                    radioGroups[input.name] = true;
                }
            } else if (input.value.trim() !== "") {
                filledFields++;
            }
        });

        // Add verified radio groups to calculation metrics
        let totalRadiosCount = Object.keys(radioGroups).length;
        let selectedRadiosCount = Object.values(radioGroups).filter(val => val).length;

        // Readjust metrics arrays
        const adjustedTotal = (totalFields - inputs.filter(i => i.type === "radio").length) + totalRadiosCount;
        const adjustedFilled = filledFields + selectedRadiosCount;

        const score = adjustedTotal > 0 ? Math.round((adjustedFilled / adjustedTotal) * 100) : 0;
        
        // Update Frontend Canvas Display
        progressBar.style.width = `${score}%`;
        progressPercent.textContent = `${score}%`;
    }

    // Attach tracking listener matrix to all elements
    form.addEventListener("input", calculateProgress);
    form.addEventListener("change", calculateProgress);

    /* ==========================================================================
       03. ADVANCED DRAG & DROP FILE INTERFACE
       ========================================================================== */
    if (uploadBox && fileInput) {
        const uploadMainText = uploadBox.querySelector(".upload-main-text");
        const origText = uploadMainText.textContent;

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadBox.addEventListener(eventName, (e) => {
                e.preventDefault();
                uploadBox.style.borderColor = "var(--primary-yellow)";
                uploadBox.style.backgroundColor = "rgba(245, 194, 66, 0.04)";
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, (e) => {
                e.preventDefault();
                uploadBox.style.borderColor = "rgba(255, 255, 255, 0.15)";
                uploadBox.style.backgroundColor = "rgba(255, 255, 255, 0.01)";
            }, false);
        });

        fileInput.addEventListener("change", () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                // Display truncated name string if parameters exceed boundary
                const fileName = file.name.length > 25 ? file.name.substring(0, 22) + "..." : file.name;
                uploadMainText.textContent = `SELECTED: ${fileName.toUpperCase()}`;
                uploadMainText.style.color = "var(--primary-yellow)";
                
                // Clear out validation alerts on file upload allocation
                uploadBox.closest(".input-group").classList.remove("invalid-parameter");
            } else {
                uploadMainText.textContent = origText;
                uploadMainText.style.color = "var(--text-pure)";
            }
            calculateProgress();
        });
    }

    /* ==========================================================================
       04. COMPONENT FIELD DIAGNOSTICS & VALIDATION ENGINE
       ========================================================================== */
    function validateField(input) {
        const inputGroup = input.closest(".input-group");
        if (!inputGroup) return true;

        let isValid = true;

        // 1. Text Field Validations (Name parameters)
        if (input.id === "fullName") {
            const nameValue = input.value.trim();
            const nameRegex = /^[A-Za-z\s]{3,40}$/;
            isValid = nameRegex.test(nameValue);
        }
        
        // 2. Alphanumeric Token Validations (SIC Codes)
        else if (input.id === "sicCode") {
            const sicValue = input.value.trim();
            const sicRegex = /^[A-Za-z0-9]{8}$/;
            isValid = sicRegex.test(sicValue);
        }
        
        // 3. Numeric System Boundary Overrides (Height, Weight, Experience)
        else if (input.type === "number") {
            const val = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            isValid = (!isNaN(val) && val >= min && val <= max);
        }
        
        // 4. Default Node Selection Matrices (Dropdowns & Radios)
        else if (input.tagName === "SELECT" || input.type === "radio") {
            if (input.type === "radio") {
                const group = form.querySelectorAll(`input[name="${input.name}"]`);
                isValid = Array.from(group).some(r => r.checked);
            } else {
                isValid = input.value !== "";
            }
        }
        
        // 5. File System Validation Parameters
        else if (input.type === "file") {
            isValid = input.files.length > 0;
            if (isValid && input.files[0].size > 5 * 1024 * 1024) {
                isValid = false; // Limit parameter capped at 5MB
            }
        }

        // Toggle error utility classes based on field validity status
        if (!isValid) {
            inputGroup.classList.add("invalid-parameter");
        } else {
            inputGroup.classList.remove("invalid-parameter");
        }

        return isValid;
    }

    // Attach validation listeners for user inputs
    inputs.forEach(input => {
        input.addEventListener("blur", () => validateField(input));
        if (input.tagName === "SELECT" || input.type === "radio") {
            input.addEventListener("change", () => validateField(input));
        }
    });

    /* ==========================================================================
       05. SECURE ENDPOINT FORM SUBMISSION ROUTING
       ========================================================================== */
    form.addEventListener("submit", (e) => {
        let isFormValid = true;

        // Force execution across all required nodes
        inputs.forEach(input => {
            const isFieldValid = validateField(input);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            e.preventDefault(); // Stop network traffic if structural parameters are invalid
            
            // Auto-scroll screen window up to first corrupted input group element
            const firstInvalid = form.querySelector(".invalid-parameter");
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            // Success optimization loop (submit process running seamlessly)
            const submitBtn = document.getElementById("submitBtn");
            if (submitBtn) {
                submitBtn.style.opacity = "0.6";
                submitBtn.style.pointerEvents = "none";
                submitBtn.innerText = "PROCESSING SUBMISSION...";
            }
        }
    });
});
