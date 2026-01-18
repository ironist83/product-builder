class KpopQuiz {
    constructor() {
        this.artists = [];
        this.currentArtistIndex = 0;
        this.score = 0;
        this.usedArtists = new Set();

        this.scoreEl = document.getElementById('score');
        this.progressEl = document.getElementById('progress');
        this.totalQuestionsEl = document.getElementById('total-questions');
        this.igContainer = document.getElementById('ig-embed-container');
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
            this.artists = await response.json();
        } catch (error) {
            console.error("Could not load artists:", error);
            this.igContainer.innerHTML = `<p>Error loading quiz data. Please check the console.</p>`;
        }
    }

    loadQuestion() {
        if (this.usedArtists.size >= this.artists.length) {
            this.endGame();
            return;
        }

        let artist;
        if (this.usedArtists.size === 0) {
            // First question: Find Jennie
            artist = this.artists.find(a => a.name.en === 'Jennie');
        } else {
            // Subsequent questions: Find a random, unused artist
            do {
                const randomIndex = Math.floor(Math.random() * this.artists.length);
                artist = this.artists[randomIndex];
            } while (this.usedArtists.has(artist.id));
        }
        
        this.currentArtist = artist;
        this.usedArtists.add(this.currentArtist.id);

        this.updateProgress();
        this.displayInstagramEmbed(this.currentArtist.instagram_url);
        this.generateChoices(this.currentArtist.birth_date);
    }
    
    updateProgress() {
        this.progressEl.textContent = this.usedArtists.size;
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

        this.loadInstagramScript();
    }

    loadInstagramScript() {
        if (!document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
            const script = document.createElement('script');
            script.async = true;
            script.src = "//www.instagram.com/embed.js";
            document.body.appendChild(script);
        } else {
            // If script is already there, tell it to process the new embed
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
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

        // Generate 3 unique wrong answers
        while (choices.size < 4) {
            const randomFactor = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
            if (randomFactor === 0) continue; // Ensure we don't add the same age
            const wrongAge = correctAge + randomFactor;
            if (wrongAge > 0) { // Ensure age is positive
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
        // Disable buttons after an answer is selected
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

        this.updateProgress();

        // Wait a moment before loading the next question
        setTimeout(() => this.loadQuestion(), 2000);
    }

    endGame() {
        this.igContainer.innerHTML = '';
        this.choicesContainer.innerHTML = `<div class="game-over">
            <h2>Game Over!</h2>
            <p>Your final score is ${this.score} out of ${this.artists.length}.</p>
            <button onclick="location.reload()">Play Again</button>
            </div>`;
    }
}

// Start the quiz once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KpopQuiz();
});