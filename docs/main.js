class KpopQuiz {
    constructor() {
        this.artists = [];
        this.currentArtistIndex = 0;
        this.score = 0;
        this.isAnswered = false;

        this.scoreEl = document.getElementById('score');
        this.progressEl = document.getElementById('progress');
        this.totalQuestionsEl = document.getElementById('total-questions');
        this.igContainer = document.getElementById('instagram-container');
        this.choicesContainer = document.getElementById('choices-container');
        this.loadingOverlayEl = document.getElementById('loading-overlay');
        this.feedbackModalEl = document.getElementById('feedback-modal');

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

    showFeedback(isCorrect) {
        const modal = this.feedbackModalEl;
        modal.textContent = isCorrect ? 'Correct!' : 'Wrong!';
        modal.className = 'feedback show';
        modal.classList.add(isCorrect ? 'correct' : 'incorrect');

        setTimeout(() => {
            modal.classList.remove('show');
        }, 1500);
    }

    async loadArtists() {
        try {
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
        } catch (error) {
            console.error("Failed to load or parse artists data:", error);
            this.showError("Could not load artist data. Please check the network or file format.");
        }
    }

    loadQuestion() {
        if (this.currentArtistIndex >= this.artists.length) {
            this.endGame();
            return;
        }
        
        this.isAnswered = false;
        const artist = this.artists[this.currentArtistIndex];
        this.currentArtist = artist;

        this.updateProgress();
        this.displayInstagramEmbed(this.currentArtist.instagram_url);
        this.generateChoices(this.currentArtist.birth_date);
        this.updateDisqus(artist);
    }
    
    updateDisqus(artist) {
        if (typeof DISQUS === 'undefined') {
            return; 
        }

        const artistIdentifier = `${artist.group}-${artist.name.en}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
        const pageUrl = `${window.location.origin}${window.location.pathname}#!${artistIdentifier}`;

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
        this.igContainer.innerHTML = '';
        this.choicesContainer.innerHTML = '';
        
        if (!url || url.includes('placeholder_url')) {
            this.igContainer.innerHTML = `<div class="placeholder-ig">This artist's Instagram is not available. Guess their age!</div>`;
            return;
        }

        const blockquote = document.createElement('blockquote');
        blockquote.className = 'instagram-media';
        blockquote.setAttribute('data-instgrm-permalink', url);
        blockquote.setAttribute('data-instgrm-version', '14');
        blockquote.setAttribute('data-instgrm-captioned', 'false');
        this.igContainer.appendChild(blockquote);

        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }

    calculateAge(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
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
            const randomOffset = Math.floor(Math.random() * 11) - 5;
            if (randomOffset === 0) continue; 
            const wrongAge = correctAge + randomOffset;
            if (wrongAge > 0 && !choices.has(wrongAge)) {
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
            button.textContent = `${age} yrs`;
            button.onclick = () => this.handleAnswer(age, correctAge);
            this.choicesContainer.appendChild(button);
        });
    }

    handleAnswer(selectedAge, correctAge) {
        if (this.isAnswered) return;
        this.isAnswered = true;

        const isCorrect = selectedAge === correctAge;
        this.showFeedback(isCorrect);

        if (isCorrect) {
            const correctAnswerSound = new Audio('sounds/correct.mp3');
            correctAnswerSound.play();
            this.score++;
        } else {
            const wrongAnswerSound = new Audio('sounds/wrong.mp3');
            wrongAnswerSound.play();
        }

        this.choicesContainer.querySelectorAll('button').forEach(btn => {
            btn.disabled = true;
            const ageFromButton = parseInt(btn.textContent.split(' ')[0]);
            if (ageFromButton === correctAge) {
                btn.classList.add('correct');
            } else if (ageFromButton === selectedAge) {
                btn.classList.add('incorrect');
            }
        });
        
        setTimeout(() => this.nextQuestion(), 1500);
    }

    nextQuestion() {
        this.currentArtistIndex++;
        this.loadQuestion();
    }

    endGame() {
        this.progressEl.textContent = this.artists.length;
        this.igContainer.innerHTML = '';
        this.choicesContainer.innerHTML = `<div class="game-over">
            <h2>Game Over!</h2>
            <p>Your final score is ${this.score} out of ${this.artists.length}.</p>
            <div class="game-over-buttons">
                <button id="play-again-btn">Play Again</button>
                <button id="share-btn">Share on X</button>
                <button id="copy-link-btn">Copy Link</button>
            </div>
            </div>`;
        
        document.getElementById('play-again-btn').addEventListener('click', () => this.resetQuiz());
        document.getElementById('share-btn').addEventListener('click', () => this.shareScore());
        document.getElementById('copy-link-btn').addEventListener('click', (e) => this.copyLink(e));

        const disqusThread = document.getElementById('disqus_thread');
        if (disqusThread) {
            disqusThread.style.display = 'none';
        }
    }

    shareScore() {
        const text = `I scored ${this.score} out of ${this.artists.length} on K-Pop Age Master! Can you beat my score?`;
        const url = window.location.href;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');
    }

    copyLink(event) {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            const button = event.target;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy Link';
            }, 2000);
        });
    }

    resetQuiz() {
        this.score = 0;
        this.currentArtistIndex = 0;
        
        // Re-shuffle artists for a new order
        for (let i = this.artists.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.artists[i], this.artists[j]] = [this.artists[j], this.artists[i]];
        }
        
        // Ensure Jennie is still first if she exists
        const jennieIndex = this.artists.findIndex(a => a.name.en === 'Jennie');
        if (jennieIndex > 0) {
            const jennie = this.artists.splice(jennieIndex, 1)[0];
            this.artists.unshift(jennie);
        }
        
        const disqusThread = document.getElementById('disqus_thread');
        if (disqusThread) {
            disqusThread.style.display = 'block';
        }

        this.loadQuestion();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KpopQuiz();
});