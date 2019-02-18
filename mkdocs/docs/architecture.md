# ハンズオンで構築する構成

![構成図](https://cacoo.com/diagrams/Cl9H3qce7UsvLRVO-521EE.png)

![](images/pipeline_all.png)

今回は上記の図のような構成を構築します。

- GitHubにコードがプッシュされるとCodePipelineでの処理が開始されます
- テスト実行用CodeBuildではテストを実行します
- アラートチェック用CodeBuildではアラートが発報されていないかチェックします
- CodeBuildでの処理が成功したらEC2に新しいバージョンのイメージがデプロイされます
