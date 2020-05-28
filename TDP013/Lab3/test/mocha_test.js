var assert = require("assert");

describe("testing istanbul with mocha", function() {
    it("assert true equals true", function() {
        assert.equal(true, true);
        if (true){
            assert.equal(1, 1)
        }
    });
});
