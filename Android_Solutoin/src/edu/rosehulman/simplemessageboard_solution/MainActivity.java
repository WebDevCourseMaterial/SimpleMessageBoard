package edu.rosehulman.simplemessageboard_solution;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
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
				String authorText = mAuthorEditText.getText().toString();
				String commentText = mCommentEditText.getText().toString();
				Message newMessage = new Message(authorText, commentText);
				new PostMessageTask().execute(newMessage);
				mAuthorEditText.setText("");
				mCommentEditText.setText("");
			}
		});
	}
	
	@Override
	protected void onStart() {
		super.onStart();
		new UpdateMessageListTask().execute();
	}

	/**
	 * Update the list view with new messages from the backend using a GET request.
	 *
	 * @author Dave Fisher (fisherds@gmail.com)
	 */
	private class UpdateMessageListTask extends
			AsyncTask<Void, Void, ArrayList<Message>> {
		@Override
		protected ArrayList<Message> doInBackground(Void... params) {
			ArrayList<Message> messagesList = new ArrayList<Message>();
			try {
				JsonNetworkClient jsonNetworkClient = new JsonNetworkClient();
				JSONObject responseJson = jsonNetworkClient.getJsonData(URL);
				JSONArray messagesJson = responseJson.getJSONArray("messages");
				// Create an ArrayList from the JSONArray.
				for (int i = 0; i < messagesJson.length(); i++) {
					JSONObject message = messagesJson.getJSONObject(i);
					messagesList.add(new Message(message.getString("author"),
							message.getString("comment")));
				}
			} catch (JSONException e) {
				Log.e(MainActivity.TAG, "Error in JSON: " + e.getMessage());
			}
			return messagesList;
		}

		@Override
		protected void onPostExecute(final ArrayList<Message> result) {
			ArrayAdapter<Message> adapter = new ArrayAdapter<Message>(
					MainActivity.this, android.R.layout.simple_list_item_1,
					result);
			mMessageListView.setAdapter(adapter);
		}
	}

	/**
	 * Add a new message to the backend using a POST request.   Then update the list view
	 * with the latest messages.
	 */
	private class PostMessageTask extends AsyncTask<Message, Void, Boolean> {
		@Override
		protected Boolean doInBackground(Message... messages) {
			Message reply = null;
			Message newMessage = messages[0];
			JsonNetworkClient jsonNetworkClient = new JsonNetworkClient();
			JSONObject replyJson = jsonNetworkClient.postJsonData(URL,
					newMessage.toJson());
			try {
				JSONObject messageJson = replyJson.getJSONObject("message");
				reply = new Message(messageJson.getString("author"),
						messageJson.getString("comment"));
			} catch (JSONException e) {
				e.printStackTrace();
			}
			return reply.equals(newMessage);
		}

		@Override
		protected void onPostExecute(Boolean success) {
			Log.d(TAG, "Finished POST with success = " + success);
			if (success) {
				new UpdateMessageListTask().execute();
			}
		}
	}
}
