package edu.rosehulman.simplemessageboard_start;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;

/**
 * Activity that allows a user to send POST data to a backend server and display
 * a list of results from a GET request to that backend.
 *
 * @author Dave Fisher (fisherds@gmail.com)
 */
public class MainActivity extends Activity {

	public static final String TAG = "SimpleMessageBoard";
	public static final String URL = "http://rose-simple-message-board.appspot.com/api";
	private ListView mMessageListView;
	private EditText mAuthorEditText;
	private EditText mCommentEditText;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		mMessageListView = (ListView) findViewById(R.id.message_list_view);
		mAuthorEditText = (EditText) findViewById(R.id.author_edit_text);
		mCommentEditText = (EditText) findViewById(R.id.comment_edit_text);

		Button submitButton = (Button) findViewById(R.id.submit_button);
		submitButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				postMessage();
			}
		});
		
		mCommentEditText.setOnKeyListener(new View.OnKeyListener() {			
			public boolean onKey(View v, int keyCode, KeyEvent event) {
				if (keyCode == KeyEvent.KEYCODE_ENTER) {
					if (event.getAction() == KeyEvent.ACTION_DOWN) {
						postMessage();						
					}
					return true;
				}
				return false;
			}
		});
	}
	
	private void postMessage() {
		String authorText = mAuthorEditText.getText().toString();
		String commentText = mCommentEditText.getText().toString();
		Message newMessage = new Message(authorText, commentText);
		mCommentEditText.setText("");
		// TODO: Post the message
	}
	
	@Override
	protected void onStart() {
		super.onStart();
		// TODO: Update the list view.
	}

}
