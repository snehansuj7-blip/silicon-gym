// Tailwind System Theme Configuration
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "secondary-fixed-dim": "#ffb3b6",
                "surface-container": "#1e2020",
                "secondary-fixed": "#ffdada",
                "background": "#121414",
                "surface-container-high": "#292a2a",
                "inverse-primary": "#be003a",
                "on-error-container": "#ffdad6",
                "inverse-on-surface": "#2f3131",
                "primary": "#ffb2b7",
                "on-error": "#690005",
                "error-container": "#93000a",
                "on-tertiary-fixed-variant": "#4d4800",
                "on-secondary": "#680019",
                "surface-bright": "#38393a",
                "on-secondary-fixed-variant": "#8f0c29",
                "surface-tint": "#ffb2b7",
                "tertiary-fixed-dim": "#d6ca00",
                "on-secondary-fixed": "#40000c",
                "on-primary-fixed-variant": "#92002a",
                "secondary-container": "#8f0c29",
                "on-background": "#e3e2e2",
                "surface-container-lowest": "#0d0e0f",
                "surface-dim": "#121414",
                "primary-container": "#c5003c",
                "on-tertiary-fixed": "#1e1c00",
                "tertiary-container": "#b9af00",
                "surface-variant": "#343535",
                "surface-container-highest": "#343535",
                "inverse-surface": "#e3e2e2",
                "tertiary": "#d6ca00",
                "on-surface-variant": "#e4bdbe",
                "on-secondary-container": "#ff989e",
                "on-surface": "#e3e2e2",
                "on-tertiary": "#353100",
                "error": "#ffb4ab",
                "outline": "#ab8889",
                "on-primary-fixed": "#40000d",
                "primary-fixed": "#ffdadb",
                "surface-container-low": "#1a1c1c",
                "outline-variant": "#5c3f41",
                "on-tertiary-container": "#454100",
                "tertiary-fixed": "#f4e703",
                "surface": "#121414",
                "secondary": "#ffb3b6",
                "on-primary-container": "#ffd4d6",
                "on-primary": "#67001b",
                "primary-fixed-dim": "#ffb2b7"
            },
            "borderRadius": {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem"
            },
            "spacing": {
                "gutter": "24px",
                "margin-desktop": "64px",
                "section-gap": "120px",
                "margin-mobile": "20px",
                "base": "8px",
                "container-max": "1440px"
            },
            "fontFamily": {
                "display-lg": ["Space Grotesk"],
                "body-md": ["Outfit"],
                "label-caps": ["Space Grotesk"],
                "body-lg": ["Outfit"],
                "stats-number": ["Space Grotesk"],
                "headline-xl-mobile": ["Space Grotesk"],
                "headline-md": ["Space Grotesk"],
                "headline-xl": ["Space Grotesk"],
                "display-lg-mobile": ["Space Grotesk"]
            },
            "fontSize": {
                "display-lg": ["72px", {"lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "700"}],
                "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.15em", "fontWeight": "700"}],
                "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                "stats-number": ["32px", {"lineHeight": "1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                "headline-xl-mobile": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                "headline-md": ["24px", {"lineHeight": "1.4", "letterSpacing": "0em", "fontWeight": "500"}],
                "headline-xl": ["40px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                "display-lg-mobile": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "700"}]
            }
        },
    },
};

// --- Three.js Background Animation Script ---
(function() {
    const container = document.getElementById('threejs-container-ANIMATION_1');
    if (!container) return;
    
    const devicePixelRatio = window.devicePixelRatio || 1;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles Setup
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: '#c5003c',
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Spheres Setup
    const spheresGroup = new THREE.Group();
    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: '#880425',
        shininess: 100,
        reflectivity: 1,
        transparent: true,
        opacity: 0.4
    });

    for(let i = 0; i < 20; i++) {
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5
        );
        spheresGroup.add(sphere);
    }
    scene.add(spheresGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight('#f3e600', 2);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        
        // Wave animation logic
        const positions = particlesGeometry.attributes.position.array;
        const time = Date.now() * 0.0005;
        for (let i = 0; i < particlesCount; i++) {
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];
            positions[i * 3 + 1] = Math.sin(x + time) * 0.5 + Math.cos(z + time) * 0.5;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Follow mouse repulsion effect
        particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (-mouseY * 0.5 - particlesMesh.position.y) * 0.05;

        spheresGroup.children.forEach((sphere, i) => {
            sphere.position.y += Math.sin(time + i) * 0.005;
        });

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
})();

// --- Application UI/UX Logic ---

// Global string to hold image base64 data
let base64ImageData = "";

// Intersection Observer for fade-up
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Slider Value Displays
const heightSlider = document.getElementById('heightSlider');
const heightVal = document.getElementById('heightVal');
if(heightSlider && heightVal) {
    heightSlider.oninput = () => heightVal.textContent = heightSlider.value;
}

const weightSlider = document.getElementById('weightSlider');
const weightVal = document.getElementById('weightVal');
if(weightSlider && weightVal) {
    weightSlider.oninput = () => weightVal.textContent = weightSlider.value;
}

const expSlider = document.getElementById('expSlider');
const expVal = document.getElementById('expVal');
if(expSlider && expVal) {
    expSlider.oninput = () => expVal.textContent = expSlider.value;
}

// Image Upload Logic
const dropZone = document.getElementById('dropZone');
const imageInput = document.getElementById('imageInput');
const previewImg = document.getElementById('previewImg');
const uploadPreview = document.getElementById('uploadPreview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const uploadProgress = document.getElementById('uploadProgress');
const clearBtn = document.getElementById('clearBtn');

if(dropZone && imageInput) {
    dropZone.onclick = () => imageInput.click();

    dropZone.ondragover = (e) => {
        e.preventDefault();
        dropZone.classList.add('border-primary');
    };

    dropZone.ondragleave = () => {
        dropZone.classList.remove('border-primary');
    };

    dropZone.ondrop = (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-primary');
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    imageInput.onchange = (e) => handleFile(e.target.files[0]);
}

function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            base64ImageData = e.target.result; // Stores base64 string including header data:image/...
            uploadPreview.classList.remove('hidden');
            uploadPlaceholder.classList.add('hidden');
            simulateUpload();
        };
        reader.readAsDataURL(file);
    }
}

function simulateUpload() {
    uploadProgress.classList.remove('hidden');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        uploadProgress.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => uploadProgress.classList.add('hidden'), 500);
        }
    }, 50);
}

if(clearBtn) {
    clearBtn.onclick = (e) => {
        e.stopPropagation();
        previewImg.src = '';
        base64ImageData = "";
        uploadPreview.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        imageInput.value = '';
    };
}

// Form Validation & Success Handling
const form = document.getElementById('registrationForm');
const successPopup = document.getElementById('successPopup');

if(form) {
    form.onsubmit = (e) => {
        e.preventDefault(); 
        let hasError = false;
        
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            if (!input.value) {
                input.parentElement.classList.add('animate-shake');
                setTimeout(() => input.parentElement.classList.remove('animate-shake'), 400);
                hasError = true;
            }
        });

        if (!hasError) {
            successPopup.classList.remove('hidden');
            setTimeout(() => successPopup.classList.add('opacity-100'), 10);
            
            // Package data explicitly into standard search params
            const formData = new FormData(form);
            const searchParams = new URLSearchParams();
            
            for (const pair of formData.entries()) {
                searchParams.append(pair[0], pair[1]);
            }
            
            // Crucial component injection: Adds image base64 data to parameters payload
            if(base64ImageData) {
                searchParams.append('entry.image', base64ImageData);
            } else {
                searchParams.append('entry.image', '');
            }
            
            fetch(form.action, {
                method: 'POST',
                body: searchParams,
                mode: 'no-cors', 
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(() => {
                console.log('Successfully sent textual form parameters and image base64 data to Apps Script!');
                form.reset(); 
                base64ImageData = "";
                uploadPreview.classList.add('hidden');
                uploadPlaceholder.classList.remove('hidden');
            })
            .catch(error => console.error('Submission Blocked:', error));
        }
    };
}

// Mouse Parallax for Hero
window.addEventListener('mousemove', (e) => {
    const amount = 20;
    const x = (e.clientX / window.innerWidth - 0.5) * amount;
    const y = (e.clientY / window.innerHeight - 0.5) * amount;
    const heroText = document.querySelector('#home h1');
    if (heroText) heroText.style.transform = `translate(${x}px, ${y}px)`;
});

// Card Tilt Effect
if (window.matchMedia("(min-width: 768px)").matches) {
    document.querySelectorAll('.glass-panel').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });
}
