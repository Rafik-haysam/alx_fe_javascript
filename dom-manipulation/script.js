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
