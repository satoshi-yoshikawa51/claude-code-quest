"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   PIXEL ART CHARACTERS (HD-2D style)
   ═══════════════════════════════════════════ */
const PixelChar = ({ size=4, animate=false, flip=false }) => {
  const rows = [
    ".....111111.......",  // hair top
    "....1HHHHHHh1.....",  // hair
    "...1HHhhhhhHH1....",  // hair highlight
    "...1HhhhhhhhHH1...",  // hair full
    "...1HSSSSSSSHH1...",  // forehead
    "...1SSSSSSSSSS1...",  // upper face
    "...1SSEESSEESS1...",  // eyes (2px wide each)
    "...1SSSSSSSSSS1...",  // below eyes
    "...1SSSSSSSSSS1...",  // cheeks
    "....1SSSSSSSS1....",  // lower face
    ".....1SSSSSS1.....",  // chin
    "......1ssss1......",  // neck
    ".....1BTTTTB1.....",  // collar
    "....1BBbTTbBB1....",  // jacket + shirt
    "....1bBBBBBBb1....",  // jacket body
    "....1bBBBBBBb1....",  // jacket body
    ".....1BBBBBB1.....",  // jacket bottom
    ".....1PP..PP1.....",  // pants
    "....1KK1..1KK1....",  // shoes
  ];
  const pal: Record<string, string> = {
    "1":"#1A1020",H:"#5A3018",h:"#9A6838",
    S:"#FFCC99",s:"#DDAA77",g:"#334488",E:"#1A1020",
    m:"#E08080",B:"#2244AA",b:"#4477CC",T:"#EEEEFF",P:"#2A2A40",K:"#5A3418",
  };
  const W=18, H=19;
  return (
    <div style={{position:"relative",display:"inline-block",
      transform:flip?"scaleX(-1)":"none",
      animation:animate?"charBounce 1.2s ease infinite":"none",
      filter:"drop-shadow(0 3px 6px rgba(0,0,0,0.5))"}}>
      <svg width={W*size} height={H*size} viewBox={`0 0 ${W} ${H}`}
        shapeRendering="crispEdges"
        style={{imageRendering:"pixelated"}}>
        {rows.join("").split("").map((c,i)=>{
          if(c==="."||!pal[c]) return null;
          return <rect key={i} x={i%W} y={Math.floor(i/W)} width={1} height={1} fill={pal[c]}/>;
        })}
      </svg>
    </div>
  );
};

/* ═══ 5 UNIQUE ENEMY SPRITES ═══ */
const ENEMY_DATA: { W: number; rows: string[]; pal: Record<string, string> }[] = [
  { // 1: バグスライム - ぷるぷるスライム
    W:14, rows:[
      "....1GGGG1....",
      "..1GGggGGGG1..",
      ".1GGgggGGGGG1.",
      ".1GgGGGGGGGG1.",
      "1GGGGGGGGGGGG1",
      "1GGG1WW11WW1G1",
      "1GGG1EW11EW1G1",
      "1GGGGGGGGGGGG1",
      "1GGGGGmmGGGG1.",
      ".1GGGGGGGGGG1.",
      "..1GGGGGGGG1..",
      "...11111111...",
    ],
    pal:{1:"#1A3020",G:"#44BB66",g:"#66DD88",E:"#1A1020",W:"#FFFFFF",m:"#228844"},
  },
  { // 2: 迷宮コード - 浮遊するコードブロック
    W:14, rows:[
      "..111111111...",
      ".1PPPPPPPPP1..",
      "1PPpPPPPPpPP1.",
      "1PP1WW1WW1PP1.",
      "1PP1EW1EW1PP1.",
      "1PPpPPPPPpPP1.",
      "1PPPPmmPPPPP1.",
      "1PcPcPcPcPcP1.",
      "1PPcPcPcPcPP1.",
      ".1PcPcPcPcP1..",
      "..111111111...",
    ],
    pal:{1:"#1A1030",P:"#7755CC",p:"#9977EE",E:"#1A1020",W:"#FFFFFF",m:"#AA66DD",c:"#55DDAA"},
  },
  { // 3: バグドラゴン - 翼と角を持つドラゴン
    W:18, rows:[
      "..1RR1....1RR1....",
      "..1RRR1..1RRR1....",
      "...1RRRRRRRR1.....",
      "...1RRrRRRrRR1....",
      "..1RRRRRRRRRR1....",
      "1r1RR1WW1WW1R1r1..",
      "1rr1R1EW1EW1R1rr1.",
      ".1rr1RRRRRR1rr1...",
      "..1r1RRmmRR1r1....",
      "...1RRRRRRRR1.....",
      "...1RRRTTRRR1.....",
      "....1RR11RR1......",
      "....1R1..1R1......",
      ".....11..11.......",
    ],
    pal:{1:"#3A0808",R:"#CC2222",r:"#EE4444",E:"#1A1020",W:"#FFEEEE",m:"#FF6644",T:"#FFD700"},
  },
  { // 4: スパゲッティ怪人 - 絡まった麺の怪物
    W:16, rows:[
      "..n..nn..n.n....",
      ".nn.1YYYY1.nn...",
      "..n1YYyyYYY1n...",
      "..1YYyYYYyYY1...",
      ".1YYY1WW1WW1Y1..",
      ".1YYY1EW1EW1Y1..",
      ".1YYYYYYYYYyY1..",
      ".1YYYYYmmYYYY1..",
      ".1YoYYYYYYoYY1..",
      "..1YYoYYoYYY1...",
      "..n1YYYYYY1n....",
      ".nn.111111.nn...",
      "..n..n..n..n....",
    ],
    pal:{1:"#6A3A00",Y:"#FFCC44",y:"#FFE088",E:"#1A1020",W:"#FFFFFF",m:"#FF8844",o:"#FF8800",n:"#DDAA22"},
  },
  { // 5: レガシー大魔王 - 王冠を戴く闇のボス
    W:18, rows:[
      "..1Y1..1Y1..1Y1...",
      "..1cY1.1Y1.1Yc1...",
      "...1cYYYYYYYc1....",
      "..1PPPPPPPPPP1....",
      ".1PPppPPPPppPP1...",
      ".1PPP1RR1RR1PP1...",
      ".1PPP1EW1EW1PP1...",
      ".1PPPpPPPPpPPP1...",
      ".1PPPPPmmPPPPP1...",
      "1PPPPPPPPPPPPPP1..",
      "1PcPPPPPPPPPPcP1..",
      "1PPcPPPPPPPPcPP1..",
      ".1PPcPPPPPPcPP1...",
      "..1PPccPPccPP1....",
      "...1PPPPPPPP1.....",
      "...1PP1..1PP1.....",
      "...111....111.....",
    ],
    pal:{1:"#0A0818",P:"#443388",p:"#6655AA",E:"#FF2222",W:"#FFAAAA",m:"#8844AA",c:"#FFD700",Y:"#FFE040",R:"#FF4444"},
  },
];

const EnemySprite = ({ stageIdx=0, size=4, hurt=false }) => {
  const e = ENEMY_DATA[stageIdx] || ENEMY_DATA[0];
  const W = e.W, H = e.rows.length;
  return (
    <div style={{filter:hurt?"brightness(3) drop-shadow(0 0 14px #fff)":"drop-shadow(0 3px 6px rgba(0,0,0,0.5))",
      animation:hurt?"none":"enemyFloat 2.5s ease-in-out infinite"}}>
      <svg width={W*size} height={H*size} viewBox={`0 0 ${W} ${H}`}
        shapeRendering="crispEdges" style={{imageRendering:"pixelated"}}>
        {e.rows.join("").split("").map((c,i)=>{
          if(c==="."||!e.pal[c]) return null;
          return <rect key={i} x={i%W} y={Math.floor(i/W)} width={1} height={1} fill={e.pal[c]}/>;
        })}
      </svg>
    </div>
  );
};

const ClaudeCompanion = ({ size=2.5 }) => {
  const p = [
    "....PPPPPP......","...PPPPPPPP.....","..PPWPPWPPPP....","..PPPPPPPPPP....",
    "..PPPPMPPPP.....","...PPPPPPPP.....","....CCCCCC......","...CCCCCCCC.....",
    "..CCCCCCCCCC....","...CCCCCCCC.....",
  ];
  const c: Record<string, string> = {P:"#D4A574",W:"#FFFFFF",M:"#E88B8B",C:"#7B68EE"};
  return (
    <svg width={16*size} height={10*size} viewBox="0 0 16 10"
      shapeRendering="crispEdges"
      style={{imageRendering:"pixelated",filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.4))"}}>
      {p.map((row,y)=>row.split("").map((ch,x)=>
        ch!=="."&&<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c[ch]||"transparent"}/>
      ))}
    </svg>
  );
};

/* ═══ Particle/Bokeh component ═══ */
const Particles = ({count=15}) => (
  <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:1}}>
    {Array.from({length:count}).map((_,i)=>{
      const s=2+Math.random()*6, x=Math.random()*100, y=Math.random()*100,
        d=4+Math.random()*8, dl=Math.random()*5;
      return <div key={i} style={{position:"absolute",left:x+"%",top:y+"%",
        width:s+"px",height:s+"px",borderRadius:"50%",
        background:s>5?`rgba(255,240,180,${0.15+Math.random()*0.2})`:`rgba(255,255,255,${0.3+Math.random()*0.3})`,
        filter:s>5?`blur(${Math.random()*2}px)`:"none",
        animation:`particleFloat ${d}s ease-in-out ${dl}s infinite alternate`}}/>;
    })}
  </div>
);

/* ═══════════════════════════════════
   GAME DATA
   ═══════════════════════════════════ */
const STAGES = [
  {
    id:1, title:"はじめの一歩", subtitle:"Claude Codeとの出会い",
    xpReward:120, enemyName:"バグスライム Lv.1", enemyHp:4,
    clearTip:"実際のClaude Codeも npm install -g @anthropic-ai/claude-code でインストール。claude と打つだけで対話が始まります！",
    story:[
      {speaker:"narrator",text:"202X年── 株式会社テックフロンティア。"},
      {speaker:"narrator",text:"あなたは新任のWebディレクター。\n開発チームのリリース遅延が目立ち始めていた。"},
      {speaker:"cto",text:"やあ、来てくれたか。\n最近、開発の生産性が落ちていてね..."},
      {speaker:"cto",text:"巷で話題のAI開発ツール──\n『Claude Code』を試してみないか？"},
      {speaker:"cto",text:"ターミナルから直接AIと対話して、\nコードの分析や生成ができるらしい。"},
      {speaker:"narrator",text:"こうして、あなたのAI冒険が始まった──"},
    ],
    steps:[
      {briefing:"まずは claude コマンドを試してみよう",hint:"ターミナルに claude と入力してEnterを押そう",
        expect:"claude",response:[{type:"error",text:"zsh: command not found: claude"},{type:"system",text:"💡 まだインストールされていないようだ..."}],
        companion:"おっと、まだインストールされていないみたいだね。\nまずはnpmでインストールしよう！",damage:1},
      {briefing:"Claude Code をインストールしよう",hint:"npm install -g @anthropic-ai/claude-code と入力",
        expect:"npm install -g @anthropic-ai/claude-code",response:[{type:"install",text:"📦 パッケージをダウンロード中..."}],
        companion:"いいね！グローバルインストールだから\n-g オプションが必要だよ。",damage:1},
      {briefing:"インストールできた！もう一度 claude を実行しよう",hint:"claude と入力してEnterを押そう",
        expect:"claude",response:[{type:"success",text:"  ✦ Claude Code v1.0.0 ✦"},{type:"success",text:"  AI-Powered Development Tool"},{type:"system",text:"🎉 Claude Code が起動しました！"}],
        companion:"やった！Claude Codeが動いたね！\nこれがAI開発の第一歩だ！",damage:1},
      {briefing:"Claude Code に質問してみよう！\nclaude に続けて質問を入力しよう",hint:'claude "このプロジェクトの構成を教えて" のように入力',
        expect:"claude ",matchType:"startsWith",response:"ai",
        companion:"Claude Codeは自然言語で質問できるのが強み。\n日本語でもOKだよ！",damage:1},
    ],
  },
  {
    id:2, title:"プロジェクトを読み解け", subtitle:"既存コードの全体像をつかめ",
    xpReward:180, enemyName:"迷宮コード Lv.3", enemyHp:5,
    clearTip:"claude で対話開始するとプロジェクトのファイルを自動認識します。自然言語で「構成を教えて」「READMEを書いて」と頼むだけでOK！",
    story:[
      {speaker:"narrator",text:"Claude Codeのインストールに成功した\nあなたに、早速最初の任務が下る──"},
      {speaker:"cto",text:"来週、新しいメンバーが入るんだ。\nオンボーディング用にプロジェクトの\n全体像をまとめてほしい。"},
      {speaker:"cto",text:"でも、この古いコードベース…\nドキュメントがほとんどなくてね。"},
      {speaker:"narrator",text:"ドキュメントなき巨大リポジトリ──\nClaude Codeで読み解けるか？"},
    ],
    steps:[
      {briefing:"プロジェクトフォルダに移動しよう",hint:"cd project と入力してフォルダに移動",
        expect:"cd project",matchType:"startsWith",
        response:[{type:"success",text:"~/project"},{type:"system",text:"📂 プロジェクトフォルダに移動しました"}],
        companion:"まずは作業フォルダに移動だね！\ncdはchange directoryの略だよ。",damage:1},
      {briefing:"Claude Code を起動しよう",hint:"claude と入力して起動しよう",
        expect:"claude",
        response:[{type:"success",text:"  ✦ Claude Code v1.0.0 ✦"},{type:"system",text:"📁 /project を認識（42ファイル）"}],
        companion:"起動するとフォルダ内のファイルを\n自動で認識してくれるんだ！",damage:1},
      {briefing:"プロジェクトの構成を聞いてみよう",hint:'claude "このプロジェクトの全体構成を教えて"',
        expect:"claude ",matchType:"startsWith",response:"ai",
        companion:"自然言語で質問するだけで\nコード全体を分析してくれるよ！",damage:1},
      {briefing:"READMEを自動生成してもらおう",hint:'claude "README.mdを作成して"',
        expect:"claude ",matchType:"startsWith",response:"ai",
        companion:"ファイル生成もお手のもの！\nディレクターが指示するだけでAIが書いてくれる。",damage:2},
    ],
  },
  {
    id:3, title:"緊急バグ報告", subtitle:"本番障害を切り抜けろ",
    xpReward:250, enemyName:"バグドラゴン Lv.5", enemyHp:5,
    clearTip:"git log と git diff で変更点を確認→claude に症状を伝えるだけで原因特定＆修正案を提案してくれます。",
    story:[
      {speaker:"narrator",text:"ある金曜の夕方──\n嫌な予感がするメッセージが飛び込んできた。"},
      {speaker:"cto",text:"大変だ！本番サイトで決済エラーが\n発生している！"},
      {speaker:"cto",text:"エンジニアの山田くんが休暇中で…\n原因の特定だけでも手伝ってくれ！"},
      {speaker:"narrator",text:"コードが読めないディレクターが、\nClaude Codeだけで障害に立ち向かう──"},
    ],
    steps:[
      {briefing:"最近の変更を確認しよう",hint:"git log --oneline で直近のコミットを確認",
        expect:"git log --oneline",
        response:[{type:"success",text:"a1b2c3d 決済APIのエンドポイント変更"},{type:"success",text:"e4f5g6h ヘッダーデザイン修正"},{type:"success",text:"i7j8k9l テスト追加"}],
        companion:"git logでコミット履歴が見えるね。\n一番上の「決済API」が怪しい！",damage:1},
      {briefing:"怪しいコミットの差分を確認しよう",hint:"git diff HEAD~1 で直前との差分を確認",
        expect:"git diff HEAD~1",
        response:[{type:"error",text:"- const API_URL = '/api/v1/payment'"},{type:"success",text:"+ const API_URL = '/api/v2/payment'"},{type:"system",text:"📝 1ファイル変更、2行追加、2行削除"}],
        companion:"APIのバージョンがv1→v2に\n変わってる！これが原因かも。",damage:1},
      {briefing:"Claude Codeにバグ原因を分析してもらおう",hint:'claude "この差分のバグ原因を分析して"',
        expect:"claude ",matchType:"startsWith",response:"ai",
        companion:"AIに差分を渡すだけで\n原因を分析してくれるんだ！",damage:1},
      {briefing:"修正方法を提案してもらおう",hint:'claude "修正方法を提案して"',
        expect:"claude ",matchType:"startsWith",response:"ai",
        companion:"原因→修正案までAIが出せる！\nディレクターでも障害対応できたね！",damage:2},
    ],
  },
  {
    id:4, title:"コードレビューの助っ人", subtitle:"PRの山を片付けろ",
    xpReward:300, enemyName:"スパゲッティ怪人 Lv.7", enemyHp:6,
    clearTip:"claude にPRの差分を見せて「レビューして」と伝えるだけ。セキュリティ・パフォーマンス・可読性など多角的にチェックしてくれます。",
    story:[
      {speaker:"narrator",text:"バグ対応を乗り越えたあなたの元に、\n新たな試練が押し寄せる──"},
      {speaker:"cto",text:"先月からプルリクエストが溜まっていて…\nレビューが追いついていないんだ。"},
      {speaker:"cto",text:"品質を保ちながら効率化できないかな？"},
      {speaker:"narrator",text:"大量のPRの山──\nClaude Codeでレビューを加速せよ！"},
    ],
    steps:[
      {briefing:"溜まっているPR一覧を確認しよう",hint:"gh pr list でプルリクエスト一覧を表示",
        expect:"gh pr list",
        response:[{type:"success",text:"#142  feat: ユーザー認証改善  (open)"},{type:"success",text:"#138  fix: メモリリーク修正   (open)"},{type:"success",text:"#135  refactor: DB接続最適化 (open)"},{type:"system",text:"📋 3件のオープンPRがあります"}],
        companion:"gh はGitHub CLIツール。\npr list でPR一覧が見えるよ！",damage:1},
      {briefing:"最新PRの内容を確認しよう",hint:"gh pr view 142 でPRの詳細を確認",
        expect:"gh pr view 142",
        response:[{type:"success",text:"feat: ユーザー認証改善"},{type:"success",text:"author: yamada (+324 -89)"},{type:"success",text:"8 files changed"},{type:"system",text:"📝 大規模な変更です…"}],
        companion:"324行追加の大きなPR！\n手動レビューだと大変だけど…",damage:1},
      {briefing:"Claude Codeにレビューを依頼しよう",hint:'claude "PR #142をレビューして"',
        expect:"claude ",matchType:"startsWith",response:"ai",
        companion:"AIが自動でコードを読んで\n問題点を指摘してくれるよ！",damage:2},
      {briefing:"セキュリティ観点でもチェックしよう",hint:'claude "セキュリティリスクを確認して"',
        expect:"claude ",matchType:"startsWith",response:"ai",
        companion:"セキュリティレビューも一瞬！\nレビュー品質と速度を両立できるね。",damage:2},
    ],
  },
  {
    id:5, title:"AIディレクター覚醒", subtitle:"チームの開発フローを変革せよ",
    xpReward:400, enemyName:"レガシー大魔王 Lv.10", enemyHp:6,
    clearTip:"claude /init でCLAUDE.mdを作成するとプロジェクト固有のルールをAIに覚えさせられます。チーム全員で共有すれば開発フロー全体が加速！",
    story:[
      {speaker:"narrator",text:"数々の試練を乗り越えたあなたは、\nチーム内で一目置かれる存在になっていた。"},
      {speaker:"cto",text:"すごいな、Claude Codeを\nこんなに使いこなすとは。"},
      {speaker:"cto",text:"最後に一つ頼みがある。\nチーム全体の開発フローに\nClaude Codeを組み込んでほしい。"},
      {speaker:"narrator",text:"最終決戦── レガシーな開発体制を\nAIの力で変革する時が来た。"},
    ],
    steps:[
      {briefing:"CLAUDE.md（プロジェクト設定ファイル）を作ろう",hint:"claude /init でプロジェクト設定を初期化",
        expect:"claude /init",
        response:[{type:"success",text:"📄 CLAUDE.md を作成中..."},{type:"success",text:"✅ プロジェクト設定を生成しました"},{type:"system",text:"💡 このファイルにルールを書くとAIが従います"}],
        companion:"CLAUDE.mdはAIへの指示書！\nプロジェクトのルールを書いておくと\n全メンバーに反映されるよ。",damage:1},
      {briefing:"コーディング規約を設定しよう",hint:'claude "CLAUDE.mdにTypeScriptの規約を追加して"',
        expect:"claude ",matchType:"startsWith",response:"ai",
        companion:"規約をAIに教えれば、\n生成コードが最初から規約準拠に！",damage:1},
      {briefing:"テストコードを自動生成してもらおう",hint:'claude "auth.tsのユニットテストを作成して"',
        expect:"claude ",matchType:"startsWith",response:"ai",
        companion:"テスト作成もAIにお任せ！\n仕様を伝えるだけでOK。",damage:2},
      {briefing:"チームへの導入提案書を作ろう",hint:'claude "Claude Code導入の提案書を作って"',
        expect:"claude ",matchType:"startsWith",response:"ai",
        companion:"提案書までAIが書いてくれる！\nこれであなたは真のAIディレクターだ！",damage:2},
    ],
  },
];

const LVL=[0,100,250,500,800,1200,1700,2300,3000,4000];
const getLevel=(xp: number)=>{let l=1;for(let i=1;i<LVL.length;i++){if(xp>=LVL[i])l=i+1;else break;}return l;};
const getXpNext=(lv: number)=>LVL[lv]||LVL[LVL.length-1];
const getXpCur=(lv: number)=>LVL[lv-1]||0;
const sleep=(ms: number)=>new Promise(r=>setTimeout(r,ms));
const NAMES: Record<string, string> = {narrator:"ナレーション",cto:"CTO 田中",companion:"クロード"};

/* ═══════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════ */
export default function ClaudeCodeQuest() {
  const [screen,setScreen]=useState("title");
  const [stageIdx,setStageIdx]=useState(0);
  const [stepIdx,setStepIdx]=useState(0);
  const [dialogIdx,setDialogIdx]=useState(0);
  const [xp,setXp]=useState(0);
  const [termHistory,setTermHistory]=useState<{type:string;text:string}[]>([]);
  const [input,setInput]=useState("");
  const [companionMsg,setCompanionMsg]=useState("");
  const [installing,setInstalling]=useState(false);
  const [gainedXp,setGainedXp]=useState(0);
  const [leveledUp,setLeveledUp]=useState(false);
  const [aiLoading,setAiLoading]=useState(false);
  const [failedAttempts,setFailedAttempts]=useState<string[]>([]);
  const [displayedText,setDisplayedText]=useState("");
  const [isTyping,setIsTyping]=useState(false);
  const [enemyHp,setEnemyHp]=useState(4);
  const [enemyMaxHp,setEnemyMaxHp]=useState(4);
  const [enemyHurt,setEnemyHurt]=useState(false);
  const [attackAnim,setAttackAnim]=useState(false);
  const [showDamage,setShowDamage]=useState(false);
  const [cleared,setCleared]=useState<number[]>([]);
  const inputRef=useRef<HTMLInputElement>(null);
  const termRef=useRef<HTMLDivElement>(null);
  const typingRef=useRef<ReturnType<typeof setInterval>|null>(null);

  const stage=STAGES[stageIdx]; const step=stage?.steps?.[stepIdx]; const level=getLevel(xp);
  const isUnlocked=(i: number)=>i===0||cleared.includes(i-1); // unlocked if previous stage cleared

  useEffect(()=>{try{const r=localStorage.getItem("ccq_save");if(r){const d=JSON.parse(r);if(d.xp)setXp(d.xp);if(d.cl)setCleared(d.cl);}}catch{}},[]);
  const saveProgress=(nxp: number,ncl?: number[])=>{const c=ncl||cleared;try{localStorage.setItem("ccq_save",JSON.stringify({xp:nxp,cl:c}));}catch{}};
  const scrollTerm=()=>{setTimeout(()=>{if(termRef.current)termRef.current.scrollTop=termRef.current.scrollHeight;},50);};

  const typeText=useCallback((text: string,cb?: ()=>void)=>{
    if(typingRef.current)clearInterval(typingRef.current);
    setIsTyping(true);setDisplayedText("");let i=0;
    typingRef.current=setInterval(()=>{i++;setDisplayedText(text.slice(0,i));
      if(i>=text.length){clearInterval(typingRef.current!);typingRef.current=null;setIsTyping(false);if(cb)cb();}
    },28);
  },[]);

  const skipTyping=()=>{if(typingRef.current){clearInterval(typingRef.current);typingRef.current=null;}
    if(screen==="story"){const d=stage.story[dialogIdx];if(d)setDisplayedText(d.text);}setIsTyping(false);};

  useEffect(()=>{if(screen==="story"&&stage?.story?.[dialogIdx])typeText(stage.story[dialogIdx].text);},[screen,dialogIdx,stageIdx,typeText,stage]);

  const advanceDialog=()=>{if(isTyping){skipTyping();return;}
    if(dialogIdx<stage.story.length-1)setDialogIdx(dialogIdx+1);
    else{setScreen("play");setEnemyHp(stage.enemyHp);setEnemyMaxHp(stage.enemyHp);
      setCompanionMsg("さあ、バトル開始だ！\nターミナルにコマンドを入力して攻撃しよう！");
      setTimeout(()=>inputRef.current?.focus(),100);}
  };

  const addTL=(lines: {type:string;text:string}[])=>{setTermHistory(h=>[...h,...lines]);scrollTerm();};

  const playAttack=async(dmg: number)=>{
    setAttackAnim(true);await sleep(300);setAttackAnim(false);
    setEnemyHurt(true);setShowDamage(true);setEnemyHp(p=>Math.max(0,p-dmg));
    await sleep(400);setEnemyHurt(false);setShowDamage(false);
  };

  const handleAiResponse=async(query: string)=>{
    setAiLoading(true);addTL([{type:"system",text:"🤔 分析中..."}]);
    try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
        system:"あなたはClaude Codeというターミナルベースの開発ツールです。Webディレクター向けに、わかりやすく簡潔に日本語で回答してください。技術用語には簡単な説明を添えてください。回答は5行以内で簡潔に。回答の冒頭に絵文字を1つ付けてください。",
        messages:[{role:"user",content:query}]})});
      const data=await res.json();const text=data.content?.map((c: {text?:string})=>c.text||"").join("")||"応答を取得できませんでした";
      addTL(text.split("\n").map((l: string)=>({type:"ai",text:l})));
    }catch{addTL([{type:"ai",text:"📁 プロジェクト構造を分析しました。\n  /src - ソースコード\n  /tests - テストファイル\n  /docs - ドキュメント"}]);}
    setAiLoading(false);
  };

  const handleCommand=async()=>{
    const cmd=input.trim();if(!cmd||!step)return;
    addTL([{type:"input",text:`$ ${cmd}`}]);setInput("");
    const isMatch=step.matchType==="startsWith"?cmd.startsWith(step.expect):cmd===step.expect;
    if(isMatch){
      if(step.response==="ai"){const q=cmd.replace(/^claude\s*/,"").replace(/^["']|["']$/g,"");await handleAiResponse(q||"このプロジェクトの構成を教えて");}
      else if((step.response as {type:string;text:string}[])[0]?.type==="install"){setInstalling(true);
        addTL([{type:"system",text:"📦 ダウンロード中..."}]);scrollTerm();await sleep(800);
        addTL([{type:"system",text:"⚙️ 依存関係を解決中..."}]);scrollTerm();await sleep(600);
        addTL([{type:"system",text:"🔧 インストール中..."}]);scrollTerm();await sleep(700);
        addTL([{type:"success",text:"✅ インストール完了！"}]);setInstalling(false);
      }else{addTL(step.response as {type:string;text:string}[]);}
      await playAttack(step.damage||1);setCompanionMsg(step.companion);proceedStep();
    }else{
      setFailedAttempts(p=>[...p,cmd]);
      const cb=cmd.split(" ")[0],eb=step.expect.split(" ")[0];
      const err=cmd.toLowerCase()===step.expect.toLowerCase()&&cmd!==step.expect?`zsh: 大文字小文字が違うようです: ${cb}`:cb===eb?"エラー: オプションまたは引数が正しくありません":cmd.includes(eb)||step.expect.includes(cb)?`zsh: コマンドの形式が違います: ${cmd}`:`zsh: command not found: ${cb}`;
      addTL([{type:"error",text:err}]);analyzeFailure(cmd,step);
    }
    scrollTerm();
  };

  const analyzeFailure=async(cmd: string, cs: typeof step)=>{
    setAiLoading(true);
    try{const af=[...failedAttempts,cmd],fh=af.slice(-5).map((f,i)=>`${i+1}回目: "${f}"`).join("\n");
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:`あなたはRPGゲームの仲間キャラ「クロード」です。プレイヤーはWebディレクター（CLI初心者）です。
プレイヤーが間違ったコマンドを入力しました。
【ミッション】${cs.briefing}
【期待するコマンド】${cs.expect}${cs.matchType==="startsWith"?"（この後に続きがあってもOK）":"（完全一致）"}
【入力した内容】"${cmd}"
【過去の間違い】\n${fh}
【ルール】答えは直接教えない/入力と正解の具体的な違いを分析/間違い回数が多いほど具体的に/RPGの仲間らしい口調で2-3文/CLI初心者向け`,
          messages:[{role:"user",content:`"${cmd}" と入力したけど間違いだった。どこが違う？`}]})});
      const data=await res.json();setCompanionMsg(data.content?.map((c: {text?:string})=>c.text||"").join("")||"もう一度確認してみよう！");
    }catch{const af=[...failedAttempts,cmd],n=af.length,ex=cs.expect;
      if(n===1)setCompanionMsg("おっと、惜しい！\nミッションの説明をもう一度読んでみよう。");
      else if(n===2){if(cmd.split(" ")[0]!==ex.split(" ")[0])setCompanionMsg(`コマンドの最初の単語を確認して。\n「${ex.split(" ")[0].slice(0,2)}...」で始まるよ！`);
        else setCompanionMsg("出だしは合ってるね！\nオプション部分を見直してみよう。");}
      else setCompanionMsg(`何度もチャレンジしてえらい！\n「${ex.slice(0,Math.floor(ex.length*0.6))}...」で始まるよ。あと少し！`);
    }setAiLoading(false);
  };

  const proceedStep=()=>{setFailedAttempts([]);
    if(stepIdx<stage.steps.length-1){setStepIdx(stepIdx+1);}
    else{setTimeout(()=>{const rw=stage.xpReward,nx=xp+rw,ol=getLevel(xp),nl=getLevel(nx);
      const ncl=cleared.includes(stageIdx)?cleared:[...cleared,stageIdx];
      setCleared(ncl);setGainedXp(rw);setLeveledUp(nl>ol);setXp(nx);saveProgress(nx,ncl);setScreen("clear");},1200);}
  };

  const requestHint=async()=>{
    if(!step)return;setAiLoading(true);
    try{const hf=failedAttempts.length>0,fh=hf?failedAttempts.slice(-5).map((f,i)=>`${i+1}回目: "${f}"`).join("\n"):"まだ入力していません",fc=failedAttempts.length;
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:`あなたはRPGゲームの仲間キャラ「クロード」です。プレイヤーはWebディレクター（CLI初心者）です。
【ミッション】${step.briefing}
【期待するコマンド】${step.expect}${step.matchType==="startsWith"?"（この後に続きがあってもOK）":"（完全一致）"}
【基本ヒント】${step.hint}
【過去の入力】${fh}
【間違い回数】${fc}回
【ルール】${fc===0?"方向性だけ教えて":fc===1?"軽いヒント":fc===2?"もう少し具体的に":fc>=3?"かなり踏み込んだヒント":""}/答えそのものは完全には教えない/RPGの仲間らしい口調で2-3文`,
          messages:[{role:"user",content:hf?`"${failedAttempts[failedAttempts.length-1]}"って入力したけどダメだった。ヒントちょうだい！`:"何を入力すればいいかわからない。ヒントちょうだい！"}]})});
      const data=await res.json();setCompanionMsg(data.content?.map((c: {text?:string})=>c.text||"").join("")||step.hint);
    }catch{if(failedAttempts.length===0)setCompanionMsg(step.hint);
      else{const l=failedAttempts[failedAttempts.length-1],ex=step.expect;
        if(l.split(" ")[0]===ex.split(" ")[0])setCompanionMsg("コマンド名は合ってるよ！\nオプションや引数を確認してみよう。");
        else setCompanionMsg(`「${ex.split(" ")[0]}」というコマンドを使うよ。\nそこから試してみて！`);}}
    setAiLoading(false);
  };

  const startStage=(idx: number)=>{if(!isUnlocked(idx))return;
    setStageIdx(idx);setStepIdx(0);setDialogIdx(0);setTermHistory([]);
    setInput("");setCompanionMsg("");setFailedAttempts([]);setScreen("story");};

  const nextStage=()=>{if(stageIdx<STAGES.length-1)startStage(stageIdx+1);else setScreen("title");};

  const xpPct=level<LVL.length?((xp-getXpCur(level))/(getXpNext(level)-getXpCur(level)))*100:100;
  const hpPct=enemyMaxHp>0?(enemyHp/enemyMaxHp)*100:0;

  /* ═════════════════════════════════════
     RENDER: TITLE
     ═════════════════════════════════════ */
  if(screen==="title") return (
    <div style={S.root}><style>{CSS}</style>
      <div style={S.titleWrap}>
        <div style={S.bgFar}/><div style={S.bgMid}/><div style={S.bgNear}/>
        <div style={S.groundBase}/>
        <div style={S.lightOverlay}/>
        <Particles count={20}/>
        <div style={S.fgLeafL}/><div style={S.fgLeafR}/>
        <div style={S.titleChar}><PixelChar size={7} animate/></div>
        <div style={S.titleUI}>
          <div style={S.titleBadge}>⚔ AI RPG Learning Game ⚔</div>
          <h1 style={S.titleLogo}><span style={S.titleC}>Claude Code</span><span style={S.titleQ}>Quest</span></h1>
          <p style={S.titleSub}>─ Webディレクターが挑む、AI開発の冒険 ─</p>
          {xp>0&&<div style={S.saveInfo}>Lv.{level} / {xp} XP</div>}
          {/* Stage Select Map */}
          <div style={S.stgMap}>
            {STAGES.map((s,i)=>{
              const unlocked=isUnlocked(i), done=cleared.includes(i);
              return (
                <button key={s.id} style={{...S.stgItem,...(done?S.stgDone:unlocked?S.stgOpen:S.stgLock)}}
                  onClick={()=>unlocked&&startStage(i)} disabled={!unlocked}>
                  <span style={S.stgId}>{done?"✓":unlocked?s.id:"🔒"}</span>
                  <span style={S.stgInfo}>
                    <span style={S.stgName}>{s.title}</span>
                    <span style={S.stgDesc}>{unlocked?s.subtitle:"前のステージをクリアしよう"}</span>
                  </span>
                  <span style={S.stgXp}>{unlocked?`${s.xpReward}XP`:""}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div style={S.letterT}/><div style={S.letterB}/>
      </div>
    </div>
  );

  /* ═════════════════════════════════════
     RENDER: STORY
     ═════════════════════════════════════ */
  if(screen==="story"){
    const d=stage.story[dialogIdx],isN=d?.speaker==="narrator";
    return(
      <div style={S.root}><style>{CSS}</style>
        <div style={S.storyWrap}>
          <div style={S.bgFar}/><div style={S.bgMid}/><div style={S.bgNear}/>
          <div style={S.groundBase}/>
          <div style={S.lightOverlay}/>
          <Particles count={12}/>
          <div style={S.fgLeafL}/><div style={S.fgLeafR}/>
          {/* Character on field */}
          <div style={{position:"absolute",bottom:"32%",left:"14%",zIndex:4}}><PixelChar size={6}/></div>
          {/* Stage header */}
          <div style={S.stgHead}><span style={S.stgBadge}>STAGE {stage.id}</span><span style={S.stgTitle}>{stage.title}</span></div>
          {/* Dialog at bottom */}
          <div style={S.dlgWrap} onClick={advanceDialog}>
            <div style={S.dlgBox}>
              {!isN&&<div style={S.dlgName}><span>{NAMES[d?.speaker]||""}</span></div>}
              <p style={{...S.dlgText,...(isN?{fontStyle:"italic",textAlign:"center" as const,color:"#8A7A5A"}:{})}}>{displayedText}</p>
              <span style={S.dlgNext}>{isTyping?"…":"▼"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════
     RENDER: CLEAR
     ═════════════════════════════════════ */
  if(screen==="clear") return(
    <div style={S.root}><style>{CSS}</style>
      <div style={S.clearWrap}>
        <Particles count={25}/>
        <div style={S.clearInner}>
          <div style={S.clearStars}>{"✦ ".repeat(10)}</div>
          <div style={S.clearBadge}>STAGE {stage.id} CLEAR</div>
          <h2 style={S.clearTitle}>{stage.title}</h2>
          <p style={S.clearSub}>{stage.subtitle}</p>
          <div style={{margin:"16px 0"}}><PixelChar size={7} animate/></div>
          <div style={S.rewards}>
            <div style={S.rwRow}><span style={{color:"#A8E6A0"}}>✦</span><span>獲得経験値</span><span style={S.rwVal}>+{gainedXp} XP</span></div>
            {leveledUp&&<div style={{...S.rwRow,...S.rwLv}}><span style={{color:"#F0D060"}}>⚡</span><span>LEVEL UP!</span><span style={{...S.rwVal,color:"#F0D060"}}>Lv.{level}</span></div>}
          </div>
          <div style={S.clrBtns}>
            {stageIdx<STAGES.length-1&&<button style={S.clrBtnNext} onClick={nextStage}>▶ 次のステージへ</button>}
            <button style={S.clrBtn} onClick={()=>setScreen("title")}>🗺 マップに戻る</button>
          </div>
          {stageIdx===STAGES.length-1&&<div style={S.endMsg}>🎉 全ステージクリア！ あなたは真のAIディレクターだ！</div>}
          <div style={S.tipBox}>
            <div style={S.tipLbl}>📝 実務 TIPS</div>
            <p style={S.tipTxt}>{stage.clearTip||""}</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ═════════════════════════════════════
     RENDER: PLAY / BATTLE
     ═════════════════════════════════════ */
  return(
    <div style={S.root}><style>{CSS}</style>
      <div style={S.playWrap}>
        {/* ── Battle scene (top) ── */}
        <div style={S.battleScene}>
          <div style={S.bgFar}/><div style={S.bgMid}/><div style={S.bgNear}/>
          <div style={S.groundBase}/>
          <div style={S.lightOverlay}/>
          <Particles count={10}/>
          <div style={S.fgLeafL}/><div style={S.fgLeafR}/>

          {/* HUD */}
          <div style={S.hud}>
            <div style={S.hudL}><span style={S.hudBadge}>STAGE {stage.id}</span><span style={S.hudT}>{stage.title}</span></div>
            <div style={S.hudR}><span style={S.lvB}>Lv.{level}</span><div style={S.xpO}><div style={{...S.xpI,width:`${xpPct}%`}}/></div><span style={S.xpL}>{xp}XP</span></div>
          </div>

          {/* Enemy */}
          <div style={S.eArea}>
            <div style={S.eN}>{stage.enemyName}</div>
            <div style={S.hpW}><div style={S.hpO}><div style={{...S.hpI,width:`${hpPct}%`}}/></div><span style={S.hpL}>HP {enemyHp}/{enemyMaxHp}</span></div>
            <EnemySprite stageIdx={stageIdx} size={4} hurt={enemyHurt}/>
            {showDamage&&<div style={S.dmg}>-{step?.damage||1}</div>}
          </div>

          {/* Player */}
          <div style={{...S.pArea,...(attackAnim?S.pAtk:{})}}><PixelChar size={6} flip/></div>

          {/* Progress */}
          <div style={S.progW}>{stage.steps.map((_,i)=>(<div key={i} style={{...S.pD,...(i<stepIdx?S.pDD:i===stepIdx?S.pDA:S.pDF)}}/>))}</div>
        </div>

        {/* ── Bottom UI ── */}
        <div style={S.botArea}>
          <div style={S.mBar}><span style={{fontSize:"14px"}}>⚔</span><span style={S.mTxt}>{step?.briefing}</span><span style={S.mCnt}>{stepIdx+1}/{stage.steps.length}</span></div>
          <div style={S.botCols}>
            {/* Companion */}
            <div style={S.cCol}>
              <div style={S.cH}><div style={S.cAv}><ClaudeCompanion size={2}/></div><span style={S.cNm}>仲間: クロード</span>
                {failedAttempts.length>0&&<span style={S.tryB}>{failedAttempts.length}回トライ</span>}</div>
              <div style={S.cBub}>{companionMsg?<p style={S.cT}>{companionMsg}</p>:<p style={{...S.cT,opacity:0.4}}>コマンドを入力してみよう！</p>}</div>
              <button style={{...S.hBtn,...(aiLoading?{opacity:0.5}:{})}} onClick={requestHint} disabled={aiLoading}>
                {aiLoading?"🔮 考え中...":failedAttempts.length===0?"💡 ヒントを聞く":failedAttempts.length<3?"💡 もっとヒント":"🔥 かなり教えて！"}</button>
            </div>
            {/* Terminal */}
            <div style={S.tC}>
              <div style={S.tH}><span style={{...S.tDot,background:"#FF5F57"}}/><span style={{...S.tDot,background:"#FFBD2E"}}/><span style={{...S.tDot,background:"#28C840"}}/><span style={S.tLb}>Terminal</span></div>
              <div style={S.tB} ref={termRef} onClick={()=>inputRef.current?.focus()}>
                {termHistory.map((l,i)=>(<div key={i} style={{...S.tLn,...(l.type==="input"?S.tI:l.type==="error"?S.tE:l.type==="success"?S.tS:l.type==="ai"?S.tA:S.tW)}}>{l.text}</div>))}
                {!installing&&!aiLoading&&(<div style={S.iR}><span style={S.pr}>$</span>
                  <input ref={inputRef} style={S.iF} value={input} onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&handleCommand()} placeholder="コマンドを入力..." autoFocus
                    disabled={installing||aiLoading} spellCheck={false} autoComplete="off" autoCapitalize="off"/></div>)}
                {(installing||aiLoading)&&<div style={S.tW}>● 処理中...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   CSS ANIMATIONS
   ═══════════════════════════════════ */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=JetBrains+Mono:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
@keyframes charBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes enemyFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes popIn{from{transform:scale(.8) translateY(0);opacity:1}to{transform:scale(1.3) translateY(-24px);opacity:0}}
@keyframes twinkle{0%,100%{opacity:.2}50%{opacity:1}}
@keyframes particleFloat{0%{transform:translateY(0) translateX(0);opacity:.2}50%{opacity:.7}100%{transform:translateY(-20px) translateX(10px);opacity:.1}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes breathe{0%,100%{opacity:.5}50%{opacity:.8}}
`;

const F={rpg:"'DotGothic16',sans-serif",mono:"'JetBrains Mono',monospace",ui:"'Noto Sans JP',sans-serif"};

/* ── STYLES ── */
const S: Record<string, React.CSSProperties> = {
  root:{width:"100%",minHeight:"640px",fontFamily:F.ui,fontSize:"14px",lineHeight:1.5,borderRadius:"12px",overflow:"hidden",position:"relative",background:"#0a0c12"},

  /* ══ HD-2D Layered Background ══ */
  bgFar:{position:"absolute",inset:0,
    background:"linear-gradient(180deg,#5B8FAF 0%,#8BBAD0 15%,#B8D8E8 30%,#D4E8D0 55%,#A8C878 75%,#78A848 100%)",
    zIndex:0},
  bgMid:{position:"absolute",inset:0,
    background:`
      radial-gradient(ellipse 40px 50px at 8% 62%, #3A6828 0%, #3A682855 50%, transparent 100%),
      radial-gradient(ellipse 35px 45px at 12% 58%, #4A8838 0%, transparent 100%),
      radial-gradient(ellipse 50px 55px at 28% 56%, #2A5A1A 0%, #2A5A1A55 50%, transparent 100%),
      radial-gradient(ellipse 40px 50px at 32% 52%, #3A7A2A 0%, transparent 100%),
      radial-gradient(ellipse 45px 50px at 55% 58%, #2A6020 0%, #2A602055 50%, transparent 100%),
      radial-gradient(ellipse 35px 45px at 58% 54%, #4A8A38 0%, transparent 100%),
      radial-gradient(ellipse 55px 55px at 78% 55%, #2A5A18 0%, #2A5A1855 50%, transparent 100%),
      radial-gradient(ellipse 40px 48px at 82% 51%, #3A7828 0%, transparent 100%),
      radial-gradient(ellipse 30px 35px at 92% 60%, #3A6828 0%, transparent 100%),
      radial-gradient(ellipse 25px 30px at 45% 64%, #3A7830 0%, transparent 100%)
    `,zIndex:0},
  bgNear:{position:"absolute",bottom:0,left:0,right:0,height:"32%",
    background:"linear-gradient(180deg,#6A9A40 0%,#508828 30%,#407020 70%,#2A5018 100%)",
    zIndex:0},
  groundBase:{position:"absolute",bottom:0,left:0,right:0,height:"25%",
    background:`
      linear-gradient(180deg, #8B7355 0%, #7A6345 30%, #6A5535 60%, #5A4828 100%)
    `,zIndex:0,
    borderTop:"3px solid #9AAA60"},
  lightOverlay:{position:"absolute",inset:0,
    background:`
      radial-gradient(ellipse 60% 50% at 70% 30%, rgba(255,240,180,0.25), transparent 70%),
      radial-gradient(ellipse 40% 30% at 20% 60%, rgba(255,220,150,0.1), transparent 60%)
    `,zIndex:1,pointerEvents:"none",animation:"breathe 6s ease infinite"},
  fgLeafL:{position:"absolute",top:0,left:0,width:"60px",height:"90px",
    background:"radial-gradient(ellipse at 0% 0%, #2A5A18 0%, transparent 70%)",
    filter:"blur(2px)",zIndex:5,opacity:0.5,pointerEvents:"none"},
  fgLeafR:{position:"absolute",top:0,right:0,width:"70px",height:"80px",
    background:"radial-gradient(ellipse at 100% 0%, #2A5A18 0%, transparent 70%)",
    filter:"blur(2px)",zIndex:5,opacity:0.4,pointerEvents:"none"},

  /* ══ Letterbox bars ══ */
  letterT:{position:"absolute",top:0,left:0,right:0,height:"4%",background:"#0a0c12",zIndex:6},
  letterB:{position:"absolute",bottom:0,left:0,right:0,height:"4%",background:"#0a0c12",zIndex:6},

  /* ══ TITLE ══ */
  titleWrap:{minHeight:"640px",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"},
  titleChar:{position:"absolute",bottom:"28%",left:"50%",transform:"translateX(-50%)",zIndex:3},
  titleUI:{position:"relative",zIndex:4,textAlign:"center",padding:"20px",animation:"slideUp .8s ease"},
  titleBadge:{display:"inline-block",padding:"5px 18px",borderRadius:"2px",
    background:"rgba(30,20,10,0.7)",color:"#E8D8B0",fontSize:"11px",fontFamily:F.rpg,marginBottom:"14px",
    border:"1px solid rgba(200,180,120,0.3)",letterSpacing:"2px"},
  titleLogo:{display:"flex",flexDirection:"column",gap:"0px",marginBottom:"8px"},
  titleC:{fontFamily:F.rpg,fontSize:"clamp(30px,6vw,48px)",color:"#FFF8E8",
    textShadow:"0 2px 4px rgba(0,0,0,0.6), 0 0 30px rgba(255,220,120,0.3)"},
  titleQ:{fontFamily:F.rpg,fontSize:"clamp(20px,4vw,34px)",color:"#F0D878",
    textShadow:"0 2px 3px rgba(0,0,0,0.5), 0 0 20px rgba(240,216,120,0.2)"},
  titleSub:{color:"#D8D0B8",fontSize:"13px",fontFamily:F.rpg,marginBottom:"18px",
    textShadow:"0 1px 3px rgba(0,0,0,0.5)"},
  titleTags:{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap",marginBottom:"24px"},
  tag:{fontSize:"10px",color:"#D0C8A8",padding:"4px 12px",background:"rgba(30,20,10,0.6)",
    borderRadius:"2px",fontFamily:F.rpg,border:"1px solid rgba(180,160,100,0.2)"},
  startBtn:{padding:"14px 44px",fontSize:"16px",fontFamily:F.rpg,color:"#2A1A08",
    background:"linear-gradient(180deg,#F0D878 0%,#D4B44C 100%)",
    border:"2px solid #A08828",borderRadius:"4px",cursor:"pointer",
    boxShadow:"0 3px 0 #806818, 0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
    textShadow:"0 1px 0 rgba(255,255,255,0.2)"},
  saveInfo:{marginTop:"10px",marginBottom:"14px",fontSize:"12px",color:"#C0B890",fontFamily:F.rpg,textShadow:"0 1px 3px rgba(0,0,0,0.5)"},

  /* ══ STAGE SELECT MAP ══ */
  stgMap:{display:"flex",flexDirection:"column",gap:"6px",width:"100%",maxWidth:"420px",marginTop:"8px"},
  stgItem:{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",
    background:"rgba(30,20,10,0.6)",border:"1px solid rgba(200,180,100,0.2)",borderRadius:"6px",
    cursor:"pointer",textAlign:"left",fontFamily:F.rpg,fontSize:"12px",
    backdropFilter:"blur(4px)",transition:"all .15s"},
  stgDone:{borderColor:"rgba(120,200,100,0.3)",background:"rgba(80,140,60,0.25)"},
  stgOpen:{borderColor:"rgba(240,216,120,0.3)",background:"rgba(50,40,20,0.65)"},
  stgLock:{opacity:0.45,cursor:"default",borderColor:"rgba(100,100,100,0.15)"},
  stgId:{width:"28px",height:"28px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:"13px",fontWeight:700,color:"#FFF8E8",background:"rgba(255,255,255,0.1)",flexShrink:0,
    border:"2px solid rgba(255,255,255,0.15)"},
  stgInfo:{flex:1,display:"flex",flexDirection:"column",gap:"1px"},
  stgName:{color:"#F0E8D0",fontSize:"13px"},
  stgDesc:{color:"#A09878",fontSize:"10px"},
  stgXp:{color:"#F0D878",fontSize:"11px",fontFamily:F.mono},

  /* ══ STORY ══ */
  storyWrap:{minHeight:"640px",position:"relative",overflow:"hidden"},
  stgHead:{position:"absolute",top:"4%",left:0,right:0,display:"flex",alignItems:"center",gap:"10px",
    padding:"10px 16px",zIndex:7},
  stgBadge:{fontFamily:F.mono,fontSize:"10px",fontWeight:700,color:"#F0D878",padding:"3px 10px",
    background:"rgba(20,15,5,0.7)",borderRadius:"2px",border:"1px solid rgba(200,180,100,0.25)",letterSpacing:"1px"},
  stgTitle:{fontFamily:F.rpg,fontSize:"14px",color:"#FFF8E8",textShadow:"0 1px 3px rgba(0,0,0,0.6)"},

  dlgWrap:{position:"absolute",bottom:"12px",left:"16px",right:"16px",zIndex:8,cursor:"pointer",userSelect:"none"},
  dlgBox:{background:"rgba(245,238,220,0.95)",border:"2px solid #B8A878",borderRadius:"4px",
    padding:"18px 24px",minHeight:"100px",
    boxShadow:"0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)"},
  dlgName:{display:"inline-block",padding:"3px 14px",background:"#5A4A30",color:"#F0E8D0",
    fontFamily:F.rpg,fontSize:"12px",borderRadius:"2px",marginBottom:"10px",
    boxShadow:"0 2px 4px rgba(0,0,0,0.2)"},
  dlgText:{fontFamily:F.ui,fontSize:"14px",lineHeight:2,color:"#2A2018",whiteSpace:"pre-wrap",minHeight:"36px",fontWeight:500},
  dlgNext:{display:"block",textAlign:"right",fontSize:"11px",color:"#8A7A5A",marginTop:"6px",animation:"pulse 2s infinite"},

  /* ══ CLEAR ══ */
  clearWrap:{minHeight:"640px",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",
    background:"radial-gradient(ellipse at 50% 40%, #1A2040 0%, #0E1428 60%, #080C18 100%)",overflow:"hidden"},
  clearInner:{position:"relative",zIndex:2,textAlign:"center",padding:"24px",animation:"slideUp .6s ease"},
  clearStars:{color:"#F0D878",fontSize:"12px",letterSpacing:"6px",marginBottom:"10px",animation:"twinkle 3s ease infinite"},
  clearBadge:{fontFamily:F.rpg,fontSize:"14px",color:"#F0D878",padding:"6px 28px",
    background:"rgba(240,216,120,0.08)",border:"1px solid rgba(240,216,120,0.25)",borderRadius:"2px",
    letterSpacing:"4px",marginBottom:"14px",display:"inline-block"},
  clearTitle:{fontFamily:F.rpg,fontSize:"22px",color:"#FFF8E8",marginBottom:"4px"},
  clearSub:{fontSize:"12px",color:"#8898B8",marginBottom:"4px"},
  rewards:{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"20px",alignItems:"center"},
  rwRow:{display:"flex",alignItems:"center",gap:"10px",padding:"10px 24px",
    background:"rgba(168,230,160,0.06)",border:"1px solid rgba(168,230,160,0.15)",borderRadius:"4px",
    color:"#C0D0D8",fontFamily:F.rpg,fontSize:"13px",minWidth:"220px"},
  rwLv:{background:"rgba(240,208,96,0.08)",borderColor:"rgba(240,208,96,0.2)"},
  rwVal:{marginLeft:"auto",fontFamily:F.mono,fontWeight:700,fontSize:"16px",color:"#A8E6A0"},
  clrBtns:{display:"flex",gap:"10px",alignItems:"center",justifyContent:"center",marginBottom:"20px",flexWrap:"wrap"},
  clrBtnNext:{padding:"12px 32px",fontSize:"14px",fontFamily:F.rpg,color:"#2A1A08",
    background:"linear-gradient(180deg,#A8E6A0,#70C868)",border:"2px solid #4A9840",borderRadius:"4px",
    cursor:"pointer",boxShadow:"0 3px 0 #3A7830"},
  clrBtn:{padding:"12px 32px",fontSize:"14px",fontFamily:F.rpg,color:"#2A1A08",
    background:"linear-gradient(180deg,#F0D878,#D4B44C)",border:"2px solid #A08828",borderRadius:"4px",
    cursor:"pointer",boxShadow:"0 3px 0 #806818"},
  endMsg:{fontFamily:F.rpg,fontSize:"14px",color:"#F0D878",textAlign:"center",marginBottom:"16px",
    textShadow:"0 0 12px rgba(240,216,120,0.3)"},
  tipBox:{maxWidth:"400px",padding:"14px 18px",background:"rgba(255,255,255,0.04)",
    border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",textAlign:"left"},
  tipLbl:{fontFamily:F.rpg,fontSize:"12px",color:"#F0D878",marginBottom:"6px"},
  tipTxt:{fontSize:"12px",color:"#7888A8",lineHeight:1.8},
  code:{fontFamily:F.mono,fontSize:"11px",padding:"2px 6px",background:"rgba(255,255,255,0.08)",borderRadius:"3px",color:"#A8E6A0"},

  /* ══ PLAY / BATTLE ══ */
  playWrap:{minHeight:"640px",display:"flex",flexDirection:"column"},
  battleScene:{position:"relative",height:"285px",overflow:"hidden",flexShrink:0},

  hud:{position:"absolute",top:0,left:0,right:0,display:"flex",justifyContent:"space-between",
    alignItems:"center",padding:"8px 12px",background:"linear-gradient(180deg,rgba(10,12,18,0.7),transparent)",zIndex:6,flexWrap:"wrap",gap:"6px"},
  hudL:{display:"flex",alignItems:"center",gap:"8px"},
  hudBadge:{fontFamily:F.mono,fontSize:"9px",fontWeight:700,color:"#F0D878",padding:"2px 8px",
    background:"rgba(20,15,5,0.6)",borderRadius:"2px",border:"1px solid rgba(200,180,100,0.2)"},
  hudT:{fontFamily:F.rpg,fontSize:"13px",color:"#FFF8E8",textShadow:"0 1px 3px rgba(0,0,0,0.5)"},
  hudR:{display:"flex",alignItems:"center",gap:"6px"},
  lvB:{fontFamily:F.mono,fontSize:"11px",fontWeight:700,color:"#F0D878",padding:"2px 6px",
    background:"rgba(20,15,5,0.6)",borderRadius:"2px"},
  xpO:{width:"56px",height:"5px",background:"rgba(0,0,0,0.4)",borderRadius:"3px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.1)"},
  xpI:{height:"100%",background:"linear-gradient(90deg,#4488DD,#66BBFF)",borderRadius:"3px",transition:"width .5s"},
  xpL:{fontFamily:F.mono,fontSize:"9px",color:"#9AB"},

  eArea:{position:"absolute",top:"52px",right:"14%",zIndex:3,textAlign:"center"},
  eN:{fontFamily:F.rpg,fontSize:"12px",color:"#FFF8E8",textShadow:"0 1px 3px rgba(0,0,0,0.7)",marginBottom:"2px"},
  hpW:{marginBottom:"6px"},
  hpO:{width:"110px",height:"7px",background:"rgba(0,0,0,0.5)",borderRadius:"3px",overflow:"hidden",
    border:"1px solid rgba(255,255,255,0.15)"},
  hpI:{height:"100%",background:"linear-gradient(90deg,#E84040,#F08848)",borderRadius:"3px",transition:"width .4s"},
  hpL:{fontFamily:F.mono,fontSize:"8px",color:"#F8A8A8"},
  dmg:{position:"absolute",top:"-10px",right:"16px",fontFamily:F.rpg,fontSize:"22px",fontWeight:700,
    color:"#FF4444",textShadow:"2px 2px 0 #000, 0 0 10px rgba(255,60,60,0.5)",animation:"popIn .6s ease forwards",zIndex:5},

  pArea:{position:"absolute",bottom:"30%",left:"12%",zIndex:3,transition:"transform .15s"},
  pAtk:{transform:"translateX(80px) translateY(-10px)"},

  progW:{position:"absolute",bottom:"8px",left:"50%",transform:"translateX(-50%)",display:"flex",gap:"5px",zIndex:6},
  pD:{width:"9px",height:"9px",borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)"},
  pDD:{background:"#A8E6A0",borderColor:"#70C068"},
  pDA:{background:"#F0D878",borderColor:"#C8B050",boxShadow:"0 0 8px rgba(240,216,120,0.5)"},
  pDF:{background:"rgba(255,255,255,0.1)"},

  /* ── Bottom UI ── */
  botArea:{flex:1,display:"flex",flexDirection:"column",background:"linear-gradient(180deg,#161C28,#0E1220)"},
  mBar:{display:"flex",alignItems:"center",gap:"8px",padding:"10px 14px",
    background:"rgba(240,216,120,0.04)",borderBottom:"1px solid rgba(255,255,255,0.04)"},
  mTxt:{flex:1,fontSize:"13px",color:"#D0D8E8",fontFamily:F.rpg,whiteSpace:"pre-wrap"},
  mCnt:{fontFamily:F.mono,fontSize:"10px",color:"#556",padding:"2px 8px",
    background:"rgba(255,255,255,0.04)",borderRadius:"3px"},

  botCols:{flex:1,display:"flex",minHeight:0},
  cCol:{width:"44%",display:"flex",flexDirection:"column",padding:"12px",borderRight:"1px solid rgba(255,255,255,0.04)",gap:"8px"},
  cH:{display:"flex",alignItems:"center",gap:"8px"},
  cAv:{width:"30px",height:"30px",borderRadius:"50%",background:"linear-gradient(135deg,#7B68EE,#5B48CE)",
    display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0},
  cNm:{fontFamily:F.rpg,fontSize:"10px",color:"#A898D8",flex:1},
  tryB:{fontFamily:F.mono,fontSize:"8px",color:"#E0C060",padding:"1px 6px",
    background:"rgba(224,192,96,0.1)",border:"1px solid rgba(224,192,96,0.15)",borderRadius:"8px"},
  cBub:{flex:1,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",
    borderRadius:"6px",padding:"10px 12px",overflowY:"auto"},
  cT:{fontSize:"12px",lineHeight:1.8,color:"#A8B8C8",whiteSpace:"pre-wrap",fontFamily:F.ui},
  hBtn:{padding:"7px 14px",fontSize:"10px",fontFamily:F.rpg,color:"#F0D878",
    background:"rgba(240,216,120,0.06)",border:"1px solid rgba(240,216,120,0.15)",
    borderRadius:"4px",cursor:"pointer",alignSelf:"flex-start"},

  tC:{flex:1,display:"flex",flexDirection:"column",minWidth:0},
  tH:{display:"flex",alignItems:"center",gap:"5px",padding:"7px 12px",
    background:"#0C1018",borderBottom:"1px solid #1A2030"},
  tDot:{width:"7px",height:"7px",borderRadius:"50%"},
  tLb:{fontFamily:F.mono,fontSize:"9px",color:"#3A4450",marginLeft:"4px"},
  tB:{flex:1,padding:"10px 12px",overflowY:"auto",fontFamily:F.mono,fontSize:"12px",
    lineHeight:1.5,background:"#080C14",cursor:"text"},
  tLn:{whiteSpace:"pre-wrap",wordBreak:"break-all",marginBottom:"1px"},
  tI:{color:"#D8E0E8"},tE:{color:"#F06666"},tS:{color:"#68D888"},tW:{color:"#E8B844"},
  tA:{color:"#C4A0FF",paddingLeft:"6px",borderLeft:"2px solid rgba(123,104,238,0.25)",margin:"3px 0"},
  iR:{display:"flex",alignItems:"center",gap:"6px",marginTop:"4px"},
  pr:{color:"#68D888",fontWeight:700,userSelect:"none"},
  iF:{flex:1,background:"transparent",border:"none",outline:"none",color:"#D8E0E8",
    fontFamily:F.mono,fontSize:"12px",caretColor:"#68D888"},
};
