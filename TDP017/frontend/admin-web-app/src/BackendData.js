
//import Config from './config.json'
const Config =  require('./config.json');

export default class BackendData {

    /**
     * The BackendData class handle all backend api request to the server. It
     * is mostl likely to create on class for each component and when the component
     * is loaded the token is added to the class.
     * @constructor
     */
    constructor(token = '') {

        this.token = token;
        this.controller = new AbortController();
    }

    /**
     * This function can be placed in a componentWillUnmount to abort
     * any ongoing request to the component. However, if there is a setState
     * function in the request a mount check has to be done.
     */
    abort() {
        this.controller.abort();
    }

    /**
     * This method add/renew a token to the class which is used for each
     * request. It is obvoiusly also possible to add it directly.
     * @param {string} token
     */
    addToken(token) {
        this.token = token;
    }

    /**
     * The method create an auth user on the server. The input argument login and pwd are later
     * used to login on the homepage.
     * @param {string} login
     * @param {string} pwd
     */
    async createUser(login, pwd) {
        const jsonData = {
            "login": login,
            "password": pwd
        }
        const path = this._createHttpPath("auth", ["user"]);
        console.log("createUser: " + path)
        const rtn = await fetch(path, {
                method: 'PUT',
                body: JSON.stringify(jsonData), // data can be `string` or {object}
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (res.ok)
                    return true;
                else {
                    console.error("Status: " + res.status)
                    let msg = "Error create auth: " + res.status;
                    msg += res.statusText;
                    alert(msg);
                    return false;
                }
            })
            .catch(error => console.error(error));
        return rtn;
    }

    /**
     * This method will send the login and pwd to server and recive a token
     * which is used for all request later on. The token is saved in the class
     * and return to the user. The class can later be used for other request
     * without adding a token.
     * @param {string} login
     * @param {string} pwd
     */
    async login(login, pwd) {
        const jsonData = {
            "login": login,
            "password": pwd
        }
        const path = this._createHttpPath("auth", []);
        console.log("login: " + path);

        const response = await fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)  // body data type must match "Content-Type" header
        })
        .then(res => res.json())
        .then(result => {
            this.token = result['jwt'];
            return result['jwt'];
        })
        .catch(error => {
            console.error(error);
        });
        return response;
    }


    /**
     * This method create an employee in the postgres table employee through a
     * PUT api call. This method need argument first_name, last_name and CardId.
     * Json object will be in the format.
     * {
     *      "firstName": "Testnamn",
     *      "lastName": "Testefternamn",
     *      "cardUid": 180000
     * }
     * @async
     * @param {string} first
     * @param {string} second
     * @param {number} cardId
     * @example<caption>Example to insert employee into postgres db.</caption>
     * const be = new BackendData();
     * be.createEmployee("Clark", "Kent", 18000)
     * .then(result => {
     *   console.log(result)
     * })
     * .catch(error => {
     *   console.log(error)
     * })
     */
    async createEmployee(first, second, cardId) {
        const jsonData = {
            "firstName": first,
            "lastName": second,
            "cardUid": cardId
        }
        const path = this._createHttpPath("employee", []);

        console.log("createEmployee: " + path);
        const rtn = await this._fetchDataPut(path, jsonData)
            .then(data => {
                return data;
            })
            .catch(error => {
                this._errorMsg("Create employee error", error)
            });
        return rtn;
    }

    /**
     * This method will remove a employee from the database.
     * @async
     * @param {number} id
     */
    async deleteEmployee(id) {

        const path = this._createHttpPath("employee", ["delete", id]);

        console.log("deleteEmployee: " + path);
        //console.log("token: " + this.token);
        const rtn = await this._fetchDataDelete(path, id)
            .then(data => {
                //console.log(data);
                return data;
            })
            .catch(error => console.error(error));
        return rtn;
    }

    /**
     *  This method create an ESD control in postgres table esdcheck through a
     *  PUT api call. The method need argument table id, employee_id and check status (true/false).
     *  Json object will be in the format.
     *  {
     *      "employeeId": 2,
     *      "passed": true,
     * }
     * @async
     * @param {number} employeeId
     * @param {boolean} passed
     * @example <caption>Example to insert ESD check into postgres db.</caption>
     * const be = new BackendData();
     * be.createESDcheck(23, 1, true)
     *  .then(result => {
     *      console.log(result)
     *  })
     *  .catch(error => {
     *      console.warn(error)
     *  })
     */
    async createESDcheck(employeeId, passed) {

        const jsonData = {
            "employeeId": employeeId,
            "passed": passed
        }
        const path = this._createHttpPath("esdcheck", []);
        console.log("createESDcheck: " + path)
        const rtn = await this._fetchDataPut(path, jsonData)
            .catch(error => console.error(error))
        return rtn;
    }

    /**
     * This method will remove a employee from the database.
     * @async
     * @param {number} id
     */
    async deleteESDcheck(id) {

        const path = this._createHttpPath("esdcheck", ["delete", id]);

        console.log("deleteESDCheck: " + path);
        //console.log("token: " + this.token);
        const rtn = await this._fetchDataDelete(path, id)
            .then(data => {
                return data;
            })
            .catch(error => console.error(error));
        return rtn;
    }

    /**
     * The method will fetch the object employee by using its id
     * @async
     * @param {number} id
     * @example <caption>Example to fetch employee from postgres db.</caption>
     * const be = new BackendData();
     * be.getEmployee(employeeId).then(result => {
     *  this.setState({
     *      firstName: result['firstName'],
     *      secondName: result['lastName']
     *  });
     * });
     */
    async getEmployee(id) {
        try{
            let path = '';
            if (id === undefined) {
                path = this._createHttpPath("employee");
            }
            else {
                path = this._createHttpPath("employee", [id]);
            }
            console.log("getEmployee: " + path);
            return await this._fetchDataGet(path);
        }
        catch(error) {
            return -1;
        }
    }

    async getEmployeeAll() {
        try{
            const path = this._createHttpPathCmd("employee");
            console.log("getEmployeeAll: " + path);
            return await this._fetchDataGet(path);
        }
        catch(error) {
            return -1;
        }
    }

    /**
     * The method will fetch the object esdcheck by using table esdcheck id
     * @async
     * @param {number} id
     * @example<caption>Example to fetch esdcheck by using Id.</caption>
     * const be = new BackendData();
     * be.getESDcheck(esdId).then(result => {
     *      console.log(result)
     * })
     * .catch((error) => {
     *      console.error(error)
     * })
     */
    async getESDcheck(id) {
        const path = this._createHttpPath("esdcheck", [id]);
        console.log("getESDcheck: " + path);
        return await this._fetchDataGet(path);
    }

    /**
     * The method will fetch all esdcheck data from postgres db.
     * @async
     * @example<caption>Example to fetch all esdcheck data.</caption>
     * const be = new BackendData();
     * be.getESDcheckAll().then(result => {
     *      for( let log in result ) {
     *          this.tableData.push(log);
     *      }
     * })
     * .catch(error => {
     *      console.error(error);
     * });
     */
    async getESDcheckAll() {
        const path = this._createHttpPath("esdcheck", []);
        console.log("getAllESDcheck: " + path);
        const data = await this._fetchDataGet(path);
        return await data;
    }

    /**
     * This method collect all esdcheck for an Employee. Return an array with esdcheck data
     * @async
     * @param {number} id
     * @example<caption>Example to fetch esdcheck data from an Employee.
     *
     *
     */
    async getESDcheckByEmployee(id) {
        const path = this._createHttpPath("esdcheck/by_employee", [id]);
        console.log("getESDcheckByEmployee: " + path);
        return await this._fetchDataGet(path);
    }

    /**
     * The method will fetch esdcheck data between 'from' and 'to' by employee id. Use the class Timestamp
     * to get correct value by using method .toTimestamp().
     * @param {number} id
     * @param {number} fromTimestamp
     * @param {number} toTimestamp
     * @example<caption>Example to fetch esdcheck data by employee</caption>
     * const be = new BackendData();
     * const timeFrom = new Timestamp(from);
     * const timeTo = new Timestamp(to);
     * be.getESDcheckInterval(id, timeFrom.toTimestamp(), timeTo.toTimestamp())
     *      .then(result => {
     *          // Loop through each row
     *          result.forEach(row => {
     *              for (const [k, v] of Object.entries(row) ) {
     *                  console.log(k)
     *                  console.log(v)
     *              }
     *              this.tableData.push(row);
     *          });
     *      })
     *      .catch(error => {
     *          console.error(error)
     * })
     */
    async getESDcheckInterval(id, fromTimestamp, toTimestamp) {
        const path = this._createHttpPathPara("esdcheck/by_employee", [id], [fromTimestamp, toTimestamp]);
        console.log("getESDcheckInterval: " + path);
        return await this._fetchDataGet(path);
    }

    /**
     * This method will create the Url which could be used in a request method.
     * @access private
     * @param {string} cmd
     */
    _createHttpPathCmd(cmd) {
        let path = "http://" + Config['url'];   // http://localhost:8099/
        path += ":" + Config['port'];           // 8099
        path += '/' + cmd;
        return path;
    }

    /**
     * This method will create the Url which could be used in a request method.
     * @access private
     * @param {string} cmd
     * @param {object[]} args
     */
    _createHttpPath(cmd, args = []) {
        let path = "http://" + Config['url'];   // http://localhost:8099/
        path += ":" + Config['port'];           // 8099
        path += '/' + cmd;
        args.forEach(arg => {
            path += "/" + arg
        });
        return path;
    }

    /**
     * This method will create the Url which could be used in a request method.
     * @access private
     * @param {string} cmd
     * @param {object[]} args
     * @param {object[]} para
     */
    _createHttpPathPara(cmd, args, para = []) {
        let path = "http://" + Config['url'];
        path += ":" + Config['port'];
        path += '/' + cmd;
        args.forEach(arg => {
            path += "/" + arg
        });
        para.forEach(par =>  {
            path += "?" + par
        });
        return path;
    }

    /**
     * This method will fetch data by using a GET request
     * @access private
     * @async
     * @param {string} path
     */
    async _fetchDataGet(path) {

        return fetch(path, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.token
                }
            })
            .then(res => res.json())
            .then(result => {
                return result;
            })
            .catch((error) => console.error(error) );
    }

    /**
     * This method will fetch data by using POST request
     * @access private
     * @param {string} path
     * @param {object{}} data
     */
    async _fetchDataPost(path, data = {}) {
        const response = await fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            body: JSON.stringify(data)  // body data type must match "Content-Type" header
        })
        .then(res => res.json())
        .then(result => {
            return result;
        })
        .catch(error => console.error(error) );
        return response;
    }

    /**
     * This method will fetch data by using a PUT request
     * @access private
     * @param {string} path
     * @param {Object[]} data
     */
    async _fetchDataPut(path, data) {

        const response = await fetch(path, {
            method: 'PUT',
            body: JSON.stringify(data), // data can be `string` or {object}
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            }
        })
        .then(res => res.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.error(error);
            throw new URIError(error);
        });

        return response;
    }

    /**
     * This method will execute a DELETE request
     * @access private
     * @param {string} path
     * @param {object[]} data
     */
    async _fetchDataDelete(path, data) {

        const response = await fetch(path, {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(result => {
            return result;
        })
        .catch(error => console.error(error));

        return response;
    }

    _errorMsg(method, error) {
        let msg = "Error in " + method + ": ";
        msg += error;
        alert(msg);
    }

}
