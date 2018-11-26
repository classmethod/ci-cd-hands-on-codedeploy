## CodePipeline によるパイプラインの構築および自動デプロイの実行

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
