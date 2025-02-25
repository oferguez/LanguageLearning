export default async function fetchCSV(file) {
    const response = await fetch(file);
    const text = await response.text();
    return csvToJSON(text); 
}

String.prototype.capitalizeFirstLetter = function() {
    if (!this) return ""; // Handle empty strings safely
    return this.charAt(0).toUpperCase() + this.slice(1);
  };  

function csvToJSON(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(/[\r,\t]/);

    try {
        return lines.slice(1).map(line => {
            const values = line.split(/[\r,\t]/);
            return headers.reduce((obj, key, index) => {
                obj[key] = values[index].capitalizeFirstLetter();
                return obj;
            }, {});
        })
    } catch (error) {
        console.error('csvToJSON: error:', error);
        return [];  
    }
}
