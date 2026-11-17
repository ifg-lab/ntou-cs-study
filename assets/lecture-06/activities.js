"use strict";

const Lecture06Templates = (() => {
const esc = value => StudySite.escape(value);

const option = (label, entries) => ({label, entries});
const button = (name, label, primary = false) =>
  '<button type="button" class="btn'+ (primary ? '' : ' secondary') +'" data-lab-action="'+name+'">'+label+'</button>';
const diagram = (title, note, line, state) => ({title,note,line,...state});

const starterGuides = {
  "sequential-search":["在 [2, 4, 7, 9, 12] 裡找 8。按「下一步」，跟著格子從左往右讀。","當讀到 9 時，看說明為什麼剩下的數不用找。","循序搜尋","把資料依順序一項項查過去。"],
  "loop-trace":["保持起始 count = 0，按「下一步」比較左右兩邊。","綠點每出現一次，就代表迴圈裡的動作做了一次。","本體","迴圈裡會重複執行的那一段。"],
  "insertion-sort":["把 Alex 插到 Fred 前面。按「下一步」，看哪一個名字先被提起。","追著空位走，等琥珀色的名字插回去。","key","這一輪先拿出來、等著插回的值。"],
  "recursive-binary":["用預設的 18 跑第一輪。按「下一步」，看下方出現第一層 Search。","每次縮小範圍，就留著上一層並增加一層。找到後看它們如何依序返回。","呼叫堆疊","記下每次呼叫的狀態，最後進入的那層先返回。"],
  "binary-search":["在 [2, 4, 7, 9] 裡找 9，先按「下一步」。","先比橘色中間格和 9。格子上出現「排除」後，再看圖下方寫了什麼。","mid","現在看的中間位置。"],
  "grid-traversal":["從 A1 開始按「下一步」，看卡片怎麼從容器滑出。","看完 A2 和 B1 加入容器後，切到 DFS 再走前三步，觀察先取出的格子。","走訪","按一套順序把可以到達的格子查過去。"],
  "mst":["先用預設的 Kruskal 按「下一步」，看最先檢查哪條邊。","追蹤前幾條選入的綠線，到 A–C 時先沿著舊線走一次。","權重","邊上的數字，表示這條連線的成本。"],
  "spanning-tree":["在按鈕中找 A–B，按一下把 B 接到 A。","試著再接 A–C 和 B–C，看圖上哪幾條線圍成一圈。","生成樹","用一套沒有環的邊，讓每個點都能互相到達。","先找一端已在樹內、另一端在樹外的邊。"],
  "maze":["用預設樣式按「下一步」，找出第一個準備加入的格子。","再按一次，看它和哪一個已加入的格子間的牆消失。","邊界候選","還在外面、但至少和一個已加入格子相鄰的格子。"],
  "prefix-average":["保留「每輪重掃前綴」，按下一步算第一個平均。","做到索引 2 後看累計讀值，再切換「沿用上一輪累加和」比較。","前綴","從第一個元素開始，到指定位置為止的一段。"],
  "prefix-query":["先點位置 2，再點位置 4，求它們之間的總和。","圖上方標出要加的三格，下面標出用哪兩個前綴做相減。","[l,r]","從位置 l 到 r，兩端都包含。","先想每個 p[i] 包含哪幾格，再看哪些格要扣掉。"],
  "difference-updates":["保留 [2,4] 加 3，按「套用區間加值」。","數一數亮起幾格差分，再切到「重建的陣列 A」比較。","差分","在每個位置記下它和左邊上一格的差。","先看加值從哪個位置開始，離開區間後在哪裡抵銷。"],
  "two-pointers":["用預設例找總和 9。按「下一步」，先把最左和最右兩個數加起來。","總和太小時，看哪一端被排除，以及為什麼。","指標","用來記目前看哪一個位置的索引。"],
  "max-count":["先找圖上的初始最大值，再按「下一步」讀下一項。","只在新值更大時更新 m。最後換成遞減陣列，比較更新了幾次。","指派","把一個新值存進變數，例如把 8 存成目前最大值。"],
  "fibonacci":["保留 n = 4，按「下一步」看第一次往下拆。","找出兩個標示相同的 F(n)，再切到記憶化比較它們會如何顯示。","基底情況","可以直接回答，無須再拆小的情況。"],
  "growth":["拖動滑桿到 n = 16，先讀右邊三個數字。","把 n 變成 32，再看哪種方法的工作量增加最多。","n","這裡代表輸入陣列的項目數。"],
  "chain-payment":["第一天先選「交出 1 節」，再按「確認今天付款」。","第二天看旅館手上的總節數，再試著交換片段。","累計","每天結束時，旅館手裡一共收到幾節。","先看今天結束時旅館應有幾節，再從 1、2、4 中挑片段。"],
  "river-puzzle":["先試一趟「帶狼」，看哪一岸留下了危險組合。","同一步可以改帶羊，再看地圖上的人、船和羊是否一起移動。","限制","何時不能移動，例如人離開後不能留下羊和菜。","先想人離開後，原本那一岸會剩下誰。"],
  "soldier-ferry":["先選運一名士兵，按「下一步」看誰先過河。","船每到對岸就數一趟。等船回到原岸後，再切換講義的 25 名。","一趟","從一岸到另一岸一次，去和回各算一趟。"],
  "fake-coin":["選左盤放第 1、2、3 枚，右盤放第 4、5、6 枚，再按「開始秤重」。","看圖下方還剩哪幾枚可能較輕，再用第二次秤縮小範圍。","候選","目前根據已知結果，仍有可能是答案的項目。","先想天平有哪三種結果，以及每一種結果會留下幾枚候選。"],
  "invariant":["按「下一步」比較 a[i] 和目前最大值 m。","每次 i 往右後，用眼睛檢查 m 是否仍是左邊看過的最大值。","不變量","雖然數值一直變，但每走完一輪仍然成立的事。"]
};

function starterMarkup(concept) {
  const [task,watch]=starterGuides[concept];
  return '<aside class="alg-starter"><strong>先跟做一次</strong><p>'+esc(task)+'</p><small>'+esc(watch)+'</small></aside>';
}

function glossaryCue(concept) {
  const [,,term,meaning]=starterGuides[concept];
  return '<p class="alg-term-cue"><strong>'+esc(term)+'</strong><span>'+esc(meaning)+'</span></p>';
}

function predictionMarkup() {
  return '<label class="alg-practice-toggle"><input type="checkbox" data-lab-practice> 猜下一步'+
    '<small data-practice-unavailable hidden>此方式目前沒有猜題。</small></label>'+
    '<form class="alg-prediction" data-lab-predict hidden><p data-prediction-question></p><div data-prediction-fields></div>'+
    '<div class="alg-actions"><button type="submit" class="btn">檢查答案</button>'+
    '<button type="button" class="btn secondary" data-prediction-hint>給我提示</button>'+
    '<button type="button" class="btn secondary" data-prediction-answer>看解答</button></div>'+
    '<p class="alg-feedback" data-prediction-feedback role="status"></p></form>';
}

function bindPrediction(root, takeStep) {
  const mode=root.querySelector("[data-lab-practice]");
  const form=root.querySelector("[data-lab-predict]");
  if(!mode)return null;
  const fields=form.querySelector("[data-prediction-fields]");
  const feedback=form.querySelector("[data-prediction-feedback]");
  const hint=form.querySelector("[data-prediction-hint]");
  const reveal=form.querySelector("[data-prediction-answer]");
  let current=null, released=false, hintLevel=0;
  const showHint=(level,retry=false)=>{
    hintLevel=level;
    feedback.textContent=(retry?"這一步還沒通過，可以原地再試。 ":"")+
      (level===1?"提示 1｜"+current.hint:"提示 2｜"+current.reason);
    feedback.dataset.result=retry?"retry":"hint";
    hint.textContent=level===1?"看這一步的原因":"已顯示兩層提示";
    hint.disabled=level===2;
  };
  const unlock=(message,correct)=>{
    released=true;
    feedback.textContent=message;
    feedback.dataset.result=correct?"correct":"revealed";
    form.querySelector('button[type="submit"]').disabled=true;
    hint.disabled=true;
    reveal.disabled=true;
    takeStep(false);
  };
  form.addEventListener("submit",event=>{
    event.preventDefault();
    if(!current||released)return;
    const chosen=new FormData(form);
    if(current.inputs.some(input=>input.options?String(input.answer)!==chosen.get(input.name):Number(chosen.get(input.name))!==input.answer)) {
      showHint(Math.max(1,hintLevel),true);
      return;
    }
    unlock("正確。"+current.explanation+" 可以往下一步了。",true);
  });
  hint.addEventListener("click",()=>{if(current&&!released&&hintLevel<2)showHint(hintLevel+1);});
  reveal.addEventListener("click",()=>{
    if(current&&!released)unlock(current.explanation,false);
  });
  mode.addEventListener("change",()=>takeStep(true));
  return {
    enabled:()=>mode.checked&&!mode.disabled,
    available(value) {
      mode.disabled=!value;
      root.querySelector("[data-practice-unavailable]").hidden=value;
    },
    set(question) {
      const active=mode.checked&&!mode.disabled?question:null;
      if(active===current)return active&&!released;
      current=active;
      released=false;
      hintLevel=0;
      form.hidden=!active;
      feedback.textContent="";
      feedback.removeAttribute("data-result");
      if(!active)return false;
      form.querySelector("[data-prediction-question]").textContent=active.question;
      fields.innerHTML=active.inputs.map(input=>'<label><span>'+esc(input.label)+'</span>'+
        (input.options?'<select class="field" required name="'+input.name+'"><option value="">請選擇</option>'+
          input.options.map(([key,label])=>'<option value="'+esc(key)+'">'+esc(label)+'</option>').join("")+'</select>':
          '<input class="field" type="text" inputmode="text" pattern="-?[0-9]+" name="'+input.name+'" required autocomplete="off">')+'</label>').join("");
      form.querySelector('button[type="submit"]').disabled=false;
      hint.disabled=false;
      hint.textContent="給我提示";
      reveal.disabled=false;
      return true;
    }
  };
}

function customArraySetup({array,target}) {
  return {
    lockedFields:[0],
    render:()=>'<details class="alg-lab-config"><summary>試自己的測資</summary><form data-lab-custom>'+
      '<div class="alg-fields"><label class="alg-choice"><span>整數陣列</span>'+
      '<input class="field" name="array" value="'+esc(array)+'" autocomplete="off" maxlength="96" required></label>'+
      (target===undefined?'':'<label class="alg-choice alg-target"><span>目標值</span>'+
        '<input class="field" name="target" type="text" inputmode="text" pattern="-?[0-9]+" value="'+target+'" maxlength="5" required></label>')+'</div>'+
      '<p class="alg-config-help">輸入 1～10 個介於 −9999 與 9999 的整數，以空格或逗號隔開。'+
      (target===undefined?'':'二元搜尋的陣列須先由小到大排列。')+'</p><div class="alg-actions"><button type="submit" class="btn">套用測資</button>'+
      '<button class="btn secondary" type="button" data-lab-restore>回範例</button></div><p class="alg-feedback" role="status"></p></form></details>',
    bind(root,publish) {
      const form=root.querySelector("[data-lab-custom]");
      const status=form.querySelector('[role="status"]');
      const restore=form.querySelector("[data-lab-restore]");
      restore.disabled=true;
      restore.addEventListener("click",()=>{
        restore.disabled=true;
        status.textContent="已切回範例測資。";
        status.removeAttribute("data-result");
        publish(undefined);
      });
      form.addEventListener("submit",event=>{
        event.preventDefault();
        const fields=new FormData(form);
        const tokens=String(fields.get("array")).trim().split(/[\s,、，]+/);
        const values=tokens.map(Number);
        const value=target===undefined?undefined:Number(String(fields.get("target")));
        let error;
        if(tokens.length>10||tokens.some((token,i)=>!/^[-+]?\d+$/.test(token)||Math.abs(values[i])>9999)) {
          error="請輸入 1～10 個合法整數，並用空格或逗號分開。";
        } else if(target!==undefined&&(!Number.isInteger(value)||Math.abs(value)>9999)) {
          error="目標值必須在 −9999 到 9999 之間。";
        } else if(target!==undefined&&values.some((number,i)=>i>0&&number<values[i-1])) {
          error="這組數值還沒由小到大排好。請先調整順序，再做二元搜尋。";
        }
        if(error){
          status.dataset.result="retry";
          status.textContent=error;
          return;
        }
        restore.disabled=false;
        status.dataset.result="correct";
        status.textContent="已套用："+values.join("、")+(value===undefined?'':'，目標 '+value)+"。";
        publish({values,target:value});
      });
    }
  };
}

function renderLab(lab) {
  const select = ({label,entries}, index) => '<label class="alg-choice"><span>'+esc(label)+'</span><select class="field" data-lab-field="'+index+'">'+
    entries.map(([value,label])=>'<option value="'+esc(value)+'">'+esc(label)+'</option>').join("")+'</select></label>';
  return '<section class="alg-lab" aria-label="'+esc(lab.title)+'">'+
    starterMarkup(lab.concept)+
    '<div class="alg-fields">'+lab.fields.map(select).join("")+'</div>'+
    (lab.setup?.render()??"")+
    '<div class="alg-stage"><div class="alg-layout"><div class="alg-playground"><div class="alg-visual" data-lab-visual'+(lab.visualAccessible?"":' aria-hidden="true"')+'></div>'+
    '<div class="alg-visual-key">'+glossaryCue(lab.concept)+'<p class="alg-key">'+esc(lab.legend)+'</p></div></div>'+
    '<div class="alg-explain"><div aria-live="polite" aria-atomic="true"><p class="alg-position" data-lab-position></p>'+
    '<h3 data-lab-title></h3><p data-lab-note></p><dl class="alg-stats" data-lab-stats></dl></div></div></div>'+
    (lab.prediction ? predictionMarkup() : "")+
    '<nav class="alg-stepper" aria-label="實驗步驟">'+button("prev","← 上一步")+
    '<span data-lab-stepbar></span>'+button("next","下一步 →",true)+'</nav></div>'+
    '<div class="alg-transport"><div class="alg-actions">'+
    button("play","播放")+button("reset","回到開頭")+'</div>'+
    '<label class="alg-scrubber"><span class="visually-hidden">'+(lab.scrubberLabel??"跳至步驟")+'</span><input type="range" data-lab-progress min="0" max="0" value="0"></label>'+
    '<label class="alg-speed">速度 <select class="field" data-lab-speed aria-label="播放速度"><option value="1650">慢速</option><option value="1050" selected>標準</option><option value="640">快速</option></select></label></div>'+
    '<details class="alg-source" open><summary>'+(lab.sourceLabel??"對照虛擬碼")+'</summary><ol data-lab-pseudo></ol></details>'+
    (lab.code ? '<details class="alg-source alg-cpp"><summary>C++ 競程實作</summary><div data-lab-code></div></details>' : '')+'</section>';
}

function bindLab(element, lab) {
  const root = element.querySelector(".alg-lab");
  const find = name => root.querySelector("[data-lab-"+name+"]");
  const action = name => root.querySelector('[data-lab-action="'+name+'"]');
  const fields = [...root.querySelectorAll("[data-lab-field]")];
  const scrubber = find("progress");
  const speed = find("speed");
  const play = action("play");
  let timeline, position, paintVisual, timer, setupValue;
  let loadedCode;
  const stop = () => {
    clearInterval(timer);
    timer = undefined;
    play.textContent = "播放";
    play.setAttribute("aria-pressed","false");
  };
  const syncControls=()=>{
    const waiting=prediction?.set(timeline.steps[position].prediction);
    const practicing=prediction?.enabled()??false;
    action("prev").disabled=position===0;
    action("next").disabled=position===timeline.steps.length-1||Boolean(waiting);
    play.disabled=practicing;
    scrubber.disabled=practicing;
    speed.disabled=practicing;
  };
  const prediction=bindPrediction(root,modeChanged=>{
    if(modeChanged)stop();
    syncControls();
  });
  const paint = (animate=false) => {
    const step = timeline.steps[position];
    paintVisual(step,{animate});
    find("position").textContent = "步驟 "+(position+1)+" / "+timeline.steps.length;
    find("stepbar").textContent=(position+1)+" / "+timeline.steps.length;
    find("title").textContent = step.title;
    find("note").textContent = step.note;
    find("stats").innerHTML = (step.stats ?? []).map(([name,value])=>
      '<div><dt>'+esc(name)+'</dt><dd>'+esc(String(value))+'</dd></div>').join("");
    [...find("pseudo").children].forEach((row,index)=>{
      const active = step.line === index;
      row.classList.toggle("is-current",active);
      if (active) row.setAttribute("aria-current","step");
      else row.removeAttribute("aria-current");
    });
    scrubber.value = position;
    scrubber.setAttribute("aria-valuetext",lab.scrubberLabel ? step.title : "第 "+(position+1)+" 步，共 "+timeline.steps.length+" 步");
    syncControls();
  };
  const move = (index,animate=true) => {
    const previous=position;
    position = Math.max(0,Math.min(timeline.steps.length-1,index));
    paint(animate&&Math.abs(position-previous)===1);
    if (position===timeline.steps.length-1) stop();
  };
  const start = () => {
    if (position===timeline.steps.length-1) move(0);
    play.textContent = "暫停";
    play.setAttribute("aria-pressed","true");
    timer = setInterval(()=>{
      if (!root.isConnected || !element.open || document.hidden) {stop();return;}
      move(position+1);
    }, Number(speed.value));
  };
  const restart = () => {
    stop();
    position = 0;
    timeline = lab.trace(...fields.map(select=>select.value),setupValue);
    prediction?.available(timeline.steps.some(step=>step.prediction));
    find("pseudo").innerHTML = timeline.pseudo.map(line=>'<li><code>'+esc(line)+'</code></li>').join("");
    paintVisual = timeline.mount(find("visual"));
    scrubber.max = timeline.steps.length-1;
    paint();
  };
  for (const field of fields) field.addEventListener("change",restart);
  lab.setup?.bind(root,value=>{
    setupValue=value;
    for(const index of lab.setup.lockedFields??[]) fields[index].disabled=value!==undefined;
    restart();
  });
  action("prev").addEventListener("click",()=>{stop();move(position-1);});
  action("next").addEventListener("click",event=>{
    stop();
    move(position+1);
    const form=find("predict");
    if(event.detail===0&&form&&!form.hidden&&action("next").disabled) {
      form.querySelector("input,select")?.focus({preventScroll:true});
    }
  });
  action("reset").addEventListener("click",()=>{stop();move(0,false);});
  play.addEventListener("click",()=>timer ? stop() : start());
  scrubber.addEventListener("input",()=>{stop();move(Number(scrubber.value),false);});
  speed.addEventListener("change",()=>{if(timer){stop();start();}});
  element.addEventListener("toggle",()=>{if(!element.open)stop();});
  const cpp = root.querySelector(".alg-cpp");
  cpp?.addEventListener("toggle",()=>{
    if (cpp.open && !loadedCode) loadedCode = loadCode(find("code"),lab.code).catch(()=>{
      loadedCode = undefined;
      find("code").querySelector('[role="status"]').textContent = "目前無法載入程式碼。可以直接下載，或重新展開再試一次。";
    });
  });
  restart();
}

const cppKeywords = new Set("alignas auto break case class const constexpr continue default delete do else enum explicit false for if inline namespace new noexcept private protected public return sizeof static struct switch template this true typename using while".split(" "));
const cppTypes = new Set("bool char double float int long short signed unsigned void size_t string vector queue pair".split(" "));
const cppTokens = /\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[A-Za-z_]\w*|(?:0[xX][\dA-Fa-f]+|0[bB][01]+|\d+(?:\.\d+)?)(?:[uUlLfF]+)?|[A-Za-z_]\w*|<<=|>>=|<=>|!=|==|<=|>=|<<|>>|&&|\|\||::|\+\+|--|->|[=!<>+\-*/%&|^~?:.]|\s+|./gu;


const cppNotes = {
  "contest-io":[
    [6,10,"單筆測資","solve() 只處理一組資料。先用 cin 讀 a 和 b，再將和交給 cout。",
      "輸入第二組 -1 7 時，a=-1、b=7，所以這一輪輸出 6。",
      "若有計數器只屬於單筆測資，把它宣告在 solve() 裡，下一筆便會重新初始化。"],
    [12,19,"快速 I/O 與多筆測資","main() 設好快速 I/O，再讀 t。while (t--) 會先使用 t 的舊值判斷，之後才把 t 減一。",
      "範例開頭的 3 是筆數，因此 solve() 會呼叫三次，得到三行輸出。",
      "如果題目開頭沒有測資筆數，不要先讀 t，直接呼叫一次 solve()。"]
  ],
  "binary-search":[
    [6,15,"找到第一個不小於目標的位置","l 和 r 是半開區間的界線，接下來取中點時可以讀 [l,r) 中的資料。中點太小就令 l=mid+1，否則讓 r=mid 繼續找更早的位置。",
      "找 7 時，[0,9) 的中點是 4。a[4]=7，縮成 [0,4)。再比較索引 2 和 1，交界最後停在索引 2。",
      "迴圈停下時可能有 l=n。應先測 l<n，才可讀 a[l]。即使找到第一個不小於目標的位置，也要確認兩者相等。"],
    [17,26,"用 lower_bound 核對結果","lower_bound 回傳迭代器，表示第一個不小於 x 的位置。若找到匹配，用 it-a.begin() 轉成從 0 起算的索引。",
      "範例輸出兩次 2，第一行出自手寫搜尋，第二行出自 STL 的 lower_bound。",
      "陣列要用同一套比較規則事先排序。若 it 是 a.end() 便不能讀 *it。"]
  ],
  "insertion-sort":[
    [6,10,"建立陣列","按輸入順序讀到 a[0] 到 a[n−1]。外層排序從索引 1 開始，因為 a[0] 單獨就是一段已排序的前綴。",
      "範例一開始排好的部分只有 [8]，下一個要插入的值是 2。"],
    [11,19,"取出 key、右移、填回空位","key 暫存 a[i]，j 表示目前空位。只要左邊一格存在且值大於 key，就把它右移，空位往左移一格。最後用 a[j]=key 填回。",
      "處理 [8,2] 時，先留住 2，將 8 移到索引 1，再把 2 放在索引 0。前綴變成 [2,8]。",
      "用嚴格大於來移動。若用大於等於，後到的等值元素會插到之前的等值元素前面，破壞穩定性。"],
    [20,25,"按順序輸出","從第二個數字開始補前置空格，再印出當前元素。等所有值都印完才換行。",
      "最後一行是 2 2 4 5 8。若題目要求一行一個數字，可只更改這一段。"]
  ],
  "prefix-sum":[
    [6,14,"先算好前綴和","p[i] 保留第 1 到第 i 項的總和。p[0]=0 代表前面一項都沒有。讀進每個 x 時，將 x 加到 p[i−1]。",
      "範例原陣列是 [3,−2,4,1,6]。p[0..5] 依序是 [0,3,1,5,6,12]。"],
    [15,20,"用兩個前綴回答區間和","p[r] 已含 1 到 r。減掉 p[l−1] 後，留下的正是包含兩個端點的 [l,r]。",
      "查 [2,4] 時用 p[4]−p[1]=6−3=3。這也等於直接算 −2+4+1。",
      "左界要扣 p[l−1]。扣 p[l] 會把第 l 項一起扣掉。"]
  ],
  "difference-array":[
    [6,16,"把原始數列改存相鄰差","d[i]=a[i]−a[i−1]。用 prev 記上一項，就能在讀入時建好差分。第一項以前的值約定為 0。",
      "範例的原陣列 [3,−2,4,1,6] 會變成差分 [3,−5,6,−3,5]。"],
    [17,22,"每次更新只處理兩格","區間 [l,r] 加 k。d[l]+=k 讓效果從 l 開始，d[r+1]−=k 讓效果在 r 之後停止。多次更新之後一起累計。",
      "對 [2,4] 加 3，只需要 d[2]+=3 和 d[5]−=3。走到第 5 項時，這筆 +3 已被抵銷。",
      "抵銷位置是 r+1。陣列配置 n+2 格，是為了讓 r=n 時也能合法寫進 n+1。"],
    [23,30,"累加差分還原結果","value 保存一路累加的總量，每到一個 i，先加 d[i] 再印 value。",
      "做完範例的兩次更新後，前五項差分為 [3,−2,6,−5,2]。依序累加就得到 [3,1,7,2,4]。"]
  ],
  "two-pointers":[
    [6,11,"設定左右端點","輸入假設已升冪。l 從 0 開始，r 從 n−1 開始，兩者界定目前還有可能成對的範圍。",
      "範例第一組配對是最左的 −3 和最右的 11，總和 8。"],
    [12,22,"根據總和移動一個指標","如果連目前最大的 a[r] 配上 a[l] 都太小，任何剩下的配對也救不了 a[l]。因此 l 向右。總和太大則依同樣理由排除右端。",
      "目標為 9，範例依序遇到 8、12、8、11 和 9。最後命中 4+5，輸出兩個位置 3 4。",
      "迴圈用 l<r，避免拿同一格兩次。內部索引從 0 起算，輸出需各自加 1。"]
  ],
  "grid-bfs":[
    [6,7,"四個方向的座標","第一個座標代表列，第二個代表欄。相同索引的 dx[i] 和 dy[i] 組成一次移動。",
      "從 (0,0) 使用 i=0，得到 (0,1)，即向右走一格。i=2 則到 (1,0)，是往下一格。"],
    [9,15,"在 bfs 初始化距離與佇列","dist[x][y] 記從起點到該格走幾步。−1 表示尚未發現，起點一入列就標為 0。",
      "範例一開始 q 只有 (0,0)。這格的 dist 為 0，其餘格都為 −1。",
      "走訪標記要在入列時寫。若等到出列才寫，不同的近鄰可能先把同一格放入佇列多次。"],
    [16,19,"取出隊首，先處理最近的格","queue 先進先出。每步把下一層的格子排到隊尾，所以先出列的是距離較短的一層。第一次取到 T 就可以回傳最短步數。",
      "從範例的 S 展開，(0,1) 和 (1,0) 都是 1 步，會排在任何 2 步的位置前面。"],
    [20,29,"檢查鄰格、更新距離與失敗條件","先判斷 nx、ny 有沒有越界，接著才讀 grid 和 dist。牆或已入列的格子跳過，其餘用目前距離加 1，並放進佇列。",
      "範例裡可以走 (0,0) → (0,1) → (1,1) → (2,1) → (2,2) → (2,3) → (1,3)，共 6 步。若佇列清空仍沒找到 T，就回傳 -1。"],
    [31,43,"solve() 讀地圖並印答案","掃每列時找出 S 的座標，把地圖與座標傳給 bfs。變數 sx 和 sy 初始為 −1，因此地圖缺少 S 時也會得到 −1。",
      "想在另一題重用搜尋時，可以保留 bfs()，把 solve() 換成那一題的輸入和輸出格式。"]
  ],
  "tree-subtree":[
    [6,11,"dfs() 設定根與堆疊","g[u] 儲存 u 的所有鄰點。parent 記父節點，−1 代表尚未發現，根的 parent 設為 0 是一個特別標記。",
      "範例以 1 為根，因此一開始 st 裡只有 1，其他節點仍未發現。"],
    [12,21,"走訪並記錄父子關係","每次從堆疊頂端取一個點，把它放到 order。新鄰點先設定父節點才放入堆疊。父節點一定早於自己的孩子出現在 order。",
      "範例從 1 發現 2、3，把它們依序入堆疊。因為後進先出，3 會比 2 先出來。",
      "無向樹會把兩個方向都存下。若沒有 parent[v]!=-1 這項檢查，走到孩子可能立刻走回父節點。"],
    [22,28,"倒序累加每個子樹","每個點的子樹先算自己一個。倒著讀 order，就能等所有孩子把子樹大小加上來，再把完整的大小交給父節點。",
      "4 和 5 各貢獻 1 給 3，因此 sz[3]=3。之後 3 把 3 加給根 1，根加上自己的 1 和節點 2 的 1，得到 5。",
      "停在 i>=1，排除位於 order[0] 的根。根的 parent=0，沒有實際的父節點需要更新。"],
    [30,46,"solve() 建圖並輸出各節點結果","輸入為 1 到 n 編號的一棵樹。每條無向邊分兩個方向加入鄰接表，再呼叫 dfs(g,1)。",
      "依點的編號印出大小，所以範例的 5 1 3 1 1 分別對應節點 1、2、3、4、5。"]
  ],
  kruskal:[
    [6,19,"存邊並初始化 DSU","一條無向邊記 u、v、w。DSU 一開始讓每個點的 parent 指向自己，sz 記成分的點數，所以起初每個大小都是 1。",
      "範例還沒選任何邊時，A～F 是六個分開的集合。程式輸入用 1～6 代表它們。"],
    [21,28,"查根與判斷相通","find 沿 parent 找到根，回頭時讓沿途的點直接指向根。same 只比較代表，檢查兩點是否已相通。",
      "若先選 A–B，再選 B–C，A 和 C 即使沒有直接相連，也會被 same 判定為同一成分。"],
    [30,37,"合併兩個不同成分","先用 find 取得兩個根，再把較小成分的根接到較大成分底下，並更新新根的 sz。路徑因此不容易長得太深。",
      "大小為 1 的 C 加入已有 A、B 的成分後，新集合大小為 3。讀集合大小時要看目前的根。"],
    [39,58,"按權重選邊並計算成本","每次先測 same。如果兩端早已相通，這條邊會形成環，略過它。否則 merge 並累加權重。",
      "範例選 D–E、A–B、B–C、B–D、D–F，依序加入的權重是 1、2、3、5、8，總和 19。A–C 雖然權重只有 4，兩端早已相通。",
      "連通 n 點的生成樹有 n−1 條邊。跑完全部邊仍不足時，輸出 IMPOSSIBLE。"]
  ],
  "binary-power":[
    [6,17,"逐個處理指數的二進位位元","a 每輪平方，依序代表原底數的 1、2、4、8 次方。b&1 取最低位，該位為 1 就將這輪的 a 乘進 ans。b>>=1 讓下一位移到最右邊。",
      "指數 5 的二進位是 101，所以只選 1 次方和 4 次方。範例 −2 的五次方是 −32，轉成這個模數的非負餘數是 999999975。",
      "底數可能是負數，先正規化成 0 到 mod−1。這個固定模數允許用 64-bit 安全地乘兩個餘數。"],
    [19,23,"讀入底數和指數","這個範例讀一組底數與非負指數，呼叫 fastPower 並印出結果。",
      "b=0 時不進迴圈，照定義直接回傳初始值 1。"]
  ]
};

function cppExplanations(lines,file) {
  const notes=[[1,4,"競程模板的共用設定",
    "bits/stdc++.h 在 GNU++17 提供常用的容器與演算法。using namespace std 讓程式可直接寫 vector、cin 和 cout。",
    "這裡把 int 宣告替換成 64-bit，像區間總和超過 2,147,483,647 時仍可保存。endl 以 '\\n' 輸出換行而不強制清空緩衝。",
    "順序要保留：先 include，再定義 int 的巨集。main() 用 signed 保持標準要求的回傳型別。"],...(cppNotes[file]??[])];
  const main=lines.findIndex(line=>line.startsWith("signed main()"));
  if(main>=0 && file!=="contest-io") notes.push([main+1,lines.length,"從 main() 進入程式",
    "先設定快速 I/O，再呼叫 solve()。目前的輸入格式只有一筆測資，所以只呼叫一次。",
    "如果另一題明確給了測資筆數，可以參考「基本 I/O 與多筆測資」，在 main() 讀 t，再呼叫 solve() 共 t 次。"]);
  return notes.map(([start,end,title,explanation,trace,pitfall])=>
    '<details class="alg-code-explanation" data-lines="'+start+'-'+end+'"><summary><span>'+esc(title)+
    '</span><small>第 '+start+'–'+end+' 行</small></summary><div class="alg-note-copy"><p>'+esc(explanation)+'</p>'+
    (trace?'<p><strong>對照範例</strong> '+esc(trace)+'</p>':'')+
    (pitfall?'<p><strong>容易寫錯的地方</strong> '+esc(pitfall)+'</p>':'')+'</div></details>').join("");
}

function cppListing(source,lines) {
  const macros = new Set([...source.matchAll(/^\s*#define\s+(\w+)/gm)].map(([,name])=>name));
  const namedTypes = new Set([...source.matchAll(/\b(?:class|struct)\s+(\w+)/g)].map(([,name])=>name));
  return lines.map((line,index)=>{
    const include = line.match(/^(\s*#include\s*)(<[^>\r\n]+>)/);
    const header = include?.[2];
    const tokens = [...line.matchAll(cppTokens)];
    const html = [];
    for(const match of tokens){
      const [token] = match;
      const position = match.index;
      if(header && position>=include[1].length && position<include[0].length){
        if(position===include[1].length) html.push('<span class="cpp-string">'+esc(header)+'</span>');
        continue;
      }
      const rest=line.slice(position+token.length);
      const style = token.startsWith("//") ? "comment" : token[0]==="#" || (macros.has(token) && (!cppTypes.has(token) || /^\s*#define/.test(line))) ? "directive" :
        /^["']/.test(token) ? "string" : /^\d/.test(token) ? "number" :
        cppTypes.has(token)||namedTypes.has(token) ? "type" :
        cppKeywords.has(token) ? "keyword" :
        /^\w/.test(token) && /^\s*\(/.test(rest) ? "function" :
        /^[=!<>+\-*/%&|^~?:.]/.test(token) ? "operator" : "";
      html.push(style ? '<span class="cpp-'+style+'">'+esc(token)+'</span>' : esc(token));
    }
    return '<div class="alg-code-row"><span class="alg-code-number" aria-hidden="true">'+(index+1)+
      '</span><code>'+html.join("")+'</code></div>';
  }).join("");
}

async function loadCode(panel, example) {
  const filename = example.file+".cpp";
  const path = "assets/lecture-06/code/"+filename+"?v=functions-2";
  const demo=example.demo ? '<p class="alg-template-demo"><a href="'+StudySite.courseLink("lecture-06","learn",...example.demo)+'">到互動實驗試一次 →</a></p>' : "";
  panel.innerHTML = '<p>'+esc(example.description)+'</p>'+demo+'<div class="alg-io">'+
    '<div><strong>範例輸入</strong><pre>'+esc(example.input)+'</pre></div>'+
    '<div><strong>範例輸出</strong><pre>'+esc(example.output)+'</pre></div></div>'+
    '<div class="alg-code-actions">'+button("copy","複製 C++")+
    '<a class="btn secondary" href="'+path+'" download="'+filename+'">下載 .cpp</a></div>'+
    '<p class="tool-status" role="status">正在載入程式碼…</p><details class="alg-code-notes" hidden><summary>段落解說</summary>'+
    '<div class="alg-code-note-list"></div></details><div class="alg-code" tabindex="0" aria-label="完整 C++ 程式碼"></div>';
  const status = panel.querySelector('[role="status"]');
  const copy = panel.querySelector("button");
  copy.disabled = true;
  const response = await fetch(path);
  if (!response.ok) throw new Error("C++ example unavailable");
  const source = await response.text();
  const lines=source.trimEnd().split(/\r?\n/);
  panel.querySelector(".alg-code").innerHTML = cppListing(source,lines);
  panel.querySelector(".alg-code-note-list").innerHTML = cppExplanations(lines,example.file);
  panel.querySelector(".alg-code-notes").hidden = false;
  copy.disabled = false;
  status.textContent = "";
  copy.addEventListener("click",async ()=>{
    try {
      await navigator.clipboard.writeText(source);
      status.textContent = "已複製程式碼";
    } catch {
      status.textContent = "可以選取下方程式碼，或點「下載 .cpp」。";
    }
  });
}

const elementPosition = index => "第 "+(index+1)+" 個元素 · 索引 "+index;

function arrayBoard(values, initialCue="") {
  return visual => {
    visual.innerHTML = '<div class="alg-array'+(values.length>12?' alg-array-names':'')+'">'+values.map((value,index) =>
      '<div class="alg-array-cell"><span class="alg-index">'+index+
      '</span><strong>'+esc(String(value))+'</strong><span class="alg-pointer"></span></div>').join("")+'</div>'+
      (initialCue?'<p class="alg-board-cue"></p>':"");
    const cells = [...visual.querySelectorAll(".alg-array-cell")];
    const cue=visual.querySelector(".alg-board-cue");
    return step=>{
      cells.forEach((cell,index)=>{
        cell.dataset.state = step.cells[index] || "";
        cell.lastElementChild.textContent = step.labels?.[index] || "";
      });
      if(cue)cue.textContent=step.cue??initialCue;
    };
  };
}

const sortedNumbers = [2,4,7,7,7,13,18,24,31];
const decision = (question,options,answer,explanation,hint,reason) => ({
  question, inputs:[{name:"decision",label:"下一步",options,answer}],explanation,hint,reason
});
const bounds = (low,high,reason) => ({
  question:"比較完中點後，下一步的 L 和 R 是多少？",
  inputs:[{name:"low",label:"下一步 L",answer:low},{name:"high",label:"下一步 R",answer:high}],
  explanation:"更新後 L = "+low+"，R = "+high+"。",
  hint:"先找到圖上的中間格和目標。比較大小，再確認 L 和 R 哪個需要移動。",reason
});
const examNames = ["Amelia","Ava","Benjamin","Charlotte","David","Elijah","Emma","Ethan","Evelyn","Harper",
  "Isabella","James","Liam","Lucas","Mason","Mia","Noah","Oliver","Olivia","Peter","Sophia","Tuvoc","William","Xavier"];
const binary = {
  page:37, concept:"binary-search", title:"二元搜尋：縮小搜尋區間",
  prediction:true, setup:customArraySetup({array:"2, 4, 7, 9",target:7}),
  intro:"資料已由小到大排列。先按「下一步」看第一次比較，再試試找不到的數字和一個有重複值的例子。",
  fields:[
    option("搜尋目標",[[9,"9（入門：四個數字）"],[7,"7（有重複）"],[18,"18"],[8,"8（找不到）"],[1,"1（小於最小值）"],[40,"40（大於最大值）"],
      ["Oliver","Oliver（2025 第三次小考）"]]),
    option("搜尋方式",[["any","找到任一個"],["first","找第一個出現的位置"],["broken","反例：把半開區間的 R 寫成 mid−1"]])
  ],
  legend:"外框表示候選範圍，琥珀色是正在比較的中點，綠色是最後的答案。",
  code:{
    file:"binary-search", input:"9 7\n2 4 7 7 7 13 18 24 31",output:"2\n2",
    description:"第一列是 n 和目標，第二列放 n 個升冪整數。程式先用手寫二元搜尋，再用 std::lower_bound，兩行都輸出第一個匹配的 0-based 位置。找不到時輸出 −1，先檢查回傳位置才讀陣列值。"
  },
  trace(targetValue, mode,custom) {
    const exam = !custom&&targetValue==="Oliver";
    const target = custom?.target ?? (exam ? "Oliver" : Number(targetValue));
    const values = custom?.values ?? (exam ? examNames : target===9 ? [2,4,7,9] : sortedNumbers);
    const mount=arrayBoard(values,"先從 0 開始編號。目標是 "+target+"，L 是左界，R 是右界。");
    const broken=mode==="broken";
    const first = mode!=="any";
    const pseudo = first ? [
      "L ← 0, R ← n  // [L, R)",
      "while L < R: mid ← L + ⌊(R − L) / 2⌋",
      "  if A[mid] < target: L ← mid + 1",
      broken?"  else: R ← mid − 1  // 反例":"  else: R ← mid",
      "if L < n and A[L] = target: return L",
      "return −1"
    ] : [
      "L ← 0, R ← n − 1  // [L, R]",
      "while L ≤ R: mid ← L + ⌊(R − L) / 2⌋",
      "  if A[mid] = target: return mid",
      "  if A[mid] < target: L ← mid + 1",
      "  else: R ← mid − 1",
      "return −1"
    ];
    const steps = [];
    let low=0,high=first?values.length:values.length-1,comparisons=0,firstError;
    const interval = () => "["+low+", "+high+(first?")":"]");
    const add = (title,note,line,mid=-1,result=-1,prediction,cue) => {
      const last = high - Number(first);
      const cells = values.map((_,i)=>i===result?"answer":i===mid?"active":i>=low&&i<=last?"candidate":"muted");
      const labels = values.map((_,i)=>[
        i===low&&low<=last?"L":"",
        i===mid?"mid":"",
        i===last&&low<=last?(first?"R−1":"R"):"",
        i===result?"✓ 找到":"",
        i!==result&&i!==mid&&(i<low||i>last)?"排除":""
      ].filter(Boolean).join(" · "));
      steps.push(diagram(title,note,line,{cells,labels,prediction,cue:cue??(result>=0?elementPosition(result)+" · 找到 "+target:
        (mid>=0?"mid · "+elementPosition(mid)+"，現在比較 "+values[mid]+" 和 "+target+"。":
          (line===5?"可查的格子已用完，沒有找到 "+target+"。":undefined))),stats:[
        ["區間",interval()],["候選數",Math.max(0,last-low+1)],["中點比較",comparisons]
      ]}));
    };
    add("把搜尋範圍設為整個陣列","這個版本使用"+(first?"半開區間，右端不含在候選內。":"閉區間，左右端都包含。")+
      (exam?"實驗索引從 0 起算，原題解答用第幾位表示。":""),0);
    while (first?low<high:low<=high) {
      const mid=low+Math.floor((high-low)/2);
      const value=values[mid];
      const equal=!first&&value===target;
      const lower=value<target;
      const comparison="現在看的中間值是 "+value+"，要找的是 "+target+"。";
      const prediction=broken?undefined:equal?
        decision("中點值等於目標。這一版接著做什麼？",[["stop","回傳 mid"],["left","繼續往左找"],["right","繼續往右找"]],"stop",
          "這一版找到任一匹配就回傳 mid。","看看中間的值是否和目標一樣，再看目前選的是哪種搜尋方式。",
          comparison+"兩個值相同，這個版本允許回傳任一匹配。"):
        bounds(lower?mid+1:low,lower?high:first?mid:mid-1,comparison+
          (lower?"中間值和更左邊的值都太小。新區間要從中點右邊一格開始。":
            (first?"使用 [L,R)，移動右界後，還能檢查中點左邊的位置。":"中間值和更右邊的值都太大。新區間的右端要留在中點左邊一格。")));
      comparisons++;
      add("比較中點 a["+mid+"] = "+value,"目前要找 "+target+"。先比中點，再決定哪一側可以排除。",1,mid,-1,prediction);
      if (equal) {
        add("找到目標","回傳索引 "+mid+(exam?"，也就是原題的第 "+(mid+1)+" 位。":"。有重複值時，這個版本會停在先遇到的匹配。"),2,mid,mid);
        return {steps,pseudo,mount};
      }
      if (lower) {
        low=mid+1;
        add("捨棄中點及左側",value+" 小於 "+target+"，有序陣列左邊的值也太小。更新 L = "+low+"。",first?2:3,
          -1,-1,undefined,"這些數都太小。標「排除」的格子之後不用再看。");
      } else {
        high=first&&!broken?mid:mid-1;
        if(broken){
          const initial=firstError===undefined;
          if(initial) firstError=steps.length+1;
          add(initial?"首次錯誤：多排除一格":"錯誤右界再次縮太多",
            "半開區間本應設 R = "+mid+"。寫成 "+high+" 時，"+
              (high<low?"右界退到 L 左邊，破壞了區間的端點順序。":"原本應保留的索引 "+high+" 也被排除。"),3,
            -1,-1,undefined,"反例：右界縮太多，試著切回正確寫法比較。");
          continue;
        }
        add("把右界收向中點",first && value===target
          ? "這裡已等於 "+target+"。把 R 設為 "+high+"，繼續確認左邊是否還有相同值。"
          : value+" 大於 "+target+"，往左縮小搜尋區間。更新 R = "+high+"。",4-Number(first),-1,-1,undefined,
          first&&value===target?"先往左確認。陣列裡可能還有更早出現的相同值。":"這些數都太大，後面只看左邊剩下的格子。");
      }
    }
    const found=first&&values[low]===target;
    if(broken){
      const expected=values.findIndex(value=>value===target);
      const actual=found?low:-1;
      const status=actual===expected?"這次結果碰巧相同":"反例重現：結果不同";
      add(status,"錯誤版本回傳 "+actual+"，正確的第一個索引是 "+expected+"。"+
        (firstError?"第 "+firstError+" 步第一次寫錯右界。":"這組資料沒有走到錯誤分支。"),found?4:5,-1,actual);
      return {steps,pseudo,mount};
    }
    add(found?"找到第一個符合的位置":"搜尋結束，找不到目標",
      first ? (found?"交界索引 "+low+" 的值等於 "+target+"，回傳 "+low+"。":"交界位於陣列末端，或該位置的值不等於 "+target+"。回傳 −1。")
        : "L 已大於 R，已沒有候選項目。回傳 −1。",
      found?4:5,-1,found?low:-1);
    return {steps,pseudo,mount};
  }
};

function insertionBoard(values) {
  return visual => {
    visual.innerHTML = '<div class="alg-sort-viewport"><div class="alg-sort" style="--columns:'+values.length+';--board-width:'+Math.max(0,values.length-5)*46+'px">'+
      values.map((_,i)=>'<div class="alg-sort-slot" style="--slot:'+i+'"><span>'+i+'</span></div>').join("")+
      values.map(value=>'<div class="alg-sort-item"><strong>'+esc(String(value))+'</strong><small></small></div>').join("")+
      '</div></div><p class="alg-board-cue"></p>';
    const pieces = [...visual.querySelectorAll(".alg-sort-item")];
    const cue=visual.querySelector(".alg-board-cue");
    return step=>{
      pieces.forEach((piece,index)=>{
        const slot=step.order.indexOf(index);
        piece.style.setProperty("--slot",slot===-1 ? step.hole : slot);
        piece.dataset.state = index===step.key ? "held" : slot<step.sorted ? "sorted" : "";
        piece.lastElementChild.textContent=index===step.key?"待插入":slot<step.sorted?"✓ 已排":"";
      });
      cue.textContent=step.key>=0?"先留住 "+values[step.key]+"。目前空位："+elementPosition(step.hole)+"。":
        "已有 "+step.sorted+" 項排好，帶 ✓ 的格子是已排好的前綴。";
    };
  };
}

const insertion = {
  page:31,concept:"insertion-sort",title:"插入排序：移出、右移、插回",
  setup:customArraySetup({array:"5, 5, 5, 2"}),
  intro:"琥珀色的 key 會先提到上方，其他物件逐格右移，再插進空位。姓名例沿用講義順序。",
  fields:[option("陣列", [["names","講義例：姓名"],["reverse","反向排列"],["ties","有重複值"],["sorted","已排序"],["equal","全部相等"]]),
    option("右移條件",[["stable","嚴格大於 key（穩定）"],["unstable","大於等於 key（穩定性反例）"]])],
  legend:"綠色標出已確定排好的前綴；有重複值時，字母標記可用來追蹤原先順序。",
  code:{file:"insertion-sort",input:"5\n8 2 5 2 4",output:"2 2 4 5 8",
    description:"讀入 n 個整數後輸出排序結果。條件 a[j−1] > key 保留相等元素的相對順序。適合用來學原地排序，輸入很大時可使用 std::sort。"},
  trace(preset,mode,custom) {
    const values = custom ? custom.values.map((value,i)=>custom.values.indexOf(value)!==custom.values.lastIndexOf(value)
      ? value+String.fromCharCode(97+custom.values.slice(0,i).filter(number=>number===value).length) : value)
      : {names:["Fred","Alex","Diana","Byron","Carol"],reverse:[9,7,5,3,1],ties:["4a","2a","4b","1","2b"],sorted:[1,3,5,7,9],equal:["5a","5b","5c","5d"]}[preset];
    const compare = (a,b) => !custom&&preset==="names" ? a.localeCompare(b,"en") : parseInt(a,10)-parseInt(b,10);
    const stable=mode==="stable";
    const order = values.map((_,i)=>i);
    const pseudo = ["for i from 1 to n − 1","  key ← A[i], j ← i",
      "  while j > 0 and A[j − 1] "+(stable?">":"≥")+" key","    A[j] ← A[j − 1], j ← j − 1","  A[j] ← key","return A"];
    const steps = [];
    let shifts=0,comparisons=0,firstTieShift;
    const add = (title,note,line,sorted,key=-1,hole=-1) => steps.push(diagram(title,note,line,{
      order:[...order],sorted,key,hole,stats:[["前綴已排好",sorted],["比較",comparisons],["右移",shifts]]
    }));
    add("先確認左側的一項已排好","從索引 1 開始，每次把一個新值插到左側的適當位置。",0,1);
    for (let i=1;i<order.length;i++) {
      let j=i;
      const key=order[i];
      order[i]=-1;
      add("提起 "+values[key],"先保留這個值，原本的位置留給右移的元素。",1,i,key,j);
      while (j>0) {
        const left=order[j-1];
        const difference=compare(values[left],values[key]);
        const move=stable?difference>0:difference>=0;
        comparisons++;
        add("與左鄰 "+values[left]+" 比較",move?(difference===0?"兩者值相等。使用 ≥ 時，這一格仍會向右移。":"它比 key 大，下一步往右讓出位置。"):
          "它小於或等於 key，維持原有順序並準備把 key 放回空位。",2,j,key,j);
        if (!move) break;
        order[j]=left;
        order[j-1]=-1;
        j--;
        shifts++;
        const first=difference===0&&firstTieShift===undefined;
        add(first?"第一次打亂相等值的順序":values[left]+" 右移一格",
          first?values[left]+" 和 "+values[key]+" 的值相等，但前者被移到後面了。":"空位也向左移到索引 "+j+"。",3,j,key,j);
        if(first)firstTieShift=steps.length;
      }
      order[j]=key;
      add("插入 "+values[key],"放入索引 "+j+"。前 "+(i+1)+" 項現在已排好。",4,i+1);
    }
    add("排序完成",order.map(index=>values[index]).join(" → ")+(firstTieShift?"。第 "+firstTieShift+" 步第一次移動相等的值。":""),5,order.length);
    return {steps,pseudo,mount:insertionBoard(values)};
  }
};

const vertices = {A:[12,24],B:[49,11],C:[28,75],D:[57,52],E:[86,20],F:[84,83]};
const graphEdges = [["A","B",2],["A","C",4],["B","C",3],["B","D",5],["B","E",6],
  ["C","D",7],["D","E",1],["D","F",8],["E","F",9]];
const edgeName = ([a,b,weight]) => a+"–"+b+" ("+weight+")";
function graphBoard(points,graph) {
  const edges = graph.map(([a,b,weight])=>{
    const [x,y]=points[a];
    const [xx,yy]=points[b];
    const dx=xx-x,dy=(yy-y)*.57;
    return '<div class="alg-edge"><span class="alg-edge-line" style="left:'+x+'%;top:'+y+'%;width:'+Math.hypot(dx,dy)+
      '%;transform:rotate('+Math.atan2(dy,dx)+'rad)"></span>'+(weight===null?"":'<span class="alg-weight" style="left:'+((x+xx)/2)+
      '%;top:'+((y+yy)/2)+'%">'+weight+'</span>')+'</div>';
  }).join("");
  return visual=>{
    const pointNames=Object.keys(points);
    visual.innerHTML='<div class="alg-graph'+(pointNames.length>8?' alg-graph-dense':'')+'">'+edges+Object.entries(points).map(([point,[x,y]])=>
      '<div class="alg-vertex" style="left:'+x+'%;top:'+y+'%">'+point+'</div>').join("")+'</div>';
    const edgeElements=[...visual.querySelectorAll(".alg-edge")];
    const pointElements=[...visual.querySelectorAll(".alg-vertex")];
    return step=>{
      edgeElements.forEach((edge,i)=>{
        edge.dataset.state = i===step.edge ? step.skipped.includes(i)?"rejected":"active" :
          step.cycle.includes(i)?"cycle":step.chosen.includes(i)?"chosen":step.candidates.includes(i)?"candidate":"muted";
      });
      pointElements.forEach((point,i)=>point.classList.toggle("is-in",step.visited.includes(pointNames[i])));
    };
  };
}

function pathInForest(source,target,selected,graph) {
  const queue=[{point:source,path:[]}];
  const seen=new Set([source]);
  for (const {point,path} of queue) {
    if (point===target) return path;
    for (const index of selected) {
      const [a,b]=graph[index];
      const next=point===a?b:point===b?a:null;
      if (!next || seen.has(next)) continue;
      seen.add(next);
      queue.push({point:next,path:[...path,index]});
    }
  }
  return null;
}

const mst = {
  page:45,concept:"mst",title:"最小生成樹：Kruskal 與 Prim",
  prediction:true,
  intro:"用同一張圖切換兩種方法。先看候選邊，再看為什麼它會被選進去或跳過。",
  fields:[option("圖形",[["demo","六個頂點範例"],["mst-quiz","2025 第三次小考"],["mst-final","2025 期末考"]]),
    option("選邊規則",[["kruskal","Kruskal：全圖依權重"],["prim-first","Prim：從編號第一點開始"],["prim-last","Prim：從編號最後一點開始"]])],
  legend:"綠線已選，藍線為候選，琥珀線正在檢查。珊瑚色標示會形成環的邊與舊路徑。",
  code:{file:"kruskal",input:"6 9\n1 2 2\n1 3 4\n2 3 3\n2 4 5\n2 5 6\n3 4 7\n4 5 1\n4 6 8\n5 6 9",output:"19",
    description:"讀入頂點數、邊數，再逐列輸入無向邊的兩端和權重。A～F 改用 1～6。以 DSU 判斷兩端是否已連通，總權重使用 long long。未能選到 V−1 條邊時輸出 IMPOSSIBLE。"},
  trace(preset,mode) {
    const figure=preset==="demo"?null:studyExamFigures[preset];
    const points=figure?.nodes??vertices;
    const graph=figure?figure.edges.map(([a,b,w])=>[String(a),String(b),w]):graphEdges;
    const graphPoints=Object.keys(points);
    const orderedEdges=graph.map((_,i)=>i).sort((a,b)=>graph[a][2]-graph[b][2]);
    const prim=mode!=="kruskal";
    const start=mode==="prim-last"?graphPoints.at(-1):graphPoints[0];
    const pseudo=prim?["S ← {start}, T ← ∅","列出只有一端在 S 的邊","選其中權重最小的邊 (u,v)",
      "把該邊加入 T，並納入樹外端點","直到 |T| = V − 1，回傳 T"]:
      ["邊依權重從小到大排序，T ← ∅","取下一條邊 (u,v)","若 u、v 已在同成分，略過這條邊",
      "否則加入 T 並合併成分","直到 |T| = V − 1，回傳 T"];
    const chosen=[],skipped=[], steps=[];
    const visited=new Set(prim?[start]:[]);
    let cost=0;
    const available=()=>orderedEdges.filter(i=>{
      const [a,b]=graph[i];
      return prim?visited.has(a)!==visited.has(b):!chosen.includes(i)&&!skipped.includes(i);
    });
    const add=(title,note,line,edge=-1,cycle=[],prediction)=>{
      const candidates=chosen.length<graphPoints.length-1?available():[];
      steps.push(diagram(title,note,line,{
        edge,cycle,prediction,candidates,chosen:[...chosen],skipped:[...skipped],visited:[...visited],
        stats:[["已選邊",chosen.length+" / "+(graphPoints.length-1)],["總權重",cost],
          [prim?"樹內頂點":"下一條候選",prim?graphPoints.filter(point=>visited.has(point)).join("、"):(candidates.length?edgeName(graph[candidates[0]]):"—")]]
      }));
    };
    add(prim?"從頂點 "+start+" 開始":"先依權重排列全圖的邊",
      prim?"起始樹只有一個頂點。每輪只能從樹內接到樹外。":"起初每個頂點都是獨立成分。每輪處理剩餘權重最小的一條邊。",0);
    while(chosen.length < graphPoints.length-1) {
      const candidates=available();
      if(prim) add("找出跨界邊","藍色邊有 "+candidates.length+" 條可延伸目前的樹，其中最輕的是 "+edgeName(graph[candidates[0]])+"。",1);
      const index=candidates[0];
      const [a,b,weight]=graph[index];
      const path=prim?null:pathInForest(a,b,chosen,graph);
      const prediction=prim?undefined:decision("Kruskal 要選這一條邊嗎？",[["take","選入"],["skip","略過"]],
        path?"skip":"take",path?a+" 和 "+b+" 已沿著綠線相通，再接就會形成環。":
          a+" 和 "+b+" 位於不同成分，可以把兩個成分合起來。",
        "先找這條邊的兩個端點，再看看圖上已選入的是哪些線。",
        path?"沿著 "+path.map(i=>edgeLabel(graph[i])).join("、")+" 就能從 "+a+" 到 "+b+"。兩端若已有路，再加一條新邊就會繞成環。":
          a+" 和 "+b+" 目前沒有辦法只沿已選入的線互相到達。把兩個分開的成分接起來不會繞成環。");
      add("檢查 "+edgeName(graph[index]),prim?"它是目前最輕的跨界邊。":"它是全圖尚未處理的邊中權重最小的。",prim?2:1,index,[],prediction);
      if(path) {
        skipped.push(index);
        add("略過 "+a+"–"+b,a+" 與 "+b+" 早已連通。新邊與珊瑚色舊路徑合起來會成環。",2,index,path);
        continue;
      }
      chosen.push(index);
      const newPoint=visited.has(a)?b:a;
      visited.add(a);
      visited.add(b);
      cost+=weight;
      add("選入 "+a+"–"+b,prim?"頂點 "+newPoint+" 加入樹，跨界候選將重新計算。":"合併原先分開的兩個成分。",3);
    }
    add("最小生成樹完成",chosen.map(i=>edgeName(graph[i])).join("、")+"，總權重 "+cost+"。",4);
    return {steps,pseudo,mount:graphBoard(points,graph)};
  }
};

function treeBoard(nodes) {
  const depth=Math.max(...nodes.map(node=>node.depth));
  const leaves=nodes.filter(node=>!node.left);
  leaves.forEach((node,i)=>node.x=8+(84*i)/Math.max(1,leaves.length-1));
  for (const node of [...nodes].reverse()) {
    if (node.left) node.x=(node.left.x+node.right.x)/2;
    node.y=9+80*node.depth/Math.max(1,depth);
  }
  return visual=>{
    visual.innerHTML='<div class="alg-tree">'+nodes.map(node=>{
      if (!node.parent) return "";
      const dx=node.parent.x-node.x;
      const dy=(node.parent.y-node.y)*.72;
      return '<span class="alg-tree-link" style="left:'+node.x+'%;top:'+node.y+'%;width:'+Math.hypot(dx,dy)+
        '%;transform:rotate('+Math.atan2(dy,dx)+'rad)"></span>';
    }).join("")+nodes.map(node=>'<div class="alg-tree-node" style="left:'+node.x+'%;top:'+node.y+
      '%"><strong>F('+node.n+')</strong><small></small></div>').join("")+'</div>';
    const links=[...visual.querySelectorAll(".alg-tree-link")];
    const spots=[...visual.querySelectorAll(".alg-tree-node")];
    return step=>{
      for(const [i,spot] of spots.entries()){
        spot.dataset.state = step.active===i?"active":step.results[i]!==undefined?"done":step.seen.includes(i)?"waiting":"pending";
        spot.lastElementChild.textContent=step.results[i]===undefined?"":"= "+step.results[i];
        if(i>0) links[i-1].classList.toggle("is-visible",step.seen.includes(i));
      }
    };
  };
}

const fibonacci={
  page:75,concept:"fibonacci",title:"費波那契：看遞迴樹展開與回傳",
  intro:"先沿左分支走到底，再回上層計算右分支。看到同一個 F(n) 出現兩次時，可以比較直接遞迴與記憶化。",
  fields:[option("輸入 n",[[4,"4"],[5,"5"]]),option("策略",[["plain","直接遞迴"],["cache","記憶化"]])],
  legend:"琥珀色是當前呼叫，藍色正在等待，綠色已返回。虛線是還沒走到的位置。",
  trace(n,mode){
    const nodes=[], steps=[], stack=[], seen=[], results={};
    const memo=new Map();
    let calls=0,hits=0;
    const cached=mode==="cache";
    const pseudo=["F(n): 開始一次呼叫","  if 已有 F(n) 的記憶：回傳它",
      "  if n ≤ 1: return n","  left ← F(n − 1)","  right ← F(n − 2)","  return left + right"];
    const add=(title,note,line,active=-1)=>steps.push(diagram(title,note,line,{
      active,seen:[...seen],results:{...results},stats:[["呼叫次數",calls],["命中快取",hits],["當前堆疊",stack.map(n=>"F("+n+")").join(" → ")||"—"]]
    }));
    function fib(k,parent){
      const id=nodes.length;
      const node={n:k,parent,depth:parent?parent.depth+1:0};
      nodes.push(node);
      seen.push(id);stack.push(k);calls++;
      add("呼叫 F("+k+")","這一層只處理自己的參數 n = "+k+"。",0,id);
      let result;
      if(cached&&memo.has(k)){
        hits++;
        result=memo.get(k);
        add("沿用已算過的 F("+k+")","從快取讀出 "+result+"，這個分支不用再展開。",1,id);
      } else if(k<=1) {
        result=k;
        add("到達基底情況","F("+k+") = "+result+"，不用再呼叫下層。",2,id);
      } else {
        add("先計算左分支","F("+k+") 等待 F("+(k-1)+") 的結果。",3,id);
        const left=nodes.length;
        const a=fib(k-1,node);
        node.left=nodes[left];
        add("左側回傳 "+a,"保留左側結果，現在展開右分支。",4,id);
        const right=nodes.length;
        const b=fib(k-2,node);
        node.right=nodes[right];
        result=a+b;
        add("合併兩個回傳值",a+" + "+b+" = "+result+"。",5,id);
      }
      if(cached) memo.set(k,result);
      results[id]=result;
      stack.pop();
      add("回傳 F("+k+") = "+result,parent?"把答案交回上一層 F("+parent.n+")。":"最外層回傳最終結果。",k<=1?2:5);
      return result;
    }
    fib(Number(n),null);
    return {steps,pseudo,mount:treeBoard(nodes)};
  }
};

function mazeBoard(cells) {
  return visual=>{
    visual.innerHTML='<div class="alg-maze">'+cells.map(i=>'<span class="alg-maze-cell">'+(i+1)+'</span>').join("")+'</div>';
    const elements=[...visual.querySelectorAll(".alg-maze-cell")];
    return step=>elements.forEach((element,i)=>{
      element.dataset.state=i===step.added?"active":step.inside.includes(i)?"answer":step.front.includes(i)?"candidate":"muted";
      const passage=neighbor=>step.edges.some(([a,b])=>a===i&&b===neighbor||b===i&&a===neighbor);
      element.classList.toggle("open-right",i%4<3&&passage(i+1));
      element.classList.toggle("open-bottom",passage(i+4));
    });
  };
}

const maze={
  page:51,concept:"maze",title:"迷宮：每次只打通一面牆",
  intro:"從一格出發，選一格 FRONTIER 接入 IN。切換種子可以重播兩種不同的牆面配置。",
  fields:[option("迷宮樣式",[["21","從左上角擴張"],["84","從中央向外擴張"]])],
  legend:"藍色是邊界候選，綠色已接入。相鄰格之間牆面消失就表示可通行。",
  trace(seedText) {
    const cells=Array.from({length:16},(_,i)=>i);
    const neighbors=i=>cells.filter(j=>Math.abs(i%4-j%4)+Math.abs(Math.floor(i/4)-Math.floor(j/4))===1);
    let seed=Number(seedText);
    const choose=items=>{
      seed=(Math.imul(1664525,seed)+1013904223)>>>0;
      return items[Math.floor(seed/2**32*items.length)];
    };
    const inside=new Set([seed===21?0:5]), edges=[], steps=[];
    const frontier=()=>cells.filter(i=>!inside.has(i)&&neighbors(i).some(j=>inside.has(j)));
    const pseudo=["選起始格加入 IN","列出鄰近 IN 的 FRONTIER",
      "選一個 FRONTIER，和一個已在 IN 的鄰格接通","把新格加入 IN 並更新邊界","直到所有格都在 IN"];
    const add=(title,note,line,added=-1)=>steps.push(diagram(title,note,line,{
      inside:[...inside],front:frontier(),edges:[...edges],added,
      stats:[["已連通格子",inside.size+"/16"],["邊界候選",frontier().length],["打通牆面",edges.length]]
    }));
    add("建立起點","初始只有一格在 IN。它旁邊的格子進入 FRONTIER。",0,[...inside][0]);
    while(inside.size<cells.length){
      const next=choose(frontier());
      const from=choose(neighbors(next).filter(i=>inside.has(i)));
      add("準備接入第 "+(next+1)+" 格","第 "+(next+1)+" 格目前和 IN 相鄰。這一輪選擇從第 "+(from+1)+" 格接過去。",1,next);
      edges.push([from,next]);
      inside.add(next);
      add("打通 "+(from+1)+" 與 "+(next+1)+" 之間的牆","新增一格和一條邊後，重新算 FRONTIER。其餘可接入的牆仍保留，避免形成環。",3,next);
    }
    add("迷宮完成","16 格用 15 條通道連在一起。任選兩格，都只有一條簡單路徑。",4);
    return {steps,pseudo,mount:mazeBoard(cells)};
  }
};

const invariant={
  page:91,concept:"invariant",title:"迴圈不變量：證明掃描最大值",
  intro:"每次處理一項，檢查目前的 m 是否等於已處理前綴的最大值。換成全負數可測試初始化。",
  fields:[option("輸入陣列",[["mix","[3, 8, 2, 11, 4]"],["negative","[−9, −6, −2, −5]"],["single","[−7]"]])],
  legend:"藍框是已處理前綴，琥珀色為下一個值，綠色標出當前最大值。",
  trace(preset) {
    const values={mix:[3,8,2,11,4],negative:[-9,-6,-2,-5],single:[-7]}[preset];
    const steps=[], pseudo=["要求 n ≥ 1","m ← a[0], i ← 1","while i < n: 比較 a[i] 和 m",
      "  if a[i] > m: m ← a[i]","  i ← i + 1","return m"];
    let index=1,maxIndex=0;
    const add=(title,note,line,active=-1)=>steps.push(diagram(title,note,line,{
      cells:values.map((_,i)=>i===active?"active":i===maxIndex?"answer":i<index?"candidate":"muted"),
      labels:values.map((_,i)=>i===maxIndex?"m":i===active?"i":""),
      stats:[["已處理","a[0.."+(index-1)+"]"],["目前最大值 m",values[maxIndex]],["下一索引 i",index]]
    }));
    add("初始化：前綴只有一項","n ≥ 1，令 m = a[0]。只有一項時，它自然就是前綴最大值。",1);
    while(index<values.length){
      const update=values[index]>values[maxIndex];
      add("比較 a["+index+"] = "+values[index],"先假定 m 已是前綴最大值。只要再比這個新值，就能得到擴張後的最大值。",2,index);
      if(update)maxIndex=index;
      index++;
      add(update?"更新最大值":"保持原最大值","前綴增加一項，m 仍然等於已處理區間的最大值。",update?3:4);
    }
    add("終止：前綴就是整個陣列","i = n，已處理區間覆蓋完整陣列。所以 m = "+values[maxIndex]+" 是所求答案。",5);
    return {steps,pseudo,mount:arrayBoard(values)};
  }
};

const prefix={
  page:61,concept:"prefix-average",title:"前綴平均：比較重掃與累加",
  intro:"兩種方法產生相同的平均，觀察每前進一格要再讀幾次陣列，以及累加法保留了什麼。",
  fields:[option("方法",[["scan","每輪重掃前綴"],["carry","沿用上一輪累加和"]])],
  legend:"共用一組輸入。琥珀格是目前要輸出平均的位置，藍框表示這輪重新讀取的前綴資料。",
  trace(mode){
    const values=[4,10,1,9,6,12], carry=mode==="carry";
    const pseudo=carry?["sum ← 0","for i from 0 to n − 1","  sum ← sum + X[i]","  A[i] ← sum / (i + 1)"]:
      ["for i from 0 to n − 1","  sum ← 0","  for j from 0 to i: sum ← sum + X[j]","  A[i] ← sum / (i + 1)"];
    const steps=[];
    let reads=0,sum=0;
    const add=(title,note,line,active=-1,result="—")=>steps.push(diagram(title,note,line,{
      cells:values.map((_,i)=>i===active?"active":!carry&&i<active?"candidate":"muted"),
      labels:values.map((_,i)=>i===active?"i":""),
      stats:[["累計讀值",reads],["sum",sum],["本輪平均",result]]
    }));
    add("準備計算每個位置的平均","位置 i 的分母是 i+1，因為從索引 0 開始。",0);
    for(const [i,value] of values.entries()){
      if(carry){sum+=value;reads++;}
      else {sum=values.slice(0,i+1).reduce((total,next)=>total+next,0);reads+=i+1;}
      add("前綴加到索引 "+i,carry?"只讀入 "+value+"，並加到已有的 sum。":"從索引 0 重讀到 "+i+"，本輪讀 "+(i+1)+" 個值。",2,i);
      add("得到第 "+(i+1)+" 個平均",sum+" ÷ "+(i+1)+" = "+Number((sum/(i+1)).toFixed(2))+"（至多顯示兩位小數）。",3,i,(sum/(i+1)).toFixed(2));
    }
    add("算完所有前綴",carry?"每項讀一次，讀值量為 n，隨規模線性增加。":"讀值次數為 1+2+⋯+n，隨規模平方增加。",3);
    return {steps,pseudo,mount:arrayBoard(values)};
  }
};

const sequential = {
  page:26, concept:"sequential-search", title:"循序搜尋：什麼時候可以提早停？",
  intro:"先找 8，再換成無序清單做一次。觀察同一個值出現時，兩種清單允許你做的判斷。",
  fields:[option("清單",[["sorted","有序：[2, 4, 7, 9, 12]"],["unsorted","無序：[9, 2, 7, 12, 4]"],["empty","空清單"]]),
    option("目標值",[[8,"8（找不到）"],[7,"7"],[12,"12"],[1,"1（小於最小值）"]])],
  legend:"琥珀色是目前讀到的值，深色是已比較的項目，綠色是找到的位置。",
  trace(preset,wanted) {
    const sorted=preset==="sorted";
    const values={sorted:[2,4,7,9,12],unsorted:[9,2,7,12,4],empty:[]}[preset];
    const target=Number(wanted), steps=[];
    const mount=arrayBoard(values,"索引從 0 開始。從第 1 個元素往右逐項找 "+target+"。");
    const pseudo=["若清單為空，回報失敗","依原順序讀取下一項","  若項目等於目標，回傳索引",
      sorted?"  若項目大於目標，回報失敗":"  大小不同仍需檢查下一項","讀完仍沒有符合的值，回報失敗"];
    let inspected=0,answer=-1;
    const add=(title,note,line,active=-1)=>steps.push(diagram(title,note,line,{
      cells:values.map((_,i)=>i===answer?"answer":i===active?"active":i<inspected?"muted":"candidate"),
      labels:values.map((_,i)=>i===answer?"✓ 找到":i===active?"正在比較":i<inspected?"已查看":""),
      cue:active>=0 ? elementPosition(active)+(active===answer?" · 找到 "+target+"。":line===3&&sorted?
        "。這一格已比目標大，後面的格子不用讀。":"，比較 "+values[active]+" 和目標 "+target+"。"):
        (line===4?"每一格都已查看，這組資料沒有 "+target+"。":undefined),
      stats:[["目標",target],["讀取次數",inspected],["剩餘",values.length-inspected]]
    }));
    if(!values.length) {
      add("清單是空的","沒有可比較的資料，直接回報搜尋失敗。",0);
      return {steps,pseudo,mount:visual=>{visual.innerHTML='<p class="alg-empty">[ ] 空清單</p>';return ()=>{};}};
    }
    add("從索引 0 開始","依序往右。"+(sorted?"已知清單是升冪排列。":"清單沒有順序保證。"),0);
    for(const [index,value] of values.entries()){
      inspected++;
      add("讀取 a["+index+"] = "+value,"把目前的值和目標 "+target+" 比一比。",1,index);
      if(value===target){
        answer=index;
        add("找到目標","索引 "+index+" 的數字是 "+target+"，共讀了 "+inspected+" 項。",2,index);
        return {steps,pseudo,mount};
      }
      if(sorted&&value>target){
        add("有序清單可以在這裡停止",value+" 已大於 "+target+"，後面的值只會相等或更大。尚有 "+(values.length-inspected)+" 項無須讀取。",3,index);
        return {steps,pseudo,mount};
      }
      if(!sorted&&index<values.length-1&&value>target){
        add("繼續看下一項","無序時，"+value+" 比目標大也無法排除後面的值。",3,index);
      }
    }
    add("掃描結束","已檢查所有項目，共 "+inspected+" 次，搜尋失敗。",4);
    return {steps,pseudo,mount};
  }
};

const loops = {
  page:28, concept:"loop-trace", title:"前測與後測：同樣的條件會跑幾次？",
  intro:"兩邊用相同的初始值和繼續條件 count > 0。本體每執行一次就顯示一個圓點，再把 count 減一。",
  fields:[option("起始 count",[[0,"0（起始條件為假）"],[1,"1"],[3,"3"]])],
  legend:"琥珀色框標出現在的判斷或本體。底下每個綠色圓點代表本體實際執行一次。",
  trace(startText){
    const start=Number(startText);
    const statements=[
      ["while","先測條件","本體 count--"],
      ["do–while","本體 count--","再測條件"]
    ];
    function run(isPost){
      const history=[];
      let count=start,checks=0,body=0;
      const state=(stage,label)=>({stage,label,count,checks,body});
      history.push(state("","準備執行"));
      do {
        if(!isPost) {
          checks++;
          history.push(state("test",count>0?"條件為真":"條件為假"));
          if(count<=0)break;
        }
        count--;
        body++;
        history.push(state("body","執行本體"));
        if(isPost) {
          checks++;
          history.push(state("test",count>0?"條件為真":"條件為假"));
        }
      } while(isPost?count>0:true);
      history.push(state("done","迴圈結束"));
      return history;
    }
    const pre=run(false),post=run(true);
    const pseudo=["while (count > 0)","  顯示一次；count ← count − 1","do","  顯示一次；count ← count − 1","while (count > 0)"];
    const last=Math.max(pre.length,post.length)-1;
    const steps=Array.from({length:last+1},(_,i)=>{
      const left=pre[Math.min(i,pre.length-1)],right=post[Math.min(i,post.length-1)];
      const final=i===last;
      return diagram(final?"比較兩邊的執行結果":"同時追蹤兩種迴圈",
        final?(start===0?"前測在第一個判斷就離開；後測先跑一次，才看到條件為假。":
          "初始條件為真時，兩邊都跑 "+start+" 次本體。前測多一次檢查，因為還要判斷是否開始第一輪。"):
          "while："+left.label+"。do–while："+right.label+"。",
        -1,{left,right,stats:[["while 本體 / 判斷",left.body+" / "+left.checks],["do–while 本體 / 判斷",right.body+" / "+right.checks]]});
    });
    return {steps,pseudo,mount:visual=>{
      visual.innerHTML='<div class="alg-loop-grid">'+statements.map(([name,first,second],index)=>
        '<div class="alg-loop"><strong>'+name+'</strong><div class="alg-loop-block" data-stage="'+(index?"body":"test")+'">'+first+
        '</div><span class="alg-loop-arrow">↓</span><div class="alg-loop-block" data-stage="'+(index?"test":"body")+'">'+second+
        '</div><p><output></output><span class="alg-loop-dots"></span></p></div>').join("")+'</div>';
      const panels=[...visual.querySelectorAll(".alg-loop")];
      return step=>[step.left,step.right].forEach((state,index)=>{
        const panel=panels[index];
        panel.querySelectorAll("[data-stage]").forEach(block=>block.classList.toggle("is-active",block.dataset.stage===state.stage));
        panel.querySelector("output").textContent="count = "+state.count;
        panel.querySelector(".alg-loop-dots").textContent="●".repeat(state.body);
      });
    }};
  }
};

const recursiveBinary = {
  page:36,concept:"recursive-binary",title:"遞迴二元搜尋：跟著堆疊上去再回來",
  intro:"這裡用閉區間 [L,R]。按下一步可看到呼叫進入較小的範圍，或從基底情況把答案逐層傳回。",
  fields:[option("目標",[[18,"18（找到後返回）"],[8,"8（空區間返回）"],[7,"7（命中第一個中點）"],[40,"40（大於最大值）"]])],
  legend:"上方是每層選的中點。下面的卡片是仍在堆疊內的呼叫，琥珀色是目前這一層。",
  trace(wanted){
    const target=Number(wanted),values=sortedNumbers;
    const steps=[], stack=[];
    let comparisons=0;
    const pseudo=["Search(L,R)","  if L > R: return −1","  mid ← L + ⌊(R−L)/2⌋",
      "  if a[mid] = target: return mid","  if target < a[mid]: return Search(L, mid − 1)",
      "  return Search(mid + 1, R)"];
    const add=(title,note,line,mid=-1,result=-1)=>{
      const top=stack.at(-1);
      const [low,high]=top??[1,0];
      steps.push(diagram(title,note,line,{
        stack:stack.map(([left,right])=>"Search("+left+", "+right+")"),
        cells:values.map((_,i)=>i===result?"answer":i===mid?"active":i>=low&&i<=high?"candidate":"muted"),
        labels:values.map((_,i)=>i===result?"✓ 找到":i===mid?"mid":i<low||i>high?"排除":""),
        cue:result>=0?"找到答案 · "+elementPosition(result):mid>=0?"mid · "+elementPosition(mid):"索引從 0 開始，也就是第一個元素在索引 0。",
        stats:[["呼叫深度",stack.length],["中點比較",comparisons],["目標",target]]
      }));
    };
    function search(low,high){
      stack.push([low,high]);
      add("進入 Search("+low+", "+high+")","加入新的呼叫。上一層的界線仍留在原本的堆疊格。",0);
      let result=-1;
      if(low>high){
        add("基底情況：區間是空的","L > R，回傳 −1。這一層沒有讀取陣列。",1);
      } else {
        const mid=low+Math.floor((high-low)/2);
        comparisons++;
        add("比較 a["+mid+"] = "+values[mid],"在本層的區間取中點。比較結果會決定停下或呼叫下一層。",2,mid);
        if(values[mid]===target){
          result=mid;
          add("基底情況：找到目標","目前索引 "+mid+" 就是答案，開始往上回傳。",3,mid,result);
        } else {
          const left=target<values[mid];
          add(left?"去左半邊":"去右半邊","排除 mid 和另一半。這一層等待下一次呼叫的結果。",left?4:5,mid);
          result=left?search(low,mid-1):search(mid+1,high);
        }
      }
      stack.pop();
      add("回傳 "+(result>=0?result:"−1"),stack.length?"剛完成的這層離開堆疊，上一層收到相同的結果。":
        (result>=0?"所有呼叫都已返回，位置是索引 "+result+"。":"所有呼叫都已返回，找不到目標。"),-1,-1,result);
      return result;
    }
    add("準備第一次呼叫","將完整區間 [0, "+(values.length-1)+"] 傳給 Search。",0);
    search(0,values.length-1);
    return {steps,pseudo,mount:visual=>{
      visual.innerHTML='<div class="alg-rec-array"></div><div class="alg-stack" data-stack></div>';
      const paintArray=arrayBoard(values,"索引從 0 開始")(visual.firstElementChild);
      const frames=visual.querySelector("[data-stack]");
      const depth=Math.max(...steps.map(step=>step.stack.length));
      frames.innerHTML=Array.from({length:depth},(_,i)=>'<div class="alg-frame"><small>第 '+(i+1)+' 層</small><strong></strong></div>').join("");
      return step=>{
        paintArray(step);
        [...frames.children].forEach((frame,index)=>{
          frame.dataset.frame=index===step.stack.length-1?"active":index<step.stack.length?"waiting":"empty";
          frame.lastElementChild.textContent=step.stack[index]??"—";
        });
      };
    }};
  }
};

const maxCount = {
  page:68,concept:"max-count",title:"找最大值：逐筆數比較和指派",
  intro:"更改同樣長度的數列。比較次數固定，最大值的更新次數會跟著輸入順序變化。",
  fields:[option("輸入排列",[["mixed","混合：[4, 8, 3, 10, 1]"],["up","遞增：[1, 3, 4, 8, 10]"],["down","遞減：[10, 8, 4, 3, 1]"]])],
  legend:"琥珀色目前讀取的值，綠色目前最大值。底下同步記錄已執行的操作。",
  trace(preset) {
    const values={mixed:[4,8,3,10,1],up:[1,3,4,8,10],down:[10,8,4,3,1]}[preset];
    const steps=[],pseudo=["m ← A[0]","逐一讀入下一個 v","  比較 v > m","  若 v 較大，m ← v","回傳 m"];
    let maxAt=0, reads=1, comparisons=0, writes=1;
    const add=(title,note,line,active=-1)=>steps.push(diagram(title,note,line,{
      cells:values.map((_,i)=>i===active?"active":i===maxAt?"answer":i<reads?"muted":"candidate"),
      labels:values.map((_,i)=>i===active?"v":i===maxAt?"m":""),
      stats:[["讀取值",reads],["比較",comparisons],["指派 m",writes]]
    }));
    add("初始化 m = "+values[0],"讀取第一項，並將它指派給 m。這兩個動作各計一次。",0);
    for(let i=1;i<values.length;i++){
      const value=values[i], previous=values[maxAt];
      reads++;
      add("讀取 "+value,"先把值存成 v。這個版本重用 v，所以比較與更新時不用再讀同一格。",1,i);
      comparisons++;
      add("檢查 "+value+" > "+previous, value>previous?"條件成立，下一步更新 m。":"條件為假，m 保持原值。",2,i);
      if(value>previous) {
        maxAt=i;
        writes++;
        add("更新 m = "+value,"這是一筆新的 m 指派，已讀取與比較的次數保持原值。",3);
      }
    }
    add("回傳 "+values[maxAt],"五筆資料都比較四次。這次含初始化共指派 m "+writes+" 次。講義的模型另外計索引、迴圈條件等操作。",4);
    return {steps,pseudo,mount:arrayBoard(values)};
  }
};

const operationCurves = [
  {label:"折半搜尋", formula:"⌊log₂ n⌋ + 1", color:"#a9e7c9", count:n=>Math.floor(Math.log2(n))+1},
  {label:"循序搜尋", formula:"n", color:"#a9cee8", count:n=>n},
  {label:"插入排序", formula:"n(n−1) / 2", color:"#ffc797", count:n=>n*(n-1)/2}
];

function drawGrowthChart(visual, maxN, logarithmic) {
  const width=530,height=236,left=55,right=510,top=24,bottom=196;
  const scale=x=>logarithmic?Math.log10(x+1):x;
  const ceiling=logarithmic?Math.pow(10,Math.ceil(scale(maxN*(maxN-1)/2)))-1:maxN*(maxN-1)/2;
  const x=n=>left+(n-1)*(right-left)/(maxN-1);
  const y=count=>bottom-(bottom-top)*(scale(count)/scale(ceiling));
  const line=(x1,y1,x2,y2,kind)=>'<i class="'+kind+'" style="left:'+(x1/width*100)+'%;top:'+(y1/height*100)+
    '%;width:'+(Math.hypot(x2-x1,y2-y1)/width*100)+'%;transform:rotate('+Math.atan2(y2-y1,x2-x1)+'rad)"></i>';
  const horizontal=logarithmic?[0,9,99,999,9999].filter(value=>value<=ceiling):[0,.25,.5,.75,1].map(r=>Math.round(ceiling*r));
  const marks=[1,maxN/4,maxN/2,maxN].map(n=>'<span class="alg-tick" style="left:'+(x(n)/width*100)+'%;top:'+(bottom/height*100)+'%">'+n+'</span>');
  const grid=horizontal.map(mark=>line(left,y(mark),right,y(mark),"alg-gridline")+
    '<span class="alg-ytick" style="top:'+(y(mark)/height*100)+'%">'+mark.toLocaleString("en")+'</span>');
  const curves=operationCurves.map(({color,count})=>{
    let lines="";
    for(let n=2;n<=maxN;n++) lines+=line(x(n-1),y(count(n-1)),x(n),y(count(n)),"alg-curve");
    return '<div style="--curve:'+color+'">'+lines+'<span class="alg-plot-dot"></span></div>';
  });
  visual.innerHTML='<div class="alg-plot">'+grid.join("")+marks.join("")+curves.join("")+
    '<i class="alg-plot-cursor"></i><span class="alg-axis-name">n</span></div>';
  const dots=[...visual.querySelectorAll(".alg-plot-dot")];
  const cursor=visual.querySelector(".alg-plot-cursor");
  return n=>{
    cursor.style.left=(x(n)/width*100)+"%";
    dots.forEach((dot,index)=>{
      dot.style.left=(x(n)/width*100)+"%";
      dot.style.top=(y(operationCurves[index].count(n))/height*100)+"%";
    });
  };
}

const growthLab = {
  page:78,concept:"growth",title:"複雜度曲線：把輸入規模拉大",
  sourceLabel:"對照計數公式",scrubberLabel:"輸入規模 n",
  intro:"拖動 n，看一次搜尋或排序的最壞操作數。兩種搜尋數比較，插入排序數右移，圖上標出各自定義的工作量。",
  fields:[option("縱軸",[["log","對數尺度（便於同時看三條線）"],["linear","線性尺度（直接看差距）"]])],
  legend:"綠色折半搜尋、藍色循序搜尋、橘色插入排序。虛線標出目前的輸入規模。",
  trace(scale){
    const steps=Array.from({length:64},(_,i)=>{
      const n=i+1;
      const change = n===1 ? "折半與循序都比較一次，已只有一項，插入排序不用右移。" :
        "資料規模是 "+n+"。折半每輪排除約一半；循序可能掃全部；反向陣列的插入排序第 k 輪要右移 k 次。";
      return diagram("輸入規模 n = "+n,change,-1,{
        n,stats:operationCurves.map(({label,count})=>[label,count(n)])
      });
    });
    return {steps,pseudo:operationCurves.map(({label,formula})=>label+"： "+formula),
      mount:visual=>{const paint=drawGrowthChart(visual,64,scale==="log");return step=>paint(step.n);}};
  }
};

const soldiers = {
  page:87,concept:"soldier-ferry",title:"渡河迴圈：兩個男孩如何送過一隊士兵？",
  intro:"船只能載兩個男孩或一名士兵。逐步看完一輪，再拖到最後核對總趟數。兩個男孩最後仍一起保有船。",
  fields:[option("士兵人數",[[1,"1 名（先看一輪）"],[3,"3 名"],[25,"25 名（講義原題）"]])],
  legend:"船從一岸移到另一岸一次，算一趟。每輪完成後，兩個男孩與船都回到起岸。",
  trace(totalText) {
    const total=Number(totalText),steps=[];
    const pseudo=["起岸：兩個男孩、待運士兵與船","兩個男孩一起到對岸","男孩甲把船划回起岸","一名士兵單獨划到對岸","男孩乙把船划回起岸","重複到所有士兵過河"];
    let count=0,trips=0;
    const add=(title,note,line,side,a,b)=>steps.push(diagram(title,note,line,{
      side,a,b,count,stats:[["累計趟數",trips],["已過河士兵",count+" / "+total]]
    }));
    add("準備開始第一輪","兩個男孩都在起岸，船也在起岸。這是每一輪開始時要有的狀態。",0,0,0,0);
    for(let round=1;round<=total;round++){
      trips++;add("甲、乙一起過河","船抵達對岸，兩人中的一位會划船回去。",1,1,1,1);
      trips++;add("甲帶船回來","乙留在對岸，等士兵抵達再把船划回。",2,0,0,1);
      trips++;count++;add("第 "+round+" 名士兵過河","士兵單獨到對岸。船現在在對岸，可以交給乙。",3,1,0,1);
      trips++;add("乙帶船回來","兩個男孩與船都回到起岸，可以接著運下一名士兵。",4,0,0,0);
    }
    add("運送完成","每輪 4 趟，共 "+total+" × 4 = "+trips+" 趟。兩個男孩和船都在起岸。",5,0,0,0);
    return {steps,pseudo,mount:visual=>{
      visual.innerHTML='<div class="alg-ferry"><div class="alg-soldier-info"><strong>起岸</strong><span data-count-left></span></div>'+
        '<div class="alg-soldier-info"><strong>對岸</strong><span data-count-right></span></div><div class="alg-river-track">'+
        '<span class="alg-boat">船</span><span class="alg-river-actor">甲</span><span class="alg-river-actor">乙</span></div></div>';
      const boat=visual.querySelector(".alg-boat");
      const [a,b]=visual.querySelectorAll(".alg-river-actor");
      return step=>{
        boat.dataset.side=step.side;
        a.dataset.side=step.a;
        b.dataset.side=step.b;
        visual.querySelector("[data-count-left]").textContent=(total-step.count)+" 名士兵";
        visual.querySelector("[data-count-right]").textContent=step.count+" 名士兵";
      };
    }};
  }
};

function renderPuzzle(puzzle) {
  return '<section class="alg-lab alg-challenge" aria-label="'+esc(puzzle.title)+'">'+starterMarkup(puzzle.concept)+'<div class="alg-layout">'+
    '<div class="alg-playground"><div class="alg-visual" data-puzzle-visual aria-hidden="true"></div>'+
    '<div class="alg-visual-key">'+glossaryCue(puzzle.concept)+'<p class="alg-key">'+esc(puzzle.legend)+'</p></div></div>'+
    '<div class="alg-explain"><div aria-live="polite" aria-atomic="true"><p class="alg-position" data-puzzle-position></p>'+
    '<h3 data-puzzle-title></h3><p data-puzzle-note></p></div></div></div>'+
    '<div class="alg-puzzle-controls" data-puzzle-controls></div><div class="alg-actions alg-puzzle-history">'+
    button("undo","復原一步")+button("reset",puzzle.resetLabel??"重新開始")+button("hint","提示")+
    '</div><p class="alg-hint" data-puzzle-hint role="status" hidden></p></section>';
}

function bindPuzzle(element,puzzle) {
  const root=element.querySelector(".alg-challenge");
  const query=name=>root.querySelector("[data-puzzle-"+name+"]");
  const action=name=>root.querySelector('[data-lab-action="'+name+'"]');
  let state=puzzle.start(), feedback, hint=0;
  const past=[];
  const paintBoard=puzzle.mount(query("visual"));
  const paintControls=puzzle.controls(query("controls"), (command,value)=>{
    const result=puzzle.move(state,command,value);
    if(result.state && result.state!==state) {
      if(result.record!==false) past.push(state);
      state=result.state;
    }
    feedback=result;
    hint=result.outcome==="retry"?Math.max(1,hint):0;
    paint();
  });
  function paint(){
    const status=feedback??puzzle.describe(state);
    query("position").textContent=puzzle.progress(state);
    query("title").textContent=status.title;
    query("note").textContent=status.outcome==="retry"?"可以在原地換個選法再試一次。":status.note;
    root.dataset.outcome=status.outcome??"";
    paintBoard(state,status);
    paintControls(state);
    action("undo").disabled=past.length===0;
    const hintText=query("hint");
    hintText.hidden=hint===0;
    hintText.textContent=hint===1?"提示 1｜"+starterGuides[puzzle.concept][4]:
      hint===2?"提示 2｜"+(status.outcome==="retry"?status.note:puzzle.hint(state)):"";
    action("hint").textContent=hint===0?"提示":hint===1?"看這一步的原因":"收起提示";
    action("hint").setAttribute("aria-expanded",String(hint>0));
  }
  action("undo").addEventListener("click",()=>{
    if(!past.length)return;
    state=past.pop();feedback=undefined;hint=0;paint();
  });
  action("reset").addEventListener("click",()=>{
    state=puzzle.start();past.length=0;feedback=undefined;hint=0;paint();
  });
  action("hint").addEventListener("click",()=>{hint=(hint+1)%3;paint();});
  paint();
}

function choiceButtons(container, label, options, change) {
  container.innerHTML='<fieldset class="alg-choice-group"><legend>'+esc(label)+'</legend><div class="alg-choice-buttons">'+
    options.map(([key,name])=>'<button type="button" class="btn secondary" data-choice="'+esc(key)+'">'+esc(name)+'</button>').join("")+'</div></fieldset>';
  const buttons=[...container.querySelectorAll("[data-choice]")];
  for(const control of buttons) control.addEventListener("click",()=>change(control.dataset.choice));
  return buttons;
}

const treeEdges = [["A","B",null],["A","C",null],["B","C",null],["B","D",null],["B","E",null],
  ["C","D",null],["D","E",null],["D","F",null],["E","F",null]];
const edgeLabel=([a,b])=>a+"–"+b;
const traversal = {
  page:42,concept:"spanning-tree",title:"生成樹：自己選下一條邊",
  intro:"從 A 開始，挑一條能把新頂點接進來的邊。看看選到兩個已連通的點時，原路徑會如何形成環。",
  legend:"綠線已接入，珊瑚色是這次嘗試會形成的環。頂點為綠色表示已可從 A 到達。",
  start:()=>({visited:["A"],chosen:[]}),
  progress:state=>"已連通 "+state.visited.length+" / 6 個頂點",
  describe:state=>state.visited.length===6?{title:"生成樹完成",note:"五條邊連通六個頂點，接入的每條邊都只引入一個新頂點，因此整張樹無環。",outcome:"success"}:
    {title:"找一條通往新頂點的邊",note:"目前可以從 A 到達 "+state.visited.join("、")+"。請選擇一條跨出這個集合的邊。"},
  hint(state){const edge=treeEdges.find(([a,b])=>state.visited.includes(a)!==state.visited.includes(b));
    return edge?"可試 "+edgeLabel(edge)+"。這條邊只有一端已可從 A 到達。":"你已經完成。可以重新開始，試著得到另一棵樹。";},
  controls(container,dispatch) {
    const buttons=choiceButtons(container,"要接哪一條邊？",treeEdges.map((edge,i)=>[i,edgeLabel(edge)]),i=>dispatch("edge",Number(i)));
    return state=>buttons.forEach((control,i)=>{
      control.setAttribute("aria-pressed",String(state.chosen.includes(i)));
      control.disabled=state.chosen.includes(i)||state.visited.length===6;
    });
  },
  move(state,_action,index) {
    if(state.chosen.includes(index)||state.visited.length===6)return this.describe(state);
    const [a,b]=treeEdges[index];
    const insideA=state.visited.includes(a),insideB=state.visited.includes(b);
    if(insideA&&insideB) {
      const cycle=pathInForest(a,b,state.chosen,treeEdges);
      return {title:edgeLabel(treeEdges[index])+" 會形成環",
        note:"兩端早已相通。沿珊瑚色的舊路徑可以從 "+a+" 到 "+b+"，再接這條邊就會繞回來。",outcome:"retry",cycle,edge:index};
    }
    if(!insideA&&!insideB)return {title:"這兩端都還在樹外",note:"目前從 A 走不到 "+a+" 或 "+b+"。先找一條一端在樹內、一端在樹外的邊。",outcome:"retry",edge:index};
    const newPoint=insideA?b:a;
    const next={visited:[...state.visited,newPoint],chosen:[...state.chosen,index]};
    return next.visited.length===6?{...this.describe(next),state:next}:{state:next,title:"接入頂點 "+newPoint,note:"新增一條邊就讓 "+newPoint+" 接上原本的樹。繼續找尚未連通的頂點。",outcome:"success"};
  },
  mount(visual) {
    const paint=graphBoard(vertices,treeEdges)(visual);
    return (state,status)=>paint({visited:state.visited,chosen:state.chosen,
      skipped:status.cycle?[status.edge]:[],edge:status.edge??-1,candidates:[],cycle:status.cycle??[]});
  }
};

const pieces=[1,2,4];
const sumPieces=items=>items.reduce((sum,piece)=>sum+piece,0);
const chain = {
  page:85,concept:"chain-payment",title:"七節金鍊：每天只多付一節",
  intro:"把第三節切開後，可以分出 1、2、4 節三塊。當每天結束，旅館必須剛好累計收到當天的節數。",
  legend:"上方顯示誰持有每塊金鍊。先用按鈕交出或收回片段，分配預覽會跟著變化，再確認當天付款。",
  start:()=>({day:0,held:[],draft:[]}),
  progress:state=>state.day===7?"7 天都已付款":"第 "+(state.day+1)+" 天付款",
  describe:state=>state.day===7?{title:"付完七天的房錢",note:"每天結算時，旅館都有正確的 1～7 節。切開一節就能完成，零刀連第一天的一節都付不出來。",outcome:"success"}:
    {title:"旅館今天應有 "+(state.day+1)+" 節",note:"目前旅館握有 "+sumPieces(state.held)+" 節。可以先拿回小塊，再交出更大的一塊。"},
  hint(state) {
    if(state.day===7)return "1、2、4 正好是三個二進位位權。每個 1～7 都能用不同的子集合組成。";
    const target=state.day+1;
    return "第 "+target+" 天結束時，旅館需要持有 "+pieces.filter(piece=>(target&piece)!==0).join(" ＋ ")+" 節的組合。";
  },
  controls(container,dispatch) {
    container.innerHTML='<div data-pieces></div><div class="alg-puzzle-submit">'+button("pay","確認今天付款",true)+'</div>';
    const buttons=choiceButtons(container.querySelector("[data-pieces]"),"預覽交付或收回",pieces.map(piece=>[piece,piece+" 節"]),piece=>dispatch("piece",Number(piece)));
    const commit=container.querySelector("[data-lab-action=pay]");
    commit.addEventListener("click",()=>dispatch("pay"));
    return state=>{
      buttons.forEach((control,index)=>{
        const selected=state.draft.includes(pieces[index]);
        control.textContent=(selected?"拿回 ":"交出 ")+pieces[index]+" 節";
        control.setAttribute("aria-pressed",String(selected));
        control.disabled=state.day===7;
      });
      commit.disabled=state.day===7;
    };
  },
  move(state,command,piece) {
    if(state.day===7)return this.describe(state);
    if(command==="piece"){
      const draft=state.draft.includes(piece)?state.draft.filter(item=>item!==piece):[...state.draft,piece];
      return {state:{...state,draft},record:false,title:"預覽：旅館將有 "+sumPieces(draft)+" 節",
        note:"第 "+(state.day+1)+" 天結束時應剛好有 "+(state.day+1)+" 節。"};
    }
    const total=sumPieces(state.draft), due=state.day+1;
    if(total!==due)return {title:"這次分配還不能結算",note:"旅館會收到 "+total+" 節，第 "+due+" 天需要剛好 "+due+" 節。先調整片段。",outcome:"retry"};
    const next={day:due,held:[...state.draft],draft:[...state.draft]};
    return {...this.describe(next),state:next,title:due===7?"付完七天的房錢":"第 "+due+" 天已付清，下次付第 "+(due+1)+" 天",outcome:"success"};
  },
  mount(visual) {
    visual.innerHTML='<div class="alg-chain"><div class="alg-chain-labels"><span>旅客保留</span><span>旅館持有</span></div><div class="alg-chain-track">'+pieces.map(piece=>
      '<div class="alg-chain-slot"><div class="alg-chain-piece"><strong>'+piece+' 節</strong><span>'+
      '<i></i>'.repeat(piece)+'</span></div></div>').join("")+'</div><p class="alg-chain-totals"></p></div>';
    const chips=[...visual.querySelectorAll(".alg-chain-piece")];
    return state=>{
      chips.forEach((chip,index)=>chip.dataset.side=state.draft.includes(pieces[index])?"1":"0");
      visual.querySelector(".alg-chain-totals").textContent="旅客 "+(7-sumPieces(state.draft))+" 節　·　旅館 "+sumPieces(state.draft)+" 節";
    };
  }
};

const passengers=["人","狼","羊","菜"];
const boatMoves=[["alone","人獨自過河"],["wolf","帶狼"],["goat","帶羊"],["cabbage","帶菜"]];
const hazard=(bank,human,other)=>human!==bank&&other.every(value=>value===bank);
const river = {
  page:86,concept:"river-puzzle",title:"狼、羊、菜：自己安排過河",
  intro:"一趟只能由人獨自划船，或帶狼、羊、菜其中一個。每次過河後，沒有人看管的一岸也要安全。",
  legend:"船的位置跟著人移動。每次成功渡河，所帶的對象會跟著移到對岸。",
  start:()=>({banks:[0,0,0,0],trips:0}),
  progress:state=>"已渡河 "+state.trips+" 趟",
  describe:state=>state.banks.every(bank=>bank===1)?
    {title:"所有人和物品都安全抵達",note:"每次出發前都檢查人離開的一岸。常見解法用七趟，羊會過去、回來、再過去。",outcome:"success"}:
    {title:state.banks[0]===0?"人和船在起岸":"人和船在對岸",note:[0,1].map(bank=>{
      const items=passengers.filter((_,i)=>state.banks[i]===bank);
      return (bank===0?"起岸：":"對岸：")+(items.join("、")||"空")+'。';
    }).join(" ")},
  hint(state){
    const [person,wolf,goat,cabbage]=state.banks;
    if(state.trips===0)return "第一趟如果帶狼或帶菜，都會留下危險組合。從帶羊試試。";
    if(person===goat&&wolf!==goat&&cabbage!==goat)return "人可以單獨划回去。羊留在另一岸時，身旁沒有狼或菜。";
    return "人離開一岸後，那裡不能同時留下狼和羊，也不能同時留下羊和菜。可先把羊帶回以拆開組合。";
  },
  controls(container,dispatch){
    const controls=choiceButtons(container,"下一趟怎麼渡河？",boatMoves,key=>dispatch("boat",boatMoves.findIndex(([value])=>value===key)));
    return state=>controls.forEach((control,index)=>{
      control.disabled=state.banks.every(bank=>bank===1)||(index!==0&&state.banks[index]!==state.banks[0]);
    });
  },
  move(state,_command,passenger){
    const leaving=state.banks[0];
    if(passenger&&state.banks[passenger]!==leaving)return {title:"要帶的對象在另一岸",note:"只能從目前船泊靠的這一岸上船。",outcome:"retry"};
    const banks=state.banks.map((bank,i)=>i===0||i===passenger?1-leaving:bank);
    const [,wolf,goat,cabbage]=banks;
    if(hazard(leaving,banks[0],[wolf,goat]))return {title:"狼和羊會被單獨留在一起",note:"人離開後，狼會吃羊。先帶羊或改搭其他路線。",outcome:"retry"};
    if(hazard(leaving,banks[0],[goat,cabbage]))return {title:"羊和菜會被單獨留在一起",note:"人離開後，羊會吃菜。先把這兩個拆開。",outcome:"retry"};
    const next={banks,trips:state.trips+1};
    return {...this.describe(next),state:next};
  },
  mount(visual){
    visual.innerHTML='<div class="alg-ferry alg-wolf"><div class="alg-soldier-info"><strong>起岸</strong></div><div class="alg-soldier-info"><strong>對岸</strong></div>'+
      '<div class="alg-river-track"><span class="alg-boat">船</span>'+passengers.map(label=>'<span class="alg-river-actor">'+label+'</span>').join("")+'</div></div>';
    const boat=visual.querySelector(".alg-boat"), characters=[...visual.querySelectorAll(".alg-river-actor")];
    return state=>{
      boat.dataset.side=state.banks[0];
      characters.forEach((element,i)=>element.dataset.side=state.banks[i]);
    };
  }
};

const coinNumbers=Array.from({length:8},(_,i)=>i+1);
const panResult=(placements,counterfeit)=>placements[counterfeit-1];
const coins = {
  page:88,concept:"fake-coin",title:"八枚硬幣：用兩次秤找出假幣",
  intro:"有一枚硬幣比較輕。選硬幣放進等量的兩個秤盤，根據每次結果剔除不可能的候選。",
  legend:"綠色保留為可能的假幣，灰色已由一次以上的秤重排除。硬幣編號可在兩個秤盤之間移動。",
  resetLabel:"換一枚假幣",
  start:()=>({fake:coinNumbers[Math.floor(Math.random()*coinNumbers.length)],items:[...coinNumbers],
    placements:coinNumbers.map(()=>0),tries:0,result:0}),
  progress:state=>"已秤 "+state.tries+" / 2 次 · "+state.items.length+" 枚候選",
  describe(state){
    if(state.items.length===1)return {title:"唯一候選是第 "+state.items[0]+" 枚",note:"這是唯一能解釋所有秤重結果的硬幣。",outcome:"success"};
    if(state.tries===2)return {title:"兩次後還有 "+state.items.length+" 枚候選",note:"這組秤法無法分辨所有可能。可復原第二次秤重，或換一枚假幣重試。",outcome:"retry"};
    return {title:"把硬幣分放在兩盤",note:"只有等量才能直接從哪一邊較輕，推知假幣可能在哪一邊。"};
  },
  hint(state) {
    if(state.tries===0)return "先秤 3 枚對 3 枚。若平衡，剩下盤外的兩枚。若失衡，剩下較輕側的三枚。";
    if(state.items.length<4)return "從候選裡取兩枚，一對一秤。哪邊較輕就是那枚；平衡則排除兩枚。";
    return "一次秤只有三種結果。若還有超過三枚候選，現在的策略無法保證用剩下一秤識別。";
  },
  controls(container,dispatch){
    container.innerHTML='<fieldset class="alg-choice-group"><legend>按下硬幣時要放在哪裡？</legend><div class="alg-pan-select">'+
      '<label><input type="radio" name="coin-pan" value="-1" checked> 左盤</label><label><input type="radio" name="coin-pan" value="1"> 右盤</label>'+
      '<label><input type="radio" name="coin-pan" value="0"> 拿下</label></div></fieldset><div data-coins></div>'+
      '<div class="alg-puzzle-submit">'+button("weigh","開始秤重",true)+'</div>';
    const controls=choiceButtons(container.querySelector("[data-coins]"),"選硬幣",coinNumbers.map(n=>[n,"第 "+n+" 枚"]),n=>
      dispatch("coin",{index:Number(n)-1,pan:Number(container.querySelector('input[name="coin-pan"]:checked').value)}));
    const weigh=container.querySelector("[data-lab-action=weigh]");
    weigh.addEventListener("click",()=>dispatch("weigh"));
    return state=>{
      const done=state.items.length===1||state.tries===2;
      controls.forEach((control,index)=>{
        const pan=state.placements[index];
        control.textContent=(index+1)+" · "+(pan===-1?"左":pan===1?"右":"盤外");
        control.setAttribute("aria-label","第 "+(index+1)+" 枚，"+(pan===-1?"左盤":pan===1?"右盤":"盤外"));
        control.disabled=done;
      });
      weigh.disabled=done;
    };
  },
  move(state,command,value){
    if(state.items.length===1||state.tries===2)return this.describe(state);
    if(command==="coin") {
      const placements=[...state.placements];
      placements[value.index]=value.pan;
      return {...this.describe(state),state:{...state,placements,result:0},record:false};
    }
    const left=state.placements.filter(pan=>pan===-1).length,right=state.placements.filter(pan=>pan===1).length;
    if(!left||left!==right)return {title:"兩個秤盤需要相同數量",note:"左盤 "+left+" 枚，右盤 "+right+" 枚。先調整到至少各一枚，避免只量到數量差。",outcome:"retry"};
    const result=panResult(state.placements,state.fake);
    const next={...state,tries:state.tries+1,result,items:state.items.filter(coin=>panResult(state.placements,coin)===result)};
    const message=result===0?"兩盤平衡，保留原本候選中沒有上秤的硬幣。":
      (result===-1?"左盤較輕":"右盤較輕")+"，只保留該盤裡原本的候選。";
    const status=this.describe(next);
    return {...status,note:message+" "+(next.items.length===1||next.tries===2?status.note:"可以重新配置秤盤再測。"),state:next};
  },
  mount(visual){
    visual.innerHTML='<div class="alg-coins"><div class="alg-balance"><i></i><span class="alg-pan" data-pan="-1"></span><span class="alg-pan" data-pan="1"></span></div>'+
      '<div class="alg-unweighed" data-pan="0"></div><p class="alg-coin-candidates"></p></div>';
    const balance=visual.querySelector(".alg-balance");
    return state=>{
      balance.dataset.result=state.result;
      for(const pan of visual.querySelectorAll("[data-pan]")){
        pan.innerHTML=coinNumbers.filter(n=>state.placements[n-1]===Number(pan.dataset.pan)).map(n=>
          '<span class="alg-coin'+(state.items.includes(n)?' is-candidate':'')+'">'+n+'</span>').join("");
      }
      visual.querySelector(".alg-coin-candidates").textContent="仍可能較輕："+state.items.join("、");
    };
  }
};

const mapWidth=7, mapHeight=5, mapSize=mapWidth*mapHeight;
const mapCells=Array.from({length:mapSize},(_,i)=>i);
const mapLabel=cell=>String.fromCharCode(65+Math.floor(cell/mapWidth))+(cell%mapWidth+1);
const defaultMap=()=>({start:0,target:6,walls:[8,9,12,17,23,25]});

function mapEditor() {
  return {
    render:()=>'<details class="alg-lab-config"><summary>編輯地圖</summary>'+
      '<fieldset class="alg-map-tools"><legend>點格子要做什麼？</legend><label><input type="radio" name="map-edit" value="wall" checked> 加入或移除牆</label>'+
      '<label><input type="radio" name="map-edit" value="start"> 移動起點</label><label><input type="radio" name="map-edit" value="target"> 移動終點</label></fieldset>'+
      '<div class="alg-map-grid alg-map-editor" aria-label="可編輯的地圖">'+mapCells.map(cell=>'<button type="button" data-map-cell="'+cell+'"></button>').join("")+'</div>'+
      '<div class="alg-actions alg-map-reset">'+button("map-reset","恢復範例地圖")+button("map-blocked","試試到不了的地圖")+
      '</div><p class="alg-feedback" data-map-feedback role="status"></p></details>',
    bind(root,publish) {
      const cells=[...root.querySelectorAll("[data-map-cell]")];
      const status=root.querySelector("[data-map-feedback]");
      let state=defaultMap();
      function render(){
        cells.forEach((element,cell)=>{
          const kind=cell===state.start?"start":cell===state.target?"target":state.walls.includes(cell)?"wall":"open";
          const label={start:"起",target:"終",wall:"牆",open:""}[kind];
          element.dataset.mapTile=kind;
          element.textContent=label||mapLabel(cell);
          element.setAttribute("aria-label",mapLabel(cell)+" "+(label||"可通行"));
        });
      }
      function apply(next,message){
        state=next;
        render();
        publish(state);
        status.textContent=message+"，已回到第 1 步。";
      }
      cells.forEach((element,cell)=>element.addEventListener("click",()=>{
        const mode=root.querySelector('input[name="map-edit"]:checked').value;
        if(mode==="wall"){
          if(cell===state.start||cell===state.target){
            status.textContent="起點或終點不能放牆。可先把它移到別格。";
            return;
          }
          const wasWall=state.walls.includes(cell);
          const walls=wasWall?state.walls.filter(point=>point!==cell):[...state.walls,cell];
          apply({...state,walls},mapLabel(cell)+(wasWall?" 已拆牆":" 已加牆"));
          return;
        }
        const other=mode==="start"?"target":"start";
        if(cell===state[other]){
          status.textContent="起點和終點要放在不同格。";
          return;
        }
        apply({...state,[mode]:cell,walls:state.walls.filter(point=>point!==cell)},(mode==="start"?"起點":"終點")+"移到 "+mapLabel(cell));
      }));
      root.querySelector('[data-lab-action="map-reset"]').addEventListener("click",()=>apply(defaultMap(),"已恢復範例"));
      root.querySelector('[data-lab-action="map-blocked"]').addEventListener("click",()=>apply({...defaultMap(),
        walls:Array.from({length:mapHeight},(_,row)=>row*mapWidth+3)},"中間一整欄的牆隔開兩側"));
      render();
    }
  };
}


function mountFrontier(container,breadth) {
  container.innerHTML='<header class="alg-container-heading"><strong>'+(breadth?"queue · 佇列":"stack · 堆疊")+'</strong><span>'+
    (breadth?"先排進去的先拿出來":"最後放進去的先拿出來")+'</span></header><div class="alg-container-model">'+
    '<div class="alg-container-bin"><div class="alg-container-ends"><span>'+(breadth?"隊首 · 取出處":"頂端 · 放入／取出處")+
    '</span>'+(breadth?'<span>隊尾 · 放入處</span>':'')+'</div><ol class="alg-container-cards" aria-label="'+
    (breadth?"從隊首到隊尾":"從堆疊頂端到底部")+'"></ol><p class="alg-container-empty">容器是空的</p>'+
    (breadth?'':'<div class="alg-stack-base">底部</div>')+'</div><div class="alg-container-dock">'+
    '<span data-frontier-dock-label>正在處理</span><span class="alg-dock-card">—</span></div></div>'+
    '<p class="alg-container-update"></p>';
  const cards=container.querySelector("ol");
  const empty=container.querySelector(".alg-container-empty");
  const dock=container.querySelector(".alg-dock-card");
  const dockLabel=container.querySelector("[data-frontier-dock-label]");
  const update=container.querySelector(".alg-container-update");
  const entries=new Map();
  function animateCard(card,frames,delay=0){
    if(typeof card.animate==="function") card.animate(frames,{duration:340,delay,easing:"cubic-bezier(.2,.65,.3,1)",fill:"backwards"});
  }
  return (step,options)=>{
    const motion=options?.animate&&!StudyPreferences.motionReduced();
    const previous=new Map(motion?[...entries].map(([cell,node])=>[cell,node.getBoundingClientRect()]):[]);
    for(const node of [...entries.values(),dock]) node.getAnimations?.().forEach(animation=>animation.cancel());
    const order=breadth?step.work:[...step.work].reverse();
    for(const cell of [...entries.keys()])if(!order.includes(cell))entries.delete(cell);
    const current=breadth?step.work[0]:step.work.at(-1);
    cards.replaceChildren(...order.map(cell=>{
      let card=entries.get(cell);
      if(!card){
        card=document.createElement("li");
        card.textContent=mapLabel(cell);
        entries.set(cell,card);
      }
      card.dataset.frontierCell=cell;
      card.classList.toggle("is-next",cell===current&&!step.done);
      card.setAttribute("aria-label",mapLabel(cell)+(cell===current&&!step.done?"，下一個取出":""));
      return card;
    }));
    empty.hidden=order.length>0;
    dock.textContent=step.active<0?"—":mapLabel(step.active);
    dock.dataset.active=String(step.active>=0);
    dockLabel.textContent=step.done?"最後處理":step.line===1?"剛取出":"正在處理";
    update.textContent=step.done
      ? (order.length?"搜尋已停下。容器裡還有 "+order.length+" 張暫時不用處理的卡。":"搜尋已停下，容器內沒有剩餘卡片。")
      : step.taken!==undefined?"取出 "+mapLabel(step.taken)+"。地圖上標「處理」的就是這一格。"
      : step.added?.length?"剛加入 "+step.added.map(mapLabel).join("、")+"。下一張要取出的是 "+mapLabel(current)+"。"
      : (step.line===0?"先把 "+mapLabel(current)+" 放進容器。"
        :(order.length?"容器裡還有 "+order.length+" 張待處理的卡。":"容器目前是空的。"));
    if(!motion)return;
    let inserted=0;
    for(const [cell,card] of entries){
      const now=card.getBoundingClientRect();
      const then=previous.get(cell);
      if(then){
        const x=then.left-now.left,y=then.top-now.top;
        if(Math.abs(x)+Math.abs(y)>1)animateCard(card,[{transform:"translate("+x+"px,"+y+"px)"},{transform:"none"}]);
      }else{
        animateCard(card,[{transform:breadth?"translateX(18px)":"translateY(-14px)",opacity:0},
          {transform:"none",opacity:1}],Math.min(inserted++*52,156));
      }
    }
    if(previous.has(step.taken)&&!entries.has(step.taken)){
      const from=previous.get(step.taken),to=dock.getBoundingClientRect();
      animateCard(dock,[{transform:"translate("+(from.left-to.left)+"px,"+(from.top-to.top)+"px)"},{transform:"none"}]);
    }
  };
}

function gridWalk(map, method) {
  const breadth=method==="bfs";
  const steps=[], work=[map.start], parent=new Map([[map.start,null]]), visited=new Set(), walls=new Set(map.walls);
  const structure=breadth?"佇列":"堆疊";
  const add=(title,note,line,active=-1,path=[],movement={})=>steps.push(diagram(title,note,line,{
    active,path,work:[...work],visited:[...visited],done:line>=4,...movement,
    stats:[["已取出",visited.size],[structure+"待處理",work.length],
      ["下一格",line<4&&work.length?mapLabel(breadth?work[0]:work.at(-1)):"—"],["路線步數",path.length?path.length-1:"—"]]
  }));
  const route=[];
  add("從 "+mapLabel(map.start)+" 開始","把起點放進"+structure+"，先記成已發現，以後就不會重複加入。",0);
  while(work.length){
    const cell=breadth?work.shift():work.pop();
    visited.add(cell);
    add("取出 "+mapLabel(cell),breadth?"從隊首拿出這張卡。":"從堆疊頂端拿出最後放入的卡。",1,cell,[],{taken:cell});
    if(cell===map.target){
      add("抵達終點 "+mapLabel(cell),"到這格後停止擴展，準備沿著它的父節點往回找。",2,cell);
      for(let point=cell;point!==null;point=parent.get(point))route.unshift(point);
      add("沿父節點回推出路線",route.map(mapLabel).join(" → ")+"，共 "+(route.length-1)+" 步。",4,cell,route);
      break;
    }
    const row=Math.floor(cell/mapWidth),col=cell%mapWidth;
    const next=[];
    for(const [dy,dx] of [[0,1],[0,-1],[1,0],[-1,0]]){
      const y=row+dy,x=col+dx,n=y*mapWidth+x;
      if(y<0||y>=mapHeight||x<0||x>=mapWidth||walls.has(n)||parent.has(n))continue;
      parent.set(n,cell);
      work.push(n);
      next.push(n);
    }
    add(next.length?"加入 "+next.map(mapLabel).join("、"):"這格沒有新的鄰格",
      next.length?"每個新格都會記住 "+mapLabel(cell)+" 是它的父節點。右、左、下、上是本實驗檢查鄰格的順序。":
        "邊界、牆和已發現的格子都跳過，接著看"+structure+"裡還有沒有其他格。",3,cell,[],{added:next});
  }
  if(!route.length)add("終點無法抵達",structure+"空了。起點能走到的格子都已看過，沒有走到終點。",5);
  return {steps,distance:route.length?route.length-1:null};
}

const gridTraversal = {
  page:42,concept:"grid-traversal",title:"網格 BFS／DFS：同一張地圖怎麼走？",
  visualAccessible:true,
  intro:"同一張地圖可在 BFS 和 DFS 間切換。試著放牆或移起點，再比較待處理格子的順序，以及最後找到的路線。",
  fields:[option("走訪方式",[["bfs","BFS：佇列（先進先出）"],["dfs","DFS：堆疊（後進先出）"]])],
  setup:mapEditor(),
  legend:"地圖標有「待處理」、「處理」和「路線」，每張卡的座標都能在圖上找到。上方可以編輯地圖。",
  trace(method, custom) {
    const map=custom??defaultMap();
    const breadth=method==="bfs";
    const {steps,distance}=gridWalk(map,method);
    const other=gridWalk(map,breadth?"dfs":"bfs").distance;
    if(distance!==null)steps.at(-1).note+=" 同一張圖，BFS 走 "+(breadth?distance:other)+" 步，DFS 走 "+(breadth?other:distance)+" 步。"+
      (distance===other?"這次兩者走到一樣長的路。BFS 能保證無權重網格的最短路。":"DFS 先沿其中一條路走，找到的不一定最短。");
    const pseudo=["起點標為已發現並加入"+(breadth?" queue":" stack"),"從"+(breadth?"隊首":"堆疊頂端")+"取出一格",
      "若已到終點，用 parent 回推","按右、左、下、上檢查新鄰格，記 parent 後加入","回傳起點到終點的路線","資料結構已空，回報失敗"];
    return {steps,pseudo,mount:visual=>{
      visual.innerHTML='<div class="alg-map-grid alg-map-trace" aria-hidden="true">'+mapCells.map(cell=>
        '<span data-map-point="'+cell+'"><strong></strong><small></small></span>').join("")+
        '</div><section class="alg-frontier alg-'+(breadth?"queue":"stack")+'-model" aria-label="'+(breadth?"佇列":"堆疊")+'"></section>';
      const cells=[...visual.querySelectorAll("[data-map-point]")];
      const frontier=mountFrontier(visual.querySelector(".alg-frontier"),breadth);
      const markers={wall:"牆",path:"路線",active:"處理",waiting:"待處理",visited:"已走訪"};
      return (step,options)=>{
        cells.forEach((element,cell)=>{
          const endpoint=cell===map.start?"起點":cell===map.target?"終點":"";
          const phase=map.walls.includes(cell)?"wall":step.path.includes(cell)?"path":cell===step.active?"active":
            step.work.includes(cell)?"waiting":step.visited.includes(cell)?"visited":endpoint?"home":"open";
          element.dataset.mapTile=phase;
          element.firstElementChild.textContent=mapLabel(cell);
          element.lastElementChild.textContent=phase==="active"?markers.active:endpoint||markers[phase]||"";
        });
        frontier(step,options);
      };
    }};
  }
};

const rangeValues=[3,-2,4,1,6];
const rangePrefixes=rangeValues.reduce((sums,value)=>[...sums,sums.at(-1)+value],[0]);
const rangePositions=rangeValues.map((_,index)=>index+1);

const prefixQuery = {
  page:61,concept:"prefix-query",title:"前綴和：圈選區間 [l,r]",
  intro:"點兩個位置選區間，先點哪一端都可以。上下兩排會對照原陣列與 p[i]，算出含左右兩端的總和。",
  legend:"橘色是圈選的區間。前綴和上，藍色要扣掉，綠色是保留到右端的前綴。",
  start:()=>({selection:[]}),
  progress:state=>state.selection.length===2?"區間已選好":state.selection.length?"再選另一端":"先選一端",
  describe({selection}){
    if(selection.length<2)return {title:selection.length?"已選位置 "+selection[0]:"從任一端開始",
      note:selection.length?"再點另一個位置。再點同一格會查單一元素。":"前綴 p[i] 已存好第 1 到第 i 項的和。下方可選任何包含端點的區間。"};
    const [l,r]=selection;
    return {title:"["+l+","+r+"] 的總和是 "+(rangePrefixes[r]-rangePrefixes[l-1]),
      note:"p["+r+"] − p["+(l-1)+"] = "+rangePrefixes[r]+" − ("+rangePrefixes[l-1]+") = "+(rangePrefixes[r]-rangePrefixes[l-1])+
        "。扣掉左端以前的值後，只剩 "+rangeValues.slice(l-1,r).join("、")+"。",outcome:"success"};
  },
  hint:()=> "p[0] 是 0。左端 l 也算在答案內，所以要扣 p[l−1]。查 [2,4] 時試看看 p[4]−p[1]。",
  controls(container,dispatch){
    const buttons=choiceButtons(container,"選區間端點",rangePositions.map(i=>[i,i+" · "+rangeValues[i-1]]),
      i=>dispatch("endpoint",Number(i)));
    return state=>buttons.forEach((element,index)=>{
      element.setAttribute("aria-pressed",String(state.selection.includes(index+1)));
    });
  },
  move(state,_command,index){
    const selection=state.selection.length===1?[state.selection[0],index].sort((a,b)=>a-b):[index];
    const next={selection};
    return {...this.describe(next),state:next};
  },
  mount(visual){
    visual.innerHTML='<div class="alg-value-row"><strong>原陣列 A</strong><div data-range-input></div></div>'+
      '<div class="alg-value-row"><strong>前綴和 p</strong><div data-range-prefixes></div></div>';
    const paintValues=rowOfValues(visual.querySelector("[data-range-input]"),rangeValues,1);
    const paintPrefixes=rowOfValues(visual.querySelector("[data-range-prefixes]"),rangePrefixes,0);
    return ({selection})=>{
      const [l,r]=selection;
      paintValues(rangePositions.map(i=>selection.length===1&&i===l||r!==undefined&&l<=i&&i<=r?"active":""));
      paintPrefixes(rangePrefixes.map((_,i)=>r===undefined?"":i===l-1?"subtract":i===r?"result":""));
    };
  }
};

function rowOfValues(container,values,first){
  container.className="alg-value-cells";
  container.innerHTML=values.map((value,index)=>'<div class="alg-value-tile"><small>'+(index+first)+
    '</small><strong>'+esc(String(value))+'</strong></div>').join("");
  const cells=[...container.children];
  return (states,newValues=values)=>cells.forEach((element,i)=>{
    element.dataset.valueState=states[i]??"";
    element.lastElementChild.textContent=newValues[i];
  });
}

const initialDifference=()=>[...rangeValues.map((item,index)=>item-(rangeValues[index-1]??0)),0];
const differenceArray = {
  page:61,concept:"difference-updates",title:"差分陣列：多次區間加值",
  intro:"同時更動整段時，只要寫兩格差分。試著疊加兩筆更新，再切換到重建的陣列核對結果。",
  legend:"橘色是最近寫入的起點，藍色是抵銷的位置；切到重建陣列時，綠色標出上次的更新範圍。",
  start:()=>({values:initialDifference(),mode:"difference",updates:0,last:null}),
  progress:state=>"已套用 "+state.updates+" 筆更新",
  describe(state){
    if(!state.last)return state.mode==="difference"
      ? {title:"原陣列的差分已建好",note:"原陣列從 1 編號。第 6 格是預留給 r+1 的哨兵。新增更新後，可以切換看前綴累加的結果。"}
      : {title:"還原出原陣列",note:"目前沒有更新，差分累加後等於原始輸入 ["+rangeValues.join(", ")+"]。"};
    const {l,r,k}=state.last;
    return state.mode==="difference"?{title:"只寫到 d["+l+"] 和 d["+(r+1)+"]",
      note:"區間 ["+l+","+r+"] 加 "+k+"。d["+l+"] 加 "+k+"，d["+(r+1)+"] 減 "+k+"。兩格之間的累加值才會受到這次更新影響。",outcome:"success"}:
      {title:"從左到右累加差分",note:"目前陣列是 ["+state.values.slice(0,rangeValues.length).reduce((items,value)=>
        [...items,(items.at(-1)??0)+value],[]).join(", ")+"]。第 6 格只控制邊界，不輸出。",outcome:"success"};
  },
  hint:()=> "試著先把 [2,4] 加 3，再把 [4,5] 加 −2。索引 4 會同時收到兩筆更新。",
  controls(container,dispatch){
    const options=rangePositions.map(i=>'<option>'+i+'</option>').join("");
    container.innerHTML='<form class="alg-update-form"><div class="alg-fields">'+
      '<label class="alg-choice">左端 l<select class="field" name="l">'+options+'</select></label>'+
      '<label class="alg-choice">右端 r<select class="field" name="r">'+options+'</select></label>'+
      '<label class="alg-choice">加值 k<input class="field" name="k" type="number" min="-99" max="99" step="1" value="3" required></label></div>'+
      '<button class="btn" type="submit">套用區間加值</button></form><div data-diff-views></div>';
    const view=choiceButtons(container.querySelector("[data-diff-views]"),"要看哪一組值？",
      [["difference","差分 d"],["array","重建的陣列 A"]],value=>dispatch("view",value));
    const form=container.querySelector("form");
    form.elements.l.value="2";
    form.elements.r.value="4";
    form.addEventListener("submit",event=>{
      event.preventDefault();
      const data=new FormData(form);
      dispatch("update",{l:Number(data.get("l")),r:Number(data.get("r")),k:Number(data.get("k"))});
    });
    return state=>view.forEach(element=>element.setAttribute("aria-pressed",String(element.dataset.choice===state.mode)));
  },
  move(state,command,detail){
    if(command==="view"){
      const next={...state,mode:detail};
      return {...this.describe(next),state:next,record:false};
    }
    const {l,r,k}=detail;
    if(l>r)return {title:"左端要小於或等於右端",note:"請確認 l ≤ r。範例 [2,4] 包含索引 2、3、4。",outcome:"retry"};
    const values=[...state.values];
    values[l-1]+=k;
    values[r]-=k;
    const next={values,mode:state.mode,updates:state.updates+1,last:detail};
    return {...this.describe(next),state:next};
  },
  mount(visual){
    visual.innerHTML='<div class="alg-value-row" data-diff-row><strong>差分 d</strong><div data-diff-values></div></div>'+
      '<div class="alg-value-row" data-array-row hidden><strong>重建的 A</strong><div data-array-values></div></div>';
    const paintDifference=rowOfValues(visual.querySelector("[data-diff-values]"),initialDifference(),1);
    const paintArray=rowOfValues(visual.querySelector("[data-array-values]"),rangeValues,1);
    return ({values,mode,last})=>{
      visual.querySelector("[data-diff-row]").hidden=mode!=="difference";
      visual.querySelector("[data-array-row]").hidden=mode!=="array";
      paintDifference(values.map((_,i)=>i+1===last?.l?"active":i===last?.r?"subtract":""),values);
      const rebuilt=values.slice(0,rangeValues.length).reduce((items,value)=>[...items,(items.at(-1)??0)+value],[]);
      paintArray(rangePositions.map(i=>last&&last.l<=i&&i<=last.r?"result":""),rebuilt);
    };
  }
};

const twoPointers = {
  page:64,concept:"two-pointers",title:"雙指標：在有序陣列找兩數和",
  intro:"先從兩端比總和。每次移動只排除一端，文字和陣列會一起顯示哪些位置已不可能成為答案。",
  fields:[option("範例",[["nine","找 9：[−3,1,4,5,7,11]"],["ties","找 6：[1,3,3,7]"],["miss","找 10：[2,3,4,9]"]])],
  legend:"L 是左指標，R 是右指標。深色位置已排除，綠色是找到的一對。",
  trace(preset){
    const {values,target}={nine:{values:[-3,1,4,5,7,11],target:9},ties:{values:[1,3,3,7],target:6},
      miss:{values:[2,3,4,9],target:10}}[preset];
    const steps=[];
    const pseudo=["L ← 0, R ← n − 1","while L < R: s ← A[L] + A[R]","  if s = target: return (L,R)",
      "  if s < target: L ← L + 1","  else: R ← R − 1","return −1"];
    let low=0,high=values.length-1,comparisons=0;
    const add=(title,note,line,{total="—",match=false,cue}={})=>steps.push(diagram(title,note,line,{
      cells:values.map((_,i)=>i===low||i===high?(match?"answer":"active"):low<i&&i<high?"candidate":"muted"),
      labels:values.map((_,i)=>{
        if(i<low||i>high)return "排除";
        if(i===low&&i===high)return "L · R";
        if(i===low)return match?"✓ 找到":"L";
        if(i===high)return match?"✓ 找到":"R";
        return "";
      }),
      cue:cue??"L · "+elementPosition(low)+"　R · "+elementPosition(high),
      stats:[["目標",target],["兩端和",total],["配對比較",comparisons]]
    }));
    add("從有序陣列的兩端開始","左端最小，右端最大。每步要用兩個不同位置，所以只在 L < R 時比較。",0);
    while(low<high){
      const a=values[low],b=values[high],sum=a+b;
      comparisons++;
      add("比較 "+a+" + "+b+" = "+sum,"目標是 "+target+"。有序性讓我們只需要移動其中一個端點。",1,{total:sum});
      if(sum===target){
        add("找到一組合計為 "+target+" 的值","索引 "+low+" 和 "+high+" 不同。在競程模板的輸出格式，它們是第 "+(low+1)+" 和 "+(high+1)+" 項。",2,{total:sum,match:true});
        return {steps,pseudo,mount:arrayBoard(values,"從兩端開始")};
      }
      if(sum<target){
        low++;
        add("排除原本的左端 "+a,"即使拿目前最大的 "+b+" 配 "+a+"，加總仍太小。原左端和範圍內其他位置配對只會更小或一樣。",3,{cue:"總和太小，左指標 L 向右移。"});
      }else{
        high--;
        add("排除原本的右端 "+b,"即使拿目前最小的 "+a+" 配 "+b+"，加總仍太大。原右端和範圍內其他位置配對只會更大或一樣。",4,{cue:"總和太大，右指標 R 向左移。"});
      }
    }
    add("兩個指標已相遇","只剩同一個位置，沒有兩個不同的位置可配對，回傳 −1。",5,{cue:"兩個指標在同一格，搜尋結束。"});
    return {steps,pseudo,mount:arrayBoard(values,"從兩端開始")};
  }
};

const labs = [sequential,loops,insertion,recursiveBinary,binary,gridTraversal,mst,maze,prefix,twoPointers,maxCount,fibonacci,growthLab,soldiers,invariant];
const puzzles = [traversal,prefixQuery,differenceArray,chain,river,coins];
const activity = ({page,concept,title,intro},scene)=>({page,concept,title,intro,scene});
StudyActivities.register("lecture-06",[
  ...labs.map(lab=>activity(lab,{render:()=>renderLab(lab),bind:element=>bindLab(element,lab)})),
  ...puzzles.map(puzzle=>activity(puzzle,{render:()=>renderPuzzle(puzzle),bind:element=>bindPuzzle(element,puzzle)}))
]);

const templateGroups = [
  {
    title:"基本寫法與搜尋",
    examples:[
      {file:"contest-io",label:"基本 I/O 與多筆測資",summary:"GNU++17 · solve() · fast I/O",
        description:"第一行是測資筆數 t，每組輸入兩個整數並輸出總和。題目只有一筆時，直接呼叫 solve()。",
        input:"3\n1 2\n-1 7\n0 0",output:"3\n6\n0"},
      {...binary.code,label:"二元搜尋與 lower_bound",summary:"O(log n) 每次查詢 · 已排序 · 第一個匹配",demo:["recursion",37,"binary-search"]},
      {...insertion.code,label:"插入排序",summary:"最壞 O(n²) · 原地 · 穩定",demo:["iteration",31,"insertion-sort"]}
    ]
  },
  {
    title:"陣列查詢與區間",
    examples:[
      {file:"prefix-sum",label:"前綴和",summary:"O(n + q) · 區間查詢 · 1-based",demo:["analysis",61,"prefix-query"],
        description:"先讀 n、查詢數 q 及 n 個數字。每筆 l、r 查詢包含左右端點的總和。先算 p[0..n]，每次查詢 O(1)。",
        input:"5 3\n3 -2 4 1 6\n1 1\n2 4\n1 5",output:"3\n3\n12"},
      {file:"difference-array",label:"差分陣列",summary:"O(n + q) · 多次區間加值 · 最後輸出",demo:["analysis",61,"difference-updates"],
        description:"先讀 n、更新數 q 和 n 個初值。每筆 l、r、k 對 [l,r] 加 k，所有更新完成後還原陣列。最後一格也可更新，d[r+1] 有預留空間。",
        input:"5 2\n3 -2 4 1 6\n2 4 3\n4 5 -2",output:"3 1 7 2 4"},
      {file:"two-pointers",label:"雙指標找目標和",summary:"O(n) · 升冪陣列 · 兩個不同位置",demo:["analysis",64,"two-pointers"],
        description:"讀 n、目標和 x 和 n 個已排序的數。輸出兩個不同的 1-based 索引，找不到就輸出 -1。數值的絕對值至多 10⁹。",
        input:"6 9\n-3 1 4 5 7 11",output:"3 4"}
    ]
  },
  {
    title:"走訪、樹與連通性",
    examples:[
      {file:"grid-bfs",label:"網格 BFS",summary:"O(nm) · 無權重最短路 · queue",demo:["graphs",42,"grid-traversal"],
        description:"第一列是 n、m，接著 n 列地圖。S 為起點、T 為終點、# 為牆、. 可通行，只能上下左右移動。輸出最短步數或 -1。",
        input:"3 4\nS.#.\n..#T\n....",output:"6"},
      {file:"tree-subtree",label:"迭代 DFS 與子樹大小",summary:"O(n) · 以 1 為根 · stack",demo:["graphs",42,"grid-traversal"],
        description:"讀入 n 和一棵樹的 n−1 條無向邊。先記走訪順序與父節點，再倒序把每棵子樹的大小加到父節點。",
        input:"5\n1 2\n1 3\n3 4\n3 5",output:"5 1 3 1 1"},
      {...mst.code,label:"並查集 DSU 與 Kruskal",summary:"O(E log E) · 無向帶權圖 · 最小生成樹",demo:["graphs",45,"mst"]}
    ]
  },
  {
    title:"競程延伸",
    examples:[
      {file:"binary-power",label:"二進位快速冪",summary:"O(log b) · 指數 b ≥ 0 · 取模",
        description:"輸入底數 a 和非負指數 b，輸出 a^b 除以 1,000,000,007 的餘數。底數可為負，先正規化再做平方和乘法。",
        input:"-2 5",output:"999999975"}
    ]
  }
];

function templateMarkup() {
  return '<div class="alg-template-list">'+templateGroups.map(group=>
    '<section class="alg-template-group"><h2>'+esc(group.title)+'</h2>'+
    group.examples.map(example=>'<details class="alg-template-card" data-template="'+example.file+'"><summary><span><strong>'+
      esc(example.label)+'</strong><small>'+esc(example.summary)+'</small></span><span aria-hidden="true">⌄</span></summary><div data-template-code></div></details>').join("")+
    '</section>').join("")+'</div>';
}

function bindTemplates(main) {
  const templates=templateGroups.flatMap(group=>group.examples);
  for(const card of main.querySelectorAll("[data-template]")){
    const example=templates.find(item=>item.file===card.dataset.template);
    let request;
    card.addEventListener("toggle",()=>{
      if(!card.open || request)return;
      const panel=card.querySelector("[data-template-code]");
      request=loadCode(panel,example).catch(()=>{
        request=undefined;
        panel.querySelector('[role="status"]').textContent="暫時載入失敗。可以下載 .cpp，或重新展開重試。";
      });
    });
  }
}

return {render:templateMarkup,bind:bindTemplates};
})();
