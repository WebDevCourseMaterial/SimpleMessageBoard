package edu.rosehulman.simplemessageboardandroidwebview_solution;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;

public class WebViewWrapperActivity extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_view_wrapper);
        WebView myWebView = (WebView) findViewById(R.id.webview);
        myWebView.getSettings().setJavaScriptEnabled(true);
        myWebView.loadUrl("http://rose-simple-message-board.appspot.com");
    }
}
