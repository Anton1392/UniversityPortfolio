package com.example.anton.myfirstapp;

import android.content.Intent;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.TimePicker;

public class AddAlarmActivity extends AppCompatActivity
{
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_alarm);

        // Sets up toolbar
        Toolbar myToolbar = (Toolbar)findViewById(R.id.toolbar);
        setSupportActionBar(myToolbar);

        // Get support action bar for this toolbar
        ActionBar ab = getSupportActionBar();
        ab.setDisplayHomeAsUpEnabled(true);

        // Sets 24 hour clock
        TimePicker tp = (TimePicker)findViewById(R.id.alarm_time_picker);
        tp.setIs24HourView(true);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item)
    {
        switch (item.getItemId())
        {
            // Send a canceled result from the toolbar back button.
            case android.R.id.home:
                Intent i = new Intent(AddAlarmActivity.this, MainActivity.class);
                setResult(RESULT_CANCELED, i);
                finish();
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    public boolean onCreateOptionsMenu(Menu menu)
    {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.toolbar_generic, menu);
        return true;
    }

    // Returns information to MainActivity to create a new alarm.
    public void addAlarm(View view)
    {
        Intent i = new Intent(AddAlarmActivity.this, MainActivity.class);

        // Grabs selected time
        TimePicker tp = (TimePicker)findViewById(R.id.alarm_time_picker);
        int hr = tp.getHour();
        int min = tp.getMinute();

        // Bundle data
        i.putExtra("hour", hr);
        i.putExtra("minute", min);

        // Set okay, then finish to send to parent.
        setResult(RESULT_OK, i);
        finish();
    }
}
