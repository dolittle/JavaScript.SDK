// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

const path = require('path');
const fs = require('fs');

(async () => {
    const readmePath = path.resolve(__dirname, '..', 'README.md');
    const readmeFile = await new Promise((resolve, reject) =>
        fs.readFile(readmePath, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        }));

    const destinations = process.argv.slice(2);

    if (destinations.length < 1) {
        throw new Error('No desitionations specified to copy the README.md file to.');
    }

    for (const destination of destinations) {
        const destinationPath = path.resolve(destination, 'README.md');
        await new Promise((reject, resolve) =>
            fs.writeFile(destinationPath, readmeFile, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }));
    }
})().catch(error => {
    console.error(error);
    process.exit(1);
});
