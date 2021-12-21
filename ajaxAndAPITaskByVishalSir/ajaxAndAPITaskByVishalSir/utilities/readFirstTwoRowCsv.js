const fs = require('fs');
const byline = require('byline');

/**
 * 
 * @param {Inputstream for file} inputStream 
 * @param {callback to specify write stream for file} createOutputStreamCallback 
 * @returns a resolved promise if first two rows are saved in a call back specified file.
 */
exports.readFirstTwoRowCsv = function(inputStream, createOutputStreamCallback){
    
    return new Promise((resolve, reject) => {
        let lineStream = byline(inputStream);
        let lineIndex = 0;
        let outputStream = null;
        let chunkIndex = 0;
        lineStream.on('data', line => {
            if (lineIndex === 0 ) {
                if (outputStream) {
                    outputStream.end();
                }
                outputStream = createOutputStreamCallback(chunkIndex++);
                if(chunkIndex > 1){
                    resolve();
                    return;
                }
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