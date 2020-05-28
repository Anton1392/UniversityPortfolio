
import Timestamp from '../Timestamp.js'

describe('GETTER TEST FROM ...', () => {

    it('DATE STRING', () => {

        const ts = new Timestamp("2012-10-05");
        expect(ts.year).toEqual("2012");
        expect(ts.month).toEqual("10");
        expect(ts.day).toEqual("5");
        expect(ts.hour).toEqual(0);
        expect(ts.minute).toEqual(0);
        expect(ts.seconds).toEqual(0);
    });

    it('DATETIME STRING', () => {
        
        const ts = new Timestamp("2012-10-05", false, "10:31:12");
        expect(ts.year).toEqual("2012");
        expect(ts.month).toEqual("10");
        expect(ts.day).toEqual("5");
        expect(ts.hour).toEqual("10");
        expect(ts.minute).toEqual("31");
        expect(ts.seconds).toEqual("12");
    });

    it('TIMESTAMP', () => {

        console.log("Enter timestamp: Monday, 03-Jun-19 15:07:12 UTC => 1559574432");
        const ts = new Timestamp(1559574432, true);
        expect(ts.year).toEqual(2019);
        expect(ts.month).toEqual(6);
        expect(ts.day).toEqual(3);
        expect(ts.hour).toEqual(15);
        expect(ts.minute).toEqual(7);
        expect(ts.seconds).toEqual(12);
        expect(ts.toTimestamp()).toEqual(1559574432);
    })
});

describe('SETTER TEST FROM ...', () => {

    it('DATE STRING', () => {

        let ts = new Timestamp("2012-10-05");
        ts.year = 2001;
        expect(ts.year).toEqual(2001);
        ts.month = 6;
        expect(ts.month).toEqual(6);
        ts.day = 30;
        expect(ts.day).toEqual(30);
        ts.hour = 23;
        expect(ts.hour).toEqual(23);
        ts.minute = 59;
        expect(ts.minute).toEqual(59);
        ts.seconds = 59;
        expect(ts.seconds).toEqual(59);

        expect(ts.toString()).toEqual("2001-06-30 23:59:59");
        expect(ts.toDateString()).toEqual("2001-06-30");
        expect(ts.toTimestamp()).toEqual(993945599);
    });

    it('TIMESTAMP', () => {

        console.log("Enter timestamp: Monday, 03-Jun-19 15:07:12 UTC => 1559574432");
        const ts = new Timestamp(1559574432, true);
        ts.year = 2001;
        expect(ts.year).toEqual(2001);
        ts.month = 6;
        expect(ts.month).toEqual(6);
        ts.day = 30;
        expect(ts.day).toEqual(30);

        expect(ts.toString()).toEqual("2001-06-30 15:07:12");
        expect(ts.toDateString()).toEqual("2001-06-30");
        expect(ts.toTimestamp()).toEqual(993913632);
    });
});

describe('TEST STRING TO TIMESTAMP', () => {

    it('This does not instansiate Timestamp', () => {

        console.log("Enter string: 2019-06-03 15:07:12 UTC => 1559574432");
        const ts = Timestamp.toTimestampFromStr("2019-06-03", "15:07:12");
        expect(ts).toEqual(1559574432)
    })
});

describe('TEST RE-ENTER NEW TIMESTAMP', () => {

    it('Enter new timestamp from existin Timestamp', () => {

        console.log("Enter string: 2017-11-03 15:07:12 UTC => 1509721632");
        let ts = new Timestamp("2019-06-03", false, "15:07:12");
        expect(ts.toTimestamp()).toEqual(1559574432);
        ts.fromTimestamp(1509721632);
        expect(ts.year).toEqual(2017);
        expect(ts.month).toEqual(11);
        expect(ts.day).toEqual(3);
        expect(ts.hour).toEqual(15);
        expect(ts.minute).toEqual(7);
        expect(ts.seconds).toEqual(12);
        expect(ts.toTimestamp()).toEqual(1509721632);
    })
});

describe('TEST TIMESTAMP FROM SQL DATABASE TO...', () => {

    it('GETTERS', () => {

        console.log("Enter enter timestamp: 2019-11-17 17:47:43.314427 UTC => 1574009639.314427");
        let ts = new Timestamp(1574009639.314427, true); //17:53:59
        expect(ts.year).toEqual(2019);
        expect(ts.month).toEqual(11);
        expect(ts.day).toEqual(17);
        expect(ts.hour + ts.timezone).toEqual(17);
        expect(ts.minute).toEqual(53);
        expect(ts.seconds).toEqual(59);
        let ts2 = new Timestamp(1574009263.4371, true); // 17:47:43
        expect(ts2.year).toEqual(2019);
        expect(ts2.month).toEqual(11);
        expect(ts2.day).toEqual(17);
        expect(ts2.hour + ts.timezone).toEqual(17);
        expect(ts2.minute).toEqual(47);
        expect(ts2.seconds).toEqual(43);

    });

    it('STRING', () => {

        console.log("Enter enter timestamp: 2019-11-17 17:53:59.4371 UTC => 1574009639.314427");
        console.log("This result could fail if tested in another timezone")
        let ts = new Timestamp(1574009639.314427, true); //17:53:59
        expect(ts.toZonedString()).toEqual("2019-11-17 17:53:59");
        let ts2 = new Timestamp(1574009263.4371, true); // 17:47:43
        expect(ts2.toZonedString()).toEqual("2019-11-17 17:47:43");
    })
})