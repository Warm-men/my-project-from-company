 # Letote App
 React Native App for LT

 # Setup
 * Buy a Mac
 * Open Terminal
 * Install Homebrew `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
 * brew install git
 * Open Mac App Store
 * Download latest XCode (>9)
 * Open Terminal, `xcode-select --install`
 * Setup your git's SSH keys following github.com's instruction
 * Open Terminal
 * `git clone this-private-repo`
 * `cd this-private-repo`
 * `brew install node`
 * If you are behind the infamous GFW, setup your npm mirror first.
 ```
 alias cnpm="npm --registry=https://registry.npm.taobao.org \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npm.taobao.org/dist \
--userconfig=$HOME/.cnpmrc"

# Or alias it in .bashrc or .zshrc
$ echo '\n#alias for cnpm\nalias cnpm="npm --registry=https://registry.npm.taobao.org \
  --cache=$HOME/.npm/.cache/cnpm \
  --disturl=https://npm.taobao.org/dist \
  --userconfig=$HOME/.cnpmrc"' >> ~/.zshrc && source ~/.zshrc
 ```
 and use `cnpm` to install.
 * `npm up npm -g`
 * `npm install`
 * `npm install react-native-cli -g`
 * `npm install react-native-git-upgrade -g`
 * Copy four files `boost_1_63_0.tar.gz`, `double-conversion-1.1.5.tar.gz`,`folly-2016.09.26.00.tar.gz`,`glog-0.3.4.tar.gz` to your `~/.rncache/` directory. NOTE: Ask other teammates for these files.
 * `react-native link` to link all the native components
 * `react-native link lottie-ios` and `react-native link lottie-react-native` to link Lottie animation library
 * `react-native run-ios`
 * For the Android port, you should follow RN's official documents to install Android Studio、SDK(s)、AVD and run `react-native run-android`. NOTE: Before you actually run Android code, have a look the Android setup section.

 ## Android setup
 * Add `android:largeHeap="true"` to `android/app/src/main/AndroidManifest.xml`, it avoids OOM when decoding large images.
 * Add blurView support by inserting
 ```
 renderscriptTargetApi 20
 renderscriptSupportModeEnabled true
 ```
 to `defaultConfig` in `android/app/build.gradle`

 * Add Lottie support
 Modify `android/app/build.gradle` file
 ```
 android {
    compileSdkVersion 26 // <-- update this to 26
    buildToolsVersion "26.0.1" // <-- update this tp 26.0.1
 ```
 Modify `android/build.gradle` file to add Google maven repo
 ```
  allprojects {
     repositories {
         // Add jitpack repository (added by react-native-spinkit)
         maven { url "https://jitpack.io" }
         mavenLocal()
         jcenter()
         maven {
             url 'https://maven.google.com'
         }
         maven {
             // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
             url "$rootDir/../node_modules/react-native/android"
         }
     }
 }

 ```

 # How to contribute
 * Find some tasks or bugs in Teambition, self-assign it if nobody working on it.
 * `git checkout master`, then `git pull` to keep you updated.
 * `git checkout -b ${the_id_you_are_working_on}`, `${the_id_you_are_working_on}` is something like `DEV-234` listed on Teambition task cards.
 * Fix the code
 * run `npm run lint` or `npm run prettier`，fix all the warings and errors before you commit any change.
 * `git commit` and `git push` your changes, keep in mind that you need to do only one thing in a single commit.
 * Create a PR on Github page if you finished your work, and request somebody to review.
 ```
 Note: The PR title starts with the [${the_id_you_are_working_on}] strings to help others keep track what are you trying to do.
 ```
 * Reviewer will accept or reject your pull-request. Please fix the concerns and push following fixes to pass the review.
 * Reviewer will merge your changes to master and delete that branch.
 ```
 NOTE: Everyone should read this: [Git flight rules](https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md)
 ```

 # Release a new version
 You can't release a new version without the authorization of QA testers and Project owner.
 * Update your code in the master branch. `git checkout master; git pull`.
 * Tag. If your latest commit of master branch is the point you want to cut, then create a tag via `git tag -a v1.0.0 -m "Our first version for AppStore review."`. If you have to tag on arbitrary commit, ref to `https://git-scm.com/book/en/v2/Git-Basics-Tagging`.
 * We follow the semver: Major.Minor.Patch
 * Push the tag to master `git push origin v1.0.0`
 * Create a release in GitHub's releases page with this version, and provide your release notes.




 ***
 # 1.测试环境服务器相关

####  a.各测试环境IP
>为各测试环境IP配置主机名，访问时可使用主机名，方便记忆
>修改hosts文件
sudo vim /etc/hosts
```
# staging environment
52.83.144.5  letote-staging
52.83.144.5  letote-staging-db
52.83.217.197    letote-staging-bg
52.83.166.193  letote-size

# dev environment
52.83.224.191 letote-dev
52.83.224.191 letote-dev-db
52.83.236.160 letote-dev-bg

#dev2 environment
120.78.164.234 letote-dev2

#Marketing environment
52.82.0.60   marketing-staging
120.78.189.151   marketing-dev
```
#### b.为用户授权访问各服务器权限

>创建SSH Key：

`ssh-keygen -t rsa`

>查看本地ssh key

`cat ~/.ssh/id_rsa.pub`

>进入rails c 将公钥加入到各环境的授权文件中authorized_keys

```
ssh ubuntu@letote-dev
vim .ssh/authorized_keys
```
****

# 2.Tote流转过程
>以下流程中c代表Customer, t 代表tote，s代表subscription
```
c = Customer.where(telephone: "+86").last
t = c.totes.last
s = c.subscriptions.last
```

#### a.进入rails c终端
>下文中的t代表cd /var/www/letote/current

```
ssh ubuntu@letote-dev
t
bundle exec rails c
```

>登录App时，当发送验证码后，可通过手机号在Verification_codes表中查询验证码
```
VerificationCode.where(telephone: "+86").last
```

>支付时，可在subscription_types表中修改相应套餐的base_price字段来更改支付金额，
`SubscriptionType.find(18).update(base_price: 0.01)`

id|套餐类型
:---:|:---:
15|	10天度假套餐会员
16|	15天度假套餐会
18|	6+4月卡
19|	6+4季卡
20|	6+4年卡
23|	6+4员工会员月卡
24|	6+4员工会员季卡
25|	6+4员工会员年卡
26|	7+4创始会员月卡
27|	7+4创始会员季卡
28|	7+4创始会员年卡
29|	10天春节鸿运套餐会
30|	15天春节鸿运套餐会员


#### b.为非会员创建套餐（正常0元支付即可创建subscriptions，不需要自己创建）

>示例:为用户956366创建6+4月卡套餐
```
c = Customer.find(956366)
subscription_fee = SubscriptionFee.create!(
  checkout_by_customer: true,
  customer: c,
  price: 0,
  subscription_type_id: 18
)
subscription_fee.calculate_prices_and_capture_payment!
```
#### b1.为会员切换套餐
>示例:将用户956366的套餐, 改为6+4员工会员季卡
```
customer = Customer.find(956366)
subscription_type_internal_name = '6+4员工会员季卡'
changer = Commands::SubscriptionTypeChanger.new(subscription_id: customer.subscription.id)
success = changer.update!(subscription_type_internal_name)
```
#### c.未下单(styling,styled)
>用户购买会员后，会自动给用户的衣箱推荐衣服<br>衣箱未被推满时状态为styling<br>被推满后状态为styled

#### d.确认下单(locked)
>用户在新衣箱挑完衣服和配饰，提交地址下单后，状态会变为`locked`

>为用户创建实名认证信息
```
c= Customer.find id
  CustomerIdentity.create(customer_id: c.id, telephone: "13156666666", id_number: "421127199308024523", name: "托特", verified: true, created_at: "2019-01-22 02:52:19", updated_at: "2019-01-22 02:52:41", id_type: "id_card")
end
```

>查询所提交的下单的地址: `sa = c.shipping_address`

>修改所提交的下单的地址: `sa.update!(full_name: "Letote")`

#### e.模拟仓库打包(pulled)
>pulled意味仓库人员看到了用户下的单，已经开始处理
```
t.product_items.each { |p| p.pulled }
t.product_pulled
t.update!(pulled_at: Time.current)
```
#### f.模拟发货状态，并生成顺丰运单号（shipped）
>仓库那边已经将衣箱中的服饰打包完毕，并且打印出了快递面单，等待顺丰小哥来取件,以发给用户.有路由的顺丰单号tracking_code:619330142733
```
t.ship!
t.shipped_at = Time.current
t.delivered_at = Time.current
t.save!
t.update!(outbound_shipping_code: "619330142733")
```
#### g.签收衣箱(shipped)
>签收后，购买衣服，可修改所支付的金额
>>修改衣箱中某一件衣服的价格
```
t = c.totes.last
pi = t.tote_products.first
pi.member_price = 0.01
pi.save!
```
>>修改衣箱中第一件衣服的价格
```
t.tote_products.each { |p| p.update!(member_price: 0.01)}
```

> 删除衣箱评价`t.tote_rating.destroy`
> 删除衣箱单品评价`t.ratings.destroy_all`


#### h.预约归还(shipped)

>用户预约归成功后，待顺丰快递小哥上门揽件，tote会变为incoming<br>快递到达仓库后，仓库确认所有服饰都收到了，tote状态会变为complete
```
t.incoming
t.complete
```

>撤销预约归还
```
#清除衣箱预约归还记录
#上门取件：
id =t.scheduled_pickups.last.scheduled_return_id
sr = ScheduledReturn.find id
ScheduledToteReturn.where(scheduled_return_id: sr.id).destroy_all
ScheduledReturn.find(sr.id).destroy
ScheduledPickup.where(scheduled_return_id: sr.id).destroy_all

#自寄：
id =t.hive_box_scheduled_pickup.scheduled_return_id
sr = ScheduledReturn.find id
ScheduledToteReturn.where(scheduled_return_id: sr.id).destroy_all
ScheduledReturn.find(sr.id).destroy
HiveBoxScheduledPickup.where(scheduled_return_id: sr.id).destroy_all

#清除自在选归还记录：
tf = t.tote_free_service
ScheduledToteFreeServiceReturn.where(tote_free_service_id: tf.id).last.destroy
```

#### 生成待支付订单
>仓库收到货后，检查发现少归还了服饰，就会生成待支付订单--后续补充


#### 将用户设置为stylist用
```
Stylist.create(customer: c)
```

#### 封装的脚本
```
#加载封装的方法
require '/home/ubuntu/elaine/ruby_scripts/my_script.rb'
c = Customer.where(telephone: "+86").last
#下单后改成发货
ship_tote(c.id)
#预约归还后，设置衣箱为仓库收到
complete_tote(t.id)
#将用户清为非会员
reset_customer(c.id)
#将下单的衣箱(locked)改为未下单(styled)
styled(c.id)

```
***

# 3.优惠券和奖励金的创建和绑定

####   a.创建未使用的PromoCode创建
```
PromoCode.create!(code: '0100', expiration_date: Time.current.end_of_day + 8.days, description: "0100", admin_note: "0100", tote_purchase_credit: nil, discount_amount: 420.00, discount_percent: 0, conversion_limit: nil, charge_type: "SubscriptionFee", discount_kind: "amount", subscription_name: nil, title: "新人直减50元优惠券", rules: ["限新会员首次购买会员使用一次，不与其他优惠同享"])
```

####  b.创建过期的promoCode
```
PromoCode.create!(code: '0100', expiration_date: Time.current.end_of_day - 8.days, description: "0100", admin_note: "0100", tote_purchase_credit: nil, discount_amount: 420.00, discount_percent: 0, conversion_limit: nil, charge_type: "SubscriptionFee", discount_kind: "amount", subscription_name: nil, title: "优惠券", rules: ["会员", "非会员"])
```

#### c.已使用的PromoCode
>创建已使用记录
```
PromoCodeRedemption.create(
customer_id: c.id,
promo_code_id: p.id,
tote_id:nil
)
```
>删除已使用记录
```
PromoCode::Redemption.find_by(customer_id: c.id).last.destroy
```


#### d.将PromoCode绑定到相应用户
```
p = PromoCode.where(code: "0100").last
c = Customer.where(telephone: "+8613802438499").last
CustomerPromoCode.create(customer: c, promo_code: p)
```

#### e.清除相应PromoCode
```
PromoCode::Redemption.find_by(customer_id: c.id).last.destroy
p = PromoCode.where(code: "0100").last
CustomerPromoCode.where(customer: c).destroy_all
```
#### f.为PromoCode创建规则
```
promo_code = PromoCode.find_by_code('LTCN_FREE_TOTE_79')
PromoCode::ValidationRules::NewSubscriber.create(promo_code: promo_code)
PromoCode::ValidationRules::CreditScore.create(promo_code: promo_code, criteria: 650)
ap promo_code.validation_rules.all
```
#### g.给用户发奖励金
```
tc = TimeCash.create!(
      customer_id:  c.id,
      starts_on:    Time.zone.now,
      ends_on:      1.months.from_now,
      cash:         100
    )
    
    TimeCashTransaction.build_with_time_cash(tc).save!
```
#### h.给用户发放加衣券
>发放
```
co = Coupon.first
CustomerCoupon.create(customer: c, coupon: co)
```
>修改用户加衣券的时间
 cc = CustomerCoupon.where(customer: c).last
 cc.update(expired_at: "2019-12-12 23:59:59")

# 4.会员状态-过期，暂停，免费试用
#### a.会员过期
```
s = c.subscriptions.last
s.chargify_next_billing_at = Time.current - 1.days
s.save!
```
在每天的0点会执行定时任务去将所有过期的会员cancel掉
`bundle exec rake subscriptions:cancel`

#### b.暂停会员恢复
>`hold_until`减1天时，需将`chargify_next_billing_at`也减一天，恢复后重新计算的chargify_next_billing_at才会是准确的
```
s = c.subscriptions.last
s.hold_until = Time.current - 1.days
s.chargify_next_billing_at = s.chargify_next_billing_at - 1.days
s.save!
```
在每天的8点会执行定时任务去将暂停会员到期的用户恢复`bundle exec rake subscriptions:reactivate_holds`

# 5.用户尺码相关

#### d.用户的档案信息，身高，体重，胸围等
`c.style`

***

