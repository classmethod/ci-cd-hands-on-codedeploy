## ハンズオンで構築する構成

![構成図](https://cacoo.com/diagrams/Cl9H3qce7UsvLRVO-521EE.png)

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/12/154a4e54cd8645dd7c7c392c5b8358d4.png)

今回は上記の図のような構成を構築します。

- GitHub にコードがプッシュされると CodePipeline での処理が開始されます。
- テスト実行用 CodeBuild ではテストを実行します。
- アラートチェック用 CodeBuild ではアラートが発報されていないかチェックします
- CodeBuild での処理が成功したら EC2 に新しいバージョンのイメージがデプロイされます。
