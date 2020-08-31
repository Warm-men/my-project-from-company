#如果使用了 MultiDex ，请确保神策 Android SDK 的代码都指定到主 DEX 中。
#可以通过在 multiDexKeepProguard 里添加如下配置：
-keep class com.sensorsdata.analytics.android.** { *; }
