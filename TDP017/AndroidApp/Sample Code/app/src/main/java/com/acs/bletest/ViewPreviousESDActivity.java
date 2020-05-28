package com.acs.bletest;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.prolificinteractive.materialcalendarview.CalendarDay;
import com.prolificinteractive.materialcalendarview.DayViewDecorator;
import com.prolificinteractive.materialcalendarview.DayViewFacade;
import com.prolificinteractive.materialcalendarview.MaterialCalendarView;
import com.prolificinteractive.materialcalendarview.spans.DotSpan;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ViewPreviousESDActivity extends AppCompatActivity{

    MaterialCalendarView calendar;
    private static String backendIP;
    public long cardID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_previous_esd);

        //Fix the look of our action bar
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle("ESD Inpassering");
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setLogo(R.mipmap.flexlogo_foreground);
        getSupportActionBar().setDisplayUseLogoEnabled(true);

        // Loads IP from preferences.
        SharedPreferences prefs = this.getSharedPreferences("myPrefs", Context.MODE_PRIVATE);
        String ip = prefs.getString("myPrefs.IP", "");
        String port = prefs.getString("myPrefs.Port", "");
        backendIP = "http://" + ip + ":" + port;

        calendar = findViewById(R.id.calendarView);

        //long cardUID = 2345102; // TODO: TEMPORARY
        cardID = getIntent().getLongExtra("CardNumber",0);
        Log.d("watiseven", String.valueOf(cardID));

        //DisplayESD(cardUID);
        DisplayESD(cardID);
        //Authorization.GetJWT(this);
    }

    private void DisplayESD(long cardUID)
    {
        // Request the correct employee
        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, backendIP + "/employee/by_card/" + cardUID,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Log.d("DEBUGA", "Response is: " + response);

                        // Extract ID through JSON.
                        try {
                            JSONObject obj = new JSONObject(response);
                            int id = obj.getInt("id");
                            Log.d("DEBUGA", "ID is: " + id);
                            RequestESD(id);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("DEBUGA", "Request error: " + error.getMessage());
            }
        }){
            /** Passing some request headers* */
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Content-Type", "application/json; charset=UTF-8");
                params.put("Authorization:", "Bearer "+Authorization.jwt);
                return params;
            }
        };

        queue.add(stringRequest);
    }

    void RequestESD(int id)
    {
        // Request the ESD checks by employee ID
        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, backendIP + "/esdcheck/by_employee/" + id,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        HandleESDResponse(response);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("DEBUGA", "Request error: " + error.getMessage());
            }
        })
        {
            /** Passing some request headers* */
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Content-Type", "application/json; charset=UTF-8");
                params.put("Authorization:", "Bearer "+Authorization.jwt);
                return params;
            }
        };

        queue.add(stringRequest);
    }

    // This is called from the HTTP response listener.
    // Takes in ESD JSONs, converts them into two lists of dates, then decorates the calendar.
    void HandleESDResponse(String response)
    {
        // Display the first 500 characters of the response string.
        Log.d("DEBUGA", "Response is: " + response);

        ArrayList<LocalDate> passDates = new ArrayList<LocalDate>();
        ArrayList<LocalDate> failDates = new ArrayList<LocalDate>();

        try {
            JSONArray arr = new JSONArray(response);
            for (int i = 0; i < arr.length(); i++)
            {
                JSONObject obj = arr.getJSONObject(i);
                long epoch = obj.getLong("date");
                // Epoch to LocalDate
                LocalDate date = Instant.ofEpochSecond(epoch).atZone(ZoneId.systemDefault()).toLocalDate();

                if(obj.getBoolean("passed")) {
                    passDates.add(date);
                }
                else {
                    failDates.add(date);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
            Log.d("DEBUGA", e.getMessage());
        }

        calendar.addDecorator(new DateDecorator(false, failDates));
        calendar.addDecorator(new DateDecorator(true, passDates));

    }
    public boolean onOptionsItemSelected(MenuItem item){
        int id = item.getItemId();

        if (id==android.R.id.home) {
            finish();
        }
        return true;
    }
}

class DateDecorator implements DayViewDecorator {

    private boolean passed;
    List<LocalDate> dates;

    public DateDecorator(boolean pass, ArrayList<LocalDate> _dates) {
        dates = _dates;
        passed = pass;
    }

    // Iterates over all days in the calendar, determining which days should be decorated.
    @Override
    public boolean shouldDecorate(CalendarDay day) {
        LocalDate d = LocalDate.of(day.getYear(), day.getMonth(), day.getDay());
        for(LocalDate ld : dates)
        {
            // if day is in the passDates array, return true.
            if(ld.equals(d))
            {
                return true;
            }
        }
        return false;
    }

    // Decorates all the determined days, once.
    @Override
    public void decorate(DayViewFacade view) {
        // if pass, decorate green, else red.
        view.addSpan(new DotSpan(25, passed ? Color.GREEN : Color.RED));
    }
}


