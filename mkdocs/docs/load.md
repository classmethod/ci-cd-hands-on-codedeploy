# 負荷がかかる処理を含むコードをデプロイしてみる

アラートが発報された際のロールバックまでの流れを体験するため、デプロイされた状態でアクセスするとCPUの使用率が極端に高まるようなコードをデプロイします。

GitHub上から`src/index.js` 内の以下の行のコメントアウトを解除します。これでアクセスするとCPUに負荷がかかるようになります。

```text
    //while(true){} // CPUをたくさん使用する処理
```

修正したら下の方にスクロールし、コミットしてPull Requestを作成します。

![confirm-edit](images/confirm-edit.png)

画像のように、`Create a new branch for this commit and start a pull request`を選択し、`Propose file change`をクリックします。

そうすると、Pull Requestの作成画面が開きます。

![create-pull-request](images/create-pull-request.png)

さらに、作成したPull Requestをマージします。

![merge-pull-request](images/merge-pull-request.png)

`Create Pull Request`をクリックします。

CodePipelineによるデプロイが完了したら、サンプルアプリケーションにアクセスします。

すると、すぐにはレスポンスが帰ってこず、ALBでタイムアウトしたあとに以下の画面のようなレスポンスが返ってきます。

![504](images/timeout.png)

また、しばらくするとCPUの使用率が100％になり、Mackerelでアラートが発報されます。

![アラート](images/alert-mackerel.png)

では、問題を解決するため、ロールバックを行いましょう。

GitHub上から当該のコードをロールバックします。

先程マージしたPull Requestの画面より、`Revert`ボタンを選択します。

![to-revert](images/to-revert.png)

そうすると、先程マージしたPull Requestの内容を取り消すPull Requestが作成されます。

![revert-create-pull-request](images/revert-create-pull-request.png)

作成されたPull Requestをマージします。

![revert-merge-pull-request](images/revert-merge-pull-request.png)

しばらくすると、アプリケーションの表示は正常に戻り、Mackerelで発報されたアラートもクローズされます。
