class KpopQuiz {
    constructor() {
        this.artists = [];
        this.currentArtistIndex = 0;
        this.score = 0;

        this.scoreEl = document.getElementById('score');
        this.progressEl = document.getElementById('progress');
        this.totalQuestionsEl = document.getElementById('total-questions');
        this.igContainer = document.getElementById('instagram-container');
        this.choicesContainer = document.getElementById('choices-container');

        this.init();
    }

    async init() {
        await this.loadArtists();
        this.totalQuestionsEl.textContent = this.artists.length;
        this.loadQuestion();
    }

    async loadArtists() {
        try {
            const response = await fetch('artists.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let artistsData = await response.json();

            // Fisher-Yates shuffle algorithm
            for (let i = artistsData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [artistsData[i], artistsData[j]] = [artistsData[j], artistsData[i]];
            }
            
            this.artists = artistsData;
            
            // As requested, ensure Jennie is the first question if she exists
            const jennieIndex = this.artists.findIndex(a => a.name.en === 'Jennie');
            if (jennieIndex > 0) {
                const jennie = this.artists.splice(jennieIndex, 1)[0];
                this.artists.unshift(jennie);
            }

        } catch (error) {
            console.error("Could not load artists:", error);
            this.igContainer.innerHTML = `<p>Error loading quiz data. Please check the console.</p>`;
        }
    }

    loadQuestion() {
        if (this.currentArtistIndex >= this.artists.length) {
            this.endGame();
            return;
        }

        const artist = this.artists[this.currentArtistIndex];
        this.currentArtist = artist;

        this.updateProgress();
        this.displayInstagramEmbed(this.currentArtist.instagram_url);
        this.generateChoices(this.currentArtist.birth_date);
    }
    
    updateProgress() {
        this.progressEl.textContent = this.currentArtistIndex + 1;
        this.scoreEl.textContent = this.score;
    }

    displayInstagramEmbed(url) {
        this.igContainer.innerHTML = ''; // Clear previous embed
        if (!url) {
            this.igContainer.innerHTML = `<p>This artist's Instagram is not available. Guess their age!</p>`;
            return;
        }

        const blockquote = document.createElement('blockquote');
        blockquote.className = 'instagram-media';
        blockquote.setAttribute('data-instgrm-captioned', '');
        blockquote.setAttribute('data-instgrm-permalink', url);
        blockquote.setAttribute('data-instgrm-version', '14');
        this.igContainer.appendChild(blockquote);

        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }

    calculateAge(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date('2026-01-18'); // As specified in the context
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
    
    generateChoices(birthDate) {
        const correctAge = this.calculateAge(birthDate);
        const choices = new Set([correctAge]);

        while (choices.size < 4) {
            const randomFactor = Math.floor(Math.random() * 5) - 2;
            if (randomFactor === 0) continue;
            const wrongAge = correctAge + randomFactor;
            if (wrongAge > 0) {
               choices.add(wrongAge);
            }
        }

        const shuffledChoices = Array.from(choices).sort(() => Math.random() - 0.5);
        this.displayChoices(shuffledChoices, correctAge);
    }



    displayChoices(choices, correctAge) {
        this.choicesContainer.innerHTML = '';
        choices.forEach(age => {
            const button = document.createElement('button');
            button.textContent = age;
            button.onclick = () => this.handleAnswer(age, correctAge);
            this.choicesContainer.appendChild(button);
        });
    }

    handleAnswer(selectedAge, correctAge) {
        this.choicesContainer.querySelectorAll('button').forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.textContent) === correctAge) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('incorrect');
            }
        });
        
        if (selectedAge === correctAge) {
            this.score++;
            alert('Correct!');
        } else {
            alert(`Wrong! The correct age is ${correctAge}.`);
        }

        this.currentArtistIndex++;
        this.updateProgress();

        setTimeout(() => this.loadQuestion(), 2000);
    }

    endGame() {
        this.progressEl.textContent = this.currentArtistIndex;
        this.igContainer.innerHTML = '';
        this.choicesContainer.innerHTML = `<div class="game-over">
            <h2>Game Over!</h2>
            <p>Your final score is ${this.score} out of ${this.artists.length}.</p>
            <button onclick="location.reload()">Play Again</button>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KpopQuiz();
});