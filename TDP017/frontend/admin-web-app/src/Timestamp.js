
export default class Timestamp {

    /**
     * This class could be used to create a timestamp used by the database
     * in the  esdcheck table. Class follow ISO-8601 format YYYY-MM-DD HH:mm:ss.sss
     * The timestamp can be created by using either
     * - One date string in format "YYYY-MM-DD" and time will be set to "00:00:00"
     * - One timestamp and boolean true. Timestamp in format Unixtimestamp.
     * - Two strings, date and time with boolean false
     *
     * @param {number/string} dateStrStamp
     * @param {boolean} timeStamp
     * @param {string} timeString
     * @example <caption>Three different constructors</caption>
     * With only datestring:
     * const timestamp = new Timestamp("2012-10-05");
     * With timestamp:
     * const timestamp = new Timestamp(1571405077.439, true);
     * With two string date and time:
     * const timestamp = new Timestamp("2012-10-05", false, "12:45:01");
     */
    constructor(dateStrStamp, timeStamp = false, timeString = "00:00:00") {
        if (timeStamp === false) {
            const strDate = dateStrStamp.split("-");
            const strTime = timeString.split(":");
            try {
                this.year = strDate[0].replace(/^0+/, '');
                this.month = strDate[1].replace(/^0+/, '');
                this.day = strDate[2].replace(/^0+/, '');
                if (timeString === "00:00:00") {
                  this.hour = 0;
                  this.minute = 0;
                  this.seconds = 0;
                }
                else {
                  this.hour = strTime[0].replace(/^0+/, '');
                  this.minute = strTime[1].replace(/^0+/, '');
                  this.seconds = strTime[2].replace(/^0+/, '');
                }
                this.utcDate = new Date(
                  Date.UTC(strDate[0], strDate[1]-1, strDate[2],
                    strTime[0], strTime[1], strTime[2])
                  );
                this.timezone = -this.utcDate.getTimezoneOffset()/60;

            }
            catch(error) {
                console.error("Timestamp error: " + error)
            }
        }
        else {
            try {
                const numStamp = parseFloat(dateStrStamp);
                const utc = new Date(numStamp*1000) // unixtimestamp*1000 for millisecond

                this.year = utc.getUTCFullYear();
                this.month = utc.getUTCMonth()+1;
                this.day = utc.getUTCDate();
                this.hour = utc.getUTCHours();
                this.minute = utc.getUTCMinutes();
                this.seconds = utc.getUTCSeconds();
                this.utcDate = utc;
                this.timezone = -this.utcDate.getTimezoneOffset()/60;
            }
            catch(error) {
                console.error("Timestamp error: Parse error from string to float - " + error)
            }
        }
    }

    /**
     * To get DateTime string in format "YYYY-MM-DD HH:mm:ss"
     */
    toString() {
        let str = this.toDateString() + " ";
        return str += this._strCheck(
            [this.hour, this.minute, this.seconds], ':');
    }

    /**
     * To get DatTime string offset zone in format "YYYY-MM-DD HH:mm:ss"
     */
    toZonedString() {
        let str = this.toDateString() + " ";
        return str += this._strCheck(
            [this.hour+this.timezone, this.minute, this.seconds], ':');
    }

    /**
     * To get Date string in format "YYYY-MM-DD"
     */
    toDateString() {
        let str = this.year + "-";
        return str += this._strCheck([this.month, this.day], '-');
    }

    /**
     * Get timestamp from object
     */
    toTimestamp() {
        this.utcDate = new Date(
            Date.UTC(this.year, this.month-1, this.day,
                this.hour, this.minute, this.seconds));
        return this.utcDate.getTime()/1000;
    }

    /**
     * Create a timestamp without creating an object using a datetime string. The string
     * has to be in format "YYYY-MM-DD HH:mm:ss"
     * @param {string} strdate
     * @param {string} strtime
     */
    static toTimestampFromStr(strdate, strtime) {
        const strDate = strdate.split("-");
        const strTime = strtime.split(":");
        const year = strDate[0].replace(/^0+/, '');
        const month = strDate[1].replace(/^0+/, '');
        const day = strDate[2].replace(/^0+/, '');
        const hour = strTime[0].replace(/^0+/, '');
        const minute = strTime[1].replace(/^0+/, '');
        const seconds = strTime[2].replace(/^0+/, '');
        const utcDate = new Date(
            Date.UTC(year, month-1, day,
                hour, minute, seconds));
        return utcDate/1000;
    }

    /**
     * Load new timestamp data into object
     * @param {number} timestamp
     */
    fromTimestamp(timestamp) {
        const utc = new Date(timestamp*1000); // unixtimestamp*1000 for millisecond
        this.year = utc.getUTCFullYear();
        this.month = utc.getUTCMonth()+1;
        this.day = utc.getUTCDate();
        this.hour = utc.getUTCHours();
        this.minute = utc.getUTCMinutes();
        this.seconds = utc.getUTCSeconds();
        this.utcDate = utc;
    }

    _strCheck(lst, delimiter) {
        let str = "";
        lst.forEach(n => {
            if (n <= 9) {
                str += "0";
            }
            str += n + delimiter;
        });
        return str.slice(0,-1);
    }
}
