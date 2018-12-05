## 自動デプロイ！

![](images/pipeline_without_mackerel)

CodePipeline の作成を完了すると、自動デプロイが開始されます。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/729add485e7b8d5826db8874263b2508.png)

各ステージ内の詳細ボタンをクリックするとそれぞれのステージでの処理の詳細情報を見ることができます。

例えば、ビルドステージの詳細ボタンからCodeBuildの当該ビルドのページに飛ぶことができ、CodeBuildでの処理のログなどを見ることができます。また、デプロイステージの詳細ボタンからhデプロイの処理が進む様子を確認できます。

最初のデプロイが完了すると、
動作確認でアクセスした URL にアクセスすると、簡単な FizzBuzz のアプリが表示されます。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/1769187c2286f846c233341f03da13e9.png)
