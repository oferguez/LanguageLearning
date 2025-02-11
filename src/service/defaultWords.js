export default async function fetchCSV(file) {
    const response = await fetch(file);
    const text = await response.text();
    return csvToJSON(text); 
}

function csvToJSON(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {
        const values = line.split(",");
        return headers.reduce((obj, key, index) => {
            obj[key] = values[index];
            return obj;
        }, {});
    });
}
