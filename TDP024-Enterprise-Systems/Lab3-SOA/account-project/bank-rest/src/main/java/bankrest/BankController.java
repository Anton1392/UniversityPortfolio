package bankrest;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import se.liu.ida.tdp024.bank.logic.impl.facade.BankLogicFacadeImpl;
import se.liu.ida.tdp024.bank.data.impl.db.facade.BankEntityFacadeDB;
import se.liu.ida.tdp024.bank.data.impl.db.entity.BankDB;

import java.util.List;

@RestController
public class BankController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    private BankLogicFacadeImpl logic = new BankLogicFacadeImpl(new BankEntityFacadeDB());

    private boolean isSetup = false;

    @RequestMapping("/list")
    public List<BankDB> list() {
        if(!isSetup){logic.setupDatabase(); isSetup = true;}
        return logic.list();
    }

    @RequestMapping("/find.name")
    public BankDB findByName(@RequestParam(value="name") String name) {
        if(!isSetup){logic.setupDatabase(); isSetup = true;}
        return logic.findByName(name);
    }

    @RequestMapping("/find.key")
    public BankDB findByKey(@RequestParam(value="key") String key) {
        if(!isSetup){logic.setupDatabase(); isSetup = true;}
        return logic.findByKey(key);
    }

    @RequestMapping("/setupDatabase")
    public int setupDatabase() {
      try
      {
        logic.setupDatabase();
      }
      catch(Exception e)
      {
        return 0;
      }
      return 1;
    }

    @RequestMapping("/greeting")
    public Greeting greeting(@RequestParam(value="name", defaultValue="World") String name) {
        return new Greeting(counter.incrementAndGet(),
                            String.format(template, name));
    }
}
