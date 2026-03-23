document.addEventListener('DOMContentLoaded', () => {
    init();
});

/* --- Global State --- */
let currentDino = null;
let allDinos = []; 
let state = {
    image: false, diet: false, hip: false, period: false, 
    reproduction: false, legs: false, size: false, name: false, location: false
};

const sounds = {
    correct: document.getElementById('sound-correct'),
    wrong: document.getElementById('sound-wrong'),
    win: document.getElementById('sound-win')
};

/* --- Initialization --- */
async function init() {
    try {
        const response = await fetch('data/list.json');
        allDinos = await response.json();
        renderSelectionScreen(allDinos);
        renderFossilSelection(allDinos);
        renderPuzzleSelection(allDinos);
        renderDiffSelection(allDinos);
        setupKeyboard();
        showScreen('main-menu');
    } catch (error) {
        console.error('Error loading dino list:', error);
    }
}

/* --- Navigation --- */
window.showScreen = (screenId) => {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');

    if (screenId === 'album-screen') {
        renderAlbum();
    }
};

window.speakText = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
};

/* --- Selection Screens --- */
function renderSelectionScreen(dinos) {
    const grid = document.getElementById('dino-grid');
    if (!grid) return;
    grid.innerHTML = '';
    dinos.forEach(dino => {
        const card = createDinoCard(dino, () => startActivity(dino.id));
        grid.appendChild(card);
    });
}

function renderFossilSelection(dinos) {
    const grid = document.getElementById('fossil-dino-grid');
    if (!grid) return;
    grid.innerHTML = '';
    dinos.forEach(dino => {
        const card = createDinoCard(dino, () => startFossilGame(dino));
        grid.appendChild(card);
    });
}

function renderPuzzleSelection(dinos) {
    const grid = document.getElementById('puzzle-dino-grid');
    if (!grid) return;
    grid.innerHTML = '';
    dinos.forEach(dino => {
        const card = createDinoCard(dino, () => startPuzzleGame(dino));
        grid.appendChild(card);
    });
}

function renderDiffSelection(dinos) {
    const grid = document.getElementById('differences-dino-grid');
    if (!grid) return;
    grid.innerHTML = '';
    dinos.forEach(dino => {
        const card = createDinoCard(dino, () => startDiffGame(dino));
        grid.appendChild(card);
    });
}

function createDinoCard(dino, onClick) {
    const card = document.createElement('div');
    card.className = 'dino-card';
    card.onclick = onClick;
    card.innerHTML = `<img src="${dino.image}" alt="${dino.name}"><h3>${dino.name}</h3>`;
    return card;
}

/* --- Main Activity Logic --- */
async function startActivity(id) {
    try {
        const response = await fetch(`data/${id}.json`);
        currentDino = await response.json();
        
        state = { 
            image: false, diet: false, hip: false, period: false, 
            reproduction: false, legs: false, size: false, name: false, location: false 
        };
        
        showScreen('activity-screen');
        document.getElementById('celebration-overlay').classList.add('hidden');
        
        // Reset specific UI elements
        document.getElementById('size-comparison').classList.add('hidden');
        document.getElementById('feeding-game').classList.add('hidden');
        document.querySelector('.mouth-icon').innerText = '😋';
        
        document.getElementById('dino-name-display').innerText = currentDino.name;
        document.getElementById('dino-meaning-display').innerText = `Significado: ${currentDino.significado}`;
        document.getElementById('name-input').innerText = '';

        const caracList = document.getElementById('caracteristicas-list');
        if (caracList) {
            caracList.innerHTML = currentDino.caracteristicas.map((f, i) => 
                `<div class="caracteristica-item"><span class="numero">${i+1}</span> ${f}</div>`
            ).join('');
        }

        setupImageOptions();
        setupTextOptions('diet', currentDino.options.diet, 'assets/icons/');
        setupTextOptions('hip', currentDino.options.hip, 'assets/icons/');
        setupTextOptions('period', currentDino.options.period, 'assets/icons/');
        setupTextOptions('reproduction', currentDino.options.reproduction, 'assets/icons/');
        setupTextOptions('legs', currentDino.options.legs, 'assets/icons/');
        setupSizeOptions();
        setupInteractiveMap();

    } catch (error) {
        console.error('Error loading dino data:', error);
    }
}

async function setupInteractiveMap() {
    const mapContainer = document.querySelector('.map-overlay-container');
    if (!mapContainer) return;
    
    try {
        const mapRes = await fetch('assets/icons/world_map_interactive.svg');
        const mapSVGText = await mapRes.text();
        mapContainer.innerHTML = mapSVGText;
        
        const svgElement = mapContainer.querySelector('svg');
        if (svgElement) {
            svgElement.setAttribute('preserveAspectRatio', 'none');
            svgElement.querySelectorAll('path').forEach(p => {
                p.style.pointerEvents = 'auto';
                p.style.cursor = 'pointer';
                
                p.addEventListener('click', function(e) {
                    console.log('CLICK en:', p.id, 'Target:', currentDino.location);
                    checkLocation(p.id, p);
                });
            });
        }
    } catch (err) {
        console.error('Error cargando mapa:', err);
    }
}

/* --- Options Setup & Verification --- */
function setupImageOptions() {
    const container = document.getElementById('image-options');
    if (!container) return;
    container.innerHTML = '';
    container.style.display = 'flex';
    document.getElementById('final-image').classList.add('hidden');

    const indices = currentDino.options.images.map((_, i) => i);
    shuffleArray(indices);

    indices.forEach(originalIndex => {
        const imgPath = currentDino.options.images[originalIndex];
        const btn = document.createElement('div');
        btn.className = 'image-option';
        btn.innerHTML = `<img src="${imgPath}">`;
        btn.onclick = () => checkImage(originalIndex, btn, imgPath);
        container.appendChild(btn);
    });
}

function setupTextOptions(category, options, iconPathBase) {
    const container = document.getElementById(`${category}-options`);
    if (!container) return;
    container.innerHTML = '';
    
    options.forEach(opt => {
        const btn = document.createElement('div');
        btn.className = 'option-btn';
        const icon = document.createElement('img');
        
        if (category === 'legs') {
            icon.src = `imagenes/${opt}patas.jpg`;
            btn.classList.add('full-image-btn');
        } else if (category === 'period') {
            const periodMap = { 'triasico': 'triasica', 'jurasico': 'jurasica', 'cretacico': 'cretacica' };
            icon.src = `imagenes/${periodMap[opt]}.jpg`;
            btn.classList.add('full-image-btn');
        } else if (category === 'reproduction') {
            const reproMap = { 'oviparo': 'huevo', 'viviparo': 'mama' };
            icon.src = `imagenes/${reproMap[opt]}.jpg`;
            btn.classList.add('full-image-btn');
        } else if (category === 'hip') {
            icon.src = `imagenes/${opt}.jpg`;
            btn.classList.add('full-image-btn');
        } else {
            icon.src = `${iconPathBase}${opt}.svg`;
        }

        const span = document.createElement('span');
        if (!['legs', 'hip', 'period', 'reproduction'].includes(category)) {
            span.innerText = opt.charAt(0).toUpperCase() + opt.slice(1);
        } else {
            span.style.display = 'none';
        }
        
        btn.appendChild(icon);
        btn.appendChild(span);
        btn.onclick = () => checkTextAnswer(category, opt, btn, container);
        container.appendChild(btn);
    });
}

function setupSizeOptions() {
    const container = document.getElementById('size-options');
    if (!container) return;
    container.innerHTML = currentDino.options.size.map(s => 
        `<div class="option-btn size-btn" onclick="checkSizeAnswer(${s}, this, this.parentNode)">
            <span style="font-size:1.3em;">${s} metros</span>
        </div>`
    ).join('');
}

function checkImage(index, element, imgPath) {
    if (state.image) return;
    if (index === currentDino.correct_image_index) {
        playSound('correct');
        element.classList.add('selected-correct');
        state.image = true;
        const finalDiv = document.getElementById('final-image');
        finalDiv.classList.remove('hidden');
        finalDiv.innerHTML = `<img src="${imgPath}" style="width:100%; max-width:300px; border-radius:15px; border:5px solid #76FF03;">`;
        document.getElementById('image-options').style.display = 'none';
        checkCompletion();
    } else {
        playSound('wrong');
        element.classList.add('selected-wrong');
        setTimeout(() => element.classList.remove('selected-wrong'), 500);
    }
}

function checkTextAnswer(category, value, element, container) {
    if (state[category]) return;
    if (value === currentDino[category]) {
        playSound('correct');
        element.classList.add('correct');
        state[category] = true;
        Array.from(container.children).forEach(child => {
            if (child !== element) {
                child.style.opacity = '0.5';
                child.style.pointerEvents = 'none';
            }
        });
        if (category === 'diet') document.getElementById('feeding-game').classList.remove('hidden');
        checkCompletion();
    } else {
        playSound('wrong');
        element.classList.add('wrong');
        setTimeout(() => element.classList.remove('wrong'), 500);
    }
}

function checkSizeAnswer(value, element, container) {
    if (state.size) return;
    if (value === currentDino.size) {
        playSound('correct');
        element.classList.add('correct');
        state.size = true;
        Array.from(container.children).forEach(child => {
            if (child !== element) {
                child.style.opacity = '0.5';
                child.style.pointerEvents = 'none';
            }
        });
        const comparison = document.getElementById('size-comparison');
        comparison.classList.remove('hidden');
        const dinoScale = document.getElementById('dino-scale-figure');
        dinoScale.style.fontSize = `${Math.min(200, 50 * (currentDino.size / 2))}px`;
        document.getElementById('size-fact-text').innerText = `¡El ${currentDino.name} mide como ${Math.round(currentDino.size)} niños juntos!`;
        checkCompletion();
    } else {
        playSound('wrong');
        element.classList.add('wrong');
        setTimeout(() => element.classList.remove('wrong'), 500);
    }
}

function checkLocation(regionId, element) {
    if (state.location) return;
    
    console.log('checkLocation llamado:', regionId, '==', currentDino.location);
    
    if (currentDino.location === regionId) {
        playSound('correct');
        element.style.fill = 'rgba(76, 255, 0, 0.9)';
        element.style.stroke = '#00ff00';
        element.style.strokeWidth = '6px';
        state.location = true;
        checkCompletion();
    } else {
        playSound('wrong');
        element.style.fill = 'rgba(255, 0, 0, 0.9)';
        element.style.stroke = '#ff0000';
        element.style.strokeWidth = '6px';
        setTimeout(() => {
            if (!state.location) {
                element.style.fill = '';
                element.style.stroke = '';
                element.style.strokeWidth = '';
            }
        }, 600);
    }
}

/* --- Feeding Game --- */
window.allowDrop = (ev) => { ev.preventDefault(); document.getElementById('dino-mouth').classList.add('drag-over'); };
window.dragFood = (ev) => { ev.dataTransfer.setData("foodType", ev.target.getAttribute('data-food')); };
window.dropFood = (ev) => {
    ev.preventDefault();
    const mouth = document.getElementById('dino-mouth');
    mouth.classList.remove('drag-over');
    const foodType = ev.dataTransfer.getData("foodType");
    if (foodType === currentDino.diet) {
        playSound('correct');
        document.querySelector('.mouth-icon').innerText = '😋 ¡NOM NOM!';
        startConfetti();
        setTimeout(stopConfetti, 2000);
    } else {
        playSound('wrong');
        document.querySelector('.mouth-icon').innerText = '🤢 ¡PUAG!';
        setTimeout(() => document.querySelector('.mouth-icon').innerText = '😋', 2000);
    }
};

/* --- Writing Game --- */
let writingGameState = { target: '', current: '', active: false };
window.openWritingGame = () => {
    const modal = document.getElementById('writing-modal');
    modal.classList.remove('hidden');
    writingGameState.target = currentDino.name.toUpperCase();
    writingGameState.current = '';
    writingGameState.active = true;
    document.getElementById('target-name-bg').innerText = writingGameState.target;
    document.getElementById('player-input').innerText = '';
    const container = document.getElementById('writing-keyboard');
    container.innerHTML = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM-'].map(row => 
        `<div class="keyboard-row">${row.split('').map(c => `<button class="key" onclick="handleWritingInput('${c}')">${c}</button>`).join('')}</div>`
    ).join('');
};

window.handleWritingInput = (char) => {
    if (!writingGameState.active) return;
    const target = writingGameState.target;
    let idx = writingGameState.current.length;
    while (idx < target.length && target[idx] === ' ') { writingGameState.current += ' '; idx++; }
    if (char === target[idx]) {
        writingGameState.current += char;
        document.getElementById('player-input').innerText = writingGameState.current;
        playSound('correct');
        if (writingGameState.current === target) {
            startConfetti(); playSound('win'); writingGameState.active = false;
            setTimeout(() => { stopConfetti(); document.getElementById('writing-modal').classList.add('hidden'); }, 4000);
        }
    } else {
        playSound('wrong');
    }
};

window.closeWritingGame = () => { document.getElementById('writing-modal').classList.add('hidden'); writingGameState.active = false; };

/* --- Fossil Game --- */
let fossilState = { isDrawing: false, ctx: null, canvas: null };
function startFossilGame(dino) {
    showScreen('fossils-screen');
    document.getElementById('fossil-setup').classList.add('hidden');
    document.getElementById('fossil-play-area').classList.remove('hidden');
    document.getElementById('fossil-target-name').innerText = dino.name;
    document.getElementById('skeleton-underlay').innerHTML = `<img src="${dino.image}" alt="Esqueleto" style="filter: sepia(1) brightness(0.8) contrast(1.2); opacity: 0.9;">`;
    const canvas = document.getElementById('sand-canvas');
    fossilState.canvas = canvas;
    const ctx = canvas.getContext('2d');
    fossilState.ctx = ctx;
    const rect = canvas.parentNode.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    ctx.fillStyle = '#C2B280'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#B0A070';
    for(let i=0; i<5000; i++) ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 60; ctx.lineCap = 'round';
    setupFossilListeners(canvas);
}

function setupFossilListeners(canvas) {
    const getPos = (e) => {
        const r = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - r.left, y: clientY - r.top };
    };
    const start = (e) => { fossilState.isDrawing = true; const p = getPos(e); fossilState.ctx.beginPath(); fossilState.ctx.moveTo(p.x, p.y); };
    const move = (e) => { if(fossilState.isDrawing) { const p = getPos(e); fossilState.ctx.lineTo(p.x, p.y); fossilState.ctx.stroke(); } };
    canvas.onmousedown = start; canvas.onmousemove = move; window.onmouseup = () => fossilState.isDrawing = false;
    canvas.ontouchstart = (e) => { e.preventDefault(); start(e); };
    canvas.ontouchmove = (e) => { e.preventDefault(); move(e); };
}

window.resetFossilGame = () => { document.getElementById('fossil-setup').classList.remove('hidden'); document.getElementById('fossil-play-area').classList.add('hidden'); };

/* --- Puzzle Game --- */
let puzzleState = { piecesPlaced: 0 };
function startPuzzleGame(dino) {
    showScreen('puzzle-screen');
    document.getElementById('puzzle-setup').classList.add('hidden');
    document.getElementById('puzzle-play-area').classList.remove('hidden');
    document.getElementById('puzzle-target-name').innerText = dino.name;
    const piecesContainer = document.getElementById('puzzle-pieces');
    piecesContainer.innerHTML = '';
    puzzleState.piecesPlaced = 0;
    const slots = document.querySelectorAll('.puzzle-slot');
    slots.forEach(slot => {
        slot.innerHTML = ''; slot.classList.remove('drag-over');
        slot.ondragover = (e) => { e.preventDefault(); slot.classList.add('drag-over'); };
        slot.ondragleave = () => slot.classList.remove('drag-over');
        slot.ondrop = (e) => {
            e.preventDefault(); slot.classList.remove('drag-over');
            const idx = e.dataTransfer.getData("idx");
            if (idx === slot.dataset.index) {
                const p = document.querySelector(`.puzzle-piece[data-index="${idx}"]`);
                p.classList.add('placed'); p.draggable = false; slot.appendChild(p);
                playSound('correct'); puzzleState.piecesPlaced++;
                if (puzzleState.piecesPlaced === 4) { startConfetti(); playSound('win'); setTimeout(stopConfetti, 3000); }
            } else { playSound('wrong'); }
        };
    });
    const indices = [0, 1, 2, 3]; shuffleArray(indices);
    const pos = ['0% 0%', '100% 0%', '0% 100%', '100% 100%'];
    indices.forEach(i => {
        const p = document.createElement('div');
        p.className = 'puzzle-piece'; p.draggable = true; p.dataset.index = i;
        p.style.backgroundImage = `url(${dino.image})`; 
        p.style.backgroundPosition = pos[i];
        p.style.backgroundSize = '200% 200%'; // Forced inline for debugging
        p.ondragstart = (e) => e.dataTransfer.setData("idx", i);
        piecesContainer.appendChild(p);
    });
}

window.resetPuzzleGame = () => { document.getElementById('puzzle-setup').classList.remove('hidden'); document.getElementById('puzzle-play-area').classList.add('hidden'); };

/* --- Differences Game --- */
let diffState = { found: [], targets: [] };

function startDiffGame(dino) {
    showScreen('differences-screen');
    document.getElementById('differences-setup').classList.add('hidden');
    document.getElementById('differences-play-area').classList.remove('hidden');
    document.getElementById('diff-found').innerText = '0';
    diffState.found = [];
    
    document.getElementById('diff-img-orig').src = dino.image;
    document.getElementById('diff-img-modified').src = dino.image;
    
    const area = document.getElementById('diff-target-area');
    // Limpiar todo excepto la imagen
    area.innerHTML = `<img id="diff-img-modified" src="${dino.image}" alt="Modificado">`;
    
    // Generar 3 diferencias visuales (iconos intrusos)
    diffState.targets = [];
    const icons = ['⚽', '🎈', '🎩', '👓', '🦋', '🍄'];
    
    for(let i=0; i<3; i++) {
        const icon = icons[Math.floor(Math.random() * icons.length)];
        const x = Math.floor(Math.random() * 80) + 10; // 10-90%
        const y = Math.floor(Math.random() * 80) + 10;
        
        diffState.targets.push({x, y, id: i});
        
        const el = document.createElement('div');
        el.className = 'diff-intruder';
        el.innerText = icon;
        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        el.dataset.id = i;
        el.onclick = (e) => {
            e.stopPropagation(); // Evitar doble click si el contenedor tiene listener
            foundDifference(i, el);
        };
        area.appendChild(el);
    }
}

function foundDifference(id, element) {
    if (diffState.found.includes(id)) return;
    
    diffState.found.push(id);
    playSound('correct');
    
    element.classList.add('found');
    element.style.border = '3px solid #76FF03';
    element.style.borderRadius = '50%';
    element.style.backgroundColor = 'rgba(118, 255, 3, 0.3)';
    
    document.getElementById('diff-found').innerText = diffState.found.length;
    
    if (diffState.found.length === 3) {
        startConfetti();
        playSound('win');
        setTimeout(stopConfetti, 3000);
    }
}

window.resetDiffGame = () => { document.getElementById('differences-setup').classList.remove('hidden'); document.getElementById('differences-play-area').classList.add('hidden'); };

/* --- Sticker Album --- */
function getCollectedDinos() { return JSON.parse(localStorage.getItem('collected_dinos') || '[]'); }
function saveCollectedDino(id) {
    const c = getCollectedDinos();
    if (!c.includes(id)) { c.push(id); localStorage.setItem('collected_dinos', JSON.stringify(c)); }
}
function renderAlbum() {
    const grid = document.getElementById('album-grid');
    const collected = getCollectedDinos();
    grid.innerHTML = allDinos.map(d => {
        const isC = collected.includes(d.id);
        return `<div class="sticker ${isC ? 'collected' : ''}">
            <img src="${d.image}" style="${isC ? '' : 'filter: brightness(0) opacity(0.3);'}">
            <p class="dino-name">${isC ? d.name : '???'}</p>
            ${isC ? '' : '<span class="new-badge" style="background:#666; animation:none;">BLOQUEADO</span>'}
        </div>`;
    }).join('');
    document.getElementById('collected-count').innerText = collected.length;
    document.getElementById('total-count').innerText = allDinos.length;
    document.getElementById('album-progress-bar').style.width = `${(collected.length / allDinos.length) * 100}%`;
}
window.resetAlbum = () => { if(confirm('¿Borrar cromos?')) { localStorage.removeItem('collected_dinos'); renderAlbum(); } };

/* --- Signature & Keyboard --- */
function setupKeyboard() {
    const container = document.getElementById('keyboard-container');
    const input = document.getElementById('name-input');
    if (!container || !input) return;
    container.innerHTML = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'].map(row => 
        `<div class="keyboard-row">${row.split('').map(c => `<button class="key" onclick="addLetter('${c}')">${c}</button>`).join('')}</div>`
    ).join('') + `<div class="keyboard-row"><button class="key key-space" onclick="addLetter(' ')">&nbsp;</button><button class="key key-delete" onclick="clearLetters()">🗑️</button></div>`;
}
window.addLetter = (c) => { 
    const input = document.getElementById('name-input');
    input.innerText += c;
    if (input.innerText.trim().length > 2) { state.name = true; checkCompletion(); }
};
window.clearLetters = () => { document.getElementById('name-input').innerText = ''; state.name = false; };

function checkCompletion() {
    if (state.image && state.diet && state.hip && state.period && state.size && state.name && state.location && state.reproduction && state.legs) {
        saveCollectedDino(currentDino.id);
        
        // Configurar el cromo en el overlay de celebración
        const cromoImg = document.getElementById('celebration-cromo');
        const cromoName = document.getElementById('celebration-dino-name');
        if (cromoImg && cromoName) {
            cromoImg.src = currentDino.image || `assets/images/${currentDino.id}.png`;
            cromoName.innerText = currentDino.name;
        }

        setTimeout(() => { 
            playSound('win'); 
            document.getElementById('celebration-overlay').classList.remove('hidden'); 
        }, 1000);
    }
}

/* --- Coloring Logic --- */
let coloringState = { canvas: null, ctx: null, isDrawing: false, currentTool: 'pencil', currentColor: '#F44336', brushSize: 5, baseImage: null };
window.openColoring = () => {
    if (!currentDino) return;
    document.getElementById('coloring-modal').classList.remove('hidden');
    document.querySelector('.coloring-header h2').innerText = `¡Colorea a ${currentDino.name}!`;
    setTimeout(initColoringCanvas, 100);
};
function initColoringCanvas() {
    const canvas = document.getElementById('coloring-canvas');
    coloringState.canvas = canvas;
    coloringState.ctx = canvas.getContext('2d');
    const container = document.querySelector('.canvas-container');
    const w = container.clientWidth; const h = container.clientHeight;
    canvas.width = w * 2; canvas.height = h * 2;
    coloringState.ctx.scale(2, 2);
    const img = new Image();
    img.src = `dinos_colorear/${currentDino.options.images[0].split('/').pop()}`;
    img.onload = () => { coloringState.baseImage = img; clearCanvas(); };
    img.onerror = () => { coloringState.baseImage = null; clearCanvas(); };
    setupPalette();
    if (!coloringState.hasListeners) { addColoringListeners(); coloringState.hasListeners = true; }
}
function setupPalette() {
    const p = document.getElementById('color-palette');
    p.innerHTML = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#000000', '#FFFFFF'].map(c => 
        `<div class="color-swatch" style="background-color:${c}" onclick="setColor('${c}', this)"></div>`
    ).join('');
}
window.setColor = (c, el) => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active'); coloringState.currentColor = c;
    if (coloringState.currentTool === 'eraser') setTool('pencil');
};
window.setTool = (t) => {
    coloringState.currentTool = t;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tool-${t}`).classList.add('active');
};
window.clearCanvas = () => {
    const ctx = coloringState.ctx; const w = coloringState.canvas.width/2; const h = coloringState.canvas.height/2;
    ctx.clearRect(0,0,w,h); ctx.fillStyle='white'; ctx.fillRect(0,0,w,h);
    if(coloringState.baseImage) {
        const s = Math.min(w/coloringState.baseImage.width, h/coloringState.baseImage.height)*0.9;
        ctx.drawImage(coloringState.baseImage, (w-coloringState.baseImage.width*s)/2, (h-coloringState.baseImage.height*s)/2, coloringState.baseImage.width*s, coloringState.baseImage.height*s);
    }
};
function addColoringListeners() {
    const c = coloringState.canvas;
    const getP = (e) => {
        const r = c.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (cx-r.left)*(c.width/r.width)/2, y: (cy-r.top)*(c.height/r.height)/2 };
    };
    const start = (e) => {
        coloringState.isDrawing = true; const p = getP(e);
        if(coloringState.currentTool==='bucket') { floodFill(p.x, p.y, coloringState.currentColor); coloringState.isDrawing=false; }
        else { coloringState.ctx.beginPath(); coloringState.ctx.moveTo(p.x, p.y); }
    };
    const move = (e) => {
        if(!coloringState.isDrawing) return; const p = getP(e); const ctx = coloringState.ctx;
        ctx.lineWidth = coloringState.brushSize; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = coloringState.currentTool === 'eraser' ? '#FFFFFF' : coloringState.currentColor;
        ctx.lineTo(p.x, p.y); ctx.stroke();
    };
    c.onmousedown = start; c.onmousemove = move; window.onmouseup = () => coloringState.isDrawing = false;
    c.ontouchstart = (e) => { e.preventDefault(); start(e); };
    c.ontouchmove = (e) => { e.preventDefault(); move(e); };
}
function floodFill(sx, sy, color) {
    const ctx = coloringState.ctx; const canvas = coloringState.canvas;
    const x = Math.floor(sx*2); const y = Math.floor(sy*2);
    const imgData = ctx.getImageData(0,0,canvas.width,canvas.height); const data = imgData.data;
    const r = parseInt(color.slice(1,3),16); const g = parseInt(color.slice(3,5),16); const b = parseInt(color.slice(5,7),16);
    const pos = (y*canvas.width+x)*4; const sr=data[pos], sg=data[pos+1], sb=data[pos+2], sa=data[pos+3];
    if(sr===r && sg===g && sb===b) return; if(sr<50 && sg<50 && sb<50) return;
    const stack = [[x,y]];
    while(stack.length > 0) {
        const [cx, cy] = stack.pop(); const p = (cy*canvas.width+cx)*4;
        if(cx>=0 && cx<canvas.width && cy>=0 && cy<canvas.height && Math.abs(data[p]-sr)<30 && Math.abs(data[p+1]-sg)<30 && Math.abs(data[p+2]-sb)<30) {
            data[p]=r; data[p+1]=g; data[p+2]=b; data[p+3]=255;
            stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
        }
    }
    ctx.putImageData(imgData,0,0);
}
window.closeColoring = () => document.getElementById('coloring-modal').classList.add('hidden');
window.printDino = () => { const w = window.open(''); w.document.write(`<img src="${coloringState.canvas.toDataURL()}" onload="window.print();window.close()">`); };
window.saveDino = () => { const l = document.createElement('a'); l.download = `dino.png`; l.href = coloringState.canvas.toDataURL(); l.click(); };

/* --- Utils --- */
function playSound(t) { if(sounds[t]) { sounds[t].currentTime=0; sounds[t].play().catch(()=>{}); } }
function shuffleArray(a) { for(let i=a.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } }
function startConfetti() {
    const c = document.getElementById('confetti-canvas'); const ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const p = Array.from({length:300}, () => ({x:Math.random()*c.width, y:Math.random()*c.height-c.height, r:Math.random()*360, s:Math.random()*0.5+0.5, c:['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#00bcd4','#009688','#4caf50','#8bc34a','#cddc39','#ffeb3b','#ffc107','#ff9800','#ff5722'][Math.floor(Math.random()*16)], v:Math.random()*3+2}));
    window.confettiInterval = setInterval(() => {
        ctx.clearRect(0,0,c.width,c.height);
        p.forEach(i => {
            ctx.save(); ctx.translate(i.x, i.y); ctx.rotate(i.r*Math.PI/180); ctx.scale(i.s, i.s); ctx.fillStyle=i.c; ctx.fillRect(-5,-5,10,10); ctx.restore();
            i.y += i.v; i.r += i.v; if(i.y > c.height) { i.y=-10; i.x=Math.random()*c.width; }
        });
    }, 16);
}
function stopConfetti() { clearInterval(window.confettiInterval); const c=document.getElementById('confetti-canvas'); c.getContext('2d').clearRect(0,0,c.width,c.height); }

/* --- Story --- */
window.openStory = () => {
    const m = document.getElementById('story-modal'); m.classList.remove('hidden');
    m.querySelector('#story-title').innerText = `Cuento de ${currentDino.name}`;
    document.getElementById('story-iframe').src = `cuentos/${currentDino.cuento}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
    document.getElementById('download-story-btn').href = `cuentos/${currentDino.cuento}`;
};
window.closeStory = () => { document.getElementById('story-modal').classList.add('hidden'); document.getElementById('story-iframe').src=''; };
