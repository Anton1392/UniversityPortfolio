package personrest;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import se.liu.ida.tdp024.person.logic.impl.facade.PersonLogicFacadeImpl;
import se.liu.ida.tdp024.person.data.impl.db.facade.PersonEntityFacadeDB;
import se.liu.ida.tdp024.person.data.impl.db.entity.PersonDB;

import java.util.List;

@RestController
public class PersonController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    private PersonLogicFacadeImpl logic = new PersonLogicFacadeImpl(new PersonEntityFacadeDB());

    private boolean isSetup = false;

    @RequestMapping("/list")
    public List<PersonDB> list() {
        if(!isSetup){logic.setupDatabase(); isSetup = true;}
        return logic.list();
    }

    @RequestMapping("/find.name")
    public List<PersonDB> findByName(@RequestParam(value="name") String name) {
        if(!isSetup){logic.setupDatabase(); isSetup = true;}
        return logic.findByName(name);
    }

    @RequestMapping("/find.key")
    public PersonDB findByKey(@RequestParam(value="key") String key) {
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
