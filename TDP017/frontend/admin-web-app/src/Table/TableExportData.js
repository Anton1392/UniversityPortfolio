
import XLSX from 'xlsx'

export default class TableExportData {

    /**
     * Incomming tableData
     * {
     *      KeyData: ["id", "name", "age", "occupation"],
     *      TableData: [
     *          {id: 1, name: "Zorro", age: 1000, occupation: "Hero"},
     *          {id: 2, name: "Superman", age: 28, occupation: "Reporter"},
     *          {id: 3, name: "Tarzan", age: 105, occupation: "Half monkey"}
     *      ]
     * }
     * @param {object} tableData
     */
    constructor(tableData) {

        // Convert tableData to this.data
        this.header = tableData["KeyData"];
        this.table = tableData["TableData"];
    }

    /**
     * Create a workbook and return an url to the file in format .xlsx.
     * The data has to be converted into following format:
     * {
     *      data: [
     *          [ "id",    "name",  "age",  "occupation"],
     *          [    1,   "Zorro",   1000,        "Hero"],
     *          [    2,"Superman",     28,    "Reporter"],
     *          [    3,  "Tarzan",    105, "Half monkey"]
     *      ]
     * }
     * @param {string} name
     */
    convertToXlsx(name) {
        // Convert data
        // let data = [this.header];
        // TODO Currently hardcoded column names
        let data = [["Name", "ESD check", "Date"]];
        for (const row of this.table) {
            let newRow = [];
            for (const key in row) {
                newRow.push(row[key]);
            }
            data.push(newRow);
        }
        const filename = name + ".xlsx";
        // Create document
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        const file = XLSX.writeFile(wb, filename);
        // Create blob by using string array buffer
        let ab = this._stringToArrayBuffer(file);
        const blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
        URL.createObjectURL(blob);
        //let a = document.createElement('a');
        //a.download = filename;
        //a.href =
        //a.click();
    }

    /**
     * Create a json file and return the url to the file in format .json
     * The data has to be converted into following format:
     * [
     *      {id: 1, name: "Zorro", age: 1000, occupation: "Hero"},
     *      {id: 2, name: "Superman", age: 28, occupation: "Reporter"},
     *      {id: 3, name: "Tarzan", age: 105, occupation: "Half monkey"}
     * ]
     * @param {string} name
     */
    convertToJson(name) {
        console.log(this.table)
        const filename = name + ".json"
        // Create document
        const jsonFile = JSON.stringify(this.table, null, 1)
        const blob = new Blob(
            [ jsonFile ],
            {
                type: "application/json"
            }
        );
        let a = document.createElement('a');
        a.download = filename;
        a.href = URL.createObjectURL(blob);
        a.click();
    }

    /**
     * This function is used to create cols data when converting file to table.
     * Please see https://www.npmjs.com/package/xlsx for more info
     * @param {string} refstr
     */
    _makeCols(refstr) {
        let cols = [];
        const range = XLSX.utils.decode_range(refstr);
        for(let i = 0; i <= range.e.c; ++i) {
            cols.push({name: XLSX.utils.encode_col(i), key:i});
        }
        return cols;
    }

    /**
     * Convert a binary file into ArrayBuffer by reading a stream/string of binary char
     * @param {string} str
     */
    _stringToArrayBuffer(str) {
        let buff = new ArrayBuffer(str.length);
        let view = new Uint8Array(buff);
        for (let i=0; i!==str.length; ++i) view[i] = str.charCodeAt(i) & 0xFF;
        return buff;
    }

}
