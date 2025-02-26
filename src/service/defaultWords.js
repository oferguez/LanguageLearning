import Papa from "papaparse";

function csvToJson(csvString) {
    const results = Papa.parse(csvString, { header: true, skipEmptyLines: true });
    return results.data; // Returns JSON array
}

export default async function fetchCSV(file) {
    const response = await fetch(file);
    const text = await response.text();
    const wordsArray = csvToJson(text); 
    return wordsArray;
}
