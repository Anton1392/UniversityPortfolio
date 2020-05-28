package com.acs.bletest;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.AppCompatDialogFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;

public class MasterKeyDialogFragment extends AppCompatDialogFragment {

    /**
     * Interface definition for a callback to be invoked when positive or negative button is
     * clicked.
     */
    public interface MasterKeyDialogListener {

        /**
         * Called when the positive button is clicked.
         *
         * @param dialog the dialog fragment
         */
        void onDialogPositiveClick(DialogFragment dialog);

        /**
         * Called when the negative button is clicked.
         *
         * @param dialog the dialog fragment
         */
        void onDialogNegativeClick(DialogFragment dialog);
    }

    private MasterKeyDialogListener mListener;
    private CheckBox mUseDefaultKeyCheckBox;
    private EditText mNewKeyEditText;
    private String mTerminalName;
    private boolean mDefaultKeyUsed;
    private String mNewKey;

    @Override
    public void onAttach(Context context) {

        super.onAttach(context);
        try {
            mListener = (MasterKeyDialogListener) context;
        } catch (ClassCastException e) {
            throw new ClassCastException(context.toString()
                    + " must implement MasterKeyDialogListener");
        }
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        LayoutInflater inflater = getActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.dialog_master_key, null);

        TextView textView = view.findViewById(R.id.dialog_master_key_terminal_name);
        textView.setText(mTerminalName);

        mUseDefaultKeyCheckBox = view.findViewById(R.id.dialog_master_key_use_default_key);
        mUseDefaultKeyCheckBox.setChecked(mDefaultKeyUsed);
        mUseDefaultKeyCheckBox.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                mNewKeyEditText.setEnabled(!mUseDefaultKeyCheckBox.isChecked());
            }
        });

        mNewKeyEditText = view.findViewById(R.id.dialog_master_key_new_key);
        mNewKeyEditText.setEnabled(!mUseDefaultKeyCheckBox.isChecked());
        mNewKeyEditText.setText(mNewKey);

        builder.setTitle(R.string.set_master_key)
                .setView(view)
                .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {

                    @Override
                    public void onClick(DialogInterface dialog, int which) {

                        mDefaultKeyUsed = mUseDefaultKeyCheckBox.isChecked();
                        mNewKey = Hex.toHexString(Hex.toByteArray(
                                mNewKeyEditText.getText().toString()));
                        mListener.onDialogPositiveClick(MasterKeyDialogFragment.this);
                    }
                })
                .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {

                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        mListener.onDialogNegativeClick(MasterKeyDialogFragment.this);
                    }
                });

        return builder.create();
    }

    /**
     * Gets the terminal name.
     *
     * @return the terminal name
     */
    public String getTerminalName() {
        return mTerminalName;
    }

    /**
     * Sets the terminal name.
     *
     * @param terminalName the terminal name
     */
    public void setTerminalName(String terminalName) {
        mTerminalName = terminalName;
    }

    /**
     * Returns {@code true} if the default key is used.
     *
     * @return {@code true} if the default key is used, otherwise {@code false}.
     */
    public boolean isDefaultKeyUsed() {
        return mDefaultKeyUsed;
    }

    /**
     * Sets {@code true} to use the default key.
     *
     * @param defaultKeyUsed {@code true} if the default key is used, otherwise {@code false}.
     */
    public void setDefaultKeyUsed(boolean defaultKeyUsed) {
        mDefaultKeyUsed = defaultKeyUsed;
    }

    /**
     * Gets the new key.
     *
     * @return the new key
     */
    public String getNewKey() {
        return mNewKey;
    }

    /**
     * Sets the new key.
     *
     * @param newKey the new key
     */
    public void setNewKey(String newKey) {
        mNewKey = newKey;
    }
}
