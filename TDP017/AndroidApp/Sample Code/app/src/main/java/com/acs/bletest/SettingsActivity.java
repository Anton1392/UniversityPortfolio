package com.acs.bletest;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class SettingsActivity extends AppCompatActivity{
    public final String PREFNAME = "myPrefs";
    SharedPreferences prefs;

    EditText inputIP;
    EditText inputPort;
    EditText inputToken;

    TextView txtConnectionFeedback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        //Fix the look of our action bar
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle("ESD Inpassering");
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setLogo(R.mipmap.flexlogo_foreground);
        getSupportActionBar().setDisplayUseLogoEnabled(true);

        prefs = this.getSharedPreferences(PREFNAME, Context.MODE_PRIVATE);

        inputIP = findViewById(R.id.inputIP);
        inputPort = findViewById(R.id.inputPort);
        inputToken = findViewById(R.id.inputToken);

        txtConnectionFeedback = (TextView)findViewById(R.id.txtConnectionFeedback);

        Button saveBtn = (Button)findViewById(R.id.btnSave);
        saveBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SaveSettings();
            }
        });

        Button btnTestBackend = (Button)findViewById(R.id.btnTestBackend);
        btnTestBackend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                TestBackend();
            }
        });

        // Load settings
        LoadSettings();
    }

    private void SaveSettings()
    {
        // Remove whitespace
        String ip = inputIP.getText().toString();
        ip.replaceAll("\\s+","");

        prefs.edit().putString(PREFNAME + ".IP", ip).apply();
        prefs.edit().putString(PREFNAME + ".Port", inputPort.getText().toString()).apply();
        prefs.edit().putString(PREFNAME + ".Token", inputToken.getText().toString()).apply();

        // Restarts
        Intent restartIntent = getBaseContext().getPackageManager()
                .getLaunchIntentForPackage(getBaseContext().getPackageName());
        restartIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(restartIntent);
    }


    private void LoadSettings()
    {
        String IP = prefs.getString(PREFNAME + ".IP", "");
        String port = prefs.getString(PREFNAME + ".Port", "");
        String token = prefs.getString(PREFNAME + ".Token", "");
        inputIP.setText(IP);
        inputPort.setText(port);
        inputToken.setText(token);
        //inputToken.setText("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbImFwcCJdLCJpc3MiOiJlc2RjaGVjayIsImxvZ2luIjoiYXBwIn0.xRf1RtbjrZnGqO0nlugB8xWAqQ6kwcZmD9Xe4HgItQ4");
    }

    private void TestBackend()
    {
        txtConnectionFeedback.setText("Connecting...");

        // Try sample request to set IP and port, check if working.
        // Request the ESD checks by employee ID
        RequestQueue queue = Volley.newRequestQueue(this);
        final String ip = "http://" + inputIP.getText().toString() + ":" + inputPort.getText().toString() + "/employee";
        ip.replaceAll("\\s+",""); // remove whitespace

        // Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.GET, ip,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        txtConnectionFeedback.setText("Connected and authorized!");
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                        Log.d("DEBUGA", "error: " + error.toString());
                        txtConnectionFeedback.setText("Error: " + error.toString());
                    }
                }
        ) {

            @Override
            public Map<String, String> getHeaders()
            {
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json");
                headers.put("Accept", "application/json");
                headers.put("Authorization:", "Bearer "+inputToken.getText());
                return headers;
            }
        };

        queue.add(stringRequest);
    }

    public boolean onOptionsItemSelected(MenuItem item){
        int id = item.getItemId();

        if (id==android.R.id.home) {
            finish();
        }
        return true;
    }
}
