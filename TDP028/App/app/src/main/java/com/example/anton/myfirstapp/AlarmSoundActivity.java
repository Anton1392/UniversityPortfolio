package com.example.anton.myfirstapp;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Vibrator;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.AttributeSet;
import android.view.View;
import android.widget.TextView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.Calendar;

public class AlarmSoundActivity extends AppCompatActivity
{
    MediaPlayer mp;
    Vibrator v;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_alarm_sound);

        // Plays repeating audio
        mp = MediaPlayer.create(this, R.raw.beep);
        mp.setLooping(true);
        mp.start();

        // Plays repeating vibrations
        v = (Vibrator)this.getSystemService(Context.VIBRATOR_SERVICE);
        long[] pattern = new long[]{0, 500, 500};
        v.vibrate(pattern, 0);

        // Set wake up greeting.
        TextView textView = findViewById(R.id.txtGreeting);
        Calendar c = Calendar.getInstance();
        String hourString = String.format("%02d", c.get(Calendar.HOUR_OF_DAY));
        String minuteString = String.format("%02d", c.get(Calendar.MINUTE));
        String greeting = getResources().getString(R.string.wake_up_greeting);
        textView.setText(greeting + " " + hourString + ":" + minuteString + ".");
    }

    // The stop-buttons onclick method
    public void btnStop(View v)
    {
        stop();
    }

    public void snooze(View v)
    {
        // Set new alarm for now + 5 minutes.
        Calendar c = Calendar.getInstance();
        c.add(Calendar.MINUTE, 5);
        // Unique broadcast id. Prevents overwriting alarms.
        int id = (int)c.getTimeInMillis();

        // Set the alarm to fire at the specified time.
        AlarmManager alarmManager = (AlarmManager)this.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(this, AlertReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(this, id, intent, 0);

        alarmManager.setExact(AlarmManager.RTC_WAKEUP, c.getTimeInMillis(), pendingIntent);

        // Deduct one discipline point
        deductPoint();

        // Quit activity, return to main.
        stop();
    }

    public void stop()
    {
        // Stops sounds and vibrations
        mp.stop();
        v.cancel();

        // Goes to MainActivity and suicides
        Intent i = new Intent(this, MainActivity.class);
        startActivity(i);
        finish();
    }

    public void deductPoint()
    {
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if(user != null)
        {
            // Initialize user
            FirebaseDatabase db = FirebaseDatabase.getInstance();
            final DatabaseReference myRef = db.getReference("/users/"+user.getUid()+"/points");
            ValueEventListener vel = new ValueEventListener()
            {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot)
                {
                    // Deduct a point
                    int pts = dataSnapshot.getValue(Integer.class);
                    pts -= 1;
                    myRef.setValue(pts);
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {}
            };
            myRef.addListenerForSingleValueEvent(vel);
        }
    }

    @Override
    public void onBackPressed()
    {
        stop();
    }
}
