/**
 * Obesity Subtype Calculator — i18n + Clinical Validation
 * Colors synced with UMAP / PCA figures from the project
 */
(function () {
  "use strict";

  // ═══════════════════════════════════════════════════════
  // 0. i18n Dictionary
  // ═══════════════════════════════════════════════════════
  const I18N = {
    en: {
      title: "Obesity Subtype Calculator",
      subtitle: "C1-C5 Probability Prediction &middot; UK Biobank Ridge Model",
      formTitle: "Clinical Measurements",
      fillDemo: "Fill sample data",
      clearBtn: "Clear",
      // Labels
      label_SBP: "Systolic BP (SBP)",
      label_hba1c: "Glycated Hemoglobin (HbA1c)",
      label_TG: "Triglycerides (TG)",
      label_HDL_C: "HDL Cholesterol (HDL-C)",
      label_Creatinine: "Creatinine (CREA)",
      label_ALT: "Alanine Transaminase (ALT)",
      label_WHR: "Waist-to-Hip Ratio (WHR)",
      // Placeholders
      ph_SBP: "e.g. 130",
      ph_hba1c: "e.g. 40",
      ph_TG: "e.g. 1.7",
      ph_HDL_C: "e.g. 1.3",
      ph_Creatinine: "e.g. 75",
      ph_ALT: "e.g. 25",
      ph_WHR: "e.g. 0.95",
      // Validation
      hardLimitMsg: "Value exceeds human physiological range. Please verify.",
      softWarnMsg: "Value deviates from model training distribution. Interpret with caution.",
      fillHint: "Please complete all 7 measurements above to calculate",
      // Button
      btnCalc: "Calculate",
      // Results
      predictedSubtype: "Predicted Subtype",
      confidence: "Confidence",
      margin: "Margin",
      probDist: "Probability Distribution",
      viewScores: "Detailed Scores",
      subtype: "Subtype",
      probability: "Probability",
      score: "Score",
      btnRadar: "Show Radar Chart",
      btnRadarHide: "Hide Radar Chart",
      // Disclaimer
      disclaimer: "Note: This calculator is based on the UK Biobank cohort (N=88,877, BMI≥30) using a multinomial ridge regression model. It is intended for academic research only and must not substitute professional clinical diagnosis. All input data is processed locally in the browser and is never uploaded to any server.",
      // Methodology
      methTitle: "Methodology",
      methFlow: "Calculation Steps",
      methStep1: "1. Z-score normalization: z = (x − μ) / σ using UKB population parameters",
      methStep2: "2. Linear scoring: scoreₖ = β₀ₖ + Σ βᵢₖ · zᵢ",
      methStep3: "3. Softmax: P(Cₖ) = exp(scoreₖ) / Σ exp(scoreₗ)",
      methStep4: "4. Predicted subtype: argmax P(Cₖ)",
      methModel: "Model Information",
      methM1: "Model: Multinomial Logistic Regression (L2 penalty)",
      methM2: "Training: 88,877 UK Biobank participants",
      methM3: "Features: 7 routine clinical variables",
      methM4: "Validation: 5-fold CV, Macro-AUC ≈ 0.89",
      methM5: "Privacy: All computation runs locally in the browser",
      methCoeff: "Ridge Regression Coefficients",
      methCoeffNote: "Interpretation: A positive β means the feature increases the log-odds of that subtype. HDL-C's large positive coefficient (95.41) for C4 reflects this subtype's defining characteristic of exceptionally high HDL cholesterol.",
    },
    zh: {
      title: "肥胖亚型预测计算器",
      subtitle: "C1-C5 概率预测 &middot; UK Biobank Ridge 模型",
      formTitle: "临床指标输入",
      fillDemo: "填充演示数据",
      clearBtn: "清空",
      // Labels
      label_SBP: "收缩压 (SBP)",
      label_hba1c: "糖化血红蛋白 (HbA1c)",
      label_TG: "甘油三酯 (TG)",
      label_HDL_C: "高密度脂蛋白胆固醇 (HDL-C)",
      label_Creatinine: "肌酐 (CREA)",
      label_ALT: "谷丙转氨酶 (ALT)",
      label_WHR: "腰臀比 (WHR)",
      // Placeholders
      ph_SBP: "例如 130",
      ph_hba1c: "例如 40",
      ph_TG: "例如 1.7",
      ph_HDL_C: "例如 1.3",
      ph_Creatinine: "例如 75",
      ph_ALT: "例如 25",
      ph_WHR: "例如 0.95",
      // Validation
      hardLimitMsg: "数值超出人类常规生理极限，请核对输入是否有误。",
      softWarnMsg: "该数值偏离模型训练分布，结果仅供参考。",
      fillHint: "请完整填写上方 7 项指标后开始计算",
      // Button
      btnCalc: "计算结果",
      // Results
      predictedSubtype: "预测亚型",
      confidence: "置信度",
      margin: "置信裕度",
      probDist: "概率分布",
      viewScores: "详细得分",
      subtype: "亚型",
      probability: "概率",
      score: "得分",
      btnRadar: "展开概率雷达图",
      btnRadarHide: "收起雷达图",
      // Disclaimer
      disclaimer: "注：本计算器基于 UK Biobank 队列构建（N=88,877, BMI≥30），采用多项 Ridge 回归模型。仅供学术研究参考，不可替代专业临床诊断。所有输入数据仅在浏览器本地计算，不会上传至任何服务器。",
      // Methodology
      methTitle: "方法学说明",
      methFlow: "计算流程",
      methStep1: "1. Z-score 标准化：z = (x − μ) / σ（使用 UKB 总体参数）",
      methStep2: "2. 线性评分：scoreₖ = β₀ₖ + Σ βᵢₖ · zᵢ",
      methStep3: "3. Softmax：P(Cₖ) = exp(scoreₖ) / Σ exp(scoreₗ)",
      methStep4: "4. 预测亚型 = argmax P(Cₖ)",
      methModel: "模型信息",
      methM1: "模型：Multinomial Logistic Regression (L2 正则化)",
      methM2: "训练样本：88,877 名 UK Biobank 参与者",
      methM3: "特征：7 项常规临床指标",
      methM4: "验证：5 折交叉验证，Macro-AUC ≈ 0.89",
      methM5: "隐私：所有计算在浏览器本地完成，数据不会上传",
      methCoeff: "Ridge 回归系数表",
      methCoeffNote: "解读：正系数（β > 0）表示该特征增加相应亚型的对数几率。HDL-C 在 C4 亚型上的极大正系数 (95.41) 反映了该亚型以极高 HDL 胆固醇为核心特征。",
    },
  };

  let LANG = "en";
  function t(key) { return (I18N[LANG] && I18N[LANG][key] !== undefined) ? I18N[LANG][key] : (I18N["en"][key] || key); }

  // ═══════════════════════════════════════════════════════
  // 1. Constants
  // ═══════════════════════════════════════════════════════
  const FEATURES = ["SBP","hba1c","TG","HDL_C","Creatinine","ALT","WHR"];
  const CLASSES = [1,2,3,4,5];
  // C1-C5 colors synced with UMAP / PCA figures from the project
  const COLORS = { 1:"#1f77b4", 2:"#9467bd", 3:"#d62728", 4:"#ff7f0e", 5:"#2ca02c" };

  const ZP = {
    SBP:        { m:144.2617,  s:18.30491 },
    hba1c:      { m:38.28826,  s:8.153269 },
    TG:         { m:2.064591,  s:1.058878 },
    HDL_C:      { m:1.776623,  s:0.6932231 },
    Creatinine: { m:74.68174,  s:15.22417 },
    ALT:        { m:29.05090,  s:15.12455 },
    WHR:        { m:0.9289015, s:0.08659783 },
  };

  const COEF = [
    { int: 57.94731,  SBP:-12.03, hba1c:-36.61, TG:-29.20, HDL_C:-36.22, Creatinine:-38.03, ALT:-36.85, WHR:-59.00 },
    { int: 82.50954,  SBP:  5.62, hba1c:-30.49, TG:-14.97, HDL_C:-22.69, Creatinine: 34.37, ALT:-20.96, WHR: 20.39 },
    { int:-135.87760,  SBP:  1.99, hba1c:130.82, TG:  8.31, HDL_C:-13.29, Creatinine:-10.91, ALT:  7.80, WHR: 18.64 },
    { int:-19.34153,   SBP: -1.90, hba1c:-36.16, TG:-25.74, HDL_C: 95.41, Creatinine: 13.91, ALT: -1.78, WHR:  6.79 },
    { int: 14.76227,   SBP:  6.32, hba1c:-27.57, TG: 61.60, HDL_C:-23.21, Creatinine:  0.66, ALT: 51.78, WHR: 13.18 },
  ];

  const HARD = {
    SBP:[50,300], hba1c:[15,200], TG:[0.1,100], HDL_C:[0.1,5],
    Creatinine:[10,2000], ALT:[1,10000], WHR:[0.5,1.5],
  };

  // Slider clinical ranges (native units)
  const SLIDER = {
    SBP:[80,220,1], hba1c:[20,100,1], TG:[0.3,10,0.1], HDL_C:[0.3,3.5,0.05],
    Creatinine:[30,180,1], ALT:[5,150,1], WHR:[0.6,1.3,0.01],
  };

  const UNIT_CONV = {
    hba1c:      { "%": v => (v-2.15)*10.929 },
    TG:         { "mg/dL": v => v/88.57 },
    HDL_C:      { "mg/dL": v => v/38.67 },
    Creatinine: { "mg/dL": v => v*88.4 },
  };
  const UNIT_REV = {
    hba1c:      { "%": v => v/10.929+2.15 },
    TG:         { "mg/dL": v => v*88.57 },
    HDL_C:      { "mg/dL": v => v*38.67 },
    Creatinine: { "mg/dL": v => v/88.4 },
  };

  // 5 real UKB patients with moderate max probability (69-70%), from ridge_predictions_all.csv
  const DEMOS = [
    { SBP:132, hba1c:36.2, TG:0.836, HDL_C:1.610, Creatinine:69.1, ALT:24.6, WHR:0.9714, label:"C1 — Metabolic Syndrome" },
    { SBP:159, hba1c:38.2, TG:1.461, HDL_C:1.940, Creatinine:84.9, ALT:57.7, WHR:0.9907, label:"C2 — Hypertensive" },
    { SBP:109, hba1c:49.8, TG:3.571, HDL_C:1.110, Creatinine:84.2, ALT:22.8, WHR:0.9023, label:"C3 — Severe Metabolic" },
    { SBP:129, hba1c:41.9, TG:0.809, HDL_C:2.540, Creatinine:86.9, ALT:17.2, WHR:1.0083, label:"C4 — High HDL" },
    { SBP:152, hba1c:39.4, TG:2.844, HDL_C:1.590, Creatinine:67.5, ALT:30.9, WHR:1.0874, label:"C5 — Metabolically Favorable" },
  ];

  // ═══════════════════════════════════════════════════════
  // 2. State & DOM
  // ═══════════════════════════════════════════════════════
  const $ = id => document.getElementById(id);
  let probChart = null;

  // ═══════════════════════════════════════════════════════
  // 3. Helpers
  // ═══════════════════════════════════════════════════════
  function toNative(f, raw) {
    const v = parseFloat(raw); if (isNaN(v)) return NaN;
    const sel = $(f+"-unit");
    if (!sel || sel.value==="native") return v;
    return (UNIT_CONV[f]?.[sel.value] || (x=>x))(v);
  }
  function dispVal(f, nv, unit) {
    if (!unit || unit==="native") return nv;
    return (UNIT_REV[f]?.[unit] || (x=>x))(nv);
  }
  function zscore(vals) { const z={}; for (const f of FEATURES) z[f]=(vals[f]-ZP[f].m)/ZP[f].s; return z; }
  function predict(vals) {
    const z = zscore(vals);
    const scores = COEF.map(c => { let s=c.int; for (const f of FEATURES) s+=c[f]*z[f]; return s; });
    const max = Math.max(...scores);
    const exps = scores.map(s => Math.exp(s-max));
    const sum = exps.reduce((a,b)=>a+b,0);
    const probs = exps.map(e=>e/sum);
    return CLASSES.map((c,i)=>({cluster:c, prob:probs[i], score:scores[i]}));
  }

  // ═══════════════════════════════════════════════════════
  // 4. Slider Sync
  // ═══════════════════════════════════════════════════════
  function sliderValToDisplay(f, sliderVal) {
    const sel = $(f+"-unit");
    const unit = (sel && sel.value !== "native") ? sel.value : null;
    if (unit && UNIT_REV[f]?.[unit]) return UNIT_REV[f][unit](sliderVal);
    return sliderVal;
  }

  window.syncFromSlider = function(f) {
    const slider = $(f+"-slider");
    const nv = parseFloat(slider.value);
    const dv = sliderValToDisplay(f, nv);
    const decimals = f==="WHR"?2 : f==="hba1c"||f==="TG"||f==="HDL_C"?1 : 0;
    $(f).value = dv.toFixed(decimals);
    checkAll();
    if (!window._hardLimitBlocked) {
      let allFilled = true;
      for (const ff of FEATURES) { if ($(ff).value.trim()==="") { allFilled=false; break; } }
      if (allFilled) window.calc();
    }
  };

  function syncToSlider(f) {
    const slider = $(f+"-slider"); if (!slider) return;
    const raw = $(f).value.trim();
    if (raw==="") return;
    const nv = toNative(f, raw);
    if (isNaN(nv)) return;
    const [lo,hi] = SLIDER[f];
    slider.value = Math.max(lo, Math.min(hi, nv));
  }

  // ═══════════════════════════════════════════════════════
  // 5. Validation
  // ═══════════════════════════════════════════════════════
  function checkAll() {
    let allFilled = true, anyHard = false;
    for (const f of FEATURES) {
      const el=$(f), raw=el.value.trim();
      const card=el.closest(".input-group");
      const hardEl=card?.querySelector(".hard-err");
      const softEl=card?.querySelector(".soft-warn");
      if (raw==="") { allFilled=false; clearWarn(card); continue; }
      const nv = toNative(f, raw);
      if (isNaN(nv)) { allFilled=false; clearWarn(card); continue; }
      const [lo,hi]=HARD[f];
      if (nv<lo || nv>hi) {
        card.classList.add("ring-1","ring-red-400");
        if (hardEl) { hardEl.classList.remove("hidden"); hardEl.textContent=t("hardLimitMsg"); }
        anyHard=true;
      } else {
        card.classList.remove("ring-1","ring-red-400");
        if (hardEl) hardEl.classList.add("hidden");
      }
      const zv = (nv-ZP[f].m)/ZP[f].s;
      if (Math.abs(zv)>3 && !anyHard) {
        if (softEl) { softEl.classList.remove("hidden"); softEl.textContent=t("softWarnMsg"); }
      } else { if (softEl) softEl.classList.add("hidden"); }
      syncToSlider(f);
    }
    const btn = $("btn-calc");
    btn.disabled = !allFilled || anyHard;
    btn.className = (!allFilled||anyHard)
      ? "w-full py-2.5 rounded-xl text-base font-semibold text-white bg-slate-300 cursor-not-allowed transition-all"
      : "w-full py-2.5 rounded-xl text-base font-semibold text-white bg-gradient-to-b from-navy-700 to-navy-600 hover:from-navy-600 hover:to-navy-500 active:from-navy-800 active:to-navy-700 transition-all shadow-sm";
  }
  function clearWarn(card) {
    card?.classList.remove("ring-1","ring-red-400");
    card?.querySelector(".hard-err")?.classList.add("hidden");
    card?.querySelector(".soft-warn")?.classList.add("hidden");
  }

  // ═══════════════════════════════════════════════════════
  // 5. Unit Switch
  // ═══════════════════════════════════════════════════════
  window.switchUnit = function(f) {
    const el=$(f), raw=el.value.trim();
    if (raw==="") return;
    const nv = toNative(f, raw);
    if (isNaN(nv)) return;
    const sel = $(f+"-unit");
    if (!sel) return;
    el.value = dispVal(f, nv, sel.value).toFixed(
      sel.value==="native" ? (f==="Creatinine"||f==="SBP"||f==="ALT"?0:1) : 2
    );
    syncToSlider(f);
    checkAll();
  };

  // ═══════════════════════════════════════════════════════
  // 6. Language Switch
  // ═══════════════════════════════════════════════════════
  window.switchLang = function(lang) {
    LANG = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (el.tagName==="INPUT") el.placeholder = t(key);
      else el.innerHTML = t(key);
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
      el.placeholder = t(el.getAttribute("data-i18n-ph"));
    });
    document.getElementById("btn-en").classList.toggle("bg-white", lang==="en");
    document.getElementById("btn-en").classList.toggle("text-navy-800", lang==="en");
    document.getElementById("btn-en").classList.toggle("bg-transparent", lang!=="en");
    document.getElementById("btn-en").classList.toggle("text-white/80", lang!=="en");
    document.getElementById("btn-zh").classList.toggle("bg-white", lang==="zh");
    document.getElementById("btn-zh").classList.toggle("text-navy-800", lang==="zh");
    document.getElementById("btn-zh").classList.toggle("bg-transparent", lang!=="zh");
    document.getElementById("btn-zh").classList.toggle("text-white/80", lang!=="zh");
    document.title = t("title");
    $("fill-hint").textContent = t("fillHint");
    $("btn-calc").textContent = t("btnCalc");
    checkAll();
    // Refresh chart tab labels if results are visible
    const tb = $("tab-bar"); if (tb) tb.textContent = LANG==="zh"?"柱状图":"Bar Chart";
    const tr = $("tab-radar"); if (tr) tr.textContent = LANG==="zh"?"雷达图":"Radar";
    const tt = $("tab-table"); if (tt) tt.textContent = t("viewScores");
    // Re-render results if visible (language-switch on dynamic content)
    if (lastResult) {
      const nameMap = LANG==="zh"
        ? ({1:"代谢综合征型",2:"高血压型",3:"重度代谢异常型",4:"高HDL型",5:"代谢相对良好型"})
        : ({1:"Metabolic Syndrome",2:"Hypertensive",3:"Severe Metabolic",4:"High HDL",5:"Metabolically Favorable"});
      const best = lastResult.reduce((a,b) => a.prob > b.prob ? a : b);
      const sorted = [...lastResult].sort((a,b) => b.prob - a.prob);
      const margin = sorted[0].prob - sorted[1].prob;
      // Rebuild badge card with current language
      $("badge-card").innerHTML = `
        <div class="flex flex-col items-center justify-center text-center h-full">
          <div class="text-xs text-muted uppercase tracking-[0.15em] mb-2">${t("predictedSubtype")}</div>
          <div id="res-subtype" class="text-7xl font-bold tracking-tight leading-none" style="color:${COLORS[best.cluster]}">C${best.cluster}</div>
          <div id="res-name" class="text-base text-muted mt-3 font-medium">${nameMap[best.cluster]}</div>
          <div class="flex justify-center gap-8 mt-6">
            <div class="text-center"><div class="text-xs text-muted uppercase tracking-[0.15em]">${t("confidence")}</div><div id="res-conf" class="text-lg font-bold text-ink mt-1">${(best.prob*100).toFixed(1)}%</div></div>
            <div class="text-center"><div class="text-xs text-muted uppercase tracking-[0.15em]">${t("margin")}</div><div id="res-margin" class="text-lg font-bold text-ink mt-1">${((margin)*100).toFixed(1)}%</div></div>
          </div>
        </div>`;
      // Update chart tab labels
      if (chartMode===2) showTable(lastResult);
      const tb = $("tab-bar"); if (tb) tb.textContent = LANG==="zh"?"柱状图":"Bar Chart";
      const tr = $("tab-radar"); if (tr) tr.textContent = LANG==="zh"?"雷达图":"Radar";
      const tt = $("tab-table"); if (tt) tt.textContent = t("viewScores");
    }
  };

  // ═══════════════════════════════════════════════════════
  // 7. Fill Demo & Spinners
  // ═══════════════════════════════════════════════════════
  /** Spin input value by delta steps */
  window.spin = function(f, delta) {
    const el = $(f), raw = el.value.trim();
    const nv = raw === "" ? ZP[f].m : (toNative(f, raw) || 0);
    const step = { SBP:5, hba1c:2, TG:0.1, HDL_C:0.05, Creatinine:5, ALT:5, WHR:0.01 }[f] || 1;
    const newNative = Math.max(HARD[f][0], Math.min(HARD[f][1], nv + delta * step));
    const sel = $(f+"-unit");
    const unit = (sel && sel.value !== "native") ? sel.value : null;
    const displayVal = (unit && UNIT_REV[f]?.[unit]) ? UNIT_REV[f][unit](newNative) : newNative;
    const decimals = f==="WHR"?2 : f==="hba1c"||f==="TG"||f==="HDL_C"?1 : 0;
    el.value = displayVal.toFixed(decimals);
    syncToSlider(f);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };

  window.fillDemo = function() {
    const patient = DEMOS[Math.floor(Math.random() * DEMOS.length)];
    for (const f of FEATURES) {
      const el = $(f), sel = $(f+"-unit");
      // Determine display unit
      const unit = (sel && sel.value !== "native") ? sel.value : null;
      const nv = patient[f];
      // Convert native → display if alt unit selected
      const displayVal = (unit && UNIT_REV[f]?.[unit]) ? UNIT_REV[f][unit](nv) : nv;
      el.value = displayVal;
      clearWarn(el.closest(".input-group"));
      // Fire input event to trigger validation
      syncToSlider(f);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
    // Flash label
    const idx = DEMOS.indexOf(patient);
    const namesZH = ["C1 代谢综合征型","C2 高血压型","C3 重度代谢异常型","C4 高HDL型","C5 代谢相对良好型"];
    const namesEN = ["C1 Metabolic Syndrome","C2 Hypertensive","C3 Severe Metabolic","C4 High HDL","C5 Metabolically Favorable"];
    const link = document.querySelector('[onclick="fillDemo()"]');
    if (link) {
      link.textContent = LANG==="zh"
        ? `已填充：${namesZH[idx]} 样本`
        : `Filled: ${namesEN[idx]} sample`;
      link.style.color = COLORS[idx+1];
      setTimeout(() => { link.textContent = t("fillDemo"); link.style.color = ""; }, 2800);
    }
    checkAll();
  };

  window.clearAll = function() {
    for (const f of FEATURES) {
      $(f).value = "";
      clearWarn($(f).closest(".input-group"));
      syncToSlider(f);
    }
    if (probChart) { probChart.destroy(); probChart = null; }
    lastResult = null;
    $("results-area").classList.add("hidden");
    checkAll();
  };

  // ═══════════════════════════════════════════════════════
  // 8. Calculate
  // ═══════════════════════════════════════════════════════
  window.calc = function() {
    if ($("btn-calc").disabled) return;
    const vals = {};
    for (const f of FEATURES) vals[f] = toNative(f, $(f).value);
    const result = predict(vals);
    const best = result.reduce((a,b) => a.prob > b.prob ? a : b);
    const sorted = [...result].sort((a,b) => b.prob - a.prob);
    const margin = sorted[0].prob - sorted[1].prob;
    const c = best.cluster;
    const nameMap = LANG==="zh"
      ? ({1:"代谢综合征型",2:"高血压型",3:"重度代谢异常型",4:"高HDL型",5:"代谢相对良好型"})
      : ({1:"Metabolic Syndrome",2:"Hypertensive",3:"Severe Metabolic",4:"High HDL",5:"Metabolically Favorable"});

    if (probChart) { probChart.destroy(); probChart=null; }

    // Store result for chart toggling
    lastResult = result;
    chartMode = 0;

    // ── Badge Card ──
    $("badge-card").innerHTML = `
      <div class="flex flex-col items-center justify-center text-center h-full">
        <div class="text-xs text-muted uppercase tracking-[0.15em] mb-2">${t("predictedSubtype")}</div>
        <div id="res-subtype" class="text-7xl font-bold tracking-tight leading-none" style="color:${COLORS[c]}">C${c}</div>
        <div id="res-name" class="text-base text-muted mt-3 font-medium">${nameMap[c]}</div>
        <div class="flex justify-center gap-8 mt-6">
          <div class="text-center"><div class="text-xs text-muted uppercase tracking-[0.15em]">${t("confidence")}</div><div id="res-conf" class="text-lg font-bold text-ink mt-1">${(best.prob*100).toFixed(1)}%</div></div>
          <div class="text-center"><div class="text-xs text-muted uppercase tracking-[0.15em]">${t("margin")}</div><div id="res-margin" class="text-lg font-bold text-ink mt-1">${((margin)*100).toFixed(1)}%</div></div>
        </div>
      </div>`;

    // ── Chart Card ──
    $("chart-card").innerHTML = `
      <div class="flex flex-col h-full w-full">
        <div id="chart-area" class="flex-1" style="min-height:280px"><canvas id="prob-chart"></canvas></div>
        <div class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-line">
          <button type="button" onclick="switchChart(-1)" class="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted hover:text-navy-700 hover:border-navy-700/30 transition-colors text-sm shrink-0">&larr;</button>
          <button type="button" id="tab-bar" onclick="switchToChart(0)" class="px-4 py-2 rounded-lg text-sm font-semibold bg-navy-700 text-white transition-colors">${LANG==="zh"?"柱状图":"Bar Chart"}</button>
          <button type="button" id="tab-radar" onclick="switchToChart(1)" class="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-muted hover:bg-slate-200 transition-colors">${LANG==="zh"?"雷达图":"Radar"}</button>
          <button type="button" id="tab-table" onclick="switchToChart(2)" class="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-muted hover:bg-slate-200 transition-colors">${t("viewScores")}</button>
          <button type="button" onclick="switchChart(1)" class="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted hover:text-navy-700 hover:border-navy-700/30 transition-colors text-sm shrink-0">&rarr;</button>
        </div>
      </div>`;

    $("results-area").classList.remove("hidden");
    $("badge-card").scrollIntoView({ behavior:"smooth", block:"nearest" });
    chartMode = 0; updateTabs(0);
    setTimeout(() => drawBar(result), 60);
  };

  // ═══════════════════════════════════════════════════════
  // 8. Placeholder
  // ═══════════════════════════════════════════════════════
  function showPlaceholder() {
    if (probChart) { probChart.destroy(); probChart = null; }
    lastResult = null;
    chartMode = 0;
    $("badge-card").innerHTML = `
      <div class="flex flex-col items-center justify-center text-center h-full text-muted">
        <svg class="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M9 12l2 2 4-4"/></svg>
        <p class="text-sm font-semibold text-ink/50">${LANG==="zh" ? "预测结果" : "Prediction"}</p>
        <p class="text-xs text-muted mt-1">${LANG==="zh" ? "将在此显示" : "will appear here"}</p>
      </div>`;
    $("chart-card").innerHTML = `
      <div class="flex flex-col items-center justify-center text-center h-full text-muted">
        <svg class="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        <p class="text-sm font-semibold text-ink/50">${LANG==="zh" ? "图表与详情" : "Chart & Details"}</p>
        <p class="text-xs text-muted mt-1">${LANG==="zh" ? "将在此显示" : "will appear here"}</p>
      </div>`;
  }

  // ═══════════════════════════════════════════════════════
  // 9. Chart Toggle (3 views: bar / radar / table)
  // ═══════════════════════════════════════════════════════
  let chartMode = 0; // 0=bar, 1=radar, 2=table
  let lastResult = null;

  function drawBar(result) {
    if (probChart) probChart.destroy();
    $("chart-area").innerHTML = '<canvas id="prob-chart"></canvas>';
    $("chart-area").style.height = "340px";
    const labels = result.map(r=>`C${r.cluster}`);
    const data = result.map(r=>r.prob*100);
    const colors = result.map(r=>COLORS[r.cluster]);
    probChart = new Chart($("prob-chart"), {
      type:"bar", data:{ labels, datasets:[{ data, backgroundColor:colors.map(c=>c+"CC"), borderColor:colors, borderWidth:2, borderRadius:5, borderSkipped:false }] },
      options:{ indexAxis:"y", responsive:true, maintainAspectRatio:false, animation:{ duration:400 }, plugins:{ legend:{ display:false } }, scales:{ x:{ beginAtZero:true, max:100, ticks:{ callback:v=>v+"%" }, grid:{ color:"#e2e8f0" } }, y:{ ticks:{ font:{ weight:"bold", size:12 } }, grid:{ display:false } } } },
    });
  }

  function drawRadar(result) {
    if (probChart) probChart.destroy();
    $("chart-area").innerHTML = '<canvas id="prob-chart"></canvas>';
    $("chart-area").style.height = "380px";
    const labels = result.map(r=>`C${r.cluster}`);
    const data = result.map(r=>r.prob*100);
    const colors = result.map(r=>COLORS[r.cluster]);
    probChart = new Chart($("prob-chart"), {
      type:"radar", data:{ labels, datasets:[{ data, backgroundColor:"rgba(37,99,235,0.10)", borderColor:"#2563eb", borderWidth:2.5, pointBackgroundColor:colors, pointBorderColor:colors, pointRadius:5, fill:true }] },
      options:{ responsive:true, maintainAspectRatio:false, animation:{ duration:500 }, plugins:{ legend:{ display:false } }, scales:{ r:{ beginAtZero:true, max:100, ticks:{ stepSize:20, backdropColor:"transparent", font:{ size:10 } }, pointLabels:{ font:{ weight:"bold", size:12 } }, grid:{ color:"#e2e8f0" }, angleLines:{ color:"#e2e8f0" } } } },
    });
  }

  function showTable(result) {
    if (probChart) { probChart.destroy(); probChart = null; }
    $("chart-area").style.height = "auto";
    const c = result.reduce((a,b) => a.prob > b.prob ? a : b).cluster;
    let rows = "";
    for (const r of result) {
      rows += `<tr class="${r.cluster===c?'bg-blue-50/60 font-semibold':''}">
        <td class="py-2.5 px-3"><span class="inline-block w-2.5 h-2.5 rounded-full mr-2" style="background:${COLORS[r.cluster]}"></span>C${r.cluster}</td>
        <td class="py-2.5 px-3 text-right tabular-nums text-sm">${(r.prob*100).toFixed(2)}%</td>
        <td class="py-2.5 px-3 text-right text-muted font-mono text-sm tabular-nums">${r.score.toFixed(2)}</td>
      </tr>`;
    }
    $("chart-area").innerHTML = `
      <table class="w-full text-sm">
        <thead><tr class="text-muted text-xs uppercase tracking-wide">
          <th class="text-left py-2 px-3 font-medium">${t("subtype")}</th>
          <th class="text-right py-2 px-3 font-medium">${t("probability")}</th>
          <th class="text-right py-2 px-3 font-medium">${t("score")}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function updateTabs(mode) {
    ["tab-bar","tab-radar","tab-table"].forEach((id,i) => {
      const el = $(id); if (!el) return;
      if (i===mode) { el.className = "px-4 py-2 rounded-lg text-sm font-semibold bg-navy-700 text-white transition-colors"; }
      else { el.className = "px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-muted hover:bg-slate-200 transition-colors"; }
    });
  }

  window.switchToChart = function(mode) {
    if (!lastResult) return;
    chartMode = mode;
    updateTabs(mode);
    if (mode===0) drawBar(lastResult);
    else if (mode===1) drawRadar(lastResult);
    else showTable(lastResult);
  };

  window.switchChart = function(dir) {
    if (!lastResult) return;
    chartMode = (chartMode + dir + 3) % 3;
    updateTabs(chartMode);
    if (chartMode===0) drawBar(lastResult);
    else if (chartMode===1) drawRadar(lastResult);
    else showTable(lastResult);
  };

  // ═══════════════════════════════════════════════════════
  // 11. Init
  // ═══════════════════════════════════════════════════════
  document.addEventListener("DOMContentLoaded", () => {
    for (const f of FEATURES) {
      const el = $(f);
      el.addEventListener("input", checkAll);
      el.addEventListener("blur", checkAll);
      el.addEventListener("keydown", e => { if (e.key==="Enter") window.calc(); });
    }
    checkAll();
  });
})();
