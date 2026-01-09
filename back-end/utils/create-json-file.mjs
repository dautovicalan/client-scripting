import fs from 'fs';

export function createJsonFile(data, filename) {

    const directoryPath = './mockup-data';
    const suffix = 'json';

    if (!fs.existsSync(directoryPath)) {
        // Create the directory
        fs.mkdirSync(directoryPath);
    }

    // Convert data to JSON string with 2-space indentation
    const jsonData = JSON.stringify(data, null, 2);
    
    // Write file into directory
    const filePath = `${directoryPath}/${filename}.${suffix}`;
    fs.writeFileSync(filePath, jsonData, 'utf-8');
    
    console.log(
      `The file ${filename}.${suffix} was successfully created with ${data.length} entries`
    );

}
