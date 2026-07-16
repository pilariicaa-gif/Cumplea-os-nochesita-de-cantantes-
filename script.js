document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================
       1. CONTROL DE AUDIO
    ========================================== */
    const bgMusic = document.getElementById("bg-music");
    const theaterBell = document.getElementById("theater-bell");
    const musicToggleBtn = document.getElementById("music-toggle");
    const icon = musicToggleBtn.querySelector("i");
    
    // Revisar preferencia previa en LocalStorage
    let isMusicPlaying = localStorage.getItem("musicPref") === "true";

    const toggleMusic = () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            icon.classList.replace("fa-music", "fa-volume-mute");
        } else {
            bgMusic.play().catch(()=> console.log("Interacción requerida para audio."));
            icon.classList.replace("fa-volume-mute", "fa-music");
        }
        isMusicPlaying = !isMusicPlaying;
        localStorage.setItem("musicPref", isMusicPlaying);
    };

    // Actualizar icono inicial
    if (!isMusicPlaying) {
        icon.classList.replace("fa-music", "fa-volume-mute");
    }

    musicToggleBtn.addEventListener("click", toggleMusic);


    /* ==========================================
       2. SECUENCIA DE APERTURA (Intro)
    ========================================== */
    const text1 = document.getElementById("intro-text-1");
    const text2 = document.getElementById("intro-text-2");
    const text3 = document.getElementById("intro-text-3");
    const titleContainer = document.getElementById("intro-title-container");
    const lights = document.querySelector(".theater-lights");

    // Animación de textos de entrada
    setTimeout(() => { text1.style.opacity = 1; }, 500);
    setTimeout(() => { text1.style.opacity = 0; }, 2500);
    setTimeout(() => { text2.style.opacity = 1; }, 3500);
    setTimeout(() => { text2.style.opacity = 0; }, 5500);
    setTimeout(() => { text3.style.opacity = 1; }, 6500);
    setTimeout(() => { text3.style.opacity = 0; }, 8500);
    
    setTimeout(() => { 
        lights.classList.add("lights-on");
        titleContainer.style.opacity = 1;
        titleContainer.style.transform = "scale(1)";
    }, 10000);

    // Botón para abrir telón
    const btnOpenCurtains = document.getElementById("btn-open-curtains");
    const introScreen = document.getElementById("intro-screen");
    const playbillWrapper = document.getElementById("playbill-wrapper");

    btnOpenCurtains.addEventListener("click", () => {
        // Reproducir campana y música si está activada
        theaterBell.play().catch(e=>console.log("No audio file"));
        if(isMusicPlaying) { bgMusic.play().catch(e=>console.log("Audio bloclked")); }

        // Abrir cortinas
        introScreen.classList.add("curtains-open");

        // Mostrar contenido por detrás
        playbillWrapper.classList.remove("hidden");
        
        // Quitar intro del DOM después de la animación
        setTimeout(() => {
            introScreen.style.display = "none";
        }, 2500);
    });


    /* ==========================================
       3. CONTADOR REGRESIVO (Acto I)
    ========================================== */
    // Fecha objetivo: 29 de Agosto del año en curso (o el siguiente si ya pasó)
    const now = new Date();
    let targetYear = now.getFullYear();
    let targetDate = new Date(`August 29, ${targetYear} 15:00:00`).getTime();

    if (now.getTime() > targetDate) {
        targetYear++;
        targetDate = new Date(`August 29, ${targetYear} 15:00:00`).getTime();
    }

    const updateCountdown = () => {
        const currentTime = new Date().getTime();
        const distance = targetDate - currentTime;

        if (distance < 0) return; // Si ya pasó, se queda en 00

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("cd-days").innerText = days.toString().padStart(2, '0');
        document.getElementById("cd-hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("cd-mins").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("cd-secs").innerText = seconds.toString().padStart(2, '0');
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();


    /* ==========================================
       4. FORMULARIOS (Acto III y IV)
    ========================================== */
    // Formulario de Casting
    const castingForm = document.getElementById("casting-form");
    const castingStamp = document.getElementById("casting-stamp");
    const castingSuccess = document.getElementById("casting-success");

    castingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // AQUÍ VA LA INTEGRACIÓN CON GOOGLE SHEETS / SUPABASE / FORMSPREE
        // const formData = new FormData(castingForm);
        // fetch('URL_DE_TU_API', { method: 'POST', body: formData }).then(...)

        // Simulación visual
        castingStamp.classList.remove("hidden");
        castingStamp.classList.add("animate-stamp");
        castingForm.style.opacity = 0.3; // oscurecer el form
        
        setTimeout(() => {
            castingSuccess.classList.remove("hidden");
        }, 1000);
    });

    // Formulario RSVP
    const rsvpForm = document.getElementById("rsvp-form");
    const rsvpSuccess = document.getElementById("rsvp-success");

    rsvpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // AQUÍ VA LA INTEGRACIÓN (Igual que arriba)

        rsvpForm.style.display = "none";
        rsvpSuccess.classList.remove("hidden");
    });


    /* ==========================================
       5. EASTER EGGS (Márgenes del Playbill)
    ========================================== */
    const phrases = [
        "The room where it happens...",
        "Defying Gravity...",
        "Honey, Honey...",
        "Él me mintió...",
        "One more song...",
        "Look around, look around...",
        "Mamma Mia, here I go again!"
    ];
    const easterEggContainer = document.getElementById("easter-eggs-container");

    const spawnEasterEgg = () => {
        // Solo mostrar si el playbill está visible
        if (playbillWrapper.classList.contains("hidden")) return;

        const el = document.createElement("div");
        el.className = "easter-egg";
        el.innerText = phrases[Math.floor(Math.random() * phrases.length)];
        
        // Posición aleatoria lateral (Izquierda o Derecha)
        const isLeft = Math.random() > 0.5;
        if(isLeft) {
            el.style.left = Math.random() * 15 + "vw";
        } else {
            el.style.right = Math.random() * 15 + "vw";
        }
        
        // Altura aleatoria relativa al viewport
        el.style.top = (Math.random() * 60 + 20) + "vh";

        easterEggContainer.appendChild(el);

        // Limpiar el DOM después de la animación (8s)
        setTimeout(() => {
            el.remove();
        }, 8000);
    };

    // Aparece un easter egg cada 7-12 segundos aleatoriamente
    setInterval(spawnEasterEgg, Math.random() * 5000 + 7000);


    /* ==========================================
       6. FINAL DEL SHOW (Outro)
    ========================================== */
    const endTrigger = document.getElementById("end-trigger");
    const outroScreen = document.getElementById("outro-screen");
    const confettiContainer = document.getElementById("confetti-container");
    let showEnded = false;

    // Función para crear lluvia de confeti / estrellas
    const createConfetti = () => {
        const colors = ['#D4AF37', '#FF4FA3', '#0B6E4F', '#F9F6EF']; // Colores de la paleta
        for (let i = 0; i < 100; i++) {
            const conf = document.createElement('div');
            conf.classList.add('confetti');
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.animationDuration = (Math.random() * 3 + 2) + 's';
            conf.style.animationDelay = (Math.random() * 2) + 's';
            
            // 20% serán estrellas
            if(Math.random() > 0.8) {
                conf.innerHTML = "⭐";
                conf.style.backgroundColor = "transparent";
                conf.style.fontSize = (Math.random() * 15 + 10) + "px";
            }
            
            confettiContainer.appendChild(conf);
        }
    };

    // Usar IntersectionObserver para detectar cuando llega al final
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !showEnded) {
            showEnded = true;
            
            // Pausa sutil antes de cerrar
            setTimeout(() => {
                outroScreen.classList.remove("hidden");
                // Resetear posición de cortinas de cierre y cerrarlas
                setTimeout(() => {
                    outroScreen.classList.add("curtains-open"); // Truco css inverso para cerrar
                    document.querySelector('.closing-left').style.transform = "translateX(0)";
                    document.querySelector('.closing-right').style.transform = "translateX(0)";
                }, 100);

                // Lluvia de confeti
                createConfetti();
                
                // Atenuar música
                if(isMusicPlaying) {
                    let vol = 1;
                    const fadeAudio = setInterval(() => {
                        if (vol > 0.1) { vol -= 0.1; bgMusic.volume = vol; } 
                        else { clearInterval(fadeAudio); bgMusic.pause(); }
                    }, 300);
                }
            }, 1000);
        }
    }, { threshold: 0.1 });

    observer.observe(endTrigger);
});
