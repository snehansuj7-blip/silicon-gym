/**
 * CYBERPUNK INDUSTRIAL LOGIC PORTAL CONTROLLER
 * Asynchronous Back-end Synchronization Core Model
 */

document.addEventListener("DOMContentLoaded", () => {
    initTactileGraphics();
    initDataRouteController();
});

function initTactileGraphics() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    class AmberParticle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -Math.random() * 0.8 - 0.2;
            this.alpha = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.y += this.speedY;
            if (this.y < 0) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = "#FF9900"; // Warning Amber Micro-sparks
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.restore();
        }
    }

    for (let i = 0; i < 30; i++) particles.push(new AmberParticle());

    function cycle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(cycle);
    }
    cycle();
}

function initDataRouteController() {
    const form = document.getElementById("cyberpunkForm");
    const submitBtn = document.getElementById("submitBtn");
    const successPopup = document.getElementById("successPopup");
    
    const fields = {
        name: document.getElementById("fullName"),
        sic: document.getElementById("sicCode"),
        height: document.getElementById("heightMetric"),
        weight: document.getElementById("weightMetric"),
        experience: document.getElementById("gymExperience")
    };

    const validators = {
        name: (val) => /^[A-Za-z\s]{3,40}$/.test(val.trim()),
        sic: (val) => /^[A-Za-z0-9]{8}$/.test(val.trim()),
        height: (val) => val !== "" && Number(val) >= 100 && Number(val) <= 250,
        weight: (val) => val !== "" && Number(val) >= 20 && Number(val) <= 250,
        experience: (val) => val !== "" && Number(val) >= 0 && Number(val) <= 40,
        gender: () => document.querySelector('input[name="entry.1858008117"]:checked') !== null,
        permission: () => document.querySelector('input[name="entry.1691817220"]:checked') !== null,
        locker: () => document.querySelector('input[name="entry.38638229"]:checked') !== null
    };

    // Live validation loop
    Object.keys(fields).forEach(key => {
        fields[key].addEventListener("input", () => {
            validateField(key, fields[key], validators[key]);
            updateProgressEngine();
        });
    });

    // Dynamic radio node change handlers
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener("change", () => {
            const group = radio.getAttribute("name");
            let key = "";
            if (group === "entry.1858008117") key = "gender";
            if (group === "entry.1691817220") key = "permission";
            if (group === "entry.38638229") key = "locker";

            if (key) {
                setFieldState(radio.closest('.input-group'), validators[key]());
                updateProgressEngine();
            }
        });
    });

    function validateField(key, el, validator) {
        const state = validator(el.value);
        setFieldState(el.closest('.input-group'), state);
        return state;
    }

    function setFieldState(wrapper, isValid) {
        if (!wrapper) return;
        if (isValid) {
            wrapper.classList.remove("invalid-state");
            wrapper.classList.add("valid-state");
        } else {
            wrapper.classList.remove("valid-state");
            wrapper.classList.add("invalid-state");
        }
    }

    function updateProgressEngine() {
        const keys = ["name", "sic", "gender", "height", "weight", "permission", "experience", "locker"];
        let validUnits = 0;
        keys.forEach(key => {
            if (["gender", "permission", "locker"].includes(key)) {
                if (validators[key]()) validUnits++;
            } else {
                if (validators[key](fields[key].value)) validUnits++;
            }
        });
        const pct = Math.round((validUnits / keys.length) * 100);
        document.getElementById("progressBar").style.width = `${pct}%`;
        document.getElementById("progressPercent").innerText = `${pct}%`;
    }

    /* Asynchronous Data Submit System (Bypasses CORS restrictions safely) */
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;

        Object.keys(fields).forEach(k => { if (!validateField(k, fields[k], validators[k])) valid = false; });
        ["gender", "permission", "locker"].forEach(k => {
            const el = document.querySelector(`input[name="${k==='gender'?'entry.1858008117':k==='permission'?'entry.1691817220':'entry.38638229'}"]`);
            if (!validators[k]()) { setFieldState(el.closest('.input-group'), false); valid = false; }
        });

        if (!valid) return;

        submitBtn.classList.add("loading");
        submitBtn.disabled = true;

        fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            mode: "no-cors"
        })
        .then(() => {
            successPopup.classList.add("active");
            setTimeout(() => {
                form.reset();
                document.querySelectorAll(".valid-state, .invalid-state").forEach(el => el.classList.remove("valid-state", "invalid-state"));
                updateProgressEngine();
                submitBtn.classList.remove("loading");
                submitBtn.disabled = false;
                successPopup.classList.remove("active");
            }, 3000);
        })
        .catch(() => {
            submitBtn.classList.remove("loading");
            submitBtn.disabled = false;
        });
    });
}
