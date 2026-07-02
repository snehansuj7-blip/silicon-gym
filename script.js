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

    // Initialize metrics immediately on UI boot
    calculateProgress();

    /* ==========================================================================
   02. DYNAMIC PROGRESS HUD TRACKING
   ========================================================================== */
    function calculateProgress() {
        let filledFields = 0;
        const radioGroups = {};

        // Isolate inputs to calculate complete elements
        inputs.forEach(input => {
            if (input.type === "radio") {
                // Initialize group state if not already indexed
                if (!radioGroups[input.name]) {
                    radioGroups[input.name] = false;
                }
                if (input.checked) {
                    radioGroups[input.name] = true;
                }
            } else if (input.tagName === "SELECT") {
                // Valid selected option cannot be blank placeholder
                if (input.value !== "") {
                    filledFields++;
                }
            } else if (input.value.trim() !== "") {
                filledFields++;
            }
        });

        // Evaluate the calculated radio clusters safely
        const totalRadiosCount = Object.keys(radioGroups).length;
        const selectedRadiosCount = Object.values(radioGroups).filter(val => val).length;

        // Deduct structural radios array count and supplement cluster parameters instead
        const totalRadioInputsCount = Array.from(inputs).filter(i => i.type === "radio").length;
        const adjustedTotal = (inputs.length - totalRadioInputsCount) + totalRadiosCount;
        const adjustedFilled = filledFields + selectedRadiosCount;

        const score = adjustedTotal > 0 ? Math.round((adjustedFilled / adjustedTotal) * 100) : 0;
        
        // Update interactive progress metrics in the frontend UI
        if (progressBar) progressBar.style.width = `${score}%`;
        if (progressPercent) progressPercent.textContent = `${score}%`;
    }

    // Attach immediate tracker listeners across form interactive elements
    form.addEventListener("input", calculateProgress);
    form.addEventListener("change", calculateProgress);

    /* ==========================================================================
   03. DRAG & DROP MULTIMEDIA ATTACHMENT BOX
   ========================================================================== */
    if (uploadBox && fileInput) {
        const uploadMainText = uploadBox.querySelector(".upload-main-text");
        const origText = uploadMainText ? uploadMainText.textContent : "CHOOSE PROFILE PHOTO";

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
                // Avoid display overflowing problems via truncated naming metrics
                const fileName = file.name.length > 25 ? file.name.substring(0, 22) + "..." : file.name;
                
                if (uploadMainText) {
                    uploadMainText.textContent = `SELECTED: ${fileName.toUpperCase()}`;
                    uploadMainText.style.color = "var(--primary-yellow)";
                }
                uploadBox.closest(".input-group").classList.remove("invalid-parameter");
            } else {
                if (uploadMainText) {
                    uploadMainText.textContent = origText;
                    uploadMainText.style.color = "var(--text-pure)";
                }
            }
            calculateProgress();
        });
    }

    /* ==========================================================================
   04. ROBUST PARAMETER DIAGNOSTICS & VALIDATION ENGINE
   ========================================================================== */
    function validateField(input) {
        const inputGroup = input.closest(".input-group");
        if (!inputGroup) return true;

        let isValid = true;

        // 1. Text Field Validations (Name parameters check)
        if (input.id === "fullName") {
            const nameValue = input.value.trim();
            const nameRegex = /^[A-Za-z\s]{3,40}$/;
            isValid = nameRegex.test(nameValue);
        }
        
        // 2. Academic Token Check (SIC Codes parameter rules)
        else if (input.id === "sicCode") {
            const sicValue = input.value.trim();
            const sicRegex = /^[A-Za-z0-9]{8}$/; // Matches standard 8-character student alphanumeric structures
            isValid = sicRegex.test(sicValue);
        }
        
        // 3. System Boundary Threshold Check (Numeric boundaries setup)
        else if (input.type === "number") {
            const val = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            isValid = (!isNaN(val) && val >= min && val <= max);
        }
        
        // 4. Branch Dropdowns & Year Radio Matrix Validation Checks
        else if (input.tagName === "SELECT" || input.type === "radio") {
            if (input.type === "radio") {
                const group = form.querySelectorAll(`input[name="${input.name}"]`);
                isValid = Array.from(group).some(r => r.checked);
            } else {
                isValid = input.value !== "";
            }
        }
        
        // 5. Attached File Limits Check
        else if (input.type === "file") {
            isValid = input.files.length > 0;
            if (isValid && input.files[0].size > 5 * 1024 * 1024) {
                isValid = false; // Cap max image size at 5MB limits
            }
        }

        // Toggle error utility classes conditionally
        if (!isValid) {
            inputGroup.classList.add("invalid-parameter");
        } else {
            inputGroup.classList.remove("invalid-parameter");
        }

        return isValid;
    }

    // Attach live interactive validation triggers
    inputs.forEach(input => {
        input.addEventListener("blur", () => validateField(input));
        if (input.tagName === "SELECT" || input.type === "radio") {
            input.addEventListener("change", () => validateField(input));
        }
    });

    /* ==========================================================================
   05. TERMINAL EXECUTION ON FORM SUBMIT
   ========================================================================== */
    form.addEventListener("submit", (e) => {
        let isFormValid = true;

        // Cycle elements validation sequence on submission invocation
        inputs.forEach(input => {
            const isFieldValid = validateField(input);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            e.preventDefault(); // Restrict faulty payloads
            
            // Auto-focus and scroll seamlessly to first invalid structure group
            const firstInvalid = form.querySelector(".invalid-parameter");
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            // Processing visual update optimization
            const submitBtn = document.getElementById("submitBtn");
            if (submitBtn) {
                submitBtn.style.opacity = "0.6";
                submitBtn.style.pointerEvents = "none";
                submitBtn.innerText = "TRANSMITTING DATA...";
            }
        }
    });
});
