
import BackendData from '../BackendData.js'
import Timestamp from '../Timestamp.js'

describe('TEST REQUEST', () => {

    describe('AUTH / EMPLOYEE / ESDCHECK', () => {

        let token = '';
        let employeeId = -1;
        let esdId = -1;

        /*
        it('CREATE AUTH: Green, Lantern', async () => {
            const be = new BackendData();
            const res = await be.createUser("Green", "Lantern")
            .catch(error => {
                console.error(error);
            });
            console.log(res)
            expect(res).toEqual(true);
        });
        */
        
        it('AUTH LOGIN: Green, Lantern', async () => {
            const be = new BackendData();
            const res = await be.login("Green", "Lantern")
            .then(result => {
                console.log(result)
                token = result;
            })
            .catch(error => {
                console.error(error);
            });
    
        });

        it('CREATE EMPLOYEE: Green, Lantern, 868686', async () => {
            const be = new BackendData(token);
            const res = await be.createEmployee("Green", "Lantern", 868686)
            .then(result => {
                console.log(result);
                expect(result.firstName).toEqual('Green');
                expect(result.lastName).toEqual('Lantern');
                expect(result.cardUid).toEqual(868686);
                // Copy id for next test
                employeeId = result.id
                return result;
            })
            .catch(error => {
                console.error(error);
            });
            expect(res.firstName).toEqual('Green');
            expect(res.lastName).toEqual('Lantern');
            expect(res.cardUid).toEqual(868686);
        });
    
        it('GET EMPLOYEE: Green, Lantern, 868686', async () => {
            if (employeeId !== -1) {
                const be = new BackendData(token);
                be.getEmployee(employeeId)
                .then(result => {
                    console.log(result);
                    expect(result.firstName).toEqual('Green');
                    expect(result.lastName).toEqual('Lantern');
                    expect(result.cardUid).toEqual(868686);
                    return result;
                })
                .catch(error => {
                    console.error(error);
                });
            }
        });
    
        it('GET ALL EMPLOYEE: Green, Lantern, 868686', async () => {
            if (employeeId !== -1) {
                const be = new BackendData();
                const res = await be.getEmployeeAll(token)
                .then(result => {
                    let rtn = {};
                    result.forEach(e => {
                        if (e.id === employeeId) {
                            rtn = e;
                        }
                    });
                    console.log(rtn)
                    return rtn;
                })
                .catch(error => {
                    console.error(error);
                });
                //console.log(res)
                expect(res.firstName).toEqual('Green');
                expect(res.lastName).toEqual('Lantern');
                expect(res.cardUid).toEqual(868686);
            }
        });
        

        let msgCreate = "CREATE ESD_CHECK: " + employeeId + ", true";
        it(msgCreate, async () => {
            const be = new BackendData(token);
            const res = await be.createESDcheck(employeeId, true)
            .then(result => {
                console.log(result);
                expect(result.employeeId).toEqual(employeeId);
                expect(result.passed).toEqual(true);
                // Copy id for next test
                esdId = result.id
                return result;
            })
            .catch(error => {
                console.error(error);
            });
            expect(res.employeeId).toEqual(employeeId);
            expect(res.passed).toEqual(true);
            //expect(res.cardUid).toEqual(868686);
        });

        it("GET ESD_CHECK: " + esdId, async () => {
            const be = new BackendData(token);
            const res = await be.getESDcheck(esdId)
            .then(result => {
                console.log(result);
                expect(result.employeeId).toEqual(employeeId);
                expect(result.passed).toEqual(true);
                return result;
            })
            .catch(error => {
                console.error(error);
            });
            expect(res.employeeId).toEqual(employeeId);
            expect(res.passed).toEqual(true);
            //expect(res.cardUid).toEqual(868686);
        });

        it("GET ESD_CHECK ALL: ", async () => {
            const be = new BackendData(token);
            const res = await be.getESDcheckAll()
            .then(result => {
                let rtn = {};
                result.forEach(e => {
                    if (e.id === esdId) {
                        rtn = e;
                    }
                });
                console.log(rtn)
                return rtn;
            })
            .catch(error => {
                console.error(error);
            });
            expect(res.employeeId).toEqual(employeeId);
            expect(res.passed).toEqual(true);
        });

        it("GET ESD_CHECK INTERVAL: ", async () => {
            const be = new BackendData(token);
            const from = new Timestamp("2019-01-01");
            var today = new Date();
            // Add one day to get esdcheck made in test
            var sDay = String(today.getDate() + 1).padStart(2, '0'); 
            var sMon = String(today.getMonth() + 1).padStart(2, '0');
            var sYear = String(today.getFullYear());
            const now = sYear + "-" + sMon + "-" + sDay;
            const to = new Timestamp(now);
            const res = await be.getESDcheckInterval(employeeId, from.toTimestamp(), to.toTimestamp())
            .then(result => {
                let rtn = {};
                result.forEach(e => {
                    if (e.id === esdId) {
                        rtn = e;
                    }
                });
                console.log(rtn)
                return rtn;
            })
            .catch(error => {
                console.error(error);
            });
            expect(res.employeeId).toEqual(employeeId);
            expect(res.passed).toEqual(true);
        });
    
        it('DELETE ESD_CHECK: ' + esdId, async () => {
            if (esdId !== -1) {
                const be = new BackendData(token);
                const res = await be.deleteESDcheck(esdId)
                .then(result => {
                    console.log(result);
                    expect(result.employeeId).toEqual(employeeId);
                    expect(result.passed).toEqual(true);
                    //expect(result.cardUid).toEqual(868686);
                    return result;
                })
                .catch(error => {
                    console.error(error);
                });
                expect(res.employeeId).toEqual(employeeId);
                expect(res.passed).toEqual(true);
                //expect(res.cardUid).toEqual(868686);
            }
        });

        it('DELETE EMPLOYEE: Green, Lantern, 868686, ' + employeeId, async () => {
            if (employeeId !== -1) {
                const be = new BackendData(token);
                const res = await be.deleteEmployee(employeeId)
                .then(result => {
                    console.log(result);
                    expect(result.firstName).toEqual('Green');
                    expect(result.lastName).toEqual('Lantern');
                    expect(result.cardUid).toEqual(868686);
                    return result;
                })
                .catch(error => {
                    console.error(error);
                });
                expect(res.firstName).toEqual('Green');
                expect(res.lastName).toEqual('Lantern');
                expect(res.cardUid).toEqual(868686);
            }
        });
    });

});





