// speechModule.js

let recognitionInstance = null;

function startSpeechRecognition(userId, reciveUserId, onTranscriptCallback) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Tarayıcınız konuşma tanımayı desteklemiyor.");
        return;
    }

    recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'tr-TR';
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = function (event) {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript.trim();
            console.log("Transkript:", transcript);

            if (typeof onTranscriptCallback === "function") {
                onTranscriptCallback(transcript);
            }

            hub.server.saveTranscript(userId, reciveUserId , transcript);
        }
    };

    recognitionInstance.onerror = function (event) {
        console.error("Speech Recognition Hatası:", event.error);
    };

    recognitionInstance.start();
    console.log("SpeechRecognition başladı.");
}

function stopSpeechRecognition() {
    if (recognitionInstance) {
        recognitionInstance.stop();
        console.log("SpeechRecognition durduruldu.");
    }
}

// ✅ Global erişilebilirlik:
window.startSpeechRecognition = startSpeechRecognition;
window.stopSpeechRecognition = stopSpeechRecognition;
