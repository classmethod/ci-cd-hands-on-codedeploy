# Mackerel のアラートのチェックの処理を追加

次は今まで作成したパイプラインに、Mackerel のアラートのチェックの処理を追加し、デプロイ先の環境でなにか障害が起こっていたときに、自動デプロイが止まるようにしていきます。

まず、パイプラインの画面から編集ボタンをクリックし、編集画面に移動します。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/11/2af7ba6352cdd08f7e7b55172957850b.png)

次に Build ステージと Deploy ステージの間のステージの追加をクリックし、Mackerel のアラートのチェック用のステージを作成します。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/11/73c36fee1ab30226337d9f1cc56e9c9b.png)

ダイアログが表示されるのでステージ名に`Mackerel`と入力しましょう。

| 入力項目   | 値         |
| ---------- | ---------- |
| ステージ名 | `Mackerel` |

作成されたステージ内のアクショングループの追加ボタンをクリックし、CodeBuild で Mackerel のアラートのチェックを行うように設定していきます。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/11/90bf10f40f6380308df1fb587b3af1e5.png)

### アクショングループの設定

| 入力項目             | 値                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| アクション名         | Mackerel                                                                                         |
| アクションプロバイダ | CodeBuild                                                                                        |
| プロジェクト名       | Create Project をクリックし、下に記述した CoeBuild の設定に従って CodeBuild のプロジェクトを作成 |
| 入力アーティファクト | `SourceArticact`                                                                                 |
| 出力アーティファクト | `MackerelOutput`                                                                                 |

### CodeBuild の設定

| 入力項目                                                                                     | 値                                           |
| -------------------------------------------------------------------------------------------- | -------------------------------------------- |
| プロジェクト名                                                                               | `hands-on-project-mackerel`                  |
| 環境イメージ                                                                                 | カスタムイメージ                             |
| 環境タイプ                                                                                   | Linux                                        |
| その他の場所                                                                                 | `mackerel/mkr`                               |
| 特権付与                                                                                     | チェックしない                               |
| サービスロール                                                                               | 既存のサービスロール                         |
| ロール名                                                                                     | `hands-on-environment-CodeBuild-ServiceRole` |
| AWS CodeBuild にこのサービスロールの編集を許可し、このビルドプロジェクトでの使用を可能にする | チェックしない                               |
| 環境変数 - 名前 (Additional configuration 内)                                                | `MACKEREL_APIKEY`                            |
| 環境変数 - 値 (Additional configuration 内)                                                  | (Mackerel の API キーの値)                   |
| 環境変数 - 入力 (Additional configuration 内)                                                | プレーンテキスト                             |
| ビルド仕様                                                                                   | ビルドコマンドを挿入する                     |
| ビルドコマンド                                                                               | `test -z "$(mkr alerts list)"`              |
