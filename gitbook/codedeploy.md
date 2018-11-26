## CodeDeploy の設定

CodePipeline から指定できるデプロイグループを作成するため、先に CodeDeploy の設定を行っていきます。

CodeDeploy のアプリケーションの画面からアプリケーションの作成をクリックします。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/d6036a2cd7ed241bfd1cf3db1c349982-640x227.png" alt="" width="640" height="227" class="alignnone size-medium wp-image-367725" />

| 入力項目                           | 値               |
| ---------------------------------- | ---------------- |
| アプリケーション名                 | `hands-on-app`   |
| コンピューティングプラットフォーム | EC2/オンプレミス |

入力項目を入力し、アプリケーションの作成をクリックすると、CodeDeploy のアプリケーションが作成され、当該アプリケーションの詳細画面が表示されます。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/801c72268e6b9258abcee851dd3ca369-640x344.png" alt="" width="640" height="344" class="alignnone size-medium wp-image-367726" />

この画面からさらに「デプロイグループの作成」をクリックし、このアプリケーションにデプロイグループを作成していきます。

| 入力項目                         | 値                                                     |
| -------------------------------- | ------------------------------------------------------ |
| デプロイグループ名               | `hands-on-deploy-group`                                |
| サービスロール                   | `hands-on-environment-CodeDeploy-ServiceRole`          |
| デプロイタイプ                   | インプレース                                           |
| Amazon EC2 Auto Scaling グループ | ✔                                                      |
| Auto Scaling グループ            | `hands-on-environment-EC2AutoScalingGroup-XXXXXXX`     |
| デプロイ設定                     | CodeDeployDefault.HalfAtOnce                           |
| ロードバランシングを有効にする   | ✔                                                      |
|                                  | Application Load Balancer または Network Load Balancer |
| Choose a load balancer           | `hands-on-environment-TargetGroup`                     |
