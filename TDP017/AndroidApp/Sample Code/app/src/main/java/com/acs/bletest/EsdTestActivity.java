package com.acs.bletest;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class EsdTestActivity extends AppCompatActivity{
    private Button passButton;
    private Button failButton;
    private JSONObject jsonString;

    private static String backendIP;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_esd_test);

        //Fix the look of our action bar
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle("ESD Inpassering");
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setLogo(R.mipmap.flexlogo_foreground);
        getSupportActionBar().setDisplayUseLogoEnabled(true);

        passButton = findViewById(R.id.PassButton);
        failButton = findViewById(R.id.FailButton);
        final String id = getIntent().getStringExtra("Id");

        passButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                //Http post med KortId och ett Pass
                jsonString = new JSONObject();
                try {
                    jsonString.put("employeeId", id);
                    jsonString.put("passed", true);
                    jsonString.put("date",  System.currentTimeMillis() / 1000L);
                    esdTestPutRequest();
                } catch (JSONException e) {
                    // handle exception
                }
            }
        });

        failButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                jsonString = new JSONObject();
                try {
                    jsonString.put("employeeId", id);
                    jsonString.put("passed", false);
                    jsonString.put("date",  System.currentTimeMillis() / 1000L);
                    esdTestPutRequest();
                } catch (JSONException e) {
                    // handle exception
                }
            }
        });

        // Loads IP from preferences.
        SharedPreferences prefs = this.getSharedPreferences("myPrefs", Context.MODE_PRIVATE);
        String ip = prefs.getString("myPrefs.IP", "");
        String port = prefs.getString("myPrefs.Port", "");
        backendIP = "http://" + ip + ":" + port;
    }

    private void StartMainActivity()
    {
        finish();
    }


    private void esdTestPutRequest()
    {
        // TODO: Use JWT
        //String jwt = Authorization.GetJWT(this); // Becomes "" on failed login

        // Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(this);

        String url = backendIP + "/esdcheck";

        // Request a string response from the provided URL.
        JsonObjectRequest putRequest = new JsonObjectRequest(Request.Method.PUT, url, jsonString,
                new Response.Listener<JSONObject>()
                {
                    @Override
                    public void onResponse(JSONObject response) {
                        // response
                        Log.d("Response", response.toString());
                        StartMainActivity();
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                        Log.d("Error.Response", error.toString());
                    }
                }
        ) {

            @Override
            public Map<String, String> getHeaders()
            {
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json");
                headers.put("Accept", "application/json");
                headers.put("Authorization:", "Bearer "+Authorization.jwt);
                return headers;
            }

            @Override
            public byte[] getBody() {

                try {
                    Log.i("json", jsonString.toString());
                    return jsonString.toString().getBytes("UTF-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                return null;
            }
        };

        queue.add(putRequest);
    }
    public boolean onOptionsItemSelected(MenuItem item){
        int id = item.getItemId();

        if (id==android.R.id.home) {
            finish();
        }
        return true;
    }
}
