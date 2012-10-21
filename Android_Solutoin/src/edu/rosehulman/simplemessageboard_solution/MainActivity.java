package edu.rosehulman.simplemessageboard_solution;

import java.util.ArrayList;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;

public class MainActivity extends Activity {

	public static final String TAG = "MessageBoard";
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
				Log.d(TAG, "Post using." + mAuthorEditText.getText().toString()
						+ " - " + mCommentEditText.getText().toString());
				String author = mAuthorEditText.getText().toString();
				String comment = mCommentEditText.getText().toString();
				Message newMessage = new Message(author, comment);
				new PostMessageTask().execute(newMessage);
				mAuthorEditText.setText("");
				mCommentEditText.setText("");
			}
		});

		new FetchMessagesTask().execute();
	}

	private class FetchMessagesTask extends
			AsyncTask<String, Void, ArrayList<Message>> {
		@Override
		protected ArrayList<Message> doInBackground(String... urls) {
			WebAdapter webAdapter = new WebAdapter();
			return webAdapter.getMessages();
		}

		@Override
		protected void onPostExecute(ArrayList<Message> result) {
			// for (Message message : result) {
			// Log.d(TAG, message.toString());
			// }
			ArrayAdapter<Message> adapter = new ArrayAdapter<Message>(
					MainActivity.this, android.R.layout.simple_list_item_1,
					result);
			mMessageListView.setAdapter(adapter);
		}
	}
	// private class FetchMessagesTask extends AsyncTask<String, Void, String> {
	// @Override
	// protected String doInBackground(String... urls) {
	// WebAdapter webAdapter = new WebAdapter();
	// return webAdapter.getOneMessage();
	// }
	//
	// @Override
	// protected void onPostExecute(String result) {
	// Log.d(TAG, result);
	// }
	// }

	private class PostMessageTask extends
			AsyncTask<Message, Void, Boolean> {
		@Override
		protected Boolean doInBackground(Message... messages) {
			WebAdapter webAdapter = new WebAdapter();
			return webAdapter.postMessage(messages[0]);
		}

		@Override
		protected void onPostExecute(Boolean success) {
			 Log.d(TAG, "Finished posting a message");
			 new FetchMessagesTask().execute();
		}
	}
}
