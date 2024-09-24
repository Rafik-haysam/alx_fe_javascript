// Array to hold quote objects
let quotes = [];

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // If there are no stored quotes, initialize with some default quotes
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Motivation" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "The purpose of our lives is to be happy.", category: "Happiness" },
        ];
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to show a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<strong>${randomQuote.text}</strong><br><em>Category: ${randomQuote.category}</em>`;
    } else {
        quoteDisplay.innerHTML = "No quotes available.";
    }
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;

    // Validate input
    if (quoteText && quoteCategory) {
        // Create a new quote object
        const newQuote = { text: quoteText, category: quoteCategory };
        
        // Add the new quote to the array
        quotes.push(newQuote);
        
        // Save quotes to local storage
        saveQuotes();
        
        // Clear input fields
        document.getElementById("newQuoteText").value = '';
        document.getElementById("newQuoteCategory").value = '';
        
        // Show the newly added quote
        showRandomQuote();
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Function to export quotes to a JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Load quotes from local storage on page load
window.onload = function() {
    loadQuotes();
    showRandomQuote();
};
// Simulate fetching quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        return data.map(item => ({
            text: item.title,
            category: "Server",
            id: item.id
        }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}

// Simulate posting new quotes to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        const data = await response.json();
        console.log('Posted new quote to server:', data);
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}
// Sync local quotes with server quotes
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();

    // Fetch existing local quotes
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    // Combine and resolve any conflicts (simple: server takes precedence)
    const mergedQuotes = resolveConflicts(localQuotes, serverQuotes);

    // Update local storage with merged quotes
    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));

    // Show notification to the user about syncing
    alert('Quotes synced with the server!');
}

// Conflict resolution function
function resolveConflicts(localQuotes, serverQuotes) {
    const localQuoteIds = localQuotes.map(q => q.id);
    const serverQuoteIds = serverQuotes.map(q => q.id);

    // Check for new quotes from the server
    const newServerQuotes = serverQuotes.filter(q => !localQuoteIds.includes(q.id));

    // Return merged list (server takes precedence)
    return [...localQuotes, ...newServerQuotes];
}

// Periodically sync with the server every 30 seconds
setInterval(syncQuotes, 30000);
// Conflict resolution strategy where server takes precedence
function resolveConflicts(localQuotes, serverQuotes) {
    const updatedQuotes = [];
    serverQuotes.forEach(serverQuote => {
        const matchingLocalQuote = localQuotes.find(localQuote => localQuote.id === serverQuote.id);
        if (matchingLocalQuote) {
            // Conflict detected, server takes precedence
            updatedQuotes.push(serverQuote);
        } else {
            // No conflict, add the server quote
            updatedQuotes.push(serverQuote);
        }
    });
    return updatedQuotes;
}

// Notify the user if conflicts are resolved
function notifyUserOfConflict() {
    const conflictNotification = document.createElement('div');
    conflictNotification.innerText = "Conflicts detected. Server data has been applied.";
    conflictNotification.style.backgroundColor = "#ffcccb";
    conflictNotification.style.padding = "10px";
    document.body.appendChild(conflictNotification);
}
<button onclick="syncQuotes()">Sync Now</button>
