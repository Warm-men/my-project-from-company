package com.letotecn;

import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

import com.adhoc.adhocsdk.AdhocTracker;
import com.adhoc.config.AdhocConfig;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.appadhoc.module.AppadhocPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.syanpicker.RNSyanImagePickerPackage;
import cn.jpush.reactnativejvrification.JVerificationPackage;

import cn.jiguang.verifysdk.api.JVerificationInterface;
import com.brentvatne.react.ReactVideoPackage;
import com.reactalipay.AlipayPackage;
import jdpay.RNJdpayPackage;
import com.rnsensors.RNSensorsPackage;
import com.beefe.picker.PickerViewPackage;
import com.appsflyer.reactnative.RNAppsFlyerPackage;
import com.reactintent.RNLetoteIntentPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.react.rnspinkit.RNSpinkitPackage;
import com.ichong.zzy.mipush.MIPushPackage;
import com.lenny.module.udesk.UdeskPackage;
import com.lenny.modules.upgrade.UpgradeReactPackage;
import com.sensorsdata.analytics.android.sdk.SensorsDataAPI;
import com.theweflex.react.WeChatPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.reactlibrary.RNAnalyticsPackage;
import com.zsc.RNWebViewPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {
    // 引入神策分析 SDK

    // 数据接收的 URL
    // final String SA_SERVER_URL = "https://s-api.letote.cn/sa?project=production";
    final String SA_SERVER_URL = "https://s-api.letote.cn/sa?project=default";

    final static String JD_PAY_APP_ID = "51b2565bbfe3460ba5e2ae21a28ee17e";

    // Debug 模式选项
    //   SensorsDataAPI.DebugMode.DEBUG_OFF - 关闭 Debug 模式
    //   SensorsDataAPI.DebugMode.DEBUG_ONLY - 打开 Debug 模式，校验数据，但不进行数据导入
    //   SensorsDataAPI.DebugMode.DEBUG_AND_TRACK - 打开 Debug 模式，校验数据，并将数据导入到神策分析中
    // 注意！请不要在正式发布的 App 中使用 Debug 模式！
    final SensorsDataAPI.DebugMode SA_DEBUG_MODE = SensorsDataAPI.DebugMode.DEBUG_OFF;




    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new SvgPackage(),
            new RNCWebViewPackage(),
            new RNViewShotPackage(),
                    new AppadhocPackage(),
                    new RNGestureHandlerPackage(),
                    new RNSyanImagePickerPackage(),
                    new JVerificationPackage(),
                    new AlipayPackage(),
                    new RNJdpayPackage(JD_PAY_APP_ID),
                    new RNSensorsPackage(),
                    new RNAppsFlyerPackage(),
                    new RNLetoteIntentPackage(),
                    new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG),
                    new ReactVideoPackage(),
                    new VectorIconsPackage(),
                    new SplashScreenReactPackage(),
                    new RNSpinkitPackage(),
                    new PickerViewPackage(),
                    new MIPushPackage(),
                    new WeChatPackage(),
                    new UpgradeReactPackage(),
                    new UdeskPackage(),
                    new FastImageViewPackage(),
                    new RNAnalyticsPackage(),
                    new RNWebViewPackage(),
                    new CookieManagerPackage(),
                    new LottiePackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        AdhocConfig adhocConfig = new AdhocConfig.Builder()
                .reportImmediately()
                // .enableDebugAssist(true)
                //设置App上下文(必要参数)
                .context(this)
                //设置Appkey(必要参数)
                .appKey("ADHOC_bf9ee63f-24c3-49f7-9ca2-fbec5f693d10")
                //全部配置参考官网
                .build();

        AdhocTracker.init(adhocConfig);
        initSDK(this);
        JVerificationInterface.init(this);
    }


    public void initSDK(Context reactContext) {
        SensorsDataAPI.sharedInstance(
                reactContext,                       // 传入 Context
                SA_SERVER_URL,                      // 数据接收的 URL
                SA_DEBUG_MODE).trackAppCrash();
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}
