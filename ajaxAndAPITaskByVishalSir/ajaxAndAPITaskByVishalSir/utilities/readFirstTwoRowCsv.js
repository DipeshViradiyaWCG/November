const fs = require('fs');
const byline = require('byline');
let lineIndex = 0;
let outputStream = null;
let chunkIndex = 0;

/**
 * 
 * @param {Inputstream for file} inputStream 
 * @param {callback to specify write stream for file} createOutputStreamCallback 
 * @returns a resolved promise if first two rows are saved in a call back specified file.
 */
exports.readFirstTwoRowCsv = function(inputStream, createOutputStreamCallback){

    let lineStream = byline(inputStream);

    return new Promise((resolve, reject) => {
        lineStream.on('data', line => {
            if (lineIndex === 0 ) {
                if (outputStream) {
                    outputStream.end();
                }
                outputStream = createOutputStreamCallback(chunkIndex++);
                resolve();
            }
            outputStream.write(line);
            outputStream.write("\n");
            lineIndex = (++lineIndex) % 2;
        });
    
        lineStream.on('error', (err) => {
            if (outputStream) {
                outputStream.end();
            }
            reject(err);
        });
    });

}