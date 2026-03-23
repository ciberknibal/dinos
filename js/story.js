document.addEventListener('DOMContentLoaded', () => {
    initScene1();
});

/* --- Global State --- */
let jungleState = { found: [], complete: false };
let dustState = { canvas: null, ctx: null, isDrawing: false };
let fossilExcavation = { canvas: null, ctx: null, isDrawing: false, completed: false };
let digCounter = 0;

/* --- Voice System --- */
function say(text, priority = false) {
    if (!('speechSynthesis' in window)) return;
    if (priority) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
}

/* --- Scene 1: Welcome --- */
function initScene1() {
    setTimeout(() => {
        say("¡Hola, explorador! Soy Teo ¡Qué alegría verte por aquí!");
        setTimeout(() => say("Hoy vamos a hacer un viaje muy especial. ¿Ves ese botón verde gigante que parpadea? ¡Tócalo con tu dedito para viajar en el tiempo conmigo!"), 1000);
    }, 500);

    const btn = document.getElementById('start-btn');
    if (btn) {
        btn.onclick = () => {
            const s1 = document.getElementById('scene-1');
            s1.classList.add('fade-out');
            setTimeout(() => { s1.classList.add('hidden'); loadJungleScene(); }, 1000);
        };
    }
}

/* --- Scene 2: Jungle --- */
function loadJungleScene() {
    const s2 = document.getElementById('scene-2');
    if (s2) {
        s2.classList.remove('hidden');
        say("Hemos viajado a la época de los dinosaurios. ¡Hace mucho calorcito y hay plantas gigantes!", true);
        setTimeout(() => say("Mira quiénes están ahí. ¡Toca a los dinosaurios para saludarlos y ver qué hacen!"), 2000);
    }
}

window.interactDino = (type, el) => {
    if (type === 'rex') { el.classList.add('animate-spin-once'); say("¡Es un Tiranosaurio! Pero tranquilo, solo está jugando.", true); setTimeout(() => el.classList.remove('animate-spin-once'), 600); }
    else if (type === 'diplo') { el.classList.add('animate-wiggle'); say("El Diplodocus tiene el cuello muy largo para comer las hojas más altas.", true); setTimeout(() => el.classList.remove('animate-wiggle'), 500); }
    else if (type === 'fly') { el.classList.add('animate-jump'); say("¡Mira cómo vuela! Ahora, toca la flecha gigante para seguir explorando.", true); setTimeout(() => el.classList.remove('animate-jump'), 500); }
    
    spawnParticles(el);
    if (!jungleState.found.includes(type)) {
        jungleState.found.push(type);
        if (jungleState.found.length === 3 && !jungleState.complete) {
            jungleState.complete = true;
            setTimeout(() => document.getElementById('next-arrow-2').classList.remove('hidden'), 1000);
        }
    }
};

function spawnParticles(target) {
    const r = target.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    for (let i = 0; i < 5; i++) {
        const p = document.createElement('div'); p.innerText = '❤️'; p.className = 'particle';
        p.style.left = (x + (Math.random() * 60 - 30)) + 'px'; p.style.top = (y + (Math.random() * 60 - 30)) + 'px';
        document.body.appendChild(p); setTimeout(() => p.remove(), 1000);
    }
}

/* --- Scene 3: Asteroid --- */
window.cargarEscenaAsteroide = () => {
    document.getElementById('scene-2').classList.add('hidden');
    document.getElementById('scene-3').classList.remove('hidden');
    say("El cielo ha cambiado de color... ¿Qué es esa luz brillante de allí arriba?", true);
    setTimeout(() => say("Es una roca gigante que viene del espacio. Se llama asteroide. ¡Toca la roca para ver qué pasa!"), 1000);
};

window.caidaAsteroide = () => {
    const ast = document.getElementById('asteroid');
    if (!ast) return;
    ast.classList.remove('animate-asteroid-slow');
    void ast.offsetWidth;
    ast.classList.add('animate-asteroid-fall');
    setTimeout(() => {
        document.getElementById('game-container').classList.add('animate-shake');
        document.getElementById('white-flash').style.opacity = '1';
        say("¡Qué golpe tan fuerte dio en la Tierra!", true);
        setTimeout(loadScene4, 2500);
    }, 750);
};

/* --- Scene 4: Dust Winter --- */
function loadScene4() {
    document.getElementById('scene-3').classList.add('hidden');
    const flash = document.getElementById('white-flash');
    flash.style.transition = "opacity 2s"; flash.style.opacity = '0';
    setTimeout(() => flash.style.display = 'none', 2000);

    const s4 = document.getElementById('scene-4');
    s4.classList.remove('hidden');
    setTimeout(() => {
        initCanvas(document.getElementById('dust-canvas'), dustState, '#2d2d2d', 180);
        say("Ese golpe levantó muchísimo polvo. ¡Tanto polvo que tapó al señor Sol!", true);
        setTimeout(() => say("Ahora hace mucho frío y está todo oscuro. Usa tu dedito para intentar limpiar el cielo y buscar el Sol."), 1000);
        setTimeout(() => {
            say("¡Es inútil! Las nubes no se van. Como no había luz del Sol, las plantitas no podían crecer y los dinosaurios grandes no tenían qué comer, así que tuvieron que irse a dormir para siempre. Toca la flecha para ver qué pasó después.", true);
            document.getElementById('next-arrow-4').classList.remove('hidden');
        }, 10000);
    }, 500); // More time to stabilize layout
}

/* --- Scene 5: Fossils --- */
window.cargarEscenaFosiles = () => {
    document.getElementById('scene-4').classList.add('hidden');
    const s5 = document.getElementById('scene-5');
    s5.classList.remove('hidden');
    setTimeout(() => {
        initCanvas(document.getElementById('earth-canvas'), fossilExcavation, '#654321', 140, true);
        say("Pero espera... ¡Los dinosaurios no desaparecieron del todo! Nos dejaron un tesoro escondido bajo la tierra.", true);
        setTimeout(() => say("¡Eres un gran excavador! Usa tu dedito para raspar la tierra marrón y descubre qué hay debajo."), 1000);
    }, 500);
};

/* --- Unified Canvas Logic with PRECISION Scaling --- */
function initCanvas(canvas, stateObj, color, size, isFossil = false) {
    if (!canvas) return;
    stateObj.canvas = canvas;
    stateObj.ctx = canvas.getContext('2d');
    
    // Use window dimensions directly for full screen canvases to avoid rect issues
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = stateObj.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const getPos = (e) => {
        const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
        const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
        // Since canvas is 100vw/100vh, screen coords match buffer coords
        return { x: clientX, y: clientY };
    };

    const draw = (e) => {
        if (!stateObj.isDrawing || (isFossil && stateObj.completed)) return;
        const p = getPos(e);
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = size; 
        ctx.lineCap = 'round'; 
        ctx.lineJoin = 'round';
        
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        
        ctx.beginPath(); 
        ctx.moveTo(p.x, p.y);
        
        if (isFossil) {
            digCounter++;
            if (digCounter > 120 && !stateObj.completed) finishExcavation();
        }
    };

    canvas.onmousedown = (e) => { stateObj.isDrawing = true; const p = getPos(e); stateObj.ctx.beginPath(); stateObj.ctx.moveTo(p.x, p.y); };
    canvas.onmousemove = draw;
    window.onmouseup = () => { stateObj.isDrawing = false; if(stateObj.ctx) stateObj.ctx.beginPath(); };
    
    canvas.addEventListener('touchstart', (e) => { 
        if(e.cancelable) e.preventDefault(); 
        stateObj.isDrawing = true; 
        const p = getPos(e); 
        stateObj.ctx.beginPath(); 
        stateObj.ctx.moveTo(p.x, p.y); 
    }, {passive: false});
    
    canvas.addEventListener('touchmove', (e) => { 
        if(e.cancelable) e.preventDefault(); 
        draw(e); 
    }, {passive: false});
    
    canvas.addEventListener('touchend', () => { 
        stateObj.isDrawing = false; 
        if(stateObj.ctx) stateObj.ctx.beginPath(); 
    });
}

function finishExcavation() {
    fossilExcavation.completed = true;
    fossilExcavation.canvas.style.transition = 'opacity 1s';
    fossilExcavation.canvas.style.opacity = '0';
    document.getElementById('fossil-hint').classList.add('hidden');
    say("¡Son sus huesos! Se llaman fósiles.", true);
    setTimeout(triggerFinalTransformation, 3000);
}

function triggerFinalTransformation() {
    say("Y, ¿sabes un secreto mágico? Algunos dinosaurios pequeñitos fueron cambiando mucho, mucho, muchísimo... ¡hasta convertirse en los pajaritos que hoy ves volar por tu ventana!", true);
    document.getElementById('fossil-skeleton').classList.add('transform-bird');
    setTimeout(() => {
        const bird = document.getElementById('final-bird');
        if (bird) {
            bird.style.opacity = '1';
            bird.style.transform = 'scale(1) translate(-50%, -50%)';
            bird.style.left = '50%';
            bird.style.top = '50%';
            bird.style.display = 'block';
            bird.style.zIndex = '100';
            setTimeout(() => {
                bird.classList.add('bird-fly-away');
            }, 2500);
        }
    }, 1500);
    
    setTimeout(() => {
        say("¡Qué gran aventura, explorador! Si quieres volver a viajar en el tiempo, ¡toca el botón de volver a jugar!");
        document.getElementById('restart-container').classList.remove('hidden');
        document.getElementById('restart-container').classList.add('flex');
    }, 12000);
}
