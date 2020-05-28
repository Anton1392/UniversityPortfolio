package com.example.anton.myfirstapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import com.firebase.ui.auth.AuthUI;
import com.firebase.ui.auth.IdpResponse;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class MainActivity extends AppCompatActivity
{
    // Arbitrary success code
    public static final int REQUEST_ALARM = 666;
    public static final int RC_SIGN_IN = 123;

    // Keeps track of state
    public static boolean hasLoaded = false;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Sets up toolbar
        Toolbar myToolbar = (Toolbar)findViewById(R.id.toolbar_main);
        setSupportActionBar(myToolbar);
    }

    @Override
    protected void onPause()
    {
        super.onPause();

        saveAlarms();
    }

    @Override
    protected void onResume()
    {
        super.onResume();

        awardDailyPoints();

        loadAlarms();

        // Show discipline points
        showDisciplinePoints();
    }


    public boolean onCreateOptionsMenu(Menu menu)
    {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.toolbar_main, menu);
        return true;
    }

    public boolean onOptionsItemSelected(MenuItem item)
    {
        // Functions of the toolbar
        switch(item.getItemId())
        {
            case R.id.action_add_alarm:
                // Open add alarm window
                Intent intent = new Intent(this, AddAlarmActivity.class);
                startActivityForResult(intent, REQUEST_ALARM);
                return true;

            case R.id.action_sign_in:
                signIn();

            case R.id.action_sign_out:
                signOut();

            default:
                return false;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        if(resultCode == RESULT_OK && requestCode == REQUEST_ALARM)
        {
            // Extract time, create alarm
            int hr = data.getExtras().getInt("hour");
            int min = data.getExtras().getInt("minute");
            createAlarm(hr, min, 0, false);
        }

        if (requestCode == RC_SIGN_IN)
        {
            IdpResponse response = IdpResponse.fromResultIntent(data);

            if (resultCode == RESULT_OK)
            {
                // Successfully signed in
                FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
            }
            else
            {
                // Sign in failed. If response is null the user canceled the
                // sign-in flow using the back button. Otherwise check
                // response.getError().getErrorCode() and handle the error.
                // ...
            }
        }
    }

    // Back button functionality
    @Override
    public void onBackPressed()
    {
        moveTaskToBack(true);
    }

    void createAlarm(int hr, int min, int id, boolean toggled)
    {
        final Bundle info = new Bundle();
        info.putInt("hour", hr);
        info.putInt("minute", min);
        info.putInt("id", id);
        info.putBoolean("toggle", toggled);

        // Weird syntax to make this work
        new Handler().post(new Runnable()
        {
            public void run()
            {
                AlarmFragment afr = new AlarmFragment();
                afr.setArguments(info);

                FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();

                // Assigns a unique tag
                transaction.add(R.id.alarmContainer, afr);

                transaction.commit();
            }
        });
    }

    // First part gets the date from the database.
    public void awardDailyPoints()
    {
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if(user != null)
        {
            FirebaseDatabase db = FirebaseDatabase.getInstance();
            final DatabaseReference dateRef = db.getReference("/users/"+user.getUid()+"/lastPoints");
            ValueEventListener dateListener = new ValueEventListener()
            {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot)
                {
                    // If field doesn't exist, make it exist.
                    if(!dataSnapshot.exists())
                    {
                        dateRef.setValue("No date");
                    }

                    // Got the last point date, call the second part.
                    awardDailyPoints2(dataSnapshot.getValue(String.class));
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {}
            };
            dateRef.addListenerForSingleValueEvent(dateListener);
        }
    }

    // Second part compares the date with the current time, and then updates the database if points are awarded.
    public void awardDailyPoints2(final String then)
    {
        if(then != null)
        {
            final FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
            final FirebaseDatabase db = FirebaseDatabase.getInstance();
            final DatabaseReference myRef = db.getReference("/users/"+user.getUid()+"/points");
            ValueEventListener pointListener = new ValueEventListener()
            {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot)
                {
                    // If user does not exist, create it
                    if(!dataSnapshot.exists())
                    {
                        myRef.setValue(0);
                    }

                    // Give the user discipline points once per day
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    String now = dateFormat.format(Calendar.getInstance().getTime());
                    if(!(then.equals(now)))
                    {
                        // Award two points
                        int pts = dataSnapshot.getValue(Integer.class);
                        pts += 2;
                        myRef.setValue(pts);

                        // Update date
                        final DatabaseReference dateRef = db.getReference("/users/"+user.getUid()+"/lastPoints");
                        dateRef.setValue(now);
                    }
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {}
            };
            myRef.addListenerForSingleValueEvent(pointListener);
        }
    }

    public void saveAlarms()
    {
        //Save data locally
        File file = new File(getFilesDir(), "alarms.json");
        if(!file.exists())
        {
            try
            {
                Log.d("DEBUGA", "Creating new file");
                file.createNewFile();
            }
            catch(IOException e)
            {
                Log.d("DEBUGA", "Shit's fucked");
                e.printStackTrace();
            }
        }

        try
        {
            // Construct JSON-file structure.
            JSONArray alarms = new JSONArray();

            List<Fragment> frags = getSupportFragmentManager().getFragments();
            for(int i = 0; i < frags.size(); i++)
            {
                if(frags.get(i) instanceof AlarmFragment)
                {
                    JSONObject alarm = new JSONObject();
                    AlarmFragment frag = (AlarmFragment)frags.get(i);
                    String hr = frag.hour;
                    String min = frag.minute;
                    int id = frag.id;
                    boolean toggle = frag.getToggle();
                    alarm.put("hr", hr);
                    alarm.put("min", min);
                    alarm.put("id", id);
                    alarm.put("toggle", toggle);
                    alarms.put(alarm);
                }
            }

            Log.d("DEBUGA", "Writing to file");
            Log.d("DEBUGA", alarms.toString());
            FileOutputStream outputStream = openFileOutput("alarms.json", Context.MODE_PRIVATE);
            outputStream.write(alarms.toString().getBytes());
            outputStream.close();
        }
        catch(Exception e)
        {
            Log.d("DEBUGA", e.getMessage());
            e.printStackTrace();
        }
    }

    public void loadAlarms() {
        // Reloads alarms
        if (!hasLoaded) {
            try {
                Log.d("DEBUGA", "Reading from file");
                InputStream in = openFileInput("alarms.json");
                Scanner input = new Scanner(in).useDelimiter("\\A");
                String jsonResult = input.hasNext() ? input.next() : "";
                Log.d("DEBUGA", "File opened: " + jsonResult);

                JSONArray alarms = new JSONArray(jsonResult);
                for (int i = 0; i < alarms.length(); i++) {
                    JSONObject alarm = alarms.getJSONObject(i);
                    int hr = Integer.parseInt(alarm.get("hr").toString());
                    int min = Integer.parseInt(alarm.get("min").toString());
                    int id = Integer.parseInt(alarm.get("id").toString());
                    boolean toggle = Boolean.parseBoolean(alarm.get("toggle").toString());
                    createAlarm(hr, min, id, toggle);
                }
                hasLoaded = true;
            } catch (Exception e) {
                Log.d("DEBUGA", "Shit's fucked");
                e.printStackTrace();
            }
        }
    }

    public void signIn()
    {
        // Choose authentication providers
        List<AuthUI.IdpConfig> providers = Arrays.asList(
                new AuthUI.IdpConfig.EmailBuilder().build(),
                new AuthUI.IdpConfig.GoogleBuilder().build(),
                new AuthUI.IdpConfig.FacebookBuilder().build());

        // Create and launch sign-in intent
        startActivityForResult(
                AuthUI.getInstance()
                        .createSignInIntentBuilder()
                        .setAvailableProviders(providers)
                        .build(),
                RC_SIGN_IN);
    }

    public void signOut()
    {
        AuthUI.getInstance()
                .signOut(this)
                .addOnCompleteListener(new OnCompleteListener<Void>()
                {
                    public void onComplete(@NonNull Task<Void> task)
                    {
                        // On logout, get rid of points.
                        showDisciplinePoints();
                    }
                });
    }

    public void showDisciplinePoints()
    {
        final FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        final TextView tv = findViewById(R.id.txtDiscPoints);
        if(user != null)
        {
            FirebaseDatabase db = FirebaseDatabase.getInstance();
            DatabaseReference ref = db.getReference("/users/"+user.getUid()+"/points");
            ref.addValueEventListener(new ValueEventListener()
            {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot)
                {
                    // Displays the users login-name and discipline points.
                    Long pts = dataSnapshot.getValue(Long.class);
                    String text = String.format(getResources().getString(R.string.welcome), user.getDisplayName(), pts);
                    tv.setText(text);
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {}
            });
        }
        else
        {
            // Not logged in.
            tv.setText(getResources().getString(R.string.welcome_not_logged_in));
        }
    }
}
