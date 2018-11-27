## テストに失敗！

CodePipeline を構築し、自動デプロイが開始されましたが Build フェーズで失敗してしまいました。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/81a4d10cefd55e9ef111104340d88aa3.png)

これは、事前にサンプルアプリケーションのリポジトリにテストが通らないようにバグを仕込んでおいたためです。

デプロイの一連の流れの中でテストが自動で実行される仕組みが構築されていたため、バグの混入したソースコードがデプロイされるのを防ぐことができました！

### バグを直す

バグを修正するため、GitHub 上で`src/model/fizzbuzz.js`　を開きます。

```
if (i % 10 == 0) {
```

のようになっている行を

```
if (i % 15 == 0) {
```

のように修正し、master にコミットします。

すると、自動で CodePipeline 上での処理が開始されます。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/10/729add485e7b8d5826db8874263b2508.png)

今度はテストが成功するため、デプロイまで正しく処理が行われました。

ここまでで最初のデプロイが完了するため、
動作確認でアクセスした URL にアクセスすると、簡単な FizzBuzz のアプリが表示されます。

![](https://cdn-ssl-devio-img.classmethod.jp/wp-content/uploads/2018/08/1769187c2286f846c233341f03da13e9.png)
