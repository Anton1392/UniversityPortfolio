package se.liu.ida.esdcheck;

import com.google.inject.Guice;
import com.google.inject.Injector;

public class Main {
    public static void main(String[] args) {
        Injector injector = Guice.createInjector(new EsdCheckModule());
        EsdCheckApp app = injector.getInstance(EsdCheckApp.class);
        app.run();
    }
}
