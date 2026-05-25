/**
 * Obesity Subtype Calculator v3 — Clinical Names + Auto-calc WHR/BMI
 */
(function () {
  "use strict";

  // ═══════════ i18n ═══════════
  const I18N = {
    en: {
      title: "Obesity Subtype Calculator",
      subtitle: "LRO · RDO · HGO · HHO · DHO &middot; UK Biobank Ridge Model",
      formTitle: "Clinical Measurements",
      fillDemo: "Fill sample data",
      clearBtn: "Clear",
      label_SBP: "Systolic BP (SBP)",
      label_hba1c: "Glycated Hemoglobin (HbA1c)",
      label_TG: "Triglycerides (TG)",
      label_HDL_C: "HDL Cholesterol (HDL-C)",
      label_Creatinine: "Creatinine",
      label_ALT: "Alanine Transaminase (ALT)",
      label_Waist: "Waist circumference (cm)",
      label_Hip: "Hip circumference (cm)",
      label_WHR: "Waist-to-Hip Ratio (WHR)",
      label_Height: "Height (cm)",
      label_Weight: "Weight (kg)",
      label_BMI: "Body Mass Index (BMI)",
      unitOpt: "Unit (optional)",
      bodyTitle: "Body Parameters",
      clearBMI: "Clear BMI",
      bmiWarn: "BMI is below 30. This model is only validated for individuals with BMI ≥ 30 kg/m².",
      ph_SBP: "e.g. 130",
      ph_hba1c: "e.g. 40",
      ph_TG: "e.g. 1.7",
      ph_HDL_C: "e.g. 1.3",
      ph_Creatinine: "e.g. 75",
      ph_ALT: "e.g. 25",
      ph_Waist: "e.g. 100",
      ph_Hip: "e.g. 105",
      ph_Height: "e.g. 170",
      ph_Weight: "e.g. 95",
      hardLimitMsg: "Value exceeds human physiological range. Please verify.",
      softWarnMsg: "Value deviates from model training distribution. Interpret with caution.",
      fillHint: "Please complete all required fields above. WHR will be calculated automatically.",
      btnCalc: "Calculate",
      predictedSubtype: "Predicted Subtype",
      confidence: "Confidence",
      margin: "Margin",
      probDist: "Probability Distribution",
      viewScores: "Detailed Scores",
      subtype: "Subtype",
      probability: "Probability",
      score: "Score",
      disclaimer: "Note: This calculator is designed for obesity subtyping among individuals with a BMI ≥ 30 kg/m². If your BMI is unknown, please use the BMI calculator below. The model uses multinomial ridge regression trained on UK Biobank data (N=88,877). All input data is processed locally and never uploaded.",
      methTitle: "Methodology",
      methFlow: "Calculation Steps",
      methStep1: "Z-score normalization: z = (x − μ) / σ using UKB population parameters",
      methStep2: "Linear scoring: scoreₖ = β₀ₖ + Σ βᵢₖ · zᵢ",
      methStep3: "Softmax: P(Cₖ) = exp(scoreₖ) / Σ exp(scoreₗ)",
      methStep4: "Predicted subtype: argmax P(Cₖ)",
      methModel: "Model Information",
      methM1: "Model: Multinomial Logistic Regression (L2 penalty / Ridge)",
      methM2: "Training: 88,877 UK Biobank participants (BMI ≥ 30)",
      methM3: "Features: 7 routine clinical variables + WHR auto-derived",
      methM4: "Validation: 5-fold CV, Macro-AUC ≈ 0.89",
      methM5: "Privacy: All computation runs locally in the browser",
      methCoeff: "Ridge Regression Coefficients",
      methCoeffNote: "Interpretation: A positive β means the feature increases the log-odds of that subtype. HDL-C's large positive coefficient (95.41) for HHO reflects this subtype's defining characteristic of exceptionally high HDL cholesterol.",
      methRidge: "This model uses multinomial ridge regression (L2-regularized logistic regression). The L2 penalty shrinks extreme coefficients, improving generalizability. The optimal regularization parameter C was selected via 5-fold cross-validation.",
    },
    zh: {
      title: "肥胖亚型预测计算器",
      subtitle: "LRO · RDO · HGO · HHO · DHO &middot; UK Biobank Ridge 模型",
      formTitle: "临床指标输入",
      fillDemo: "填充示例数据",
      clearBtn: "清空",
      label_SBP: "收缩压 (SBP)",
      label_hba1c: "糖化血红蛋白 (HbA1c)",
      label_TG: "甘油三酯 (TG)",
      label_HDL_C: "高密度脂蛋白胆固醇 (HDL-C)",
      label_Creatinine: "肌酐 (Creatinine)",
      label_ALT: "谷丙转氨酶 (ALT)",
      label_Waist: "腰围 (cm)",
      label_Hip: "臀围 (cm)",
      label_WHR: "腰臀比 (WHR)",
      label_Height: "身高 (cm)",
      label_Weight: "体重 (kg)",
      label_BMI: "身体质量指数 (BMI)",
      unitOpt: "单位（可选）",
      bodyTitle: "体格参数",
      clearBMI: "清空BMI",
      bmiWarn: "BMI 低于 30。本模型仅适用于 BMI ≥ 30 kg/m² 的个体。",
      ph_SBP: "例如 130",
      ph_hba1c: "例如 40",
      ph_TG: "例如 1.7",
      ph_HDL_C: "例如 1.3",
      ph_Creatinine: "例如 75",
      ph_ALT: "例如 25",
      ph_Waist: "例如 100",
      ph_Hip: "例如 105",
      ph_Height: "例如 170",
      ph_Weight: "例如 95",
      hardLimitMsg: "数值超出人类常规生理极限，请核对输入是否有误。",
      softWarnMsg: "该数值偏离模型训练分布，结果仅供参考。",
      fillHint: "请完整填写上方所需指标。WHR 将自动计算。",
      btnCalc: "计算结果",
      predictedSubtype: "预测亚型",
      confidence: "置信度",
      margin: "置信裕度",
      probDist: "概率分布",
      viewScores: "详细得分",
      subtype: "亚型",
      probability: "概率",
      score: "得分",
      disclaimer: "注：本计算器适用于 BMI ≥ 30 kg/m² 的肥胖个体亚型分型。如未知 BMI，请使用下方 BMI 计算器。模型基于 UK Biobank 数据（N=88,877）的多项 Ridge 回归。所有数据仅在浏览器本地计算，不会上传。",
      methTitle: "方法学说明",
      methFlow: "计算流程",
      methStep1: "Z-score 标准化：z = (x − μ) / σ（使用 UKB 总体参数）",
      methStep2: "线性评分：scoreₖ = β₀ₖ + Σ βᵢₖ · zᵢ",
      methStep3: "Softmax：P(Cₖ) = exp(scoreₖ) / Σ exp(scoreₗ)",
      methStep4: "预测亚型 = argmax P(Cₖ)",
      methModel: "模型信息",
      methM1: "模型：Multinomial Logistic Regression（L2 正则化 / Ridge）",
      methM2: "训练样本：88,877 名 UK Biobank 参与者（BMI ≥ 30）",
      methM3: "特征：7 项临床指标 + WHR 自动推算",
      methM4: "验证：5 折交叉验证，Macro-AUC ≈ 0.89",
      methM5: "隐私：所有计算在浏览器本地完成",
      methCoeff: "Ridge 回归系数",
      methCoeffNote: "解读：正系数表示该特征增加相应亚型的对数几率。HDL-C 在 HHO 亚型上的极大正系数 (95.41) 反映了该亚型以极高 HDL 胆固醇为核心特征。",
      methRidge: "本模型采用多项 Ridge 回归（L2 正则化逻辑回归）。L2 惩罚项收缩极端系数，提高泛化能力。最优正则化参数 C 通过 5 折交叉验证选择。",
    },
  };

  let LANG = "en";
  function t(key) { return (I18N[LANG] && I18N[LANG][key] !== undefined) ? I18N[LANG][key] : (I18N["en"][key] || key); }

  // ═══════════ Constants ═══════════
  const FEATURES = ["SBP","hba1c","TG","HDL_C","Creatinine","ALT","WHR"];
  const REQUIRED = ["SBP","hba1c","TG","HDL_C","Creatinine","ALT","Waist","Hip"];
  const CLASSES = [1,2,3,4,5];
  const COLORS = { 1:"#1f77b4", 2:"#9467bd", 3:"#d62728", 4:"#ff7f0e", 5:"#2ca02c" };
  const NAME_EN = {1:"Low-risk obesity", 2:"Renal-dominant obesity", 3:"Hyperglycaemic obesity", 4:"High-HDL obesity", 5:"Dyslipidaemic–hepatic obesity"};
  const NAME_ZH = {1:"低风险肥胖型", 2:"肾脏主导肥胖型", 3:"高血糖肥胖型", 4:"高HDL肥胖型", 5:"血脂异常-肝脏型"};

  const ZP = {
    SBP:{m:144.2617,s:18.30491}, hba1c:{m:38.28826,s:8.153269}, TG:{m:2.064591,s:1.058878},
    HDL_C:{m:1.776623,s:0.6932231}, Creatinine:{m:74.68174,s:15.22417}, ALT:{m:29.05090,s:15.12455}, WHR:{m:0.9289015,s:0.08659783},
  };
  const COEF = [
    { int:57.94731,SBP:-12.03,hba1c:-36.61,TG:-29.20,HDL_C:-36.22,Creatinine:-38.03,ALT:-36.85,WHR:-59.00},
    { int:82.50954,SBP:5.62,hba1c:-30.49,TG:-14.97,HDL_C:-22.69,Creatinine:34.37,ALT:-20.96,WHR:20.39},
    { int:-135.87760,SBP:1.99,hba1c:130.82,TG:8.31,HDL_C:-13.29,Creatinine:-10.91,ALT:7.80,WHR:18.64},
    { int:-19.34153,SBP:-1.90,hba1c:-36.16,TG:-25.74,HDL_C:95.41,Creatinine:13.91,ALT:-1.78,WHR:6.79},
    { int:14.76227,SBP:6.32,hba1c:-27.57,TG:61.60,HDL_C:-23.21,Creatinine:0.66,ALT:51.78,WHR:13.18},
  ];
  const HARD = {
    SBP:[50,300], hba1c:[15,200], TG:[0.1,100], HDL_C:[0.1,5], Creatinine:[10,2000], ALT:[1,10000], WHR:[0.5,1.5],
    Waist:[40,250], Hip:[40,250], Height:[100,250], Weight:[30,300],
  };
  const SLIDER = {
    SBP:[80,220,1], hba1c:[20,100,1], TG:[0.3,10,0.1], HDL_C:[0.3,3.5,0.05],
    Creatinine:[30,180,1], ALT:[5,150,1], Waist:[60,180,1], Hip:[60,180,1],
    Height:[140,210,1], Weight:[40,200,1],
  };
  const UNIT_CONV = {
    hba1c:{"%":v=>(v-2.15)*10.929}, TG:{"mg/dL":v=>v/88.57}, HDL_C:{"mg/dL":v=>v/38.67}, Creatinine:{"mg/dL":v=>v*88.4},
  };
  const UNIT_REV = {
    hba1c:{"%":v=>v/10.929+2.15}, TG:{"mg/dL":v=>v*88.57}, HDL_C:{"mg/dL":v=>v*38.67}, Creatinine:{"mg/dL":v=>v/88.4},
  };
  const DEMOS = [
    { SBP:132, hba1c:36.2, TG:0.836, HDL_C:1.610, Creatinine:69.1, ALT:24.6, Waist:92, Hip:103 },
    { SBP:159, hba1c:38.2, TG:1.461, HDL_C:1.940, Creatinine:84.9, ALT:57.7, Waist:108, Hip:109 },
    { SBP:109, hba1c:49.8, TG:3.571, HDL_C:1.110, Creatinine:84.2, ALT:22.8, Waist:105, Hip:116 },
    { SBP:129, hba1c:41.9, TG:0.809, HDL_C:2.540, Creatinine:86.9, ALT:17.2, Waist:98, Hip:97 },
    { SBP:152, hba1c:39.4, TG:2.844, HDL_C:1.590, Creatinine:67.5, ALT:30.9, Waist:106, Hip:98 },
  ];

  // ═══════════ State ═══════════
  const $ = id => document.getElementById(id);
  let probChart = null, chartMode = 0, lastResult = null;

  // ═══════════ Helpers ═══════════
  function toNative(f, raw) {
    const v = parseFloat(raw); if (isNaN(v)) return NaN;
    const sel = $(f+"-unit"); if (!sel||sel.value==="native") return v;
    return (UNIT_CONV[f]?.[sel.value]||(x=>x))(v);
  }

  // ═══════════ Auto-calc WHR & BMI ═══════════
  window.calcWHR = function() {
    const w = parseFloat($("Waist").value), h = parseFloat($("Hip").value);
    if (!isNaN(w) && !isNaN(h) && h > 0) $("WHR").value = (w/h).toFixed(4);
    else $("WHR").value = "";
    checkAll();
  };
  window.calcBMI = function() {
    const ht = parseFloat($("Height").value), wt = parseFloat($("Weight").value);
    const bmiEl = $("BMI"), warnEl = $("bmi-warn");
    if (!isNaN(ht) && !isNaN(wt) && ht > 0) {
      const bmi = wt / ((ht/100)*(ht/100));
      bmiEl.value = bmi.toFixed(1);
      if (bmi > 0 && bmi < 30) { warnEl.classList.remove("hidden"); }
      else { warnEl.classList.add("hidden"); }
    } else { bmiEl.value = ""; warnEl.classList.add("hidden"); }
  };
  window.clearBMI = function() {
    $("Height").value = ""; $("Weight").value = ""; $("BMI").value = "";
    $("bmi-warn").classList.add("hidden");
  };

  // ═══════════ Predict ═══════════
  function zscore(vals) { const z={}; for(const f of FEATURES) z[f]=(vals[f]-ZP[f].m)/ZP[f].s; return z; }
  function predict(vals) {
    const z = zscore(vals);
    const scores = COEF.map(c=>{let s=c.int; for(const f of FEATURES) s+=c[f]*z[f]; return s;});
    const max = Math.max(...scores), exps = scores.map(s=>Math.exp(s-max));
    const sum = exps.reduce((a,b)=>a+b,0);
    return CLASSES.map((c,i)=>({cluster:c, prob:exps[i]/sum, score:scores[i]}));
  }

  // ═══════════ Slider sync ═══════════
  function sliderValToDisplay(f, sv) {
    const sel = $(f+"-unit"), unit = (sel&&sel.value!=="native")?sel.value:null;
    return (unit&&UNIT_REV[f]?.[unit])?UNIT_REV[f][unit](sv):sv;
  }
  window.syncFromSlider = function(f) {
    const slider = $(f+"-slider"), nv = parseFloat(slider.value);
    const dv = sliderValToDisplay(f, nv);
    const dec = f==="WHR"?4:f==="hba1c"||f==="TG"||f==="HDL_C"?1:0;
    $(f).value = dv.toFixed(dec);
    checkAll();
    if (!window._hardLimitBlocked && !$("btn-calc").disabled) window.calcSilent();
  };
  function syncToSlider(f) { const sl=$(f+"-slider"); if(!sl)return; const r=$(f).value.trim(); if(r==="")return; const nv=toNative(f,r); if(isNaN(nv))return; const[lo,hi]=SLIDER[f]||[0,200,1]; sl.value=Math.max(lo,Math.min(hi,nv)); }

  // ═══════════ Validation ═══════════
  window._hardLimitBlocked = false;
  function checkAll() {
    let allFilled = true, anyHard = false;
    for (const f of REQUIRED) {
      const el=$(f), raw=el.value.trim(), card=el.closest(".input-group");
      const hardEl=card?.querySelector(".hard-err"), softEl=card?.querySelector(".soft-warn");
      if (raw==="") { allFilled=false; clearWarn(card); continue; }
      const nv = (f==="Waist"||f==="Hip") ? parseFloat(raw) : toNative(f, raw);
      if (isNaN(nv)) { allFilled=false; clearWarn(card); continue; }
      const lim = HARD[f]; if (!lim) continue;
      const [lo,hi] = lim;
      if (nv<lo || nv>hi) {
        card.classList.add("ring-1","ring-red-400");
        if (hardEl) { hardEl.classList.remove("hidden"); hardEl.textContent=t("hardLimitMsg"); }
        anyHard=true;
      } else {
        card.classList.remove("ring-1","ring-red-400");
        if (hardEl) hardEl.classList.add("hidden");
      }
      if (f!=="Waist"&&f!=="Hip") {
        const zv = (nv-ZP[f].m)/ZP[f].s;
        if (Math.abs(zv)>3 && !anyHard) { if(softEl){softEl.classList.remove("hidden");softEl.textContent=t("softWarnMsg");} }
        else { if(softEl) softEl.classList.add("hidden"); }
      }
    }
    const btn = $("btn-calc");
    btn.disabled = !allFilled || anyHard;
    btn.className = (!allFilled||anyHard)
      ? "w-full py-2.5 rounded-xl text-base font-semibold text-white bg-slate-300 cursor-not-allowed transition-all"
      : "w-full py-2.5 rounded-xl text-base font-semibold text-white bg-gradient-to-b from-navy-700 to-navy-600 hover:from-navy-600 hover:to-navy-500 active:from-navy-800 active:to-navy-700 transition-all shadow-sm";
    for (const f of FEATURES) syncToSlider(f);
  }
  function clearWarn(card) { card?.classList.remove("ring-1","ring-red-400"); card?.querySelector(".hard-err")?.classList.add("hidden"); card?.querySelector(".soft-warn")?.classList.add("hidden"); }

  // ═══════════ Unit Switch ═══════════
  window.switchUnit = function(f) {
    const el=$(f), raw=el.value.trim(); if(raw==="")return;
    const nv=toNative(f,raw); if(isNaN(nv))return;
    const sel=$(f+"-unit"); if(!sel)return;
    el.value = (sel.value==="native"?nv:(UNIT_REV[f]?.[sel.value]||(x=>x))(nv)).toFixed(sel.value==="native"?(f==="Creatinine"||f==="SBP"||f==="ALT"?0:1):2);
    checkAll();
  };

  // ═══════════ Fill / Clear ═══════════
  window.spin = function(f, delta) {
    const el = $(f), raw = el.value.trim();
    const nv = raw === "" ? (ZP[f]?ZP[f].m:100) : (toNative(f, raw) || 0);
    const step = { SBP:5, hba1c:2, TG:0.1, HDL_C:0.05, Creatinine:5, ALT:5, Waist:5, Hip:5 }[f] || 1;
    const lim = HARD[f] || [0,9999];
    const newNative = Math.max(lim[0], Math.min(lim[1], nv + delta * step));
    const sel = $(f+"-unit"); const unit = (sel && sel.value !== "native") ? sel.value : null;
    const displayVal = (unit && UNIT_REV[f]?.[unit]) ? UNIT_REV[f][unit](newNative) : newNative;
    const decimals = f==="WHR"?4 : f==="hba1c"||f==="TG"||f==="HDL_C"?1 : 0;
    el.value = displayVal.toFixed(decimals);
    syncToSlider(f);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    if (f==="Waist"||f==="Hip") window.calcWHR();
  };
  window.spinSBP = function(d) { window.spin("SBP", d); };
  window.spinWaist = function(d) { window.spin("Waist", d); };
  window.spinHip = function(d) { window.spin("Hip", d); };
  window.spinHeight = function(d) { const el=$("Height"); const v=parseFloat(el.value)||170; el.value=Math.max(100,Math.min(250,(v+d*5).toFixed(1))); el.dispatchEvent(new Event("input",{bubbles:true})); window.calcBMI(); };
  window.spinWeight = function(d) { const el=$("Weight"); const v=parseFloat(el.value)||95; el.value=Math.max(30,Math.min(300,(v+d*5).toFixed(1))); el.dispatchEvent(new Event("input",{bubbles:true})); window.calcBMI(); };
  window.fillDemo = function() {
    const patient = DEMOS[Math.floor(Math.random()*DEMOS.length)];
    const fields = ["SBP","hba1c","TG","HDL_C","Creatinine","ALT","Waist","Hip"];
    for (const f of fields) {
      const el=$(f), sel=$(f+"-unit");
      const unit = (sel&&sel.value!=="native")?sel.value:null;
      const nv = patient[f];
      const dv = (unit&&UNIT_REV[f]?.[unit])?UNIT_REV[f][unit](nv):nv;
      el.value = dv;
      clearWarn(el.closest(".input-group"));
      el.dispatchEvent(new Event("input",{bubbles:true}));
    }
    window.calcWHR();
    const idx = DEMOS.indexOf(patient);
    const zhNames = ["低风险肥胖","肾脏主导","高血糖","高HDL","血脂异常肝脏"];
    const enNames = ["Low-risk obesity","Renal-dominant","Hyperglycaemic","High-HDL","Dyslipidaemic-hepatic"];
    const link = document.querySelector('[onclick="fillDemo()"]');
    if (link) {
      link.textContent = LANG==="zh"?`已填充：${zhNames[idx]} 样本`:`Filled: ${enNames[idx]} sample`;
      link.style.color = COLORS[idx+1];
      setTimeout(()=>{link.textContent=t("fillDemo");link.style.color="";},2800);
    }
    checkAll();
  };
  window.clearAll = function() {
    for (const f of REQUIRED) { $(f).value=""; clearWarn($(f).closest(".input-group")); }
    $("WHR").value=""; $("bmi-warn").classList.add("hidden");
    if(probChart){probChart.destroy();probChart=null;}
    lastResult=null; $("results-area").classList.add("hidden");
    checkAll();
  };

  // ═══════════ Language ═══════════
  window.switchLang = function(lang) {
    LANG = lang;
    document.querySelectorAll("[data-i18n]").forEach(el=>{el.innerHTML=t(el.getAttribute("data-i18n"));});
    document.querySelectorAll("[data-i18n-ph]").forEach(el=>{el.placeholder=t(el.getAttribute("data-i18n-ph"));});
    document.getElementById("btn-en").classList.toggle("bg-white",lang==="en");
    document.getElementById("btn-en").classList.toggle("text-navy-800",lang==="en");
    document.getElementById("btn-en").classList.toggle("bg-transparent",lang!=="en");
    document.getElementById("btn-en").classList.toggle("text-white/80",lang!=="en");
    document.getElementById("btn-zh").classList.toggle("bg-white",lang==="zh");
    document.getElementById("btn-zh").classList.toggle("text-navy-800",lang==="zh");
    document.getElementById("btn-zh").classList.toggle("bg-transparent",lang!=="zh");
    document.getElementById("btn-zh").classList.toggle("text-white/80",lang!=="zh");
    document.title=t("title");
    $("fill-hint").textContent=t("fillHint");
    $("btn-calc").textContent=t("btnCalc");
    checkAll();
    const tb=$("tab-bar"); if(tb)tb.textContent=LANG==="zh"?"柱状图":"Bar Chart";
    const tr=$("tab-radar"); if(tr)tr.textContent=LANG==="zh"?"雷达图":"Radar";
    const tt=$("tab-table"); if(tt)tt.textContent=t("viewScores");
    if(lastResult) {
      const best=lastResult.reduce((a,b)=>a.prob>b.prob?a:b);
      const sorted=[...lastResult].sort((a,b)=>b.prob-a.prob); const margin=sorted[0].prob-sorted[1].prob;
      $("badge-card").innerHTML=`<div class="flex flex-col items-center justify-center text-center h-full"><div class="text-xs text-muted uppercase tracking-[0.15em] mb-2">${t("predictedSubtype")}</div><div id="res-subtype" class="text-7xl font-bold tracking-tight leading-none" style="color:${COLORS[best.cluster]}">${LANG==="zh"?["","LRO","RDO","HGO","HHO","DHO"][best.cluster]:["","LRO","RDO","HGO","HHO","DHO"][best.cluster]}</div><div id="res-name" class="text-base text-muted mt-3 font-medium">${LANG==="zh"?NAME_ZH[best.cluster]:NAME_EN[best.cluster]}</div><div class="flex justify-center gap-8 mt-6"><div class="text-center"><div class="text-xs text-muted uppercase tracking-[0.15em]">${t("confidence")}</div><div class="text-lg font-bold text-ink mt-1">${(best.prob*100).toFixed(1)}%</div></div><div class="text-center"><div class="text-xs text-muted uppercase tracking-[0.15em]">${t("margin")}</div><div class="text-lg font-bold text-ink mt-1">${(margin*100).toFixed(1)}%</div></div></div></div>`;
      if(chartMode===2) showTable(lastResult);
    }
  };

  // ═══════════ Calculate ═══════════
  function doCalc(scroll) {
    const vals = {};
    for (const f of FEATURES) {
      if (f==="WHR") { vals[f]=parseFloat($("WHR").value)||0; continue; }
      vals[f]=toNative(f,$(f).value);
    }
    const result = predict(vals);
    const best = result.reduce((a,b)=>a.prob>b.prob?a:b);
    const sorted = [...result].sort((a,b)=>b.prob-a.prob);
    const margin = sorted[0].prob-sorted[1].prob;
    const c = best.cluster;

    if(probChart){probChart.destroy();probChart=null;}
    lastResult=result; chartMode=0;

    $("badge-card").innerHTML = `<div class="flex flex-col items-center justify-center text-center h-full"><div class="text-xs text-muted uppercase tracking-[0.15em] mb-2">${t("predictedSubtype")}</div><div id="res-subtype" class="text-7xl font-bold tracking-tight leading-none" style="color:${COLORS[c]}">${["","LRO","RDO","HGO","HHO","DHO"][c]}</div><div id="res-name" class="text-base text-muted mt-3 font-medium">${LANG==="zh"?NAME_ZH[c]:NAME_EN[c]}</div><div class="flex justify-center gap-8 mt-6"><div class="text-center"><div class="text-xs text-muted uppercase tracking-[0.15em]">${t("confidence")}</div><div class="text-lg font-bold text-ink mt-1">${(best.prob*100).toFixed(1)}%</div></div><div class="text-center"><div class="text-xs text-muted uppercase tracking-[0.15em]">${t("margin")}</div><div class="text-lg font-bold text-ink mt-1">${(margin*100).toFixed(1)}%</div></div></div></div>`;

    $("chart-card").innerHTML = `<div class="flex flex-col h-full w-full"><div id="chart-area" class="flex-1" style="min-height:280px"><canvas id="prob-chart"></canvas></div><div class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-line"><button type="button" onclick="switchChart(-1)" class="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted hover:text-navy-700 hover:border-navy-700/30 transition-colors text-sm shrink-0">&larr;</button><button type="button" id="tab-bar" onclick="switchToChart(0)" class="px-4 py-2 rounded-lg text-sm font-semibold bg-navy-700 text-white transition-colors">${LANG==="zh"?"柱状图":"Bar Chart"}</button><button type="button" id="tab-radar" onclick="switchToChart(1)" class="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-muted hover:bg-slate-200 transition-colors">${LANG==="zh"?"雷达图":"Radar"}</button><button type="button" id="tab-table" onclick="switchToChart(2)" class="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-muted hover:bg-slate-200 transition-colors">${t("viewScores")}</button><button type="button" onclick="switchChart(1)" class="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted hover:text-navy-700 hover:border-navy-700/30 transition-colors text-sm shrink-0">&rarr;</button></div></div>`;

    $("results-area").classList.remove("hidden");
    if(scroll) $("badge-card").scrollIntoView({behavior:"smooth",block:"nearest"});
    chartMode=0; updateTabs(0);
    setTimeout(()=>drawBar(result),60);
  }
  window.calc = function() { if($("btn-calc").disabled)return; doCalc(true); };
  window.calcSilent = function() { if($("btn-calc").disabled)return; doCalc(false); };

  // ═══════════ Chart ═══════════
  function drawBar(result) {
    if(probChart)probChart.destroy();
    $("chart-area").innerHTML='<canvas id="prob-chart"></canvas>';
    $("chart-area").style.height="340px";
    const labels=result.map(r=>["","LRO","RDO","HGO","HHO","DHO"][r.cluster]);
    const data=result.map(r=>r.prob*100);
    const colors=result.map(r=>COLORS[r.cluster]);
    probChart=new Chart($("prob-chart"),{type:"bar",data:{labels,datasets:[{data,backgroundColor:colors.map(c=>c+"CC"),borderColor:colors,borderWidth:2,borderRadius:5,borderSkipped:false}]},options:{indexAxis:"y",responsive:true,maintainAspectRatio:false,animation:{duration:400},plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,max:100,ticks:{callback:v=>v+"%"},grid:{color:"#e2e8f0"}},y:{ticks:{font:{weight:"bold",size:12}},grid:{display:false}}}}});
  }
  function drawRadar(result) {
    if(probChart)probChart.destroy();
    $("chart-area").innerHTML='<canvas id="prob-chart"></canvas>';
    $("chart-area").style.height="380px";
    const labels=result.map(r=>["","LRO","RDO","HGO","HHO","DHO"][r.cluster]);
    const data=result.map(r=>r.prob*100);
    const colors=result.map(r=>COLORS[r.cluster]);
    probChart=new Chart($("prob-chart"),{type:"radar",data:{labels,datasets:[{data,backgroundColor:"rgba(37,99,235,0.10)",borderColor:"#2563eb",borderWidth:2.5,pointBackgroundColor:colors,pointBorderColor:colors,pointRadius:5,fill:true}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:500},plugins:{legend:{display:false}},scales:{r:{beginAtZero:true,max:100,ticks:{stepSize:20,backdropColor:"transparent",font:{size:10}},pointLabels:{font:{weight:"bold",size:12}},grid:{color:"#e2e8f0"},angleLines:{color:"#e2e8f0"}}}}});
  }
  function showTable(result) {
    if(probChart){probChart.destroy();probChart=null;}
    $("chart-area").style.height="auto";
    const c = result.reduce((a,b)=>a.prob>b.prob?a:b).cluster;
    let rows="", names=["","LRO","RDO","HGO","HHO","DHO"];
    for(const r of result) rows+=`<tr class="${r.cluster===c?'bg-blue-50/60 font-semibold':''}"><td class="py-2.5 px-3"><span class="inline-block w-2.5 h-2.5 rounded-full mr-2" style="background:${COLORS[r.cluster]}"></span>${names[r.cluster]}</td><td class="py-2.5 px-3 text-right tabular-nums text-sm">${(r.prob*100).toFixed(2)}%</td><td class="py-2.5 px-3 text-right text-muted font-mono text-sm tabular-nums">${r.score.toFixed(2)}</td></tr>`;
    $("chart-area").innerHTML=`<table class="w-full text-sm"><thead><tr class="text-muted text-xs uppercase tracking-wide"><th class="text-left py-2 px-3 font-medium">${t("subtype")}</th><th class="text-right py-2 px-3 font-medium">${t("probability")}</th><th class="text-right py-2 px-3 font-medium">${t("score")}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  function updateTabs(mode) {
    ["tab-bar","tab-radar","tab-table"].forEach((id,i)=>{const el=$(id);if(!el)return;el.className=i===mode?"px-4 py-2 rounded-lg text-sm font-semibold bg-navy-700 text-white transition-colors":"px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-muted hover:bg-slate-200 transition-colors";});
  }
  window.switchToChart = function(mode) { if(!lastResult)return; chartMode=mode; updateTabs(mode); if(mode===0)drawBar(lastResult); else if(mode===1)drawRadar(lastResult); else showTable(lastResult); };
  window.switchChart = function(dir) { if(!lastResult)return; chartMode=(chartMode+dir+3)%3; updateTabs(chartMode); if(chartMode===0)drawBar(lastResult); else if(chartMode===1)drawRadar(lastResult); else showTable(lastResult); };

  // ═══════════ Init ═══════════
  document.addEventListener("DOMContentLoaded",()=>{
    for(const f of REQUIRED) { const el=$(f); el.addEventListener("input",checkAll); el.addEventListener("blur",checkAll); }
    for(const f of FEATURES) { const el=$(f); if(el)el.addEventListener("keydown",e=>{if(e.key==="Enter")window.calc();}); }
    $("Waist").addEventListener("input",window.calcWHR); $("Hip").addEventListener("input",window.calcWHR);
    $("Height").addEventListener("input",window.calcBMI); $("Weight").addEventListener("input",window.calcBMI);
    checkAll();
  });
})();
