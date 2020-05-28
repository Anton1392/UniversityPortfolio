package com.acs.bletest;

import java.util.ArrayList;
import java.util.List;

import javax.smartcardio.CardTerminal;

public final class TerminalList {

    private static final TerminalList INSTANCE = new TerminalList();
    private List<CardTerminal> mTerminals = new ArrayList<>();

    /**
     * Creates an instance of {@code TerminalList}.
     */
    private TerminalList() {
    }

    /**
     * Returns the instance of {@code TerminalList}.
     *
     * @return the instance
     */
    public static TerminalList getInstance() {
        return INSTANCE;
    }

    /**
     * Gets the list of card terminals.
     *
     * @return the list of card terminals
     */
    public List<CardTerminal> getTerminals() {
        return mTerminals;
    }
}
