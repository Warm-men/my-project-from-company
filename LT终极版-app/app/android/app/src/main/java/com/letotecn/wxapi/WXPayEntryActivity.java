package com.letotecn.wxapi;

/**
 * Created by okct on 07/02/2018.
 */

import android.app.Activity;
import android.os.Bundle;
import com.theweflex.react.WeChatModule;

public class WXPayEntryActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WeChatModule.handleIntent(getIntent());
        finish();
    }
}