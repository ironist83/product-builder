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
        this.loadingOverlayEl = document.getElementById('loading-overlay');

        this.init();
    }

    async init() {
        this.showLoading(true);
        try {
            await this.loadArtists();
            
            if (this.artists.length === 0) {
                this.showError("No quiz data found. The file might be empty.");
                return;
            }

            this.totalQuestionsEl.textContent = this.artists.length;
            this.loadQuestion();
        } catch (error) {
            console.error("Initialization failed:", error);
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }
    
    showLoading(isLoading) {
        this.loadingOverlayEl.style.opacity = isLoading ? '1' : '0';
        this.loadingOverlayEl.style.pointerEvents = isLoading ? 'all' : 'none';
    }

    showError(message) {
        this.igContainer.innerHTML = `<p style="color: var(--incorrect-red);">${message}</p>`;
    }

    async loadArtists() {
        const response = await fetch('artists.json');
        if (!response.ok) {
            throw new Error(`Failed to load quiz data. (HTTP status: ${response.status})`);
        }
        const artistsData = await response.json();

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
        this.updateDisqus(artist);
    }
    
    updateDisqus(artist) {
        if (typeof DISQUS === 'undefined') {
            return; // Disqus script hasn't loaded yet
        }

        // A unique identifier for the artist, e.g., 'blackpink-jennie'
        const artistIdentifier = `${artist.group}-${artist.name.en}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
        
        // The page's canonical URL
        const pageUrl = `${window.location.origin}${window.location.pathname}#!${artistIdentifier}`;

        window.disqus_config = function () {
            this.page.url = pageUrl;
            this.page.identifier = artistIdentifier;
        };

        // Reset Disqus to load the new thread
        DISQUS.reset({
            reload: true,
            config: function () {
                this.page.url = pageUrl;
                this.page.identifier = artistIdentifier;
            }
        });
    }

    updateProgress() {
        this.progressEl.textContent = this.currentArtistIndex + 1;
        this.scoreEl.textContent = this.score;
    }

    displayInstagramEmbed(url) {
        this.igContainer.innerHTML = ''; // Clear previous embed
        this.choicesContainer.innerHTML = ''; // Clear choices while loading
        if (!url) {
            this.igContainer.innerHTML = `<p>This artist's Instagram is not available. Guess their age!</p>`;
            return;
        }

        const blockquote = document.createElement('blockquote');
        blockquote.className = 'instagram-media';
        blockquote.setAttribute('data-instgrm-permalink', url);
        blockquote.setAttribute('data-instgrm-version', '14');
        blockquote.setAttribute('data-instgrm-captioned', 'false');
        this.igContainer.appendChild(blockquote);

        // Ensure the Instagram script is loaded and can process the new embed
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        } else {
            // If the script isn't loaded yet, which can happen on fast connections,
            // we might need to manually load it or wait for it.
            // For now, we rely on the async script in index.html.
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

        // Generate 3 unique incorrect answers
        while (choices.size < 4) {
            const randomFactor = Math.floor(Math.random() * 5) - 2; // -2, -1, 1, 2
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
        }

        this.currentArtistIndex++;
        
        setTimeout(() => {
            this.updateProgress();
            this.loadQuestion();
        }, 2000);
    }

    endGame() {
        this.progressEl.textContent = this.artists.length; // Show final progress
        this.igContainer.innerHTML = '';
        this.choicesContainer.innerHTML = `<div class="game-over">
            <h2>Game Over!</h2>
            <p>Your final score is ${this.score} out of ${this.artists.length}.</p>
            <button onclick="location.reload()">Play Again</button>
            </div>`;
        // Hide Disqus on the game over screen
        const disqusThread = document.getElementById('disqus_thread');
        if (disqusThread) {
            disqusThread.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KpopQuiz();
});