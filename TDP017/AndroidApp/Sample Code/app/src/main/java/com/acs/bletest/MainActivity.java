package com.acs.bletest;

import com.acs.smartcardio.BluetoothSmartCard;
import com.acs.smartcardio.BluetoothTerminalManager;
import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.LayoutRes;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.DialogFragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.smartcardio.Card;
import javax.smartcardio.CardChannel;
import javax.smartcardio.CardException;
import javax.smartcardio.CardTerminal;
import javax.smartcardio.CommandAPDU;
import javax.smartcardio.ResponseAPDU;
import javax.smartcardio.TerminalFactory;

public class MainActivity extends AppCompatActivity
        implements
        MasterKeyDialogFragment.MasterKeyDialogListener {

    private class TerminalAdapter extends ArrayAdapter<String> {

        private List<CardTerminal> mTerminals;

        /**
         * Creates an instance of {@code TerminalAdapter}.
         *
         * @param context  the context
         * @param resource the resource ID
         */
        public TerminalAdapter(@NonNull Context context, @LayoutRes int resource) {

            super(context, resource);
            mTerminals = TerminalList.getInstance().getTerminals();
            for (CardTerminal terminal : mTerminals) {
                add(terminal.getName());
            }
        }

        /**
         * Adds the card terminal.
         *
         * @param terminal the card terminal
         */
        public void addTerminal(CardTerminal terminal) {
            if ((terminal != null) && !mTerminals.contains(terminal)) {

                mTerminals.add(terminal);
                add(terminal.getName());

                /* Load the settings. */
                SharedPreferences sharedPref = getSharedPreferences(
                        "com.acs.bletest." + terminal.getName(), Context.MODE_PRIVATE);
                boolean defaultKeyUsed = sharedPref.getBoolean(KEY_PREF_USE_DEFAULT_KEY, true);
                String newKey = sharedPref.getString(KEY_PREF_NEW_KEY, null);

                /* Set the master key. */
                if (!defaultKeyUsed) {

                    mLogger.logMsg("Setting the master key (%s)...", terminal.getName());
                    try {
                        mManager.setMasterKey(terminal, Hex.toByteArray(newKey));
                    } catch (IllegalArgumentException e) {
                        mLogger.logMsg("Error: %s", e.getMessage());
                    }
                }
            }
        }

        /**
         * Gets the card terminal.
         *
         * @param index the index
         * @return the card terminal
         */
        public CardTerminal getTerminal(int index) {
            return mTerminals.get(index);
        }

        @Override
        public void clear() {

            super.clear();
            mTerminals.clear();
        }
    }

    public static String backendIP;

    private static final String TAG = "MainActivity";
    private static final String STATE_LOG = "log";
    private static final int REQUEST_ENABLE_BT = 1;
    private static final int REQUEST_ACCESS_COARSE_LOCATION = 2;
    private static final int REQUEST_ACCESS_WRITE_EXTERNAL_STORAGE = 3;
    private static final String KEY_PREF_USE_DEFAULT_KEY = "pref_use_default_key";
    private static final String KEY_PREF_NEW_KEY = "pref_new_key";

    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothTerminalManager mManager;
    private TerminalFactory mFactory;
    private Handler mHandler;
    private Logger mLogger;

    private Spinner mTerminalSpinner;
    private TerminalAdapter mTerminalAdapter;
    private CheckBox mT0CheckBox;
    private CheckBox mT1CheckBox;
    private EditText mControlCodeEditText;
    private TextView mFilenameTextView;
    private TextView mLogTextView;
    private TextView userHintTextView;
    private ImageView userHintImageView;
    private Button oldESDButton;
    private Button newESDButton;
    private Button logOutButton;
    private Button hideShowButton;
    private String employeeId;
    private long cardUId;
    private boolean cardScanned = false;
    private TextView welcomeViewTextView;
    private TextView mLoggerTextView;
    private ResponseAPDU responseAPDU;
    private boolean proceed = false;
    private boolean showLogger = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //get token from our preferences
        Authorization.GetJWT(this);

        //Fix the look of our action bar
        getSupportActionBar().setTitle("ESD Inpassering");
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setLogo(R.mipmap.flexlogo_foreground);
        getSupportActionBar().setDisplayUseLogoEnabled(true);

        // Loads IP from preferences.
        SharedPreferences prefs = this.getSharedPreferences("myPrefs", Context.MODE_PRIVATE);
        String ip = prefs.getString("myPrefs.IP", "");
        String port = prefs.getString("myPrefs.Port", "");
        backendIP = "http://" + ip + ":" + port;

        /* Initialize welcomeViewTextView . */
        welcomeViewTextView = findViewById((R.id.welcomeView));

        /* Initialize mLoggerTextView . */
        mLoggerTextView = findViewById((R.id.activity_main_text_view_log));
        mLoggerTextView.setVisibility(View.GONE);

        /* Initialize hideShowButton . */
        hideShowButton = findViewById(R.id.hideshowButton);
        hideShowButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showLogger = !showLogger;
                if(showLogger)
                {
                    mLoggerTextView.setVisibility(View.VISIBLE);
                    hideShowButton.setText(getResources().getString(R.string.Hide));
                }
                else
                {
                    hideShowButton.setText(getResources().getString(R.string.Show));
                    mLoggerTextView.setVisibility(View.GONE);
                }
            }
        });

        /* Initialize oldESDButton . */
        oldESDButton = findViewById(R.id.oldESDButton);
        oldESDButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                OldEsdTestActivity();
            }
        });
        oldESDButton.setEnabled(false);

        /* Initialize newESDButton . */
        newESDButton = findViewById(R.id.newESDButton);
        newESDButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                StartEsdTestActivity();
            }
        });
        newESDButton.setEnabled(false);

        /* Initialize logOutButton . */
        logOutButton = findViewById(R.id.logOutButton);
        logOutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                cardScanned = false;
                logOutButton.setEnabled(false);
                oldESDButton.setEnabled(false);
                newESDButton.setEnabled(false);
                welcomeViewTextView.setText("");
                userHintTextView.setText(getResources().getString(R.string.ScanCard));
                userHintImageView.setVisibility(View.VISIBLE);
                userHintImageView.setVisibility(View.VISIBLE);
            }
        });
        logOutButton.setEnabled(false);

        if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {

            Toast.makeText(this, R.string.error_bluetooth_le_not_supported,
                    Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        /*
         * Initializes a Bluetooth adapter.  For API level 18 and above, get a reference to
         * BluetoothAdapter through BluetoothManager.
         */
        final BluetoothManager bluetoothManager =
                (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        if (bluetoothManager != null) {
            mBluetoothAdapter = bluetoothManager.getAdapter();
        }

        /* Checks if Bluetooth is supported on the device. */
        if (mBluetoothAdapter == null) {

            Toast.makeText(this, R.string.error_bluetooth_not_supported, Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        /* Get the Bluetooth terminal manager. */
        mManager = BluetoothSmartCard.getInstance(this).getManager();
        if (mManager == null) {

            Toast.makeText(this, R.string.error_bluetooth_not_supported, Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        /* Get the terminal factory. */
        mFactory = BluetoothSmartCard.getInstance(this).getFactory();
        if (mFactory == null) {

            Toast.makeText(this, R.string.error_bluetooth_provider_not_found,
                    Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        /* Initialize terminal spinner. */
        mTerminalAdapter = new TerminalAdapter(this, android.R.layout.simple_spinner_item);
        mTerminalAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mTerminalSpinner = findViewById(R.id.activity_main_spinner_terminal);
        mTerminalSpinner.setAdapter(mTerminalAdapter);

        /* Initialize Scan button. */
        mHandler = new Handler();



        /* Initialize UserHintTextView . */
        userHintTextView = findViewById(R.id.UserHintTextView);
        //userHintTextView.setText();

        /* Initialize UserHintImageView . */
        userHintImageView = findViewById(R.id.UserHintImg);
        userHintImageView.setEnabled(false);


        /* Initialize Log text view. */
        mLogTextView = findViewById(R.id.activity_main_text_view_log);

        /* Initialize the logger. */
        mLogger = new Logger(this, mLogTextView);

        /* Restore the contents. */
        if (savedInstanceState != null) {

            mLogTextView.setText(savedInstanceState.getCharSequence(STATE_LOG));

        }

        /* Hide input window. */
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);

        /*Check and or get location permission*/
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            // Permission is not granted
            // Should we show an explanation?
            if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                    Manifest.permission.ACCESS_COARSE_LOCATION)) {
                new AlertDialog.Builder(this)
                        .setTitle(getResources().getString(R.string.permissionTitle))
                        .setMessage(getResources().getString(R.string.permissionExplanation))
                        .setPositiveButton(getResources().getString(R.string.allow), new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                ActivityCompat.requestPermissions(MainActivity.this,new String[]{Manifest.permission.ACCESS_COARSE_LOCATION},REQUEST_ACCESS_COARSE_LOCATION);
                            }
                        })
                        .setNegativeButton(getResources().getString(R.string.deny), new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                            }
                        })
                        .create().show();

                // Show an explanation to the user *asynchronously* -- don't block
                // this thread waiting for the user's response! After the user
                // sees the explanation, try again to request the permission.
            } else {
                // No explanation needed; request the permission
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.ACCESS_COARSE_LOCATION},
                        REQUEST_ACCESS_COARSE_LOCATION);
                // MY_PERMISSIONS_REQUEST_READ_CONTACTS is an
                // app-defined int constant. The callback method gets the
                // result of the request.
            }
        }
        else
        {
            //Permission already given
            ConnectBlueToothReadCardLoop();
        }

    }


    private void ConnectBlueToothReadCardLoop()
    {
        new Thread(new Runnable() {
            public void run() {
                while(true)
                {
                    //Check if a card is already scanned and if so wait until the card has been logged out
                    while (cardScanned)
                    {}
                    boolean isConnected;
                    //Try and connect to the card reader
                    try
                    {
                        CardTerminal terminal = mTerminalAdapter.getTerminal(0);
                        //mLogger.logMsg("Terminal name is: " + terminal.getName());
                        terminal.isCardPresent();
                        isConnected = true;
                    }

                    catch (CardException e)
                    {
                        //mLogger.logMsg("CardException");
                        isConnected = false;
                    }
                    catch (Exception e)
                    {
                        //mLogger.logMsg("Random");
                        isConnected = false;
                    }

                    if(!isConnected)
                    {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                userHintTextView.setText(getResources().getString(R.string.ConnectingToCardReader));
                                userHintImageView.setVisibility(View.INVISIBLE);
                            }
                        });
                        connectTerminal();
                    }
                    else
                    {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                userHintTextView.setText(getResources().getString(R.string.ScanCard));
                                userHintImageView.setVisibility(View.VISIBLE);
                            }
                        });
                        //Function that gets the uid from the card
                        readCard(mTerminalAdapter.getTerminal(0));
                    }
                }

            }
        }).start();
    }

    private void connectTerminal() {
        // While not connected
        // Try to connect
        if(mTerminalAdapter.getCount()!=0)
        {
            return;
        }
        else
        {
            mLogger.logMsg("Scanning for bluetooth");
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mTerminalAdapter.clear();
                }
            });

            /* Start the scan. */
            proceed = false;
            mManager.startScan(BluetoothTerminalManager.TERMINAL_TYPE_ACR1255U_J1_V2, new BluetoothTerminalManager.TerminalScanCallback() {
                @Override
                public void onScan(CardTerminal terminal)
                {
                    mTerminalAdapter.addTerminal(terminal);
                    mLogger.logMsg("Bluetooth found");
                    mManager.stopScan();
                    //mLogger.logMsg(String.valueOf(mTerminalAdapter.getCount()));
                    proceed = true;


                }
            });
            mLogger.logMsg("Trying to connect");
            while(!proceed){}
            mLogger.logMsg("Connected");
        }
    }

    private void readCard(CardTerminal terminal) {
        // While we are connected
        // Read card
        // If not connected, connect again

        mLogger.logMsg("Trying to read card");
        // Read card
        try {
            // Connect to the card.
            while (!terminal.isCardPresent())
            {
                // if we are disconnected from terminal, reconnect
            }
            mLogger.logMsg("Connecting to the card (%s, direct)...",
                    terminal.getName());

            Card card = terminal.connect("T=1");

            // Requests a response containing the cards unique UID.
            CardChannel channel = card.getBasicChannel();
            CommandAPDU commandAPDU = new CommandAPDU(new byte[]{(byte) 0xFF, (byte) 0xCA, (byte) 0x00, (byte) 0x00, (byte) 0x00});
            responseAPDU = channel.transmit(commandAPDU);
            Log.d(TAG, responseAPDU.toString());
            mLogger.logBuffer(responseAPDU.getBytes());

            // Disconnect from the card.
            mLogger.logMsg("Disconnecting from the card (%s)...",
                    terminal.getName());

            card.disconnect(false);


            //Check token and the call our ProcessCardID()
            //Authorization.vl = this;
            //Authorization.GetJWT(this); // check token and then run our callback "Maincallback()"
            ProcessCardID(responseAPDU);


            while (terminal.isCardPresent())
            {
                // if we are disconnected from terminal, reconnect
            }
        }
        catch (CardException e)
        {
            mLogger.logMsg("Error: %s", e.getMessage());
            Throwable cause = e.getCause();
            if (cause != null) {
                mLogger.logMsg("Cause: %s", cause.getMessage());
            }
        }
    }

    public void ProcessCardID(ResponseAPDU resp)
    {
        // Gets the first 4 bytes of the response (excluding 90 00). Then converts to an int.
        byte[] bytes = Arrays.copyOfRange(resp.getBytes(), 0, 4);
        final int uid = ByteBuffer.wrap(bytes).getInt();
        mLogger.logMsg("Card UID is: ");
        mLogger.logBuffer(bytes);
        mLogger.logMsg(String.valueOf(uid));

        if(Authorization.jwt == "")
        {
            mLogger.logMsg("Unable to acquire token: " + Authorization.jwt);
        }
        else
        {
            mLogger.logMsg("Token Valid");
        }

        // Make HTTP request to backend.
        final int localUid = uid;

        RequestQueue queue = Volley.newRequestQueue(this);
        String url = backendIP + "/employee/by_card/" + String.valueOf(localUid);
        mLogger.logMsg(url);

        // prepare the Request
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                (Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
                   @Override
                    public void onResponse(final JSONObject response) {
                        mLogger.logMsg("Response: " + response.toString());
                        try {
                            employeeId = response.getString("id");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        try {
                            cardUId = Long.parseLong(response.getString("cardUid"));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        runOnUiThread(new Runnable()
                        {
                            @Override
                            public void run() {
                                String firstName = "";
                                try {
                                    firstName = response.getString("firstName");
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }

                                String lastName = "";
                                try {
                                    lastName = response.getString("lastName");
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                oldESDButton.setEnabled(true);
                                newESDButton.setEnabled(true);
                                logOutButton.setEnabled(true);
                                String welcome = getString(R.string.main_welcome, firstName + " " + lastName);
                                welcomeViewTextView.setText(welcome);
                                userHintImageView.setVisibility(View.INVISIBLE);
                                userHintTextView.setText("");
                                cardScanned = true;
                            }
                        });
                    }
                },  new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        NetworkResponse networkResponse = error.networkResponse;
                        mLogger.logMsg(String.valueOf(error));

                        if (networkResponse != null ) {
                            mLogger.logMsg(String.valueOf(networkResponse.statusCode));
                            if(networkResponse.statusCode == 404)
                            {
                                mLogger.logMsg("Kortet har ingen användare");
                                StartRegisterActivity(localUid);
                            }

                            if(networkResponse.statusCode == 500)
                            {
                                mLogger.logMsg("Kunde inte nå databasen");
                            }
                            // HTTP Status Code: 401 Unauthorized
                        }
                        else
                        {
                            mLogger.logMsg("Kunde inte nå databasen");
                            mLogger.logMsg("Testa en annan ip adress");
                        }
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

        // add it to the RequestQueue
        queue.add(jsonObjectRequest);
    }


    @Override
    public void onDialogPositiveClick(DialogFragment dialog) {
        /* Get the selected card terminal. */
        int index = mTerminalSpinner.getSelectedItemPosition();
        if (index == AdapterView.INVALID_POSITION) {

            mLogger.logMsg("Error: Card terminal not selected");
            return;
        }

        /* Save the settings. */
        MasterKeyDialogFragment fragment = (MasterKeyDialogFragment) dialog;
        CardTerminal terminal = mTerminalAdapter.getTerminal(index);
        SharedPreferences sharedPref = getSharedPreferences(
                "com.acs.bletest." + terminal.getName(), Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putBoolean(KEY_PREF_USE_DEFAULT_KEY, fragment.isDefaultKeyUsed());
        editor.putString(KEY_PREF_NEW_KEY, fragment.getNewKey());
        editor.apply();

        /* Set the master key. */
        mLogger.logMsg("Setting the master key (%s)...", terminal.getName());
        try {
            mManager.setMasterKey(terminal, fragment.isDefaultKeyUsed() ?
                    null : Hex.toByteArray(fragment.getNewKey()));
        } catch (IllegalArgumentException e) {
            mLogger.logMsg("Error: %s", e.getMessage());
        }
    }

    @Override
    public void onDialogNegativeClick(DialogFragment dialog) {
        dialog.getDialog().cancel();
    }

    @Override
    protected void onResume() {
        super.onResume();

        /*
         * Ensures Bluetooth is enabled on the device.  If Bluetooth is not currently enabled,
         * fire an intent to display a dialog asking the user to grant permission to enable it.
         */
        if (!mBluetoothAdapter.isEnabled()) {

            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        /* User chose not to enable Bluetooth. */
        if ((requestCode == REQUEST_ENABLE_BT) && (resultCode == Activity.RESULT_CANCELED)) {
            finish();
            return;
        }

        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        /* Save the contents. */
        //outState.putCharSequence(STATE_FILENAME, mFilenameTextView.getText());
        outState.putCharSequence(STATE_LOG, mLogTextView.getText());
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        boolean dontShowAgainInfo = true;
        if (requestCode == REQUEST_ACCESS_COARSE_LOCATION) {
            if ((grantResults.length > 0)
                    && (grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
                dontShowAgainInfo = false;
                ConnectBlueToothReadCardLoop();
            }
            boolean showRationale = shouldShowRequestPermissionRationale( permissions[0]);
            if (!showRationale && dontShowAgainInfo) {
                //User has chosen don't show again when asked for a permission, we now need to explain why the will never
                //again ask for location permission,why that's a problem and how to fix it.
                new AlertDialog.Builder(this)
                        .setTitle(getResources().getString(R.string.DontShowTitle))
                        .setMessage(getResources().getString(R.string.DontShowExplanaition))
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                            }
                        })
                        .create().show();
            }

        } else if (requestCode == REQUEST_ACCESS_WRITE_EXTERNAL_STORAGE) {

            if ((grantResults.length > 0)
                    && (grantResults[0] == PackageManager.PERMISSION_GRANTED)) {

                new FileChooser(this).setFileListener(
                        new FileChooser.FileSelectedListener() {

                            @Override
                            public void fileSelected(File file) {
                                mFilenameTextView.setText(file.getAbsolutePath());
                            }
                        }).showDialog();
            }

        } else {

            super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(final MenuItem item) {

        boolean ret = true;

        switch (item.getItemId()) {
            case R.id.menu_get_battery_level: {
                /* Get the selected card terminal. */
                int index = mTerminalSpinner.getSelectedItemPosition();
                if (index == AdapterView.INVALID_POSITION) {

                    mLogger.logMsg("Error: Card terminal not selected");
                    break;
                }

                /* Get the battery level. */
                final CardTerminal terminal = mTerminalAdapter.getTerminal(index);
                item.setEnabled(false);
                new Thread(new Runnable() {

                    @Override
                    public void run() {
                        try {

                            mLogger.logMsg("Getting the battery level (%s)...", terminal.getName());
                            int batteryLevel = mManager.getBatteryLevel(terminal, 10000);
                            if (batteryLevel < 0) {
                                mLogger.logMsg("Battery Level: Not supported");
                            } else {
                                mLogger.logMsg("Battery Level: %d%%", batteryLevel);
                            }

                        } catch (CardException e) {

                            mLogger.logMsg("Error: %s", e.getMessage());
                            Throwable cause = e.getCause();
                            if (cause != null) {
                                mLogger.logMsg("Cause: %s", cause.getMessage());
                            }
                        }

                        runOnUiThread(new Runnable() {

                            @Override
                            public void run() {
                                item.setEnabled(true);
                            }
                        });
                    }
                }).start();
                break;
            }

            case R.id.menu_settings:
                Intent intent = new Intent(this, SettingsActivity.class);
                startActivity(intent);
                break;

            default:
                ret = super.onOptionsItemSelected(item);
                break;
        }

        return ret;
    }

    private void StartRegisterActivity(int cardNumber)
    {
        Intent intent = new Intent(this, RegisterActivity.class);
        intent.putExtra("CardNumber", cardNumber);
        intent.setFlags(intent.getFlags() | Intent.FLAG_ACTIVITY_NO_HISTORY);
        startActivity(intent);
    }

    private void StartEsdTestActivity()
    {
        Intent intent = new Intent(this, EsdTestActivity.class);
        intent.putExtra("Id", employeeId);
        intent.setFlags(intent.getFlags() | Intent.FLAG_ACTIVITY_NO_HISTORY);
        startActivity(intent);
    }

    private void OldEsdTestActivity()
    {
        Intent intent = new Intent(this, ViewPreviousESDActivity.class);
        intent.putExtra("CardNumber", cardUId);
        intent.setFlags(intent.getFlags() | Intent.FLAG_ACTIVITY_NO_HISTORY);
        startActivity(intent);
    }
}
