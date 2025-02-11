export default async function fetchCSV(file) {
    const response = await fetch(file);
    const text = await response.text();
    return csvToJSON(text); 
}

function csvToJSON(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(/['\r', ',']/);

    return lines.slice(1).map(line => {
        const values = line.split(/['\r', ',']/);
        return headers.reduce((obj, key, index) => {
            obj[key] = values[index];
            return obj;
        }, {});
    });
}
