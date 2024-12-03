// Utility function to calculate cosine similarity between two vectors
function calculateCosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((acc, value, index) => acc + value * vec2[index], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((acc, value) => acc + value * value, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((acc, value) => acc + value * value, 0));
    return dotProduct / (magnitude1 * magnitude2);
}

// Function to create a simple sentence embedding (this could be replaced by a more advanced model)
function getSentenceEmbedding(sentence) {
    return sentence.split(' ').map(word => word.charCodeAt(0));
}

// TextRank algorithm to rank sentences by semantic importance and coherence
function generateSummaryWithSimilarity(text, summaryLength) {
    const sentences = text.split('. ').map(sentence => sentence.trim());
    const sentenceEmbeddings = sentences.map(sentence => getSentenceEmbedding(sentence));

    const sentenceScores = sentences.map((sentence, index) => {
        let score = 0;
        for (let i = 0; i < sentences.length; i++) {
            if (i !== index) {
                score += calculateCosineSimilarity(sentenceEmbeddings[index], sentenceEmbeddings[i]);
            }
        }
        return { sentence, score };
    });

    sentenceScores.sort((a, b) => b.score - a.score);
    const topSentences = sentenceScores.slice(0, summaryLength).map(item => item.sentence);

    return topSentences.join('. ') + '.';
}

// Function to count words in a string
function countWords(text) {
    return text.trim().split(/\s+/).length;
}

// Update slider value display
document.getElementById('sentenceSlider').addEventListener('input', function() {
    document.getElementById('sliderValue').innerText = this.value;
});

// Update word count display for input text
document.getElementById('inputText').addEventListener('input', function() {
    const inputText = this.value;
    const wordCount = countWords(inputText);
    document.getElementById('inputWordCount').innerText = wordCount;
});

// Generate and display the summary based on user input
function generateSummary() {
    const inputText = document.getElementById('inputText').value;
    const summaryLength = parseInt(document.getElementById('sentenceSlider').value);

    if (!inputText.trim()) {
        alert('Please enter some text to summarize.');
        return;
    }

    const summary = generateSummaryWithSimilarity(inputText, summaryLength);
    document.getElementById('summaryResult').innerText = summary;

    // Update the summary word count
    const summaryWordCount = countWords(summary);
    document.getElementById('summaryWordCount').innerText = summaryWordCount;

    // Enable text-to-speech playback
    speechSynthesis.cancel(); // Cancel any ongoing speech
    speechSynthesis.speak(new SpeechSynthesisUtterance(summary));
}

// Text-to-Speech functionality
let currentSpeechUtterance = null;

function playSpeech() {
    const text = document.getElementById('summaryResult').innerText;
    if (!text.trim()) {
        alert('Please generate a summary first.');
        return;
    }

    currentSpeechUtterance = new SpeechSynthesisUtterance(text);
    currentSpeechUtterance.onend = function() {
        document.getElementById('playButton').disabled = false;  // Re-enable play button after speech ends
    };

    speechSynthesis.speak(currentSpeechUtterance);
    document.getElementById('playButton').disabled = true;  // Disable play button during speech
}

function pauseSpeech() {
    if (speechSynthesis.speaking) {
        speechSynthesis.pause();
    }
}

function resumeSpeech() {
    if (speechSynthesis.paused) {
        speechSynthesis.resume();
    }
}
function goHome() {
    window.history.back();
}
