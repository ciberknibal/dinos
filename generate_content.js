const fs = require('fs');

const dinos = [
    { id: 'riojasaurus', name: 'Riojasaurio', significado: 'Lagarto de La Rioja', cuento: 'riojasaurio.pdf', period: 'triasico', diet: 'herbivoro', hip: 'saurisquio', location: 'sa', color: '#8D6E63', size: 10, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Era muy largo como un autobús!', 'Comía plantas todo el día', 'Vivió en La Rioja, España'] },
    { id: 'trex', name: 'T-Rex', significado: 'Rey de los lagartos tiranos', cuento: 'trex.pdf', period: 'cretacico', diet: 'carnivoro', hip: 'saurisquio', location: 'na', color: '#EF5350', size: 12, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Tenía dientes enormes como plátanos!', 'Era el rey de los dinosaurios', 'Corría muy rápido para cazar'] },
    { id: 'triceratops', name: 'Triceratops', significado: 'Cara de tres cuernos', cuento: 'triceratops.pdf', period: 'cretacico', diet: 'herbivoro', hip: 'ornitisquio', location: 'na', color: '#FFA726', size: 9, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Tenía tres cuernos grandes!', 'Su cabeza era como un escudo', 'Era amigo de los otros herbívoros'] },
    { id: 'velociraptor', name: 'Velociraptor', significado: 'Ladrón veloz', cuento: 'velociraptor.pdf', period: 'cretacico', diet: 'carnivoro', hip: 'saurisquio', location: 'asia', color: '#AB47BC', size: 2, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Era pequeño pero muy listo!', 'Corría súper rápido', 'Tenía garras afiladas en las patas'] },
    { id: 'stegosaurus', name: 'Stegosaurus', significado: 'Lagarto con tejado', cuento: 'stegosarus.pdf', period: 'jurasico', diet: 'herbivoro', hip: 'ornitisquio', location: 'na', color: '#66BB6A', size: 9, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Tenía placas en la espalda!', 'Su cola tenía pinchos para defenderse', 'Comía plantas bajitas'] },
    { id: 'brachiosaurus', name: 'Brachiosaurus', significado: 'Lagarto brazo', cuento: 'brachiosaruio.pdf', period: 'jurasico', diet: 'herbivoro', hip: 'saurisquio', location: 'na', color: '#26C6DA', size: 26, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Era altísimo como un edificio!', 'Su cuello llegaba a los árboles altos', 'Pesaba como 12 elefantes'] },
    { id: 'spinosaurus', name: 'Spinosaurus', significado: 'Lagarto de espina', cuento: 'spinosaurio.pdf', period: 'cretacico', diet: 'carnivoro', hip: 'saurisquio', location: 'afr', color: '#EC407A', size: 15, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Tenía una vela gigante en la espalda!', 'Le gustaba nadar y pescar', 'Era más grande que el T-Rex'] },
    { id: 'ankylosaurus', name: 'Ankylosaurus', significado: 'Lagarto acorazado', cuento: 'ankylosaurio.pdf', period: 'cretacico', diet: 'herbivoro', hip: 'ornitisquio', location: 'na', color: '#8D6E63', size: 8, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Estaba cubierto de armadura!', 'Su cola era como un martillo gigante', 'Era como un tanque de guerra'] },
    { id: 'pteranodon', name: 'Pteranodon', significado: 'Ala sin dientes', cuento: 'pteranodon.pdf', period: 'cretacico', diet: 'carnivoro', hip: 'saurisquio', location: 'na', color: '#7E57C2', size: 6, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Podía volar como un avión!', 'Tenía un pico largo sin dientes', 'Sus alas eran enormes'] },
    { id: 'diplodocus', name: 'Diplodocus', significado: 'Doble viga', cuento: 'diplodocus.pdf', period: 'jurasico', diet: 'herbivoro', hip: 'saurisquio', location: 'na', color: '#29B6F6', size: 27, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Era el dinosaurio más largo!', 'Su cola era como un látigo', 'Tenía el cuello larguísimo'] },
    { id: 'allosaurus', name: 'Allosaurus', significado: 'Lagarto extraño', cuento: 'allosaurus.pdf', period: 'jurasico', diet: 'carnivoro', hip: 'saurisquio', location: 'na', color: '#FF7043', size: 10, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Era un gran cazador!', 'Tenía dientes afilados como cuchillos', 'Cazaba en grupo con sus amigos'] },
    { id: 'parasaurolophus', name: 'Parasaurolophus', significado: 'Cercano al lagarto con cresta', cuento: 'parasaurolophus.pdf', period: 'cretacico', diet: 'herbivoro', hip: 'ornitisquio', location: 'na', color: '#FFCA28', size: 10, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Tenía una cresta como trompeta!', 'Hacía sonidos para hablar', 'Vivía cerca del agua'] },
    { id: 'gallimimus', name: 'Gallimimus', significado: 'Imitador de gallina', cuento: 'gallimimus.pdf', period: 'cretacico', diet: 'herbivoro', hip: 'saurisquio', location: 'asia', color: '#9CCC65', size: 6, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Parecía un avestruz gigante!', 'Corría muy muy rápido', 'No tenía dientes'] },
    { id: 'iguanodon', name: 'Iguanodon', significado: 'Diente de iguana', cuento: 'iguanodon.pdf', period: 'cretacico', diet: 'herbivoro', hip: 'ornitisquio', location: 'eur', color: '#5C6BC0', size: 10, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Tenía pulgares con púas!', 'Podía andar a dos o cuatro patas', 'Vivía en Europa'] },
    { id: 'carnotaurus', name: 'Carnotaurus', significado: 'Toro carnívoro', cuento: 'carnotaurus.pdf', period: 'cretacico', diet: 'carnivoro', hip: 'saurisquio', location: 'sa', color: '#D32F2F', size: 8, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Tenía dos cuernos como un toro!', 'Sus brazos eran muy pequeñitos', 'Corría muy rápido'] },
    { id: 'archaeopteryx', name: 'Archaeopteryx', significado: 'Ala antigua', cuento: 'archaeropteryx.pdf', period: 'jurasico', diet: 'carnivoro', hip: 'saurisquio', location: 'eur', color: '#78909C', size: 1, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Era mitad dinosaurio, mitad pájaro!', 'Tenía plumas de colores', 'Era pequeñito como una paloma'] },
    { id: 'pachycephalosaurus', name: 'Pachycephalosaurus', significado: 'Lagarto de cabeza gruesa', cuento: 'pachycephalosaurus.pdf', period: 'cretacico', diet: 'herbivoro', hip: 'ornitisquio', location: 'na', color: '#8D6E63', size: 5, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Tenía la cabeza super dura!', 'Chocaba cabezas como los carneros', 'Su cráneo era muy grueso'] },
    { id: 'dilophosaurus', name: 'Dilophosaurus', significado: 'Lagarto de dos crestas', cuento: 'dilophosaurus.pdf', period: 'jurasico', diet: 'carnivoro', hip: 'saurisquio', location: 'na', color: '#43A047', size: 7, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Tenía dos crestas en la cabeza!', 'Era muy rápido y ágil', 'Cazaba animales pequeños'] },
    { id: 'argentinosaurus', name: 'Argentinosaurus', significado: 'Lagarto de Argentina', cuento: 'argentinodaurus..pdf', period: 'cretacico', diet: 'herbivoro', hip: 'saurisquio', location: 'sa', color: '#5D4037', size: 35, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Era el dinosaurio más grande del mundo!', 'Pesaba como 15 elefantes', 'Vivió en Argentina'] },
    { id: 'baryonyx', name: 'Baryonyx', significado: 'Garra pesada', cuento: 'baryonyx.pdf', period: 'cretacico', diet: 'carnivoro', hip: 'saurisquio', location: 'eur', color: '#00897B', size: 10, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Le encantaba comer pescado!', 'Tenía garras enormes', 'Su hocico era como el de un cocodrilo'] },
    { id: 'compsognathus', name: 'Compsognathus', significado: 'Mandíbula elegante', cuento: 'compsognathus.pdf', period: 'jurasico', diet: 'carnivoro', hip: 'saurisquio', location: 'eur', color: '#E91E63', size: 1, reproduction: 'oviparo', hasPhoto: true, caracteristicas: ['¡Era pequeñito como un gato!', 'Era el dinosaurio más chiquitín', 'Corría muy rápido'] }
];

// Función para generar opciones de tamaño incorrectas
function generateSizeOptions(correctSize) {
    const options = [correctSize];
    
    // Generar 2 opciones incorrectas
    while (options.length < 3) {
        let wrongSize;
        if (correctSize <= 5) {
            // Para dinos pequeños, variar entre 1-15
            wrongSize = Math.floor(Math.random() * 14) + 1;
        } else if (correctSize <= 15) {
            // Para dinos medianos, variar +/- 5-10
            const variation = Math.floor(Math.random() * 10) + 3;
            wrongSize = correctSize + (Math.random() > 0.5 ? variation : -variation);
            wrongSize = Math.max(1, wrongSize);
        } else {
            // Para dinos grandes, variar +/- 10-20
            const variation = Math.floor(Math.random() * 15) + 5;
            wrongSize = correctSize + (Math.random() > 0.5 ? variation : -variation);
            wrongSize = Math.max(5, wrongSize);
        }
        
        wrongSize = Math.round(wrongSize);
        if (!options.includes(wrongSize) && wrongSize > 0) {
            options.push(wrongSize);
        }
    }
    
    // Mezclar las opciones
    return options.sort(() => Math.random() - 0.5);
}

// Generate List
const list = dinos.map(d => ({
    id: d.id,
    name: d.name,
    image: d.hasPhoto ? `assets/images/${d.id}.png` : `assets/images/${d.id}.svg`
}));

fs.writeFileSync('data/list.json', JSON.stringify(list, null, 2));

// Generate JSONs
dinos.forEach(d => {
    const otherDinos = dinos.filter(other => other.id !== d.id);
    const shuffled = otherDinos.sort(() => Math.random() - 0.5);
    const wrongOptions = shuffled.slice(0, 2);
    
    // Generar opciones de tamaño
    const sizeOptions = generateSizeOptions(d.size);
    
    const data = {
        id: d.id,
        name: d.name,
        significado: d.significado,
        cuento: d.cuento,
        period: d.period,
        diet: d.diet,
        hip: d.hip,
        location: d.location,
        size: d.size,
        reproduction: d.reproduction,
        caracteristicas: d.caracteristicas,
        description: `El ${d.name} significa "${d.significado}". Medía ${d.size} metros y vivió en el periodo ${d.period}.`,
        options: {
            period: ["triasico", "jurasico", "cretacico"],
            diet: ["herbivoro", "carnivoro"],
            hip: ["saurisquio", "ornitisquio"],
            reproduction: ["oviparo", "viviparo"],
            size: sizeOptions,
            images: [
                d.hasPhoto ? `assets/images/${d.id}.png` : `assets/images/${d.id}.svg`,
                wrongOptions[0].hasPhoto ? `assets/images/${wrongOptions[0].id}.png` : `assets/images/${wrongOptions[0].id}.svg`,
                wrongOptions[1].hasPhoto ? `assets/images/${wrongOptions[1].id}.png` : `assets/images/${wrongOptions[1].id}.svg`
            ]
        },
        correct_image_index: 0
    };
    fs.writeFileSync(`data/${d.id}.json`, JSON.stringify(data, null, 2));
});

console.log('✅ Contenido generado con reproducción y fotos reales!');