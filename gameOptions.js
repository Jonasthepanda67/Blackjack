document.addEventListener('DOMContentLoaded', () => {
    const joinButtons = document.querySelectorAll(".join-button");
    const avatarModal = document.getElementById("avatar-modal");
    const closeModal = document.querySelector(".close");
    const avatarOptions = document.querySelectorAll(".avatar-option");
    const confirmAvatarButton = document.getElementById("confirm-avatar");
    //const startGameButton = document.getElementById("startGameButton");
    const chipImages = document.querySelectorAll(".chip");
    const potDisplay = document.getElementById("pot");
    let selectedAvatar = null;
    let currentButtonIndex = null;
    let currentPlayerIndex = null;
    let pot = 0;

    document.getElementById("cardTypeSelect").addEventListener("change", function() {
        const selectedCardType = this.value;
        initializeDeck(selectedCardType);
    });

    joinButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            avatarModal.style.display = "block";
            currentButtonIndex = index;
        });
    });

    closeModal.addEventListener("click", () => {
        avatarModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === avatarModal) {
            avatarModal.style.display = "none";
        }
    });

    avatarOptions.forEach(option => {
        option.addEventListener("click", () => {
            avatarOptions.forEach(opt => opt.classList.remove("selected"));
            option.classList.add("selected");
            selectedAvatar = option.dataset.avatar;
            confirmAvatarButton.disabled = false;
        });
    });

    confirmAvatarButton.addEventListener("click", () => {
        if (selectedAvatar && currentButtonIndex !== null) {
            const playerSeat = document.getElementById(`gameoptions-player${currentButtonIndex + 1}`);
            if (playerSeat) {
                playerSeat.classList.remove("gray-out");
                
                const avatarImg = playerSeat.querySelector(".avatar-img");
                if (avatarImg) {
                    avatarImg.src = selectedAvatar;
                    avatarImg.alt = selectedAvatar;
                }

                const wager = playerSeat.querySelector(".wager");
                if (wager) {
                    wager.textContent = "Wager: $0"
                }
                joinButtons[currentButtonIndex].style.display = "none";

                sessionStorage.setItem(`player${currentButtonIndex + 1}-avatar`, selectedAvatar);
                avatarModal.style.display = "none";

                currentPlayerIndex = currentButtonIndex;

                if (currentPlayerIndex === null) {
                    currentPlayerIndex = currentButtonIndex;
                }
            }
        } else {
            alert("Please select an avatar before confirming")
        }
    });

    chipImages.forEach(chip => {
        chip.addEventListener("click", () => {
            const chipValue = parseInt(chip.dataset.value, 10);
            if (!isNaN(chipValue)) {
                placeBet(chipValue);
            }
        });
    });

    function placeBet(amount) {
        if (currentPlayerIndex === null) return; // No player joined

        const playerSeat = document.getElementById(`gameoptions-player${currentPlayerIndex + 1}`);
        if (playerSeat) {
            const playerBalanceEl = playerSeat.querySelector(".player-info");
            const playerWagerEl = playerSeat.querySelector(".wager");

            // Parse and update player balance
            let playerBalance = parseInt(playerBalanceEl.textContent.replace("$", ""), 10);
            let playerWager = parseInt(playerWagerEl.textContent.replace("Wager: $", ""), 10);

            if (playerBalance >= amount) {
                playerBalance -= amount;
                playerWager += amount;
                pot += amount;

                // Update display values
                playerBalanceEl.textContent = `$${playerBalance}`;
                playerWagerEl.textContent = `Wager: $${playerWager}`;
                potDisplay.textContent = `Pot: $${pot}`;
            } else {
                alert("Insufficient balance to place this bet.");
            }
        }
    }

    document.querySelector(".start-game-btn").addEventListener("click", () => {
        const playerData = [];
        //const players = [];

        document.querySelectorAll('.gameoptions-player-seat').forEach(playerSeat => {
            const playerName = playerSeat.querySelector('.player-name').value;
            const playerBalance = parseInt(playerSeat.querySelector('.player-info').innerText.replace('$', '')) || 250;
            const playerWager = parseInt(playerSeat.querySelector('.wager').innerText.replace('Wager: $', '')) || 0;
            const playerAvatar = playerSeat.querySelector('.avatar-img').src;

            playerData.push({
                name: playerName,
                balance: playerBalance,
                wager: playerWager,
                avatar: playerAvatar,
                cards: []
            });
        });

        /*joinButtons.forEach((button, index) => {
            const playerSeat = document.getElementById(`gameoptions-player${index + 1}`);
            const avatar = sessionStorage.getItem(`player${index + 1}-avatar`);
            const balance = parseInt(playerSeat.querySelector(".player-info").textContent.replace("$", ""), 10);
            const wager = parseInt(playerSeat.querySelector(".wager").textContent.replace("Wager: $", ""), 10);

            if (avatar) {
                playerData.push({
                    index: index,
                    avatar: avatar,
                    balance: balance,
                    wager: wager
                });
            }
        });*/

        sessionStorage.setItem("players", JSON.stringify(playerData));
        sessionStorage.setItem("selectedCardType", document.getElementById("cardTypeSelect").value);
        sessionStorage.setItem("pot", document.getElementById("pot").innerText.replace("Pot: $", ""));

        alert(`Game starting!`);
        window.location.href = "index.html";
    });
});

function initializeDeck(cardType) {
    const gameCards = document.querySelectorAll(".game-card");
    const imagePath = `../Card_Images/${cardType}/`;

    gameCards.forEach((card, index) => {
        const cardValues = ["ace", "king"];
        const cardSuits = ["spades", "diamonds"];
        const cardName = `${cardSuits[index]}_${cardValues[index]}.png`
        
        card.style.backgroundImage = `url('${imagePath + cardName}')`;
        card.style.backgroundSize = "cover";
        card.textContent = "";
    });
}