package com.example.anton.myfirstapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class AlertReceiver extends BroadcastReceiver
{
    @Override
    public void onReceive(Context context, Intent intent)
    {
        Log.d("DEBUGA","Alarm activated, wake up if you may");
        // Star
        Intent i = new Intent(context, AlarmSoundActivity.class);
        context.startActivity(i);
    }
}
