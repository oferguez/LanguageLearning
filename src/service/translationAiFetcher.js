export default async function fetchTranslation(words, targetLanguage) {
    const url = "https://oferguez.netlify.app/.netlify/functions/ai-translation-fetcher";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ words, targetLanguage }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Translation API error:", error);
        return { error: "Failed to fetch translations" };
    }
}

// Example Usage
// fetchTranslation(["hello", "world"], "French")
//     .then(console.log)
//     .catch(console.error);
