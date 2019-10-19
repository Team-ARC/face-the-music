const csv = require('csvtojson');
const fs = require('fs').promises;
const path = require('path');

const csvPath = path.join(__dirname, '..', 'server', 'data', 'warming.csv');
const wasteCsvPath = path.join(__dirname, '..', 'server', 'data', 'waste.csv');
const cityPath = path.join(__dirname, '..', 'server', 'data', 'cities.json');
const cityOutputPath = path.join(__dirname, '..', 'server', 'data', 'cities.final.json');

async function main() {
    const warmingData = await csv().fromFile(csvPath);
    const landdfillData = await csv().fromFile(wasteCsvPath);
    const cities = JSON.parse(await fs.readFile(cityPath)).features;
    const output = [];
    let id = 0;
    for(const city of cities) {
        const { name, country } = city.properties;
        const co2 = city.properties.ef;
        const population = city.properties.pop_in_cluster;
        const [long, lat] = city.geometry.coordinates;
        let co2NatPercentage = city.properties.ef_as_pct_of_national;
        co2NatPercentage = Number(co2NatPercentage.replace('%', ''));

        const row = warmingData.find(p => p.City.trim().toLowerCase() === name.trim().toLowerCase());
        
        if(row) {
            const item = {
                name,
                country,
                countryAlt: row.Country,
                population,
                co2NatPercentage,
                location: { long, lat },
                co2,
                warming: Number(row.Warming.split(' ')[0]),
                landfill: null
            };

            const landfillRow = landdfillData.find(p => p.country.trim().toLowerCase() === item.country.trim().toLowerCase() || p.country.trim().toLowerCase() === item.countryAlt.trim().toLowerCase());
            if(landfillRow) {
                let countryLandfill = landfillRow.landfill.trim();
                if(countryLandfill === 'no data') {
                    item.landfill = null;
                } else {
                    item.landfill = Number(countryLandfill);
                }
            }
            if(item.landfill !== null) {
                item.id = id++;
                output.push(item);
            }
        }
    }
    console.log(`Found ${output.length} matches`);
    await fs.writeFile(cityOutputPath, JSON.stringify(output));
}

main().catch(console.error);