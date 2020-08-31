/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <AdhocSDK/AdhocSDK.h>
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import "SplashScreen.h"  //XXX Add for splash
#import "RCTMIPushModule.h"
#import "RCTPushNotificationManager.h"
#import <AppsFlyerTracker.h>
#import "SensorsAnalyticsSDK.h"
#import "JDPAuthSDK.h"
#import "JVERIFICATIONService.h"

//#define SA_SERVER_URL @"https://s-api.letote.cn/sa?project=production"
#define SA_SERVER_URL @"https://s-api.letote.cn/sa?project=default"

//   SensorsAnalyticsDebugOff - 关闭 Debug 模式
//   SensorsAnalyticsDebugOnly - 打开 Debug 模式，校验数据，但不进行数据导入
//   SensorsAnalyticsDebugAndTrack - 打开 Debug 模式，校验数据，并将数据导入到神策分析中
#define SA_DEBUG_MODE SensorsAnalyticsDebugOff

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  
#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  jsCodeLocation = [CodePush bundleURL];
#endif
  AdhocSDKConfig *config = [AdhocSDKConfig defaultConfig];
//  config.enableDebugAssist=YES;
  config.reportImmediatelyEnabled=YES;
  config.appKey = @"ADHOC_f0529524-7977-4d75-961c-ff7dcd461c23";
  [AdhocSDK startWithConfigure:config options:launchOptions];
  JVAuthConfig *cf = [[JVAuthConfig alloc] init];
  cf.appKey = @"b9c16825f136f7868ea0b907";
  [JVERIFICATIONService setupWithConfig:cf];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"letotecn"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [SplashScreen show];  //XXX Add for splash
  [RCTMIPushModule application:application didFinishLaunchingWithOptions:launchOptions];
  
  NSDictionary* userInfo = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
  if(userInfo){
    NSString *messageId = [userInfo objectForKey:@"_id_"];
    if (messageId!=nil) {
      [MiPushSDK openAppNotify:messageId];
    }
  }
  SAConfigOptions *options = [[SAConfigOptions alloc] initWithServerURL:SA_SERVER_URL launchOptions:launchOptions];
  options.autoTrackEventType = SensorsAnalyticsEventTypeAppStart | SensorsAnalyticsEventTypeAppEnd | SensorsAnalyticsEventTypeAppClick | SensorsAnalyticsEventTypeAppViewScreen;
  options.enableTrackAppCrash = YES;
  [SensorsAnalyticsSDK sharedInstanceWithConfig:options];
  [[JDPAuthSDK sharedJDPay] registServiceWithAppID:@"51b2565bbfe3460ba5e2ae21a28ee17e" merchantID:@"111147561003"];
  return YES;
}

// 点击通知进入应用
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [MiPushSDK handleReceiveRemoteNotification:userInfo];
    NSString *messageId = [userInfo objectForKey:@"_id_"];
    [MiPushSDK openAppNotify:messageId];
  }
  completionHandler();
}

// ios 8.x or older
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  [[AppsFlyerTracker sharedTracker] handleOpenURL:url sourceApplication:sourceApplication withAnnotation:annotation];
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}

// ios 9.0+
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
            options:(NSDictionary<NSString*, id> *)options
{
  if([options[@"UIApplicationOpenURLOptionsSourceApplicationKey"] isEqualToString:@"com.360buy.jdmobile"]){
      [[JDPAuthSDK sharedJDPay] handleOpenURL:url];
  }
  [[AppsFlyerTracker sharedTracker] handleOpenUrl:url options:options];
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  
  [RCTMIPushModule application:application didRegisterUserNotificationSettings:notificationSettings];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTMIPushModule application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  [[AppsFlyerTracker sharedTracker] registerUninstall:deviceToken];
  
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  NSString *messageId = [notification objectForKey:@"_id_"];
  [MiPushSDK openAppNotify:messageId];
  [RCTMIPushModule application:application didReceiveRemoteNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RCTMIPushModule application:application didReceiveLocalNotification:notification];
}

// ios 10
// 应用在前台收到通知
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  [RCTMIPushModule userNotificationCenter:center willPresentNotification:notification withCompletionHandler:completionHandler];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler{
  [[AppsFlyerTracker sharedTracker] continueUserActivity:userActivity restorationHandler:restorationHandler];
  return YES;
}


@end
