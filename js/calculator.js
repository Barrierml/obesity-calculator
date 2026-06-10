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
      optionalLabel: "optional",
      label_TG: "Triglycerides (TG)",
      label_HDL_C: "HDL Cholesterol (HDL-C)",
      label_Creatinine: "Creatinine",
      label_ALT: "Alanine Transaminase (ALT)",
      label_Waist: "Waist circumference",
      label_Hip: "Hip circumference",
      label_WHR: "Waist-to-Hip Ratio (WHR)",
      label_Height: "Height",
      label_Weight: "Weight",
      label_BMI: "BMI",
      bodyTitle: "BMI Calculator",
      clearBMI: "Clear",
      bmiWarn: "BMI is below 30. This model is only validated for individuals with BMI ≥ 30 kg/m².",
      ph_SBP: "e.g. 130",
      ph_hba1c: "e.g. 40",
      ph_WHR: "Auto-calculated",
      ph_BMI: "Auto-calculated",
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
      batchTitle: "Batch CSV Prediction",
      batchDesc: "Upload a CSV with ID and seven raw UKB-unit indicators. The browser will generate a two-column result CSV locally.",
      batchInput: "Input: ID, SBP, HbA1c, TG, HDL-C, Creatinine, ALT, WHR",
      batchOutput: "Output: ID, subtype",
      viewExampleInput: "View example input",
      viewExampleOutput: "View example output",
      batchGuide: "Input guide",
      exampleInputTitle: "Example input CSV",
      exampleOutputTitle: "Example output CSV",
      batchGuideTitle: "CSV input guide",
      uploadCsv: "Upload CSV",
      dropTitle: "Drop CSV here",
      dropHint: "or click to choose a file",
      batchStatusIdle: "No CSV selected.",
      batchStatusWorking: "Processing CSV locally...",
      batchStatusReady: "Processed {n} rows. Preview or download the result.",
      batchStatusError: "CSV error: {msg}",
      previewResult: "Preview result",
      downloadResult: "Download result CSV",
      clearBatch: "Clear CSV",
      resultPreviewTitle: "Prediction result preview",
      batchMissingColumns: "missing required columns: {cols}",
      batchInvalidValue: "invalid or missing value at row {row}, column {col}",
      methTitle: "Methodology",
      methFlow: "Calculation Steps",
      methStep1: "Z-score normalization: z = (x − μ) / σ using UKB population parameters",
      methStep2: "Linear scoring: scoreₖ = β₀ₖ + Σ βᵢₖ · zᵢ",
      methStep3: "Softmax: P(Cₖ) = exp(scoreₖ) / Σ exp(scoreₗ)",
      methStep4: "Predicted subtype: argmax P(Cₖ)",
      methModel: "Model Information",
      methM1: "Model: Multinomial Ridge Regression",
      methM2: "Training: 88,877 UK Biobank participants (BMI ≥ 30)",
      methM3: "Features: 7 routine clinical variables",
      methM4: "Validation: 5-fold CV, Macro-AUC ≈ 0.89",
      methM5: "Privacy: All computation runs locally in the browser",
      methCoeff: "Ridge Regression Coefficients",
      tabCoeff: "Coefficients Table",
      viewDefs: "View Subtype Definitions",
      modalTitle: "Obesity Subtype Definitions",
      lro_title: "LRO — Low-risk obesity",
      lro_desc: "Features the most favorable metabolic profile among the subtypes. Biomarkers such as HbA1c, lipids, and liver/renal enzymes remain within or close to normal physiological ranges, indicating a \"metabolically healthy\" obesity phenotype with lower immediate cardiometabolic risk.",
      rdo_title: "RDO — Renal-dominant obesity",
      rdo_desc: "Primarily characterized by elevated serum creatinine levels relative to other clusters. This phenotype points towards early renal hemodynamic alterations, suggesting a higher baseline susceptibility to obesity-related nephropathy or chronic kidney disease (CKD).",
      hgo_title: "HGO — Hyperglycaemic obesity",
      hgo_desc: "Defined by markedly elevated HbA1c levels, reflecting severe insulin resistance and poor glycemic control. Patients in this cluster have the highest clinical overlap with prediabetes and overt type 2 diabetes mellitus.",
      hho_title: "HHO — High-HDL obesity",
      hho_desc: "A distinct phenotypic cluster maintaining paradoxically elevated levels of High-Density Lipoprotein Cholesterol (HDL-C) despite an obese state. While typical obesity is associated with low HDL-C, this subtype requires context-specific risk assessment.",
      dho_title: "DHO — Dyslipidaemic–hepatic obesity",
      dho_desc: "Characterised by elevated triglycerides (TG) and Alanine Transaminase (ALT), strongly suggesting hepatic involvement (such as MASLD/NAFLD) alongside systemic dyslipidaemia. HbA1c and blood pressure tend to be intermediate.",
      tabDefs: "Subtype Definitions",
      methCoeffNote: "Interpretation: A positive β means the feature increases the log-odds of that subtype. HDL-C's large positive coefficient (95.41) for HHO reflects this subtype's defining characteristic of exceptionally high HDL cholesterol.",
      methRidge: "This model uses multinomial ridge regression (L2-regularized logistic regression). The L2 penalty shrinks extreme coefficients, improving generalizability. The optimal regularization parameter C was selected via 5-fold cross-validation.",
      licenseTitle: "License",
      licenseIntro: 'This work is licensed under a <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-navy-700 underline underline-offset-2">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a> (CC BY-NC-ND). By accessing the material through this website, you are confirming that you agree that your use of the material is subject to these licence terms.',
      licensePersonalUse: "Please note that the use of this webtool is limited to personal, non-commercial use.",
      licenseFreeTo: "You are free to:",
      licenseShare: "Share — copy and redistribute the material in any medium or format",
      licenseIrrevocable: "The licensor cannot revoke these freedoms as long as you follow the license terms.",
      licenseTermsTitle: "Under the following terms:",
      licenseBY: "BY = Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.",
      licenseNC: "NC = NonCommercial — You may not use the material for commercial purposes.",
      licenseND: "ND = NoDerivatives — If you remix, transform, or build upon the material, you may not distribute the modified material.",
      licenseFullTerms: 'For the full licence terms, please visit: <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-navy-700 underline underline-offset-2">https://creativecommons.org/licenses/by-nc-nd/4.0/</a>.',
    },
    zh: {
      title: "肥胖亚型预测计算器",
      subtitle: "LRO · RDO · HGO · HHO · DHO &middot; UK Biobank Ridge 模型",
      formTitle: "临床指标输入",
      fillDemo: "填充示例数据",
      clearBtn: "清空",
      label_SBP: "收缩压 (SBP)",
      label_hba1c: "糖化血红蛋白 (HbA1c)",
      optionalLabel: "可选",
      label_TG: "甘油三酯 (TG)",
      label_HDL_C: "高密度脂蛋白胆固醇 (HDL-C)",
      label_Creatinine: "肌酐 (Creatinine)",
      label_ALT: "谷丙转氨酶 (ALT)",
      label_Waist: "腰围",
      label_Hip: "臀围",
      label_WHR: "腰臀比 (WHR)",
      label_Height: "身高",
      label_Weight: "体重",
      label_BMI: "BMI",
      bodyTitle: "BMI 计算器",
      clearBMI: "清空",
      bmiWarn: "BMI 低于 30。本模型仅适用于 BMI ≥ 30 kg/m² 的个体。",
      ph_SBP: "例如 130",
      ph_hba1c: "例如 40",
      ph_WHR: "自动计算",
      ph_BMI: "自动计算",
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
      batchTitle: "批量 CSV 预测",
      batchDesc: "上传一个包含 ID 和 7 个 UKB 单位原始指标的 CSV，浏览器会在本地生成两列结果 CSV。",
      batchInput: "输入：ID, SBP, HbA1c, TG, HDL-C, Creatinine, ALT, WHR",
      batchOutput: "输出：ID, subtype",
      viewExampleInput: "查看示例输入",
      viewExampleOutput: "查看示例输出",
      batchGuide: "指标说明",
      exampleInputTitle: "示例输入 CSV",
      exampleOutputTitle: "示例输出 CSV",
      batchGuideTitle: "CSV 输入指标说明",
      uploadCsv: "上传 CSV",
      dropTitle: "拖拽 CSV 到这里",
      dropHint: "或点击选择文件",
      batchStatusIdle: "尚未选择 CSV。",
      batchStatusWorking: "正在本地处理 CSV...",
      batchStatusReady: "已处理 {n} 行。可预览或下载结果。",
      batchStatusError: "CSV 错误：{msg}",
      previewResult: "预览结果",
      downloadResult: "下载结果 CSV",
      clearBatch: "清空 CSV",
      resultPreviewTitle: "预测结果预览",
      batchMissingColumns: "缺少必需列：{cols}",
      batchInvalidValue: "第 {row} 行的 {col} 列缺失或不是有效数值",
      methTitle: "方法学说明",
      methFlow: "计算流程",
      methStep1: "Z-score 标准化：z = (x − μ) / σ（使用 UKB 总体参数）",
      methStep2: "线性评分：scoreₖ = β₀ₖ + Σ βᵢₖ · zᵢ",
      methStep3: "Softmax：P(Cₖ) = exp(scoreₖ) / Σ exp(scoreₗ)",
      methStep4: "预测亚型 = argmax P(Cₖ)",
      methModel: "模型信息",
      methM1: "模型：多重Ridge回归",
      methM2: "训练样本：88,877 名 UK Biobank 参与者（BMI ≥ 30）",
      methM3: "特征：7 项临床指标",
      methM4: "验证：5 折交叉验证，Macro-AUC ≈ 0.89",
      methM5: "隐私：所有计算在浏览器本地完成",
      methCoeff: "Ridge 回归系数",
      tabCoeff: "系数表",
      viewDefs: "查看亚型定义",
      modalTitle: "肥胖亚型定义",
      lro_title: "LRO — 低风险型肥胖",
      lro_desc: "在所有亚型中具有最良好的代谢特征。糖化血红蛋白（HbA1c）、血脂以及肝肾功能酶类等生物标志物保持在正常或接近正常的生理范围内，代表\"代谢健康型肥胖\"表型，短期内核心代谢及心血管疾病的发生风险较低。",
      rdo_title: "RDO — 肾脏主导型肥胖",
      rdo_desc: "主要特征为血清肌酐（Creatinine）水平相对其他亚型显著升高。该表型提示早期肾脏血液动力学改变，意味着患者对肥胖相关肾病或慢性肾脏病（CKD）具有更高的临床易感性。",
      hgo_title: "HGO — 高血糖型肥胖",
      hgo_desc: "以显著升高的糖化血红蛋白（HbA1c）水平为核心特征，反映了严重的胰岛素抵抗和不良的血糖控制。该亚型患者在临床上与糖尿病前期及确诊的 2 型糖尿病重叠度最高。",
      hho_title: "HHO — 高HDL型肥胖",
      hho_desc: "一种独特的临床表型，尽管患者处于肥胖状态，但仍维持异常高水平的高密度脂蛋白胆固醇（HDL-C）。由于典型肥胖通常伴随低 HDL-C，该特殊亚型需结合特定的遗传或代谢背景进行个体化评估。",
      dho_title: "DHO — 血脂异常-肝脏型肥胖",
      dho_desc: "以甘油三酯（TG）和谷丙转氨酶（ALT）显著升高为显著特征，强烈提示伴有早期肝脏受累（如代谢相关脂肪性肝病 MASLD/NAFLD）以及全身性血脂异常。其糖化血红蛋白和血压水平通常表现为中度异常。",
      tabDefs: "亚型定义",
      methCoeffNote: "解读：正系数表示该特征增加相应亚型的对数几率。HDL-C 在 HHO 亚型上的极大正系数 (95.41) 反映了该亚型以极高 HDL 胆固醇为核心特征。",
      methRidge: "本模型采用多项 Ridge 回归（L2 正则化逻辑回归）。L2 惩罚项收缩极端系数，提高泛化能力。最优正则化参数 C 通过 5 折交叉验证选择。",
      licenseTitle: "许可协议",
      licenseIntro: '本作品采用 <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-navy-700 underline underline-offset-2">知识共享 署名-非商业性使用-禁止演绎 4.0 国际许可协议</a>（CC BY-NC-ND）进行许可。通过本网站访问相关材料，即表示您确认并同意，您对本材料的使用受这些许可条款约束。',
      licensePersonalUse: "请注意，本网页工具仅限个人、非商业用途使用。",
      licenseFreeTo: "您可以：",
      licenseShare: "共享 — 以任何媒介或格式复制和再分发本材料",
      licenseIrrevocable: "只要您遵守许可条款，许可人不得撤回上述自由。",
      licenseTermsTitle: "使用须遵守以下条款：",
      licenseBY: "BY = 署名 — 您必须给出适当署名，提供许可协议链接，并说明是否作出修改。您可以用任何合理方式进行署名，但不得以任何方式暗示许可人为您或您的使用背书。",
      licenseNC: "NC = 非商业性使用 — 您不得将本材料用于商业目的。",
      licenseND: "ND = 禁止演绎 — 如果您对本材料进行再混合、转换或基于本材料进行创作，您不得分发修改后的材料。",
      licenseFullTerms: '完整许可条款请访问：<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-navy-700 underline underline-offset-2">https://creativecommons.org/licenses/by-nc-nd/4.0/</a>。',
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
    SBP:{m:144.261698752208,s:18.3049127093897}, hba1c:{m:38.288260179799,s:8.15326894473964}, TG:{m:2.06459139619924,s:1.05887835734525},
    HDL_C:{m:1.77662319835278,s:0.693223111946496}, Creatinine:{m:74.6817388075655,s:15.2241707689751}, ALT:{m:29.0509011892841,s:15.1245458778404}, WHR:{m:0.928901505744505,s:0.0865978339462485},
  };
  const COEF = [
    { int:57.947312955068654,SBP:-12.025405717991879,hba1c:-36.60881861339705,TG:-29.20267115488223,HDL_C:-36.2232507437771,Creatinine:-38.02660114786002,ALT:-36.847810416677795,WHR:-59.00487481571789},
    { int:82.50954354804371,SBP:5.6192209478167445,hba1c:-30.490652841350098,TG:-14.966818415046827,HDL_C:-22.689264643192285,Creatinine:34.3698240517385,ALT:-20.956522168114848,WHR:20.393969704570694},
    { int:-135.87759846126272,SBP:1.9900636482202922,hba1c:130.82260090566632,TG:8.30944162635771,HDL_C:-13.28729324615973,Creatinine:-10.912543321264138,ALT:7.804344085354792,WHR:18.64301103000144},
    { int:-19.341530392691297,SBP:-1.904640008886198,hba1c:-36.15733020669558,TG:-25.73974623114728,HDL_C:95.41181951326253,Creatinine:13.909462630886257,ALT:-1.7751551540675148,WHR:6.785899215987084},
    { int:14.762272350752943,SBP:6.320761130840697,hba1c:-27.565799244221648,TG:61.599794174721936,HDL_C:-23.2120108801449,Creatinine:0.6598577864945157,ALT:51.77514365350848,WHR:13.181994865158394},
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
    { SBP:135, hba1c:42, TG:1.8, HDL_C:1.6, Creatinine:70, ALT:45, Waist:92, Hip:100 },   // LRO 53% + DHO 42% + RDO 5%
    { SBP:120, hba1c:55, TG:1.6, HDL_C:1.2, Creatinine:100, ALT:15, Waist:82, Hip:100 },   // RDO 62% + HGO 30% + LRO 8%
    { SBP:120, hba1c:55, TG:0.8, HDL_C:1.2, Creatinine:100, ALT:25, Waist:82, Hip:100 },   // HGO 63% + RDO 32% + LRO 5%
    { SBP:105, hba1c:40, TG:1.8, HDL_C:2.2, Creatinine:65, ALT:35, Waist:98, Hip:100 },   // HHO 39% + LRO 34% + RDO 26%
    { SBP:120, hba1c:50, TG:3.5, HDL_C:1.8, Creatinine:60, ALT:35, Waist:85, Hip:100 },   // DHO 46% + HGO 33% + LRO 22%
  ];

  // ═══════════ State ═══════════
  const $ = id => document.getElementById(id);
  let probChart = null, chartMode = 0, lastResult = null;
  let lastBatchOutput = "";
  let lastBatchN = 0;

  // ═══════════ Helpers ═══════════
  function toNative(f, raw) {
    const v = parseFloat(raw); if (isNaN(v)) return NaN;
    const sel = $(f+"-unit"); if (!sel||sel.value==="native") return v;
    return (UNIT_CONV[f]?.[sel.value]||(x=>x))(v);
  }
  function displayDecimals(f, unit) {
    if (unit && unit !== "native") return 2;
    if (f === "TG" || f === "HDL_C") return 2;
    if (f === "WHR") return 4;
    return 1;
  }

  // ═══════════ Auto-calc WHR & BMI ═══════════
  window.calcWHR = function() {
    const w = parseFloat($("Waist").value), h = parseFloat($("Hip").value);
    if (!isNaN(w) && !isNaN(h) && h > 0) {
      const whr = w / h;
      $("WHR").dataset.raw = String(whr);
      $("WHR").value = whr.toFixed(4);
    } else {
      $("WHR").dataset.raw = "";
      $("WHR").value = "";
    }
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

  // ═══════════ Batch CSV ═══════════
  const BATCH_ALIASES = {
    ID:["ID","id","eid","EID"],
    SBP:["SBP","sbp"],
    hba1c:["HbA1c","hba1c","HBA1C"],
    TG:["TG","tg","Triglycerides"],
    HDL_C:["HDL-C","HDL_C","HDL","hdl_c","hdl"],
    Creatinine:["Creatinine","creatinine"],
    ALT:["ALT","alt"],
    WHR:["WHR","whr"],
  };
  const SUBTYPE_CODE = {1:"LRO", 2:"RDO", 3:"HGO", 4:"HHO", 5:"DHO"};

  function parseCSV(text) {
    const rows = [];
    let row = [], cell = "", quoted = false;
    const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    for (let i=0; i<normalized.length; i++) {
      const ch = normalized[i], next = normalized[i+1];
      if (quoted) {
        if (ch === '"' && next === '"') { cell += '"'; i++; }
        else if (ch === '"') quoted = false;
        else cell += ch;
      } else if (ch === '"') {
        quoted = true;
      } else if (ch === ",") {
        row.push(cell); cell = "";
      } else if (ch === "\n") {
        row.push(cell);
        if (row.some(v=>v.trim() !== "")) rows.push(row);
        row = []; cell = "";
      } else {
        cell += ch;
      }
    }
    row.push(cell);
    if (row.some(v=>v.trim() !== "")) rows.push(row);
    return rows;
  }

  function csvEscape(value) {
    const s = String(value ?? "");
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function htmlEscape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function findColumn(headers, aliases) {
    for (const alias of aliases) {
      const idx = headers.indexOf(alias);
      if (idx !== -1) return idx;
    }
    return -1;
  }

  function formatMsg(key, values) {
    let msg = t(key);
    for (const [name, value] of Object.entries(values || {})) {
      msg = msg.replace(`{${name}}`, value);
    }
    return msg;
  }

  function setBatchStatus(key, values, isError) {
    const el = $("batch-status");
    if (!el) return;
    el.textContent = formatMsg(key, values);
    el.className = isError ? "mt-3 text-xs text-red-600" : "mt-3 text-xs text-slate-400";
  }

  function showBatchActions(show) {
    const actions = $("batch-actions");
    if (actions) actions.classList.toggle("hidden", !show);
  }

  function buildBatchOutput(text) {
    const rows = parseCSV(text);
    if (rows.length < 2) throw new Error("empty CSV");
    const headers = rows[0].map(h=>h.trim());
    const col = {};
    for (const key of ["ID", ...FEATURES]) {
      const idx = findColumn(headers, BATCH_ALIASES[key]);
      if (idx === -1) col[key] = -1;
      else col[key] = idx;
    }
    const missing = Object.entries(col).filter(([,idx])=>idx === -1).map(([key])=>BATCH_ALIASES[key][0]);
    if (missing.length) throw new Error(formatMsg("batchMissingColumns", { cols: missing.join(", ") }));

    const out = [["ID","subtype"]];
    for (let r=1; r<rows.length; r++) {
      const input = rows[r];
      const vals = {};
      for (const f of FEATURES) {
        const raw = (input[col[f]] ?? "").trim();
        const value = Number(raw);
        if (raw === "" || !Number.isFinite(value)) {
          throw new Error(formatMsg("batchInvalidValue", { row: r + 1, col: BATCH_ALIASES[f][0] }));
        }
        vals[f] = value;
      }
      const result = predict(vals);
      const best = result.reduce((a,b)=>a.prob>b.prob?a:b);
      out.push([input[col.ID] ?? "", SUBTYPE_CODE[best.cluster]]);
    }
    return out.map(row=>row.map(csvEscape).join(",")).join("\n") + "\n";
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }

  function csvRowsToTable(rows) {
    if (!rows.length) return `<p class="p-4 text-sm text-slate-500">Empty CSV</p>`;
    const headers = rows[0];
    const body = rows.slice(1);
    const head = headers.map(h=>`<th class="sticky top-0 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-600 border-b border-slate-100">${htmlEscape(h)}</th>`).join("");
    const bodyRows = body.map(row=>`<tr class="odd:bg-white even:bg-slate-50/50">${headers.map((_,i)=>`<td class="px-3 py-2 text-xs text-slate-600 border-b border-slate-50 whitespace-nowrap">${htmlEscape(row[i] ?? "")}</td>`).join("")}</tr>`).join("");
    return `<table class="w-full border-collapse"><thead><tr>${head}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  }

  async function loadExampleCsv(kind) {
    if (window.EXAMPLE_CSV?.[kind]) return window.EXAMPLE_CSV[kind];
    const path = kind === "output" ? "examples/example_output.csv" : "examples/example_input.csv";
    const response = await fetch(path);
    if (!response.ok) throw new Error(`failed to load ${path}`);
    return response.text();
  }

  window.showExampleCsv = async function(kind) {
    const modal = $("example-csv-modal");
    const title = $("example-csv-title");
    const table = $("example-csv-table");
    if (!modal || !title || !table) return;
    title.textContent = t(kind === "output" ? "exampleOutputTitle" : "exampleInputTitle");
    title.dataset.kind = kind;
    table.innerHTML = `<p class="p-4 text-sm text-slate-500">${t("batchStatusWorking")}</p>`;
    modal.showModal();
    try {
      const text = await loadExampleCsv(kind);
      table.innerHTML = csvRowsToTable(parseCSV(text));
    } catch (err) {
      table.innerHTML = `<p class="p-4 text-sm text-red-600">${htmlEscape(err.message || String(err))}</p>`;
    }
  };

  window.showBatchGuide = function() {
    const modal = $("example-csv-modal");
    const title = $("example-csv-title");
    const table = $("example-csv-table");
    if (!modal || !title || !table) return;
    title.textContent = t("batchGuideTitle");
    title.dataset.kind = "guide";
    const headers = LANG === "zh"
      ? ["CSV 列名", "含义", "单位", "可接受范围", "备注"]
      : ["CSV column", "Meaning", "Unit", "Accepted range", "Notes"];
    const rows = LANG === "zh" ? [
      ["ID", "样本或个体编号", "文本或数字", "不能为空", "输出表会原样保留该 ID"],
      ["SBP", "收缩压", "mmHg", "50 - 300", "请输入原始测量值，不要输入 z-score"],
      ["HbA1c", "糖化血红蛋白", "mmol/mol", "15 - 200", "批量 CSV 只接受 mmol/mol；单人计算器可切换百分比"],
      ["TG", "甘油三酯", "mmol/L", "0.1 - 100", "批量 CSV 只接受 mmol/L"],
      ["HDL-C", "高密度脂蛋白胆固醇", "mmol/L", "0.1 - 5", "列名也可写 HDL_C"],
      ["Creatinine", "肌酐", "umol/L", "10 - 2000", "批量 CSV 只接受 umol/L"],
      ["ALT", "谷丙转氨酶", "U/L", "1 - 10000", "请输入原始酶活性数值"],
      ["WHR", "腰臀比", "ratio", "0.5 - 1.5", "WHR = 腰围 / 臀围；批量 CSV 需要直接提供 WHR"],
    ] : [
      ["ID", "Sample or participant identifier", "text or number", "Required", "The same ID is preserved in the output"],
      ["SBP", "Systolic blood pressure", "mmHg", "50 - 300", "Use raw measurements, not z-scores"],
      ["HbA1c", "Glycated hemoglobin", "mmol/mol", "15 - 200", "Batch CSV accepts mmol/mol only; the single calculator can convert from %"],
      ["TG", "Triglycerides", "mmol/L", "0.1 - 100", "Batch CSV accepts mmol/L only"],
      ["HDL-C", "HDL cholesterol", "mmol/L", "0.1 - 5", "HDL_C is also accepted as a column name"],
      ["Creatinine", "Creatinine", "umol/L", "10 - 2000", "Batch CSV accepts umol/L only"],
      ["ALT", "Alanine transaminase", "U/L", "1 - 10000", "Use the raw enzyme value"],
      ["WHR", "Waist-to-hip ratio", "ratio", "0.5 - 1.5", "WHR = waist / hip; batch CSV should provide WHR directly"],
    ];
    const note = LANG === "zh"
      ? "适用范围：本模型用于 BMI ≥ 30 kg/m² 的肥胖个体亚型预测。所有 CSV 指标都应为原始单位数值，不应上传标准化后的 z-score。"
      : "Applicability: this model is intended for obesity subtyping among individuals with BMI >= 30 kg/m². CSV inputs should be raw-unit values, not standardized z-scores.";
    table.innerHTML = `${csvRowsToTable([headers, ...rows])}<p class="px-4 py-3 text-xs leading-relaxed text-slate-500 border-t border-slate-100">${htmlEscape(note)}</p>`;
    modal.showModal();
  };

  window.handleBatchCsv = function(file) {
    if (!file) return;
    lastBatchOutput = "";
    lastBatchN = 0;
    showBatchActions(false);
    setBatchStatus("batchStatusWorking");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const output = buildBatchOutput(String(reader.result || ""));
        const n = Math.max(0, output.trim().split("\n").length - 1);
        lastBatchOutput = output;
        lastBatchN = n;
        showBatchActions(true);
        setBatchStatus("batchStatusReady", { n });
      } catch (err) {
        showBatchActions(false);
        setBatchStatus("batchStatusError", { msg: err.message || String(err) }, true);
      }
    };
    reader.onerror = () => setBatchStatus("batchStatusError", { msg: "failed to read file" }, true);
    reader.readAsText(file);
  };

  window.previewBatchResult = function() {
    if (!lastBatchOutput) return;
    const modal = $("example-csv-modal");
    const title = $("example-csv-title");
    const table = $("example-csv-table");
    if (!modal || !title || !table) return;
    title.textContent = t("resultPreviewTitle");
    title.dataset.kind = "result";
    table.innerHTML = csvRowsToTable(parseCSV(lastBatchOutput));
    modal.showModal();
  };

  window.downloadBatchResult = function() {
    if (!lastBatchOutput) return;
    downloadText("subtype_predictions.csv", lastBatchOutput);
  };

  window.clearBatchCsv = function() {
    lastBatchOutput = "";
    lastBatchN = 0;
    const input = $("batch-csv-input");
    if (input) input.value = "";
    showBatchActions(false);
    setBatchStatus("batchStatusIdle");
    const modal = $("example-csv-modal");
    const title = $("example-csv-title");
    if (modal?.open && title?.dataset.kind === "result") modal.close();
  };

  function setupBatchDropZone() {
    const zone = $("batch-drop-zone");
    if (!zone) return;
    const activeClass = ["border-navy-700/50","bg-blue-50"];
    const setActive = active => activeClass.forEach(cls=>zone.classList.toggle(cls, active));
    ["dragenter","dragover"].forEach(eventName => {
      zone.addEventListener(eventName, event => {
        event.preventDefault();
        setActive(true);
      });
    });
    ["dragleave","dragend","drop"].forEach(eventName => {
      zone.addEventListener(eventName, event => {
        event.preventDefault();
        setActive(false);
      });
    });
    zone.addEventListener("drop", event => {
      const file = event.dataTransfer?.files?.[0];
      if (file) window.handleBatchCsv(file);
    });
  }

  // ═══════════ Slider sync ═══════════
  function sliderValToDisplay(f, sv) {
    const sel = $(f+"-unit"), unit = (sel&&sel.value!=="native")?sel.value:null;
    return (unit&&UNIT_REV[f]?.[unit])?UNIT_REV[f][unit](sv):sv;
  }
  window.syncFromSlider = function(f) {
    const slider = $(f+"-slider"), nv = parseFloat(slider.value);
    const dv = sliderValToDisplay(f, nv);
    const sel = $(f+"-unit");
    const dec = displayDecimals(f, sel?.value || "native");
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
    el.value = (sel.value==="native"?nv:(UNIT_REV[f]?.[sel.value]||(x=>x))(nv)).toFixed(displayDecimals(f, sel.value));
    checkAll();
  };

  // ═══════════ Fill / Clear ═══════════
  window.spin = function(f, delta) {
    const el = $(f), raw = el.value.trim();
    const nv = raw === "" ? (ZP[f]?ZP[f].m:100) : (toNative(f, raw) || 0);
    const step = { SBP:0.1, hba1c:0.1, TG:0.01, HDL_C:0.01, Creatinine:0.1, ALT:0.1, Waist:0.1, Hip:0.1 }[f] || 0.1;
    const lim = HARD[f] || [0,9999];
    const newNative = Math.max(lim[0], Math.min(lim[1], nv + delta * step));
    const sel = $(f+"-unit"); const unit = (sel && sel.value !== "native") ? sel.value : null;
    const displayVal = (unit && UNIT_REV[f]?.[unit]) ? UNIT_REV[f][unit](newNative) : newNative;
    const decimals = displayDecimals(f, unit || "native");
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
    $("WHR").value=""; $("WHR").dataset.raw=""; $("bmi-warn").classList.add("hidden");
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
    const exampleTitle = $("example-csv-title");
    if (exampleTitle && $("example-csv-modal")?.open) {
      const kind = exampleTitle.dataset.kind;
      exampleTitle.textContent = kind === "result" ? t("resultPreviewTitle") : t(kind === "guide" ? "batchGuideTitle" : kind === "output" ? "exampleOutputTitle" : "exampleInputTitle");
    }
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
      if (f==="WHR") { vals[f]=parseFloat($("WHR").dataset.raw || $("WHR").value)||0; continue; }
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

  // ═══════════ Coeff / Defs Tab Switcher ═══════════
  window.switchCoeffTab = function(mode) {
    const cp = document.getElementById("coeff-panel");
    const dp = document.getElementById("defs-panel");
    if (cp) cp.classList.toggle("hidden", mode !== 0);
    if (dp) dp.classList.toggle("hidden", mode !== 1);
    ["tab-coeff","tab-defs"].forEach((id,i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.className = i === mode
        ? "px-4 py-1.5 rounded-lg text-xs font-semibold bg-navy-700 text-white transition-colors"
        : "px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-muted hover:bg-slate-200 transition-colors";
    });
  };

  // ═══════════ Init ═══════════
  document.addEventListener("DOMContentLoaded",()=>{
    for(const f of REQUIRED) { const el=$(f); el.addEventListener("input",checkAll); el.addEventListener("blur",checkAll); }
    for(const f of FEATURES) { const el=$(f); if(el)el.addEventListener("keydown",e=>{if(e.key==="Enter")window.calc();}); }
    $("Waist").addEventListener("input",window.calcWHR); $("Hip").addEventListener("input",window.calcWHR);
    $("Height").addEventListener("input",window.calcBMI); $("Weight").addEventListener("input",window.calcBMI);
    const batchInput = $("batch-csv-input");
    if (batchInput) batchInput.addEventListener("change", e=>window.handleBatchCsv(e.target.files?.[0]));
    setupBatchDropZone();
    checkAll();
  });
})();
