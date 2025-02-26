export default async function fetchTranslation(words, targetLanguage, onChunkReceived, chunkSize = 3) {
    const url = "https://oferguez.netlify.app/.netlify/functions/ai-translation-fetcher";
    const results = [];
    onChunkReceived(0, words.length);

    for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ words: chunk, targetLanguage }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const result = await response.json();
            results.push(...result);
            onChunkReceived(i + result.length, words.length);
        } catch (error) {
            console.error("Translation API error:", error);
            return { error: "Failed to fetch translations" };
        }
    }

    return results;
}