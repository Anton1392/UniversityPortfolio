package com.acs.bletest;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class RegisterActivity extends AppCompatActivity{
    private EditText firstNameTextView;
    private EditText lastNameTextView;
    private Button registerButton;
    private JSONObject jsonObject;

    private static String backendIP;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        //Fix the look of our action bar
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle("ESD Inpassering");
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setLogo(R.mipmap.flexlogo_foreground);
        getSupportActionBar().setDisplayUseLogoEnabled(true);


        firstNameTextView = findViewById(R.id.FirstNameEditText);
        lastNameTextView = findViewById(R.id.LastNameEditText);
        registerButton = findViewById(R.id.regButton);
        registerButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                String firstName = String.valueOf(firstNameTextView.getText());
                String lastName = String.valueOf(lastNameTextView.getText());
                Log.d("REGACT",firstName + lastName);
                final int cardNumber = getIntent().getIntExtra("CardNumber",0);
                Log.d("REGACT", String.valueOf(cardNumber));
                //Kontrollera att fälten är infyllda
                if(firstName.length() == 0)
                {
                    Toast toast = Toast.makeText(getApplicationContext(), "You need to write a first name", Toast.LENGTH_SHORT);
                    toast.show();
                }
                else if(lastName.length() == 0)
                {
                    Toast toast = Toast.makeText(getApplicationContext(), "You need to write a last name", Toast.LENGTH_SHORT);
                    toast.show();
                }
                else {
                    String pushload = "{firstName:" + firstName+ ", lastName:"+ lastName+"cardUid:" + cardNumber+"}";
                    jsonObject = new JSONObject();
                    try {
                        jsonObject.put("firstName", firstName);
                        jsonObject.put("lastName", lastName);
                        jsonObject.put("cardUid", cardNumber);
                    } catch (JSONException e) {
                        // handle exception
                    }
                    pushCreateNewEmployee(jsonObject);
                    //Authorization.GetJWT(getApplicationContext());

                }
            }
        });

        backendIP = MainActivity.backendIP;
    }


    private void pushCreateNewEmployee(final JSONObject jsonString)
    {
        // Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(this);
        String url = backendIP + "/employee";

        // Request a string response from the provided URL.
        JsonObjectRequest putRequest = new JsonObjectRequest(Request.Method.PUT, url, jsonString,
                new Response.Listener<JSONObject>()
                {
                    @Override
                    public void onResponse(JSONObject response) {
                        // response
                        Log.d("Response", response.toString());

                        try {
                            StartEsdTestActivity(response.getString("id"));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                        Log.d("Error.Response", error.toString());
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

        queue.add(putRequest);
    }


    private void StartEsdTestActivity(String id)
    {
        Intent intent = new Intent(this, EsdTestActivity.class);
        intent.putExtra("Id", id);
        intent.setFlags(intent.getFlags() | Intent.FLAG_ACTIVITY_NO_HISTORY);
        startActivity(intent);
    }

    public boolean onOptionsItemSelected(MenuItem item){
        int id = item.getItemId();

        if (id==android.R.id.home) {
            finish();
        }
        return true;
    }
}
