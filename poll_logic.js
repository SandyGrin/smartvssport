// poll_logic.js

// --- Global State & Keys ---
const pollDataKey = 'smartphonePollData_v2'; // Updated version key
const userAnswerKey = 'userAnswer_v2';
const hasAnsweredKey = 'hasAnswered_v2';

// Initialize the global poll data structure (will be populated by loadPollData)
let pollData = {
    answers: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    total: 0
};

// --- Data Persistence ---
function loadPollData() {
    console.log("loadPollData called.");
    try {
        const savedData = localStorage.getItem(pollDataKey);
        console.log("Raw data from localStorage:", savedData);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            console.log("Parsed data:", parsedData);
            // Basic validation
            if (parsedData && typeof parsedData.answers === 'object' && typeof parsedData.total === 'number') {
                 // Ensure all expected keys (1-5) exist in answers, default to 0 if missing
                 const defaultAnswers = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                 // Merge saved data over defaults
                 pollData.answers = { ...defaultAnswers, ...parsedData.answers };
                 pollData.total = parsedData.total;
                 // Ensure total matches sum of answers (basic integrity check)
                 const calculatedTotal = Object.values(pollData.answers).reduce((sum, count) => sum + count, 0);
                 if (pollData.total !== calculatedTotal) {
                     console.warn(`Mismatch in total count. Saved: ${pollData.total}, Calculated: ${calculatedTotal}. Using calculated total.`);
                     pollData.total = calculatedTotal;
                 }

            } else {
                console.warn("Invalid data format found in localStorage. Using default poll data.");
                resetPollData(); // Use default if data is corrupt, but don't clear user keys yet
            }
        } else {
            console.log("No previous poll data found in localStorage. Using default poll data.");
            // Ensure pollData is the default initialized structure if nothing is loaded
             pollData = {
                answers: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                total: 0
            };
        }
    } catch (error) {
        console.error("Error loading/parsing poll data from localStorage:", error);
        // Use default data if parsing fails
        resetPollData(); // Use default if critical error
    }
    console.log("Final pollData after load:", JSON.stringify(pollData));
}

function savePollData() {
    try {
        console.log("Attempting to save pollData:", JSON.stringify(pollData));
        // Recalculate total before saving for consistency
        pollData.total = Object.values(pollData.answers).reduce((sum, count) => sum + count, 0);
        localStorage.setItem(pollDataKey, JSON.stringify(pollData));
        console.log("pollData saved successfully. Total:", pollData.total);
    } catch (error) {
        console.error("Error saving poll data to localStorage:", error);
        alert("Не удалось сохранить данные опроса. Возможно, хранилище браузера переполнено или недоступно.");
    }
}

// Function to clear all poll-related data (for testing)
function resetPollData() {
    pollData = {
        answers: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        total: 0
    };
    localStorage.removeItem(pollDataKey);
    localStorage.removeItem(userAnswerKey);
    localStorage.removeItem(hasAnsweredKey);
    console.log("All poll data has been reset in localStorage and memory.");
    // Optional: Reload or redirect after reset if needed
    // window.location.reload();
}


// --- Helper ---
function getAnswerText(option) {
    const answers = {
        1: 'Менее 1 часа',
        2: '1–2 часа',
        3: '2–4 часа',
        4: '4–6 часов',
        5: 'Более 6 часов'
    };
    // Convert option to number just in case it's passed as string
    const numOption = parseInt(option);
    return answers[numOption] || 'Неизвестный выбор';
}