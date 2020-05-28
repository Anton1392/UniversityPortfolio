package accountrest;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MissingServletRequestParameterException;

import se.liu.ida.tdp024.account.logic.impl.facade.AccountLogicFacadeImpl;
import se.liu.ida.tdp024.account.data.impl.db.facade.AccountEntityFacadeDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;

import se.liu.ida.tdp024.account.logic.impl.facade.TransactionLogicFacadeImpl;
import se.liu.ida.tdp024.account.data.impl.db.facade.TransactionEntityFacadeDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.TransactionDB;

import java.util.List;

@RestController
public class AccountController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    private TransactionLogicFacadeImpl transactionLogic = new TransactionLogicFacadeImpl(new TransactionEntityFacadeDB());
    private AccountLogicFacadeImpl accountLogic = new AccountLogicFacadeImpl(new AccountEntityFacadeDB());

    @RequestMapping("/account/create")
    public String create(@RequestParam(value="accounttype", required = true) String accounttype, @RequestParam(value="person", required = true) String person, @RequestParam(value="bank", required = true) String bank) {
        return accountLogic.create(accounttype, person, bank);
    }

    @RequestMapping("/account/find/person")
    public List<AccountDB> findByPersonKey(@RequestParam(value="person", required = true) String personKey) {
        return accountLogic.findByPersonKey(personKey);
    }

    @RequestMapping("/account/debit")
    public String debit(@RequestParam(value="id") int id, @RequestParam(value="amount", required = true) int amount) {
        return accountLogic.debit(id, amount);
    }

    @RequestMapping("/account/credit")
    public String credit(@RequestParam(value="id") int id, @RequestParam(value="amount", required = true) int amount) {
        return accountLogic.credit(id, amount);
    }

    @RequestMapping("/account/transactions")
    public List<TransactionDB> findTransactions(@RequestParam(value="id", required = true) int id) {
        return transactionLogic.findByAccount(id);
    }

    @RequestMapping("/greeting")
    public Greeting greeting(@RequestParam(value="name", defaultValue="World", required = true) String name) {
        return new Greeting(counter.incrementAndGet(),
                            String.format(template, name));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public String handleMissingParams(MissingServletRequestParameterException ex) {
        return "FAILED";
    }
}
