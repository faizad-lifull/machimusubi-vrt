# machimusubi-web 自動E2Eテスト

このディレクトリ配下では、machimusubi-web のE2Eテストのソースコードを管理する
puppeteer を利用し、Chromium でテストシナリオを進行させる

現状はGitHub ActionsでCIとして組み込むことはできていない
対応するにはテスト環境やpool環境に疎通できるように self-hosted runner を作成すれば良いと思う

## Tealium 関連のE2Eテスト

- `window.utag_data` に期待通りのデータが格納されているかのチェック

## 実行手順

```bash
$ cd '<machimusubi-webのプロジェクトルート>/e2e' # このディレクトリに移動
$ npm ci
$ npm run test:tealium

# 環境変数に特定の値を指定することで、実行対象の環境を指定することができる
# 環境変数を未指定にすると、テスト環境に対して実行する
$ npm run test:tealium

# 以下で pool 環境に対して実行する
$ STAGE=pool npm run test:tealium

# 以下で live 環境（本番環境）に対して実行する
$ STAGE=live npm run test:tealium

# 以下で localhost:8000 環境に対して実行する
$ STAGE=local npm run test:tealium

# 以下で Ephemeral 環境（GitHubのPRで作成される環境）に対して実行する
# https://github.com/lifull/machimusubi-web/pull/172 の Ephemeral 環境に対して実行する場合は↓
$ STAGE=pr:172 npm run test:tealium
# 任意のPR番号を指定して実行することができる（ Ephemeral 環境が既に起動していることが前提 ）
$ STAGE=pr:${対象のPR番号} npm run test:tealium
```
