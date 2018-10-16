# CI/CD 環境構築ハンズオン

## アジェンダ

### 必要な事前準備

- 自分の AWS アカウントのコンソールにログインする。（できれば EC2-Classic に対応していないアカウントが望ましいです）
- **東京リージョンのコンソールが表示されるようにしておく**
- 自分の GitHub アカウントにログインする。
- Git をインストール及びセットアップする。（自分の自分のリポジトリからのクローンおよびプッシュが行える状態にしておいてください。）
- コンソールから起動しコードの編集が行えるエディタ(Vim, Emacs, VSCode 等)

### ハンズオンの目的

CodePipeline を使用してデプロイの自動化が簡単に行えることを体感していただき、実際にデプロイの自動化に取り組むきっかけにしていただく。

### このハンズオンでかかる AWS の費用

$1 未満

### ハンズオンの流れ

1. 構成の簡単な紹介
1. サンプルアプリケーションのフォーク及びクローン
1. ハンズオン用環境構築用の CloudFormation の実行
1. CodePipeline によるパイプラインの構築および自動デプロイの実行
1. テストが失敗すると自動デプロイが止まるのを確認
1. 再度正しいコードに戻して自動デプロイ

## 1. ハンズオンで構築する構成

![構成図](https://cacoo.com/diagrams/Bik1Om7JvTVGzpfj-9A688.png)

今回は上記の図のような構成を構築します。

- GitHub にコードがプッシュされると CodePipeline での処理が開始されます。
- CodeBuild ではテスト、Docker イメージの作成および作成したイメージの ECR へのプッシュを行います。
- CodeBuild での処理が成功したら ECS に新しいバージョンのイメージがデプロイされます。

## 2. サンプルアプリケーションのフォークおよびクローン

まずは、このリポジトリをフォークし、自分のアカウントにリポジトリを作成します。
サンプルアプリケーションは、指定された数まで FizzBuzz を表示する Node.js による簡単なアプリケーションです

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/fork-640x210.png" alt="" width="640" height="210" class="alignnone size-medium wp-image-348765" />

上のリンクから GitHub の当該リポジトリのページに移動し、右上の `Fork` というボタンからフォークを実行します。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/f514b4e78f8a717b73707cc3b38dcff4-640x353.png" alt="" width="640" height="353" class="alignnone size-medium wp-image-348767" />

自分の GitHub アカウント上に作成されたフォークしたリポジトリから、ローカルの PC にクローンします。
作業用のディレクトリで以下のコマンドを実行します。

```shell
$ git clone git@github.com:<ご自分のgithubのアカウント名>/ci-cd-hands-on.git
```

クローンされたリポジトリのディレクトリに移動して中身を確認し、クローンが正しく行われたことを確認します。

```shell
$ cd ci-cd-handson
$ ls
Dockerfile		cloudformation		src
README.md		package-lock.json	template
buildspec.yml		package.json		test
```

## 2. キーペアの作成

インスタンスに SSH でログインするためにキーペアを事前に作成しておきます。今回のハンズオンではインスタンスに SSH でログインしない想定ですが、デバッグ用途などで用意しておくと便利です。すでに作成している場合この作業は必要ありません。

- マネジメントコンソールのトップ画面より「EC2」をクリック

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2017/05/devops-hands-on-1-640x474.png" alt="devops-hands-on-1" width="640" height="474" class="alignnone size-medium wp-image-258966" />

- 「EC2 ダッシュボード」から「キーペア」をクリック

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2017/05/devops-hands-on-2-640x409.png" alt="devops-hands-on-2" width="640" height="409" class="alignnone size-medium wp-image-258967" />

- 「キーペアの作成」をクリックしてキーペア名をわかりやすい名前(hands-on など)で入力

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2017/05/devops-hands-on-3-640x298.png" alt="devops-hands-on-3" width="640" height="298" class="alignnone size-medium wp-image-258968" />

- 「作成」をクリックするとキーペアのダウンロード画面が表示されるので、任意の場所に保存

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2017/05/devops-hands-on-4-640x421.png" alt="devops-hands-on-4" width="640" height="421" class="alignnone size-medium wp-image-258969" />

## 3. ハンズオン用環境構築用の CloudFormation の実行

[Launch Stack](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/new?stackName=hands-on-environment&templateURL=https://s3-ap-northeast-1.amazonaws.com/ci-cd-hands-on-template/node/hands-on-environment.template.yaml)

上のリンクより、ハンズオン用の環境を構築するための CloudFormation を実行します。
パラメータ画面でキーペアの名前を選択し、ログインが行えるようにします。

この、CloudFormation によって、以下の図ような構成の環境が作成されます。

![CloudFormationによってい構築される構成](https://cacoo.com/diagrams/Bik1Om7JvTVGzpfj-CBE40.png)

アプリケーションの動作環境以外に後で CodeBuild で使用するための IAM 　 Role を作成しています。

作成したスタックが `CREATE_COMPLETE` の状態になるまで待ちます。

### 動作確認

作成したスタックの出力に`ALBDNSName`というキーでアドレスが出力されています。こちらにアクセスすると Nginx の Welcome ページが表示されます。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/FireShot-Capture-13-Test-Page-for-the-Nginx-HTTP-Server-on_-http___fugafug-alb-4hygylams8fk-13-640x341.png" alt="" width="640" height="341" class="alignnone size-medium wp-image-367711" />

## 3. CodeDeploy の設定

CodePipeline から指定できるデプロイグループを作成するため、先に CodeDeploy の設定を行っていきます。

CodeDeploy のアプリケーションの画面からアプリケーションの作成をクリックします。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/d6036a2cd7ed241bfd1cf3db1c349982-640x227.png" alt="" width="640" height="227" class="alignnone size-medium wp-image-367725" />

| 入力項目                           | 値               |
| ---------------------------------- | ---------------- |
| アプリケーション名                 | `hands-on-app`   |
| コンピューティングプラットフォーム | EC2/オンプレミス |

入力項目を入力し、アプリケーションの作成をクリックすると、CodeDeployのアプリケーションが作成され、当該アプリケーションの詳細画面が表示されます。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/801c72268e6b9258abcee851dd3ca369-640x344.png" alt="" width="640" height="344" class="alignnone size-medium wp-image-367726" />

この画面からさらに「デプロイグループの作成」をクリックし、このアプリケーションにデプロイグループを作成していきます。

| 入力項目                           | 値               |
| ---------------------------------- | ---------------- |
| デプロイグループ名                | `hands-on-deploy-group`   |
| サービスロール | `hands-on-environment-codedeploy-service-role` |
| デプロイタイプ | インプレース |
| Amazon EC2 Auto Scaling グループ | ✔ |
| Auto Scaling グループ | `hands-on-environment-asg` |
| デプロイ設定 | CodeDeployDefault.HalfAtOnce |
| ロードバランシングを有効にする | ✔ |
| | Application Load Balancer または Network Load Balancer |
| Choose a load balancer | `hands-on-environment-TargetGroup` |


## 4. CodePipeline によるパイプラインの構築および自動デプロイの実行

CodePipeline/CodeBuild/CodeDeploy を使用したパイプラインを作成していきます。

今回作成するパイプラインは以下図の左側の部分です。

![構成図](https://cacoo.com/diagrams/Bik1Om7JvTVGzpfj-5F49C.png)

では、早速作成していきましょう。

マネジメントコンソールのトップ画面より「CodePipeline」をクリックします。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2017/05/devops-hands-on-15-640x195.png" alt="devops-hands-on-15" width="640" height="195" class="alignnone size-medium wp-image-259029" />

以下のような画面が表示されるので「パイプラインの作成」をクリックします。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/3a19eb848252813419c880402c423c1e-640x214.png" alt="" width="640" height="214" class="alignnone size-medium wp-image-367717" />

パイプラインのセットアップが開始するので順番に値を入力していきます。

| 入力項目                             | 値                                                       |
| ------------------------------------ | -------------------------------------------------------- |
| パイプライン名                       | `hands-on-pipeline`                                      |
| サービスロール                       | 新しいサービスロール                                     |
| ロール名                             | `AWSCodePipelineServiceRole-us-west-2-hands-on-pipeline` |
| Allow AWS CodePipeline to create ... | ✔                                                        |
| アーティファクトストア               | デフォルトの場所                                         |

次はソースプロバイダのセットアップが始まるので以下の表のように入力後、「次のステップ」をクリックします。

| 入力項目           | 値                           |
| ------------------ | ---------------------------- |
| ソースプロバイダ   | GitHub                       |
| リポジトリ         | フォークしておいたリポジトリ |
| ブランチ           | master                       |
| 変更検出オプション | GitHub ウェブフック (推奨)   |

ビルドプロバイダのセットアップが始まるので以下の表のように入力後、「ビルドプロジェクトの保存」をクリックしてから「次のステップ」をクリックします。

ビルドステージの設定画面になるので、ビルドプロバイダで`CodeBuild`を選択し、`Create Project`をクリック。

CodeBuild のプロジェクトの作成画面が表示されるので CodeBuild の設定項目を入力していきます。

| 入力項目           | 値                           |
| ------------------ | ---------------------------- |
| プロジェクト名 | hands-on-project |
| 環境イメージ | マネージド型イメージ |
| OS | Ubuntu |
| ランタイム | Node.js |
| ランタイムバージョン | aws/codebuild/nodejs:10.1.0 |
| Image version | Always use the latest image for this runtime version |
| 特権付与 | チェックしない |
| サービスロール | 新しいサービスロール |
| ロール名 | `hands-on-codebuild-service-role` |
| ビルド仕様 | buildspec.yml |

最後にデプロイステージの設定を行います

| 入力項目           | 値                      |
| ------------------ | ----------------------- |
| デプロイプロバイダ | CodeDeploy              |
| アプリケーション名 | `hands-on-app`          |
| デプロイグループ名 | `hands-on-deploy-group` |

最後に確認画面が表示されるので、内容を確認後、「パイプラインの作成」をクリックします。

すると、パイプラインが自動で開始されます。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/FireShot-Capture-14-AWS-Developer-Tools_-https___ap-northeast-1.console.aws_-640x319.png" alt="" width="640" height="319" class="alignnone size-medium wp-image-367740" />

`Staging`ステージまで緑色になり、デプロイが完了したところで最初に開いたの`https://<ALBのDNS名>/express/`にアクセスするとサンプルアプリケーションが表示されることを確認します。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/1769187c2286f846c233341f03da13e9-640x207.png" alt="" width="640" height="207" class="alignnone size-medium wp-image-349210" />

## 5. テストが失敗すると自動デプロイが止まるのを確認

バグが混入した際に、テストで処理が失敗し、デプロイが途中で止まることを確認するため、フォークしたリポジトリのコードを修正します。

エディタで FizzBuzz のロジックが記述されているファイル、`src/model/fizzbuzz.js`を開きます。

意図的にバグを混入させるため、

```
if (i % 15 == 0) {
```

と書かれた行を

```
if (i % 10 == 0) {
```

のように修正します。

修正が終わったらコミットし、GitHub 上にプッシュします。

```shell
$ git commit -am bug
$ git push origin master
```

GitHub にプッシュすると、CodePipeline での処理が開始されます。
しかし、CodeBuild でテストが失敗し、ECS へのデプロイは実行されません。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/6785bac4c64b2e508b1134aa19bed74d-640x908.png" alt="" width="640" height="908" class="alignnone size-medium wp-image-349032" />

テストが自動で実行される環境が構築されていたため、バグの混入したバージョンがデプロイされるのを防ぐことができました！

## 6. 再度正しいコードに戻して自動デプロイ

先程の修正をもとに戻すため、`src/model/fizzbuzz.js`　を開きます。

```
if (i % 10 == 0) {
```

のように先程編集した行を

```
if (i % 15 == 0) {
```

のように修正し、GitHub にプッシュします。

```shell
$ git commit -am fixbug
$ git push origin master
```

同様に自動で CodePipeline 上での処理が開始されます。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/e6dddcd46828eb204b0eef8048c50e4f-640x957.png" alt="" width="640" height="957" class="alignnone size-medium wp-image-349044" />

今度はテストが成功するため、デプロイが行われました。

## まとめ

CodePipeline を使用することでデプロイやテストが自動で実行されるようになりました。

煩雑な手作業が自動化されることで人為的ミスを削減し、デプロイにかかる時間を短縮できます。

## 参考資料

### EC2 に CodeDeploy でデプロイするパターン

- [「AWS と GitHub で始める DevOps ハンズオン」の資料を公開します！](https://dev.classmethod.jp/etc/aws-github-devops-hands-on/)

### Pull Request をビルドしたいパターン

- [CodeBuild で GitHub のプルリクエストを自動ビルドして、結果を表示する](https://dev.classmethod.jp/cloud/aws/codebuild-github-pullrequest-settings/)

### サーバレスパターン

- [CodeDeploy を利用した Lambda のバージョン間の段階デプロイ](https://dev.classmethod.jp/cloud/aws/aws-reinvent-codedeploy-lambda/)
- [AWS SAM を通して CodeDeploy を利用した Lambda 関数のデプロイを理解する](https://dev.classmethod.jp/server-side/serverless/understanding-lambda-deploy-with-codedeploy-using-aws-sam/)

## 補足. 環境の削除

ハンズオンで作成した環境を削除したい場合は以下の手順を参考にしてください。
リソース間の依存関係がある関係で削除に失敗することがあるため、
CloudFormation スタックおよびクローンした GitHub のリポジトリは最後に削除を行ってください。

TODO 画像等も含めて手順を正確に提示

### AWS

#### CodePipeline のパイプラインの削除

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/e8c7b85b815b9231b93b6c76a1331441-640x531.png" alt="" width="640" height="531" class="alignnone size-medium wp-image-354244" />

パイプラインの画面から編集ボタンをクリック、

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/895f14063d9b4ebfc04657899acd08a3-640x463.png" alt="" width="640" height="463" class="alignnone size-medium wp-image-354245" />

表示された編集画面で削除ボタンをクリックし、表示された確認ダイアログにパイプライン名`hands-on-pipeline`を入力して削除します。

#### CodeBuild のプロジェクトの削除

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/ae5122b2851970fae6d119adab33a263-640x309.png" alt="" width="640" height="309" class="alignnone size-medium wp-image-354247" />

CodeBuild 　の画面から、プロジェクト`hands-on-project`を選択した状態で、アクションのドロップダウンリストから削除をクリックします。

#### IAM Role の削除　 CodePipeline 用 CodeBuild 用

CodeBuild 用のロール`hands-on-environment-CodeBuild-ServiceRole`を削除します。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/899fb48d174d86e98f6bb281fd29727e-640x390.png" alt="" width="640" height="390" class="alignnone size-medium wp-image-354249" />

`hands-on-environment-CodeBuild-ServiceRole`という名前のロールを選択し、ロールを削除します。

CodePipeline での他のプロジェクトが存在しない場合は`AWS-CodePipeline-Service`という名前のロールも同様の手順で削除しましょう。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/b7f0d8a5fdc73ca64c3baaa31e0639ff-640x379.png" alt="" width="640" height="379" class="alignnone size-medium wp-image-354248" />

#### CodePipeline のアーティファクト保存用 S3 バケット削除

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/42dfdf601622493f20cbdffbf8f2c374-640x280.png" alt="" width="640" height="280" class="alignnone size-medium wp-image-354250" />

`codepipeline-ap-northeast-1-****`バケットの中身を確認し、

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/1a31704e05462dde8750e59651f7888e-640x280.png" alt="" width="640" height="280" class="alignnone size-medium wp-image-354251" />

もし、`hands-on-xxx` のフォルダだけしかなければ、バケット自体を削除します。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/c72ecc6de66e24061ef1a12a12552659-640x382.png" alt="" width="640" height="382" class="alignnone size-medium wp-image-354252" />

他のフォルダがあれば、フォルダ以下を削除します。

#### ECR リポジトリ内のイメージをすべて削除

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/899ad3960898d06dacd6be39a3ca0f85-640x247.png" alt="" width="640" height="247" class="alignnone size-medium wp-image-354254" />

ECS の画面の左側にある、リポジトリのリンクをクリックし、`hands-***`という名前のリポジトリの画面の移動します。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/fc89af39613b29fc3112cbb093918216-640x197.png" alt="" width="640" height="197" class="alignnone size-medium wp-image-354255" />

そして、すべてのイメージを選択し、削除を行います。リポジトリ自体は削除しなくても大丈夫です。

#### CloudFormation スタックの削除

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/496450dcfb095b95105cd9264d5d67af-640x354.png" alt="" width="640" height="354" class="alignnone size-medium wp-image-354256" />

CloudFormation のコンソールから、`hands-on-environment`という名前のスタックを選択し、削除します

#### hands-on-task-definition の登録を解除

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/15a28e586fc12d481269df69037a1e76-640x388.png" alt="" width="640" height="388" class="alignnone size-medium wp-image-354257" />

ECS の画面の左側にある、タスク定義のリンクをクリックし、`hands-on-environment-****`という名前のタスク定義の画面に移動します。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/6eece21cbe5c833bf500aab26afe0019-640x371.png" alt="" width="640" height="371" class="alignnone size-medium wp-image-354259" />

すべてのタスク定義を選択し、登録解除します。

### GitHub

#### クローンしたリポジトリの削除

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/0539d520bebeb1e1782c3f33538578bb-640x214.png" alt="" width="640" height="214" class="alignnone size-medium wp-image-354260" />

フォーク先リポジトリの Setting を開き、

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/3b7190c3bdf6c2d9e5afa64505c426d9-640x341.png" alt="" width="640" height="341" class="alignnone size-medium wp-image-354261" />

一番下の Delete this Repository というボタンをクリック、確認ダイアログにリポジトリ名を入力して削除します。
