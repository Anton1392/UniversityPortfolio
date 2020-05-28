package se.liu.ida.tdp024.bank.data.impl.db.util;

import se.liu.ida.tdp024.bank.data.api.util.StorageFacade;

public class StorageFacadeDB implements StorageFacade{
    // Implementation of the utility methods, nothing vital needed here.
    @Override
    public void emptyStorage() {
        EMF.close();
    }

}
