const fs = require('fs').promises;
const path = require('path');
const clone = require('clone');

const cityOutputPath = path.join(__dirname, 'server', 'data', 'cities.2.json');
const compOutputPath = path.join(__dirname, 'server', 'data', 'comp.csv');

async function main() {
    const cities = JSON.parse(await fs.readFile(cityOutputPath));
    // const co2Cities = clone(cities).sort((a, b) => b.co2-a.co2);
    // const warmingCities = clone(cities).sort((a, b) => b.warming-a.warming);
    let csvString = 'name,co2,warming\n';
    // for(let i = 0; i < cities.length; i++) {
    //     csvString += co2Cities[i].name + ',' + warmingCities[i].name + '\n'; 
    // }
    for(const city of cities) {
        csvString += `${city.name},${city.co2},${city.warming}\n`; 
    }
    await fs.writeFile(compOutputPath, csvString);
}

main().catch(console.error);