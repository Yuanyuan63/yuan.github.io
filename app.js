(() => {
  const dims = Array.isArray(window.FIN5_DIMENSIONS) ? window.FIN5_DIMENSIONS : null;
  const questions = Array.isArray(window.FIN5_QUESTIONS) ? window.FIN5_QUESTIONS : null;
  const careers = Array.isArray(window.FINANCE_CAREERS) ? window.FINANCE_CAREERS : null;

  if (!dims || !questions || !careers) {
    // eslint-disable-next-line no-alert
    alert("数据加载失败：请确认 data.js 与 app.js 在同一目录，并且未被浏览器拦截。");
    return;
  }

  const $ = (id) => /** @type {HTMLElement} */ (document.getElementById(id));

  const els = {
    screenIntro: $("screen-intro"),
    screenQuiz: $("screen-quiz"),
    screenResult: $("screen-result"),

    startBtn: $("startBtn"),
    previewBtn: $("previewBtn"),
    backToIntroBtn: $("backToIntroBtn"),
    prevBtn: $("prevBtn"),
    nextBtn: $("nextBtn"),

    qNum: $("qNum"),
    qDim: $("qDim"),
    qLeft: $("qLeft"),
    qRight: $("qRight"),
    qScale: $("qScale"),

    progressFill: $("progressFill"),
    progressText: $("progressText"),

    typeText: $("typeText"),
    dimBars: $("dimBars"),
    topMatches: $("topMatches"),
    moreMatches: $("moreMatches"),
    copyBtn: $("copyBtn"),
    restartBtn: $("restartBtn"),

    dimensionLegend: $("dimensionLegend"),

    previewDialog: /** @type {HTMLDialogElement|null} */ (document.getElementById("previewDialog")),
    previewList: $("previewList"),
  };

  const STORAGE_KEY = "fin5.answers.v1";

  /** @type {Array<number|null>} */
  let answers = Array.from({ length: questions.length }, () => null);
  let currentIndex = 0;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  function showScreen(screenId) {
    for (const el of [els.screenIntro, els.screenQuiz, els.screenResult]) {
      el.classList.remove("screen-active");
    }
    $(screenId).classList.add("screen-active");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function findFirstUnansweredIndex() {
    for (let i = 0; i < answers.length; i += 1) {
      if (answers[i] == null) return i;
    }
    return -1;
  }

  function answeredCount() {
    let count = 0;
    for (const a of answers) if (typeof a === "number") count += 1;
    return count;
  }

  function updateProgress() {
    const done = answeredCount();
    const total = questions.length;
    const pct = total === 0 ? 0 : (done / total) * 100;
    els.progressFill.style.width = `${pct}%`;
    els.progressText.textContent = `${done} / ${total}`;
  }

  function safeJsonParse(text) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  function saveState() {
    try {
      const payload = { answers, currentIndex, ts: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const payload = safeJsonParse(raw);
      if (!payload || !Array.isArray(payload.answers)) return;
      if (payload.answers.length !== questions.length) return;

      answers = payload.answers.map((v) => (typeof v === "number" ? clamp(v, -2, 2) : null));
      if (typeof payload.currentIndex === "number") {
        currentIndex = clamp(payload.currentIndex, 0, questions.length - 1);
      }

      const firstUnanswered = findFirstUnansweredIndex();
      if (firstUnanswered >= 0) currentIndex = firstUnanswered;
    } catch {
      // ignore
    }
  }

  function renderLegend() {
    els.dimensionLegend.innerHTML = "";

    for (const dim of dims) {
      const row = document.createElement("div");
      row.className = "dim-row";

      const key = document.createElement("div");
      key.className = "dim-key";
      key.textContent = `${dim.left.letter}–${dim.right.letter}（${dim.title}）`;

      const value = document.createElement("div");
      value.innerHTML = `
        <div>${dim.left.letter}：${dim.left.name}（${dim.left.summary}）</div>
        <div>${dim.right.letter}：${dim.right.name}（${dim.right.summary}）</div>
      `;

      row.append(key, value);
      els.dimensionLegend.append(row);
    }
  }

  function scaleOptions() {
    return [
      { value: -2, label: "强偏左" },
      { value: -1, label: "偏左" },
      { value: 0, label: "中立" },
      { value: 1, label: "偏右" },
      { value: 2, label: "强偏右" },
    ];
  }

  function renderScale(questionId, selectedValue) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "scale";
    fieldset.setAttribute("aria-label", "选择偏好程度");

    const name = `scale_${questionId}`;

    for (const opt of scaleOptions()) {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = String(opt.value);
      input.checked = selectedValue === opt.value;
      input.id = `${name}_${String(opt.value)}`;

      input.addEventListener("change", () => {
        answers[currentIndex] = opt.value;
        saveState();
        updateProgress();
        renderQuestion();
      });

      const label = document.createElement("label");
      label.htmlFor = input.id;

      const text = document.createElement("span");
      text.className = "scale-text";
      text.textContent = opt.label;

      label.append(text);
      fieldset.append(input, label);
    }

    return fieldset;
  }

  function renderQuestion() {
    const q = questions[currentIndex];
    const dim = dims.find((d) => d.id === q.dim);

    els.qNum.textContent = `第 ${currentIndex + 1} 题 / ${questions.length}`;
    els.qDim.textContent = dim ? `${dim.title} · ${dim.left.letter} ↔ ${dim.right.letter}` : "";
    els.qLeft.textContent = q.left;
    els.qRight.textContent = q.right;

    els.qScale.innerHTML = "";
    els.qScale.append(renderScale(q.id, answers[currentIndex]));

    els.prevBtn.disabled = currentIndex <= 0;

    const hasAnswer = typeof answers[currentIndex] === "number";
    const isLast = currentIndex >= questions.length - 1;
    els.nextBtn.disabled = !hasAnswer;
    els.nextBtn.textContent = isLast ? "查看结果" : "下一题";

    updateProgress();
  }

  function goPrev() {
    if (currentIndex <= 0) return;
    currentIndex -= 1;
    saveState();
    renderQuestion();
  }

  function goNext() {
    if (typeof answers[currentIndex] !== "number") return;

    if (currentIndex >= questions.length - 1) {
      showResults();
      return;
    }

    currentIndex += 1;
    saveState();
    renderQuestion();
  }

  function computeUserVector() {
    /** @type {Record<string, number>} */
    const sums = {};
    /** @type {Record<string, number>} */
    const counts = {};

    for (const dim of dims) {
      sums[dim.id] = 0;
      counts[dim.id] = 0;
    }

    for (let i = 0; i < questions.length; i += 1) {
      const q = questions[i];
      const v = answers[i];
      if (typeof v !== "number") continue;
      sums[q.dim] += v;
      counts[q.dim] += 1;
    }

    /** @type {Record<string, number>} */
    const vector = {};
    for (const dim of dims) {
      const maxAbs = 2 * counts[dim.id];
      vector[dim.id] = maxAbs === 0 ? 0 : clamp(sums[dim.id] / maxAbs, -1, 1);
    }
    return vector;
  }

  function computeType(vector) {
    const letters = [];
    for (const dim of dims) {
      const v = vector[dim.id];
      letters.push(v <= 0 ? dim.left.letter : dim.right.letter);
    }
    return letters.join("");
  }

  function scoreCareer(userVector, career) {
    let weightSum = 0;
    let distance = 0;

    for (const dim of dims) {
      const w = typeof dim.weight === "number" ? dim.weight : 1;
      const u = typeof userVector[dim.id] === "number" ? userVector[dim.id] : 0;
      const t = typeof career.vector[dim.id] === "number" ? career.vector[dim.id] : 0;
      weightSum += w;
      distance += w * Math.abs(u - t);
    }

    const similarity = 1 - distance / (weightSum * 2);
    return {
      score: Math.round(clamp(similarity, 0, 1) * 100),
      similarity,
    };
  }

  function dimSidePhrase(dimId, score) {
    if (dimId === "pace") return score <= 0 ? "快节奏与短反馈" : "长周期深度打磨";
    if (dimId === "client") return score <= 0 ? "对外沟通与推动决策" : "对内分析与高质量产出";
    if (dimId === "risk") return score <= 0 ? "接受不确定性换收益" : "重视稳定与可控风险";
    if (dimId === "craft") return score <= 0 ? "偏数理/数据/代码" : "偏商业表达与谈判叙事";
    if (dimId === "order") return score <= 0 ? "偏规则流程与治理" : "偏创新开拓与探索";
    return score <= 0 ? "偏左" : "偏右";
  }

  function buildWhyChips(userVector, career) {
    /** @type {Array<{id:string,score:number,label:string}>} */
    const ranked = [];

    for (const dim of dims) {
      const u = userVector[dim.id];
      const t = career.vector[dim.id];
      const alignment = 1 - Math.abs(u - t) / 2; // 0..1
      const strength = Math.abs(u); // 0..1
      const blended = alignment * 0.72 + strength * 0.28;
      ranked.push({ id: dim.id, score: blended, label: dimSidePhrase(dim.id, u) });
    }

    ranked.sort((a, b) => b.score - a.score);

    const chips = [];
    for (const item of ranked) {
      const u = userVector[item.id];
      const t = career.vector[item.id];
      const aligned = Math.abs(u - t) <= 0.65;
      const strongEnough = Math.abs(u) >= 0.28;
      if (aligned && strongEnough) chips.push(item.label);
      if (chips.length >= 3) break;
    }

    if (chips.length === 0) {
      chips.push("偏好较均衡");
    }
    return chips;
  }

  function computeMatches(userVector) {
    const matches = careers.map((career) => {
      const scored = scoreCareer(userVector, career);
      return {
        ...career,
        score: scored.score,
        why: buildWhyChips(userVector, career),
      };
    });

    matches.sort((a, b) => b.score - a.score);
    return matches;
  }

  function renderDimBars(userVector) {
    els.dimBars.innerHTML = "";

    for (const dim of dims) {
      const v = clamp(userVector[dim.id], -1, 1);
      // 仅用于视觉呈现：让偏离中线的幅度稍微更“明显”
      const curve = 0.85; // < 1 会放大中间区间的偏离；不影响实际分数与复制文本
      const visual = Math.sign(v) * Math.pow(Math.abs(v), curve);
      const pct = ((visual + 1) / 2) * 100;

      const wrap = document.createElement("div");
      wrap.className = "dim";

      const title = document.createElement("div");
      title.className = "dim-title";
      title.innerHTML = `<span>${dim.title} ${dim.left.letter}–${dim.right.letter}</span><span>${Math.round(
        v * 100,
      )}</span>`;

      const bar = document.createElement("div");
      bar.className = "dim-bar";

      const marker = document.createElement("div");
      marker.className = "dim-marker";
      marker.style.left = `${pct}%`;
      marker.title = `${dimSidePhrase(dim.id, v)}（${Math.round(v * 100)}）`;

      bar.append(marker);

      const labels = document.createElement("div");
      labels.className = "dim-labels";
      labels.innerHTML = `<span>${dim.left.name}（${dim.left.letter}）</span><span>${dim.right.name}（${dim.right.letter}）</span>`;

      wrap.append(title, bar, labels);
      els.dimBars.append(wrap);
    }
  }

  function renderMatches(matches) {
    const top = matches.slice(0, 3);
    els.topMatches.innerHTML = "";

    for (const m of top) {
      const card = document.createElement("div");
      card.className = "match";

      const title = document.createElement("div");
      title.className = "match-title";
      title.innerHTML = `<div class="match-name">${m.name}</div><div class="match-score">${m.score} / 100</div>`;

      const meta = document.createElement("div");
      meta.className = "match-meta";
      meta.textContent = m.family;

      const desc = document.createElement("div");
      desc.className = "match-desc";
      desc.textContent = m.desc;

      const why = document.createElement("div");
      why.className = "why";
      for (const w of m.why) {
        const chip = document.createElement("div");
        chip.className = "chip";
        chip.textContent = w;
        why.append(chip);
      }

      card.append(title, meta, desc, why);
      els.topMatches.append(card);
    }

    const more = matches.slice(3, 8).map((m) => m.name);
    els.moreMatches.textContent = more.length ? `更多相近：${more.join("、")}` : "";
  }

  function buildCopyText(type, userVector, matches) {
    const lines = [];
    lines.push(`FIN-5 类型：${type}`);
    lines.push(
      dims
        .map((d) => `${d.title}${d.left.letter}/${d.right.letter}=${Math.round(clamp(userVector[d.id], -1, 1) * 100)}`)
        .join(" · "),
    );
    lines.push("");
    lines.push("职业匹配 Top 3：");
    matches.slice(0, 3).forEach((m, i) => {
      lines.push(`${i + 1}. ${m.name}（${m.score}/100）— ${m.desc}`);
    });
    return lines.join("\n");
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function showResults() {
    const missing = findFirstUnansweredIndex();
    if (missing >= 0) {
      currentIndex = missing;
      saveState();
      showScreen("screen-quiz");
      renderQuestion();
      return;
    }

    const userVector = computeUserVector();
    const type = computeType(userVector);
    const matches = computeMatches(userVector);

    els.typeText.textContent = type;
    renderDimBars(userVector);
    renderMatches(matches);

    els.copyBtn.onclick = async () => {
      try {
        await copyToClipboard(buildCopyText(type, userVector, matches));
        els.copyBtn.textContent = "已复制";
        setTimeout(() => {
          els.copyBtn.textContent = "复制结果";
        }, 1200);
      } catch {
        // eslint-disable-next-line no-alert
        alert("复制失败：请手动选择并复制。");
      }
    };

    showScreen("screen-result");
  }

  function resetAll() {
    answers = Array.from({ length: questions.length }, () => null);
    currentIndex = 0;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    updateProgress();
  }

  function openPreview() {
    els.previewList.innerHTML = "";

    for (let i = 0; i < questions.length; i += 1) {
      const q = questions[i];
      const dim = dims.find((d) => d.id === q.dim);
      const el = document.createElement("div");
      el.className = "preview-q";
      el.innerHTML = `
        <div><strong>第 ${i + 1} 题</strong> <span style="color: var(--muted2)">· ${
          dim ? `${dim.title} ${dim.left.letter}–${dim.right.letter}` : ""
        }</span></div>
        <div style="margin-top:6px;">左：${q.left}</div>
        <div>右：${q.right}</div>
      `;
      els.previewList.append(el);
    }

    const dialog = els.previewDialog;
    if (!dialog) {
      // eslint-disable-next-line no-alert
      alert("当前浏览器不支持题目预览弹窗。你也可以直接开始测试。");
      return;
    }

    if (typeof dialog.showModal !== "function") {
      // eslint-disable-next-line no-alert
      alert("当前浏览器不支持题目预览弹窗。你也可以直接开始测试。");
      return;
    }

    dialog.showModal();
  }

  function startQuiz() {
    const saved = answeredCount();
    if (saved > 0) {
      const firstUnanswered = findFirstUnansweredIndex();
      currentIndex = firstUnanswered >= 0 ? firstUnanswered : 0;
    } else {
      currentIndex = 0;
    }
    saveState();
    showScreen("screen-quiz");
    renderQuestion();
  }

  // Wire up events
  els.startBtn.addEventListener("click", () => {
    startQuiz();
  });

  els.previewBtn.addEventListener("click", () => {
    openPreview();
  });

  els.backToIntroBtn.addEventListener("click", () => {
    showScreen("screen-intro");
  });

  els.prevBtn.addEventListener("click", () => {
    goPrev();
  });

  els.nextBtn.addEventListener("click", () => {
    goNext();
  });

  els.restartBtn.addEventListener("click", () => {
    resetAll();
    showScreen("screen-intro");
  });

  // Init
  loadState();
  renderLegend();
  updateProgress();
})();
