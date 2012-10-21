package edu.rosehulman.simplemessageboard_solution;

import org.json.JSONException;
import org.json.JSONObject;

public class Message {

	private String mAuthor;
	private String mComment;
	
	public Message(String author, String comment) {
		mAuthor = author;
		mComment = comment;
	}

	public String getAuthor() {
		return mAuthor;
	}

	public String getComment() {
		return mComment;
	}
	
	@Override
	public String toString() {
		return mAuthor + " - " + mComment;
	}
	
	public JSONObject toJson() {
		JSONObject jsonMessage = new JSONObject();
		try {
			jsonMessage.put("author", mAuthor);
			jsonMessage.put("comment", mComment);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonMessage;
	}
}
