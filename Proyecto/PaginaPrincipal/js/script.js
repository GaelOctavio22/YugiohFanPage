// Al cargar la página, se establece la plantilla "Monstruo" por defecto y genera la carta.
window.addEventListener('load', function() {
    document.getElementById('cardType').value ='Monstruo';
    updateCardPreview(); // Actualiza la carta al cargar la página
});

// Función para dividir el texto y dibujarlo en el canvas
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');  // Dividimos el texto en palabras
    let line = '';
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
        // Intentamos añadir la palabra actual al final de la línea
        const testLine = line + words[n] + ' ';
        const testWidth = ctx.measureText(testLine).width;

        // Si la nueva línea excede el máximo de ancho, entonces dibujamos la línea actual y comenzamos una nueva
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y + (lineCount * lineHeight));  // Dibujamos la línea
            line = words[n] + ' ';  // Comenzamos una nueva línea
            lineCount++;  // Aumentamos el contador de líneas
        } else {
            line = testLine;  // Si no excede el ancho, seguimos añadiendo palabras a la línea actual
        }
    }

    // Finalmente dibujamos la última línea
    ctx.fillText(line, x, y + (lineCount * lineHeight));
}

// Función para dibujar las estrellas en el canvas según el nivel
function drawStars(ctx, level) {
    const starImg = new Image();
    starImg.src = 'assets/star.png';  // Ruta de la imagen de la estrella

    starImg.onload = function() {
        const starWidth = 28;  // Ancho de la estrella
        const starHeight = 28; // Alto de la estrella
        const startX = 350;    // Posición inicial en el eje X (coordenada horizontal)
        const startY = 72;     // Posición en el eje Y (coordenada vertical)

        // Dibuja las estrellas en una fila, asegurándonos de que cada estrella esté a la izquierda de la anterior
        for (let i = 0; i < level; i++) {
            // Ajusta la posición horizontal de la estrella sumando el ancho de la estrella en cada iteración
            const xPosition = startX - (i * (starWidth));  // Asegura el espaciado entre las estrellas
            ctx.drawImage(starImg, xPosition, startY, starWidth, starHeight);
        }
    };
}

// Función para dibujar ATK y DEF de derecha a izquierda
function drawATKDEF(ctx, text, x, y, maxWidth) {
    // Establecemos un tamaño de fuente estándar
    const fontSize = 17;
    ctx.font = `${fontSize}px YuGiOh-Bold`;
    // Medimos la longitud del texto
    const textWidth = ctx.measureText(text).width;
    
    // Si el texto se sale del margen, moverlo hacia la derecha
    let offsetX = x + maxWidth - textWidth;  // Calculamos el desplazamiento desde la derecha

    // Dibujamos el texto en la posición calculada
    ctx.fillText(text, offsetX, y);
}

// Función para actualizar la vista previa de la carta en tiempo real
function updateCardPreview() {
    const name = document.getElementById('cardName').value;
    const type = document.getElementById('cardType').value;
    const effect = document.getElementById('cardEffect').value;
    const cardImageInput = document.getElementById('cardImage');
    const cardLevel = parseInt(document.getElementById('cardLevel').value); // Obtener el nivel de la carta (número de estrellas)
    const cardAttack = parseInt(document.getElementById('cardAttack').value);
    const cardDefense = parseInt(document.getElementById('cardDefense').value);
    const canvas = document.getElementById('cardCanvas');
    const ctx = canvas.getContext('2d');

    // Limpiar el canvas antes de generar la carta
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Seleccionar la plantilla de acuerdo al tipo de carta
    let templateSrc = '';
    let cardTypeText = '';  // Aquí definimos el texto de la carta (Monstruo, Hechizo, Trampa)
    let attackDefText = '';  // Aquí pondremos el texto de ATK y DEF si es un monstruo

    // Establecer el texto para la carta según el tipo seleccionado
    if (type === 'Monstruo') {
        templateSrc = 'assets/images/monster-template.png';
        cardTypeText = '';  // Texto para la carta de Monstruo
        attackDefText = `ATK/${cardAttack} / DEF/${cardDefense}`;  // Asignar texto de ATK y DEF
    } else if (type === 'Hechizo') {
        templateSrc = 'assets/images/spell-template.png';
        cardTypeText = '[CARTA DE HECHIZO]';  // Texto para la carta de Hechizo
    } else if (type === 'Trampa') {
        templateSrc = 'assets/images/trap-template.png';
        cardTypeText = '[CARTA DE TRAMPA]';  // Texto para la carta de Trampa
    }

    // Cargar la plantilla y dibujarla en el canvas
    const templateImage = new Image();
    templateImage.onload = function() {
        // Dibuja la plantilla de carta en el canvas
        ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);

        // Ajustar el nombre de la carta dentro del área de la plantilla
        ctx.fillStyle = '#000000';
        ctx.font = '30px YuGiOh-Bold sans-serif';
        ctx.fillText(name, 27, 60, 370); // Ajuste para que no sobresalga

        // Aquí se ajusta el tipo de carta (Monstruo, Hechizo, Trampa)
        ctx.font = '22px YuGiOh-Bold sans-serif';
        ctx.fillText(cardTypeText, 118, 94.5); // Aquí se pone el texto [CARTA DE MONSTRUO], [CARTA DE HECHIZO], etc.

        // Ajustar el efecto de la carta dentro del área de la plantilla
        ctx.font = '20px YuGiOh-Bold sans-serif';
        wrapText(ctx, effect, 27, 480, 380, 18);

        // Dibujar las estrellas solo si es una carta de Monstruo
        if (type === 'Monstruo') {
            drawStars(ctx, cardLevel);  // Llamamos a la función para dibujar las estrellas

            // Dibujar el texto de ATK y DEF solo si es un monstruo
            drawATKDEF(ctx, `ATK/${cardAttack}`, 180, 576, 120);  // Posición para ATK
            drawATKDEF(ctx, `DEF/${cardDefense}`, 272, 576, 120); // Posición para DEF
        }

        // Verificar si el usuario subió una imagen
        if (cardImageInput.files && cardImageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const image = new Image();
                image.onload = function() {
                    // Ajuste para la imagen en el marco de la carta
                    const imageWidth = 324.1;
                    const imageHeight = 323.8;
                    const x = (canvas.width - imageWidth) / 2;  // Centrar la imagen
                    const y = 111.5;  // Ubicar la imagen en la zona correcta de la carta
                    ctx.drawImage(image, x, y, imageWidth, imageHeight);
                };
                image.src = e.target.result;
            };
            reader.readAsDataURL(cardImageInput.files[0]);
        }
    };
    templateImage.src = templateSrc;  // Asignar la fuente de la plantilla

    // Mostrar u ocultar los campos ATK y DEF según el tipo de carta
    const monsterStats = document.getElementById('monsterStats');
    if (type === 'Monstruo') {
        monsterStats.classList.remove('hidden');  // Mostrar los campos
    } else {
        monsterStats.classList.add('hidden');  // Ocultar los campos
    }
}

// Escuchar cambios en los campos del formulario para actualizar la carta en tiempo real
document.getElementById('cardName').addEventListener('input', updateCardPreview);
document.getElementById('cardType').addEventListener('change', updateCardPreview);
document.getElementById('cardEffect').addEventListener('input', updateCardPreview);
document.getElementById('cardImage').addEventListener('change', updateCardPreview);
document.getElementById('cardLevel').addEventListener('change', updateCardPreview);
document.getElementById('cardAttack').addEventListener('input', updateCardPreview);
document.getElementById('cardDefense').addEventListener('input', updateCardPreview);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('downloadCard').addEventListener('click', function() {
        const canvas = document.getElementById('cardCanvas');
        
        // Verificar si el canvas tiene contenido
        if (canvas.width === 0 || canvas.height === 0) {
            alert("El canvas está vacío o no tiene contenido. Asegúrate de generar la carta correctamente.");
            return;
        }
        
        console.log("Clic en el botón de descargar");  // Para depuración
        
        const link = document.createElement('a');
        link.download = 'carta_yugioh.png';
        link.href = canvas.toDataURL('Tu_Carta_yugioh.png');  // Convertir el canvas a imagen PNG
        
        // Asegúrate de agregar el enlace al DOM antes de hacer clic en él
        document.body.appendChild(link);
        
        // Forzar el clic en el enlace para iniciar la descarga
        link.click();
        
        // Después de hacer clic, eliminamos el enlace del DOM para no dejar residuos
        document.body.removeChild(link);
    });
});
// Función para manejar la publicación de la carta
document.getElementById('publishCard').addEventListener('click', function() {
    const name = document.getElementById('cardName').value;
    const type = document.getElementById('cardType').value;
    const effect = document.getElementById('cardEffect').value;
    const cardImageInput = document.getElementById('cardImage');
    const cardLevel = parseInt(document.getElementById('cardLevel').value);
    const cardAttack = parseInt(document.getElementById('cardAttack').value);
    const cardDefense = parseInt(document.getElementById('cardDefense').value);
    const canvas = document.getElementById('cardCanvas');
    
    // Verificar que el canvas no esté vacío
    if (canvas.width === 0 || canvas.height === 0) {
        alert("Genera primero la carta antes de publicarla.");
        return;
    }

    // Crear un objeto con los datos de la carta
    const newCard = {
        name: name,
        type: type,
        effect: effect,
        level: cardLevel,
        attack: cardAttack,
        defense: cardDefense,
        image: canvas.toDataURL(),  // Convertir el canvas a una imagen en formato base64
        likes: 0,
        dislikes: 0
    };

    // Obtener las cartas ya publicadas desde el localStorage
    const savedCards = JSON.parse(localStorage.getItem('publishedCard')) || [];

    // Agregar la nueva carta a las cartas guardadas
    savedCards.push(newCard);

    // Guardar las cartas en el localStorage
    localStorage.setItem('publishCard', JSON.stringify(savedCards));

    alert('Carta publicada correctamente!');
});

// Al cargar la página de cartas publicadas
window.addEventListener('load', function() {
    const savedCards = JSON.parse(localStorage.getItem('publishedCard')) || [];

    // Mostrar las cartas publicadas
    savedCards.forEach(function(card) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-item');
        
        const cardImage = document.createElement('img');
        cardImage.src = card.image;
        cardImage.alt = card.name;
        
        cardContainer.appendChild(cardImage);

        const likeButton = document.createElement('button');
        likeButton.textContent = `Me gusta (${card.likes})`;
        likeButton.addEventListener('click', function() {
            card.likes++;
            updateCardInStorage(savedCards);
            likeButton.textContent = `Me gusta (${card.likes})`;
        });

        const dislikeButton = document.createElement('button');
        dislikeButton.textContent = `No me gusta (${card.dislikes})`;
        dislikeButton.addEventListener('click', function() {
            card.dislikes++;
            updateCardInStorage(savedCards);
            dislikeButton.textContent = `No me gusta (${card.dislikes})`;
        });

        cardContainer.appendChild(likeButton);
        cardContainer.appendChild(dislikeButton);

        document.getElementById('publishedCard').appendChild(cardContainer);
    });
});

// Función para actualizar el localStorage con las cartas
function updateCardInStorage(cards) {
    localStorage.setItem('publishedCard', JSON.stringify(cards));
}
// Remove a specific item
localStorage.removeItem('publishCard');

// Clear all items
localStorage.clear();
