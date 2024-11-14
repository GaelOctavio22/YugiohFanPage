document.addEventListener('DOMContentLoaded', function() {
    const savedCards = JSON.parse(localStorage.getItem('cards')) || [];

    // Función para mostrar la carta
    function displayCard(card) {
        const newCardContainer = document.createElement('div');
        newCardContainer.classList.add('card-item');

        const cardImageElement = document.createElement('img');
        cardImageElement.src = card.image;
        cardImageElement.alt = "Carta Generada";

        newCardContainer.appendChild(cardImageElement);

        const likeBtn = document.createElement('button');
        likeBtn.innerText = `Like (${card.likes})`;
        likeBtn.classList.add('like-btn');
        const dislikeBtn = document.createElement('button');
        dislikeBtn.innerText = `Dislike (${card.dislikes})`;
        dislikeBtn.classList.add('dislike-btn');

        likeBtn.addEventListener('click', function() {
            card.likes++;
            updateCardInStorage(savedCards);
            likeBtn.innerText = `Like (${card.likes})`;
        });

        dislikeBtn.addEventListener('click', function() {
            card.dislikes++;
            updateCardInStorage(savedCards);
            dislikeBtn.innerText = `Dislike (${card.dislikes})`;
        });

        newCardContainer.appendChild(likeBtn);
        newCardContainer.appendChild(dislikeBtn);

        document.getElementById('publishedCards').appendChild(newCardContainer);
    }

    // Función para actualizar el localStorage
    function updateCardInStorage(cards) {
        localStorage.setItem('cards', JSON.stringify(cards));
    }

    // Cargar las cartas guardadas
    savedCards.forEach(card => displayCard(card));

    // Filtrar y ordenar
    document.getElementById('applyFilter').addEventListener('click', function() {
        const selectedCriteria = document.getElementById('sortBy').value;
        const sortedCards = [...savedCards].sort((a, b) => b[selectedCriteria] - a[selectedCriteria]);

        document.getElementById('publishedCards').innerHTML = '';
        sortedCards.forEach(card => displayCard(card));
    });
});
