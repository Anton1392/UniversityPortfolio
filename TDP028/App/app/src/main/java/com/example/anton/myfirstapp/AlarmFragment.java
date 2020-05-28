package com.example.anton.myfirstapp;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.Switch;
import android.widget.TextView;

import java.util.Calendar;

public class AlarmFragment extends Fragment
{
    public String hour = "00";
    public String minute = "00";

    public int id;

    // Keeps track of state, prevents duplicate alarms.
    public boolean firstRun = true;

    NotificationManager nm;

    public AlarmFragment()
    {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // Set hour, minute, and id
        if (getArguments() != null)
        {
            hour = Integer.toString(getArguments().getInt("hour"));
            minute = Integer.toString(getArguments().getInt("minute"));
            id = getArguments().getInt("id");

            // Add trailing zero
            if(hour.length() == 1)
            {
                hour = "0"+hour;
            }
            if(minute.length() == 1)
            {
                minute = "0"+minute;
            }
        }

        nm = getActivity().getSystemService(NotificationManager.class);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.fragment_alarm, container, false);

        // Set switch toggle listener
        Switch onOffSwitch = v.findViewById(R.id.alarmToggleSwitch);
        onOffSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener()
        {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b)
            {
                toggleAlarm();
            }
        });

        // Set cancel button click listener
        Button alarmCancelButton = (Button)v.findViewById(R.id.deleteButton);
        alarmCancelButton.setOnClickListener(new View.OnClickListener()
        {
            public void onClick(View v)
            {
                deleteAlarm();
            }
        });

        TextView time = v.findViewById(R.id.txtAlarmTime);
        time.setText(hour + ":" + minute);

        return v;
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState)
    {
        super.onActivityCreated(savedInstanceState);
        // Set toggle state
        if (getArguments() != null)
        {
            boolean toggle = getArguments().getBoolean("toggle");
            if(toggle)
            {
                firstRun = false;
                Switch sw = getView().findViewById(R.id.alarmToggleSwitch);
                sw.setChecked(true);
            }
        }
    }

    public boolean getToggle()
    {
        Switch sw = getView().findViewById(R.id.alarmToggleSwitch);
        return sw.isChecked();
    }

    public void toggleAlarm()
    {
        // Set a time for wakeup
        Calendar c = Calendar.getInstance();
        c.set(Calendar.HOUR_OF_DAY, Integer.parseInt(hour));
        c.set(Calendar.MINUTE, Integer.parseInt(minute));
        c.set(Calendar.SECOND, 0);
        // If c is before this moment, set alarm for next day.
        if(c.before(Calendar.getInstance()))
        {
            c.add(Calendar.DATE, 1);
        }

        Switch sw = getView().findViewById(R.id.alarmToggleSwitch);
        if(sw.isChecked() && firstRun)
        {
            firstRun = false;
            Log.d("DEBUGA","Tried to enable alarm at " + hour + ":" + minute);

            // Unique broadcast id. Prevents overwriting alarms.
            id = (int)c.getTimeInMillis();

            // Set the alarm to fire at the specified time.
            AlarmManager alarmManager = (AlarmManager)getActivity().getSystemService(Context.ALARM_SERVICE);
            Intent intent = new Intent(getContext(), AlertReceiver.class);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(getContext(), id, intent, 0);

            alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, c.getTimeInMillis(), AlarmManager.INTERVAL_DAY, pendingIntent);

            sendNotification();
        }
        else if(!sw.isChecked())
        {
            firstRun = true;
            cancelAlarm();
        }
    }

    public void cancelAlarm()
    {
        Log.d("DEBUGA","Tried to cancel alarm");
        // Else cancel alarm
        AlarmManager alarmManager = (AlarmManager)getActivity().getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(getContext(), AlertReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(getContext(), id, intent, 0);

        alarmManager.cancel(pendingIntent);

        cancelNotification();
    }

    public void deleteAlarm()
    {
        cancelAlarm();

        // Suicide
        android.support.v4.app.FragmentTransaction t = getActivity().getSupportFragmentManager().beginTransaction();
        t.addToBackStack(null);
        t.remove(AlarmFragment.this).commit();
    }

    public void sendNotification()
    {
        // Builds a notification channel
        // Relevant for API 26+. Needed for notifications to work.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(String.valueOf(id), "AlarmingApp", NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription("AlarmingApp's notification channel");

            // Disable notification vibrations
            channel.enableVibration(false);
            channel.setVibrationPattern(new long[]{0});

            nm.createNotificationChannel(channel);
        }

        // Build the notification and set properties
        NotificationCompat.Builder notification = new NotificationCompat.Builder(getContext(), String.valueOf(id));
        notification.setSmallIcon(R.drawable.ic_launcher_foreground);
        notification.setTicker(getString(R.string.notification_ticker));
        notification.setContentTitle(getString(R.string.notification_active_alarm) + " " + hour + ":" + minute + ".");
        notification.setOngoing(true); // Not dismissable

        // Redirect to app on click
        Intent i = new Intent(getActivity(), MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(getActivity(), 0, i, PendingIntent.FLAG_UPDATE_CURRENT);
        notification.setContentIntent(pendingIntent);

        // Sends notification
        nm.notify(id, notification.build());
    }

    public void cancelNotification()
    {
        // Removes the relevant notification
        nm.cancel(id);
    }
}
