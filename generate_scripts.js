const fs = require('fs');

// 千葉銀行テンプレートの構造をベースに、各社データを流し込む
function generateScript(c) {
  const shortName = c.name.replace(/株式会社|ホールディングス/g, '').trim();
  const honorific = c.name.includes('銀行') ? '御行' : '御社';
  
  return `# パナリット IS スクリプト【${shortName}特化型】

> **Why now：** ${c.why_now}
> **${c.timing_hook}** 。

---

## 1. ${shortName} ターゲット情報サマリー

### 1-1. 基本情報

| 項目 | 内容 |
|---|---|
| 商号 | ${c.name}（コード：${c.code}、${c.market}） |
| 本社 | ${c.hq} |
| 代表者 | ${c.ceo} |
| ${c.hr_title || 'HR担当'} | ${c.hr_person || '※架電前にIR資料で特定'} |
| 規模 | ${c.scale} |
| 中計 | ${c.plan} |

### 1-2. 中計の人材関連ハイライト（攻撃材料）

| 中計テーマ | 具体目標 | パナリット価値 |
|---|---|---|
${c.highlights.map(h => `| ${h[0]} | ${h[1]} | ${h[2]} |`).join('\n')}

### 1-3. 注目ポイント

${c.points.map(p => `- ${p}`).join('\n')}

---

## 2. アプローチ先優先順位

| 優先 | 役職 | 理由 |
|---|---|---|
${c.targets.map(t => `| ${t[0]} | ${t[1]} | ${t[2]} |`).join('\n')}

---

## 3. なぜ今、${shortName}に刺さるのか（フック設計）

### 3-1. タイミングフック（最強）

> 「${c.timing_script}」

→ ${c.timing_reason}

### 3-2. ロジックフック（${c.logic_label}）

> 「${c.logic_script}」

### 3-3. 競合フック（${c.comp_label}）

> 「弊社は **${c.comp_ref}** にご導入いただいており、 **${c.comp_value}** を得意としています。」

---

## 4. 事前メール（${shortName}特化版）

**件名：${c.email_subject}**

\`\`\`
${c.name}
${c.email_to}
${c.email_to_name || '[氏名]'} 様

突然のご連絡失礼いたします。
パナリット株式会社の◯◯と申します。

${c.email_intro}

弊社は、Google米国本社で全社人事制度改革をリードして
いた小川（現CEO）が創業した、人事データの統合・可視化・
分析基盤を提供しております。${c.comp_ref}等
100社以上にご利用いただいております。

${c.email_to_name || '[氏名]'}様におかれましては、特に下記の
テーマで他社事例を踏まえたご共有が可能です。

${c.email_points.map(p => ` ・${p}`).join('\n')}

なお、弊社サービスは既存システムを置き換えず、
データ統合層として上に乗る設計のため、${c.system_note || '現行の人事システムをそのままご利用いただけます'}。

5分の情報共有でも結構でございます。
明日改めてお電話差し上げますので、ご検討のほど
よろしくお願い申し上げます。

----
パナリット株式会社  ◯◯ ◯◯
〒108-6022 東京都港区港南2-15-1 品川インターシティA棟22階
\`\`\`

---

## 5. 秘書室突破トーク（${shortName}特化）

### 5-1. オープニング

> 「いつもお世話になっております。パナリット株式会社の◯◯と申します。
> **${c.secretary_opener}** 、${c.secretary_target}への情報共有のお願いでご連絡を差し上げました。」

### 5-2. 用件説明（1行）

> 「${c.secretary_purpose}」

### 5-3. 「人事部にお繋ぎします」と言われたら

> 「ありがとうございます。 **人事部の皆様とも別途やり取りはさせていただきますが** 、本件は **${c.secretary_escalation}** のため、${c.secretary_target}にご認識いただきたい内容でございます。」

### 5-4. 折り返し依頼時

> 「大変ありがたいです。
> ${c.secretary_target.replace(/様$/, '')}様がお忙しいようでしたら、 **5分のご共有だけでも結構** とお伝えいただけますでしょうか。
> 概要をメールでお送りすることも可能ですので、お申し付けくださいませ。」

---

## 6. 役員本人ピッチ（110秒・${shortName}特化）

### 【0-15秒：自己紹介＋${shortName}への敬意】

> 「お忙しいところ恐れ入ります。パナリット株式会社の◯◯と申します。
> 弊社は **Google米国本社で人事制度改革をリードしていた小川** が立ち上げた、人事データ基盤の会社でございます。
> 本日は、 **${c.pitch_opener}** を拝見し、ぜひお話しできればと思いご連絡を差し上げました。」

### 【15-40秒：経営課題との接続】

> 「${c.pitch_challenge}」

### 【40-60秒：先潰し（既存システム前提）】

> 「${c.pitch_preempt}」

### 【60-90秒：4論点（${shortName}版）】

> 「具体的には、 **${c.comp_ref}を含む100社以上** で、下記4点について経営層と議論しております。
>
> 1点目、 **${c.four_points[0]}** 。
> 2点目、 **${c.four_points[1]}** 。
> 3点目、 **${c.four_points[2]}** 。
> 4点目、 **${c.four_points[3]}** 。」

### 【90-110秒：アポ依頼】

> 「もしご関心をお持ちいただけましたら、 **30分ほど、弊社CEO小川と私で直接ご訪問** させていただきたく存じます。
> 来週ですと、 **△曜日△時、もしくは△曜日△時** はいかがでしょうか。」

---

## 7. 想定質問への回答（商談で深掘り前提、簡潔に）

> **原則** ：架電中はヒアリング・深掘りはしない。質問が来たら **アポ獲得の動機** に変換する。

${c.qa.map(q => `### 「${q.q}」

> 「${q.a}」
`).join('\n')}
### 「料金は？」

> 「規模・連携データ範囲によりますが、 **エンタープライズ向けで年額数百万円〜1,000万円程度** が一般的なレンジです。 **まずは30分、${honorific}のご状況に合うかご確認いただく時間を頂戴できますでしょうか** 。」

---

## 8. このアプローチが効く理由（社内説明用ロジック）

### 8-1. なぜ今か（タイミング）
${c.why_now_reasons.map(r => `- ${r}`).join('\n')}

### 8-2. なぜ${shortName}か（ターゲット適合性）
${c.why_company_reasons.map(r => `- ${r}`).join('\n')}

### 8-3. なぜパナリットか（提供価値の固有性）
${c.why_panalyt_reasons.map(r => `- ${r}`).join('\n')}

---

## 9. 運用チェックリスト（${shortName}用）

**架電前**：
${c.checklist_before.map(ch => `- [ ] ${ch}`).join('\n')}

**架電中**：
${c.checklist_during.map(ch => `- [ ] ${ch}`).join('\n')}

**架電後**：
- [ ] 24時間以内に秘書宛フォローメール送付
- [ ] アポ獲得時は **小川CEO同行が可能か社内調整**
${c.checklist_after.map(ch => `- [ ] ${ch}`).join('\n')}

---

## 10. 商談獲得後のシナリオ（参考）

### 10-1. 商談1回目（30分）
${c.deal_1.map(d => `- ${d}`).join('\n')}

### 10-2. 商談2回目（60分・小川CEO同行）
${c.deal_2.map(d => `- ${d}`).join('\n')}

### 10-3. 商談3回目（経営層プレゼン）
${c.deal_3.map(d => `- ${d}`).join('\n')}

### 10-4. 受注（PoC開始）
${c.deal_4.map(d => `- ${d}`).join('\n')}

---

> **最後に**
>
> ${c.closing}
`;
}

// テンプレ生成の確認用テスト
console.log('Template generator ready. Testing with sample...');
const sample = generateScript({
  name: 'テスト株式会社', code: '9999', market: '東証プライム',
  hq: '東京都千代田区', ceo: '山田太郎', hr_title: 'CHRO', hr_person: '鈴木花子',
  scale: '連結1,000名', plan: '中計2026',
  why_now: 'テスト用のWhy now文',
  timing_hook: '中計発表直後の今がアプローチ好機',
  highlights: [['テーマ1', '目標1', '価値1'], ['テーマ2', '目標2', '価値2']],
  points: ['ポイント1', 'ポイント2'],
  targets: [['◎', '社長 山田太郎', '意思決定者']],
  timing_script: 'タイミングフック文', timing_reason: '理由文',
  logic_label: 'テスト', logic_script: 'ロジックフック文',
  comp_label: '大手実績', comp_ref: '大手メガバンクをはじめ、パナソニック、JT',
  comp_value: 'グローバル人材統合',
  email_subject: '【テスト】件名', email_to: '社長', email_to_name: '山田太郎',
  email_intro: 'メール導入文', email_points: ['ポイント1', 'ポイント2'],
  system_note: '現行システムをそのまま利用可能',
  secretary_opener: '中計について', secretary_target: '山田社長',
  secretary_purpose: '用件説明文', secretary_escalation: '経営判断領域',
  pitch_opener: '中計発表', pitch_challenge: 'ピッチ課題文', pitch_preempt: '先潰し文',
  four_points: ['論点1', '論点2', '論点3', '論点4'],
  qa: [{q: '質問1', a: '回答1'}],
  why_now_reasons: ['理由1'], why_company_reasons: ['理由1'], why_panalyt_reasons: ['理由1'],
  checklist_before: ['チェック1'], checklist_during: ['チェック1'], checklist_after: ['チェック1'],
  deal_1: ['ステップ1'], deal_2: ['ステップ1'], deal_3: ['ステップ1'], deal_4: ['ステップ1'],
  closing: 'クロージング文'
});
console.log('Generated ' + sample.length + ' chars');
console.log('Template OK');
