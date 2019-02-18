# 使用するサービスの説明

今回はAWSのCodeシリーズというサービスを使用してCI/CD環境を構築していきます。

## CodePipeline

<img src="/images/codepipeline-icon.png" width="40%"/>

CodePipelineはマネージドの継続的デリバリサービスです。

- ソースコードが変更されたらすばやくデプロイできます
- AWS環境にデプロイするパイプラインを簡単に構築できます

## CodeBuild

<img src="/images/codebuild-icon.png" width="40%"/>

CodeBuildはビルドを行うAWSのマネージドサービスです。

- 従量課金です。そのため、ビルド用のインスタンスをずっと立て続けているより安く運用できます。
- ビルドの数に応じて自動スケールしてくれるため、CodeBuildによるCIでは他のビルドを待つ必要がありま
せん。
- 主要な言語に対するビルド環境が最初から用意されているのですぐに始めることができます。

## CodeDeploy

<img src="/images/codedeploy-icon.png" width="40%"/>

CodeDeployはマネージドのビルド自動化サービスです。

- EC2やAWS Lambda、ECSに対応
- 問題が発生した際には簡単にロールバック
- Blue/Greenデプロイに対応
