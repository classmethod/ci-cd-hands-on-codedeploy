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
- CodeBuild ではテストを実行します。
- CodeBuild での処理が成功したら EC2 に新しいバージョンのイメージがデプロイされます。

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
$ cd ci-cd-handson-codedeploy
$ ls
README.md		hooks			template
appspec.yml		package-lock.json	test
buildspec.yml		package.json
cloudformation		src
```

## 3. ハンズオン用環境構築用の CloudFormation の実行

[Launch Stack](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/new?stackName=hands-on-environment&templateURL=https://s3-ap-northeast-1.amazonaws.com/ci-cd-hands-on-template/codedeploy/hands-on-environment.yaml)

上のリンクより、ハンズオン用の環境を構築するための CloudFormation を実行します。
パラメータ画面でキーペアの名前を選択し、ログインが行えるようにします。

この、CloudFormation によって、以下の図ような構成の環境が作成されます。

![CloudFormationによってい構築される構成](https://cacoo.com/diagrams/Bik1Om7JvTVGzpfj-CBE40.png)

アプリケーションの動作環境以外に後で CodeBuild で使用するための IAM Role を作成しています。

作成したスタックが `CREATE_COMPLETE` の状態になるまで待ちます。

### 動作確認

作成したスタックの出力に`ALBDNSName`というキーでURLが出力されています。こちらにアクセスすると Nginx の Welcome ページが表示されます。まだソースコードがデプロイされていないため、エラー画面が表示されています。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/FireShot-Capture-13-Test-Page-for-the-Nginx-HTTP-Server-on_-http___fugafug-alb-4hygylams8fk-13-640x341.png" alt="" width="640" height="341" class="alignnone size-medium wp-image-367711" />

## 4. CodeDeploy の設定

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

## 5. CodePipeline によるパイプラインの構築および自動デプロイの実行

CodePipeline/CodeBuild/CodeDeploy を使用したパイプラインを作成していきます。

今回作成するパイプラインは以下図の左側の部分です。

![構成図](https://cacoo.com/diagrams/Bik1Om7JvTVGzpfj-9A688.png)

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

| 入力項目                                                                                     | 値                                                   |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| プロジェクト名                                                                               | hands-on-project                                     |
| 環境イメージ                                                                                 | マネージド型イメージ                                 |
| OS                                                                                           | Ubuntu                                               |
| ランタイム                                                                                   | Node.js                                              |
| ランタイムバージョン                                                                         | aws/codebuild/nodejs:10.1.0                          |
| Image version                                                                                | Always use the latest image for this runtime version |
| 特権付与                                                                                     | チェックしない                                       |
| サービスロール                                                                               | 既存のサービスロール                                 |
| ロール名                                                                                     | `hands-on-environment-CodeBuild-ServiceRole`         |
| AWS CodeBuild にこのサービスロールの編集を許可し、このビルドプロジェクトでの使用を可能にする | チェックしない                                       |
| ビルド仕様                                                                                   | buildspec.yml                                        |

最後にデプロイステージの設定を行います

| 入力項目           | 値                      |
| ------------------ | ----------------------- |
| デプロイプロバイダ | AWS CodeDeploy          |
| アプリケーション名 | `hands-on-app`          |
| デプロイグループ名 | `hands-on-deploy-group` |

最後に確認画面が表示されるので、内容を確認後、「パイプラインの作成」をクリックします。

すると、パイプラインが自動で開始されます。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/FireShot-Capture-14-AWS-Developer-Tools_-https___ap-northeast-1.console.aws_-640x319.png" alt="" width="640" height="319" class="alignnone size-medium wp-image-367740" />

`Staging`ステージまで緑色になり、デプロイが完了したところで最初に開いたの`https://<ALBのDNS名>/express/`にアクセスするとサンプルアプリケーションが表示されることを確認します。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/1769187c2286f846c233341f03da13e9-640x207.png" alt="" width="640" height="207" class="alignnone size-medium wp-image-349210" />

## 6. テストが失敗すると自動デプロイが止まるのを確認

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
しかし、CodeBuild でテストが失敗し、デプロイは実行されません。

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/81a4d10cefd55e9ef111104340d88aa3-640x359.png" alt="" width="640" height="359" class="alignnone size-medium wp-image-367757" />

テストが自動で実行される環境が構築されていたため、バグの混入したバージョンがデプロイされるのを防ぐことができました！

## 7. 再度正しいコードに戻して自動デプロイ

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

<img src="https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/729add485e7b8d5826db8874263b2508-640x357.png" alt="" width="640" height="357" class="alignnone size-medium wp-image-367750" />

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

### EKS でパターン

- [Kustomize + CodePipeline + CodeBuild で EKS に継続的デプロイしてみた](https://dev.classmethod.jp/cloud/aws/kustomize-codepipeline-codebuild/)
