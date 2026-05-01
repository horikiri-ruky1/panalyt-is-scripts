# 928社バッチ処理の手順

## セッションごとに以下を実行

```
928社のリサーチ+MD生成を進めて。
new_companies.jsonのbatch_statusが"pending"の会社から、
10社ずつリサーチエージェントに投げて、
結果をJSONに反映→bulk_generate.jsでMD生成→git push。
1セッションで50-100社を目標に。
```

## 進捗管理
- new_companies.json の各社に `batch_status: "pending" | "researched" | "generated"` を付与
- 各セッション終了時にgit pushして進捗を保存

## リサーチ質問テンプレ（トークン節約版）
エージェントへの指示：
```
以下の企業の中計と人事情報を調査。JSON形式で返してください。
{name, plan_name, plan_period, plan_targets, ceo_name, hr_officer, why_now, four_points[4]}
```
