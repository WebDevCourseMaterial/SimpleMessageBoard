package edu.rosehulman.simplemessageboard_solution;

import java.io.IOException;
import java.util.ArrayList;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;


public class WebAdapter {
    
    private static final String URL = "http://rose-simple-message-board.appspot.com/api";
    
    private JSONObject getJsonData() {
        HttpClient httpclient = new DefaultHttpClient();
        HttpGet httpget = new HttpGet(URL);
        try {
            // Execute HTTP "get" request
            String responseBody = httpclient.execute(httpget, new BasicResponseHandler());
            return new JSONObject(responseBody);
        } catch (ClientProtocolException e) {
            Log.e(MainActivity.TAG, "Error in JSON (Client Protocol): " + e.getMessage());
            return new JSONObject();
        } catch (IOException e) {
            Log.e(MainActivity.TAG, "Error in JSON (IOException): " + e.getMessage());
            return new JSONObject();
        } catch (JSONException e) {
            Log.e(MainActivity.TAG, "Error in JSON (JSONException): " + e.getMessage());
            return new JSONObject();
        }
    }
    
    public String getOneMessageComment() {
        try {
        	JSONArray result = getJsonData().getJSONArray("messages");
        	JSONObject message = result.getJSONObject(0);
            return message.getString("comment");
        } catch (JSONException e) {
            Log.e(MainActivity.TAG, "Error in JSON: " + e.getMessage());
            return "JSON ERROR!";
        }
    }
    
    public ArrayList<Message> getMessages() {
    	ArrayList<Message> messagesList = new ArrayList<Message>();
        try {
        	JSONArray messagesJson = getJsonData().getJSONArray("messages");
        	for (int i = 0; i < messagesJson.length();i++) {
        		JSONObject message = messagesJson.getJSONObject(i);
        		messagesList.add(new Message(message.getString("author"), message.getString("comment")));
         	} 
        	return messagesList;
        } catch (JSONException e) {
            Log.e(MainActivity.TAG, "Error in JSON: " + e.getMessage());
            return messagesList;
        }
    }
    
    public boolean postMessage(Message newMessage) {
    	Message reply = null;
    	JSONObject replyJson = sendJsonData(newMessage.toJson());
    	try {
			reply = new Message(replyJson.getString("author"), replyJson.getString("comment"));
		} catch (JSONException e) {
			e.printStackTrace();
		}
    	
    	// TODO: See if the message was added and sent back with a timestamp.
    	
    	return true;
    }
    private JSONObject sendJsonData(JSONObject newMessageJson) {
        HttpClient httpclient = new DefaultHttpClient();
        HttpPost httppost = new HttpPost(URL);
        try {
            // Execute HTTP "post" request
        	Log.d(MainActivity.TAG, "Sending " + newMessageJson.toString());
            StringEntity newMessageStringEntity = new StringEntity(newMessageJson.toString());
            newMessageStringEntity.setContentType("application/json;charset=UTF-8");
            httppost.setEntity(newMessageStringEntity);
            String responseBody = httpclient.execute(httppost, new BasicResponseHandler());
            Log.d(MainActivity.TAG, "responseBody = " + responseBody);
            return new JSONObject(responseBody);
        } catch (ClientProtocolException e) {
            Log.e(MainActivity.TAG, "Error in JSON (Client Protocol): " + e.getMessage());
            return new JSONObject();
        } catch (IOException e) {
            Log.e(MainActivity.TAG, "Error in JSON (IOException): " + e.getMessage());
            return new JSONObject();
        } catch (JSONException e) {
            Log.e(MainActivity.TAG, "Error in JSON (JSONException): " + e.getMessage());
            return new JSONObject();
        }
    }
}
