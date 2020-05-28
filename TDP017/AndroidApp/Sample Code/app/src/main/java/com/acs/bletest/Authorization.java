package com.acs.bletest;

import android.content.Context;
import android.content.SharedPreferences;

// Handles JWT authentication and token saving
public class Authorization
{
    private static SharedPreferences prefs;

    // Token from backend upon startup.
    public static String jwt;

    public static void GetJWT(Context _context)
    {
        prefs = _context.getSharedPreferences("myPrefs", Context.MODE_PRIVATE);
        // Load jwt from preferences
        jwt = prefs.getString("myPrefs" + ".Token", "");
    }
}

