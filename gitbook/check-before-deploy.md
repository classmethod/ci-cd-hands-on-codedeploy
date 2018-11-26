### 動作確認

事前にデプロイしてあるサンプルアプリケーションの現時点での動作を確認してみましょう。

サンプルアプリケーションのアクセス先の情報を取得するため、以下のリンクより CloudFormation のコンソールに移動します。

[CloudFormation のコンソール](https://ap-northeast-1.console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks?filter=active)

`StackSet-hands-on-environment-XXXXXXX`という名前のスタックの出力の中に`ALBDNSName`というキーで URL が出力されています。こちらにアクセスすると Nginx の Welcome ページが表示されます。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/FireShot-Capture-13-Test-Page-for-the-Nginx-HTTP-Server-on_-http___fugafug-alb-4hygylams8fk-13-640x341.png" alt="" width="640" height="341" class="alignnone size-medium wp-image-367711" />

まだソースコードがデプロイされていないため、エラー画面が表示されています。
