/**
 * 
 * @param {csv file headers} headerArray 
 * @param {second row of csv file} demoEntryArray 
 * @param {availble data feilds in DB} dbFeildArray 
 * @param {HBS helper options} options 
 * @returns an HTML string to render with table and dropdown.
 */

exports.renderMapTable = function (headerArray, demoEntryArray, dbFeildArray, options) {
    let htmlStr = `<table class="table" id="mapTable">
                        <thead>
                            <tr>
                                <th scope="col"> CSV file headers </th>
                                <th scope="col"> Demo Entry </th>
                                <th scope="col"> Data feilds </th>
                            </tr>
                        </thead>
                    <tbody>
                      `;
    for(let i = 0; i < headerArray.length; i++) {
        htmlStr +=  `<tr id="${options.fn(headerArray[i])}" class="${i}" >
                        <td>${options.fn(headerArray[i])}</td>
                            <td>${options.fn(demoEntryArray[i])}</td>
                            <td>
                                <select name="dbFeild" class="${i}" id="${options.fn(headerArray[i])}">
                                    <option value="" selected>--select data feild--</option>`;
        for(let j = 0; j < dbFeildArray.length; j++){
            htmlStr += `
                                    <option value="${options.fn(dbFeildArray[j])}">${options.fn(dbFeildArray[j])}</option>
                    `;
        }
                  
        htmlStr += `                <option value="addDataFeild">--Add a new data feild--</option>
                                </select>
                            </td>
                    </tr>`;
    }
    
    htmlStr += `
                    </tbody>
                </table>`
                return htmlStr;
}