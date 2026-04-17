(() => {
  /** @type {Array<{id:string,title:string,weight:number,left:{letter:string,name:string,summary:string},right:{letter:string,name:string,summary:string}}>} */
  const FIN5_DIMENSIONS = [
    {
      id: "pace",
      title: "节奏",
      weight: 1,
      left: { letter: "S", name: "快节奏", summary: "短反馈 / 临场执行" },
      right: { letter: "L", name: "长周期", summary: "深度打磨 / 耐心迭代" },
    },
    {
      id: "client",
      title: "对客",
      weight: 1,
      left: { letter: "C", name: "对外沟通", summary: "客户 / 协作 / 推动决策" },
      right: { letter: "A", name: "对内产出", summary: "分析 / 内容 / 体系化" },
    },
    {
      id: "risk",
      title: "风险",
      weight: 1,
      left: { letter: "R", name: "进攻性", summary: "接受不确定性换收益" },
      right: { letter: "P", name: "审慎性", summary: "稳定 / 边界清晰 / 可控" },
    },
    {
      id: "craft",
      title: "技能形态",
      weight: 1,
      left: { letter: "Q", name: "数理技术", summary: "数据 / 代码 / 模型" },
      right: { letter: "B", name: "商业表达", summary: "叙事 / 谈判 / 共识" },
    },
    {
      id: "order",
      title: "工作取向",
      weight: 1,
      left: { letter: "O", name: "秩序治理", summary: "规则 / 流程 / 可审计" },
      right: { letter: "X", name: "创新开拓", summary: "探索 / 产品 / 策略迭代" },
    },
  ];

  /** @type {Array<{id:string,dim:string,left:string,right:string}>} */
  const FIN5_QUESTIONS = [
    // S–L（节奏）
    {
      id: "q1",
      dim: "pace",
      left: "更喜欢短反馈周期（当天/当周看到结果）",
      right: "更喜欢长周期投入（数月打磨更大成果）",
    },
    {
      id: "q2",
      dim: "pace",
      left: "享受实时变化带来的刺激（行情/突发信息）",
      right: "享受稳定推进的深度工作（调研/项目）",
    },
    { id: "q3", dim: "pace", left: "倾向于多任务快速切换", right: "倾向于少量关键任务持续深入" },
    { id: "q4", dim: "pace", left: "更偏好“先执行、边做边校准”", right: "更偏好“先打磨框架、再稳步落地”" },
    {
      id: "q5",
      dim: "pace",
      left: "更愿意在强时点压力下冲刺（截止日、开盘收盘）",
      right: "更愿意在可控节奏里长期迭代",
    },

    // C–A（对客）
    {
      id: "q6",
      dim: "client",
      left: "更愿意站在台前对外沟通、影响他人",
      right: "更愿意在台后做分析产出，让结果替我说话",
    },
    { id: "q7", dim: "client", left: "从社交与协作中补能", right: "从独立专注中补能" },
    {
      id: "q8",
      dim: "client",
      left: "更喜欢把复杂内容讲清楚并推动决策",
      right: "更喜欢把复杂内容拆解清楚并做成模型/文档",
    },
    { id: "q9", dim: "client", left: "更喜欢开放式问题：先沟通需求再给方案", right: "更喜欢结构化问题：定义假设并验证" },
    { id: "q10", dim: "client", left: "更在意建立长期客户/合作关系", right: "更在意把内部能力（研究/系统/流程）做强" },

    // R–P（风险）
    { id: "q11", dim: "risk", left: "为更高回报能接受明显波动与不确定性", right: "更重视可预测性，宁愿牺牲部分收益" },
    { id: "q12", dim: "risk", left: "更愿意对“结果”负责（收益/增长）", right: "更愿意对“底线”负责（风险/合规/稳定）" },
    { id: "q13", dim: "risk", left: "做决策时更愿意先下注再迭代", right: "做决策时更愿意先把风险边界想清楚" },
    { id: "q14", dim: "risk", left: "不介意在信息不完美时做判断", right: "更倾向在证据充分时再行动" },
    { id: "q15", dim: "risk", left: "更认可“进攻性目标”的驱动力", right: "更认可“少出事/不出事”的安全感" },

    // Q–B（技能形态）
    { id: "q16", dim: "craft", left: "更享受用数据/统计/数学把问题讲清楚", right: "更享受用商业逻辑/故事线把问题讲清楚" },
    { id: "q17", dim: "craft", left: "更愿意写代码、做自动化、搭模型", right: "更愿意写材料、谈判、对齐共识" },
    { id: "q18", dim: "craft", left: "遇到问题更倾向先查数据、跑实验", right: "遇到问题更倾向先访谈、做判断" },
    { id: "q19", dim: "craft", left: "更喜欢“可复现的证据链”", right: "更喜欢“有说服力的论证与表达”" },
    { id: "q20", dim: "craft", left: "对工程细节（性能、稳定性、数据质量）更敏感", right: "对业务细节（定位、需求、利益相关方）更敏感" },

    // O–X（工作取向）
    { id: "q21", dim: "order", left: "更喜欢明确规则、标准流程、可审计", right: "更喜欢探索新方法、新产品、模糊边界的机会" },
    { id: "q22", dim: "order", left: "更愿意做“把事情做对”的角色（控制/检查/治理）", right: "更愿意做“把事情做成”的角色（创新/开拓）" },
    { id: "q23", dim: "order", left: "更享受把流程优化得更稳、更少差错", right: "更享受把方案迭代得更快、更有突破" },
    { id: "q24", dim: "order", left: "面对灰度地带更倾向保守解释与留痕", right: "面对灰度地带更倾向试点验证与快速学习" },
    { id: "q25", dim: "order", left: "更愿意在既有规则内做增量改进", right: "更愿意推动规则/产品/策略的显著变化" },
  ];

  /**
   * vector 取值范围 [-1, 1]
   * - pace: 负 S（快）/ 正 L（长）
   * - client: 负 C（对外）/ 正 A（对内）
   * - risk: 负 R（进攻）/ 正 P（审慎）
   * - craft: 负 Q（数理）/ 正 B（商业表达）
   * - order: 负 O（规则治理）/ 正 X（创新开拓）
   */
  /** @type {Array<{id:string,name:string,family:string,desc:string,keywords:string[],vector:Record<string,number>}>} */
  const FINANCE_CAREERS = [
    {
      id: "ibd_ma",
      name: "投行并购（M&A / IBD）",
      family: "卖方前台",
      desc: "并购重组、融资与项目推进：估值建模、尽调、材料路演与多方协调。",
      keywords: ["项目制", "沟通协调", "材料与建模"],
      vector: { pace: -0.1, client: -0.2, risk: 0.0, craft: 0.6, order: 0.4 },
    },
    {
      id: "ecm_dcm",
      name: "股债资本市场（ECM / DCM）",
      family: "卖方前台",
      desc: "发行与承销：定价、簿记、市场窗口把握，与发行人/投资者/监管协同。",
      keywords: ["节奏快", "定价与发行", "跨方协作"],
      vector: { pace: -0.4, client: -0.2, risk: 0.1, craft: 0.3, order: 0.2 },
    },
    {
      id: "institutional_sales",
      name: "机构销售（Sales）",
      family: "卖方前台",
      desc: "覆盖机构客户、提供观点与服务、推动成交与关系经营。",
      keywords: ["对客", "表达说服", "结果导向"],
      vector: { pace: -0.6, client: -1.0, risk: 0.0, craft: 0.8, order: 0.2 },
    },
    {
      id: "trading_mm",
      name: "交易员 / 做市（Trading / Market Making）",
      family: "卖方前台",
      desc: "报价与执行、头寸管理、对冲与纪律化风控，关注实时信息与价格变化。",
      keywords: ["快决策", "头寸与P&L", "纪律"],
      vector: { pace: -1.0, client: 0.1, risk: -0.6, craft: -0.3, order: 0.0 },
    },
    {
      id: "structuring",
      name: "结构化 / 衍生品（Structuring）",
      family: "卖方前台",
      desc: "产品设计、定价与对冲：在收益、风险与条款之间做结构化权衡。",
      keywords: ["产品设计", "定价对冲", "数理与业务结合"],
      vector: { pace: -0.3, client: -0.1, risk: -0.2, craft: -0.8, order: 0.8 },
    },
    {
      id: "sell_side_research",
      name: "卖方研究（Research）",
      family: "卖方研究",
      desc: "跟踪公司/行业/宏观，产出研究观点与报告，为客户与业务提供信息支持。",
      keywords: ["写作输出", "信息整合", "长期跟踪"],
      vector: { pace: 0.2, client: 0.4, risk: 0.3, craft: 0.0, order: 0.0 },
    },
    {
      id: "buy_side_research",
      name: "买方研究（投研 Analyst）",
      family: "买方投研",
      desc: "围绕可投资标的做深度研究，产出可执行的观点与组合建议。",
      keywords: ["深度研究", "投资框架", "结论可落地"],
      vector: { pace: 0.4, client: 0.6, risk: -0.2, craft: 0.1, order: 0.2 },
    },
    {
      id: "portfolio_manager",
      name: "基金经理 / 组合管理（PM）",
      family: "买方投研",
      desc: "资产配置与仓位决策，在收益目标与回撤约束之间做长期权衡。",
      keywords: ["组合管理", "风险预算", "长期一致性"],
      vector: { pace: 0.3, client: 0.4, risk: -0.3, craft: 0.2, order: 0.1 },
    },
    {
      id: "execution_trader",
      name: "交易执行（Execution）",
      family: "买方交易",
      desc: "围绕成交效率与成本最优化执行交易，关注微观结构与执行质量。",
      keywords: ["执行效率", "交易成本", "速度与纪律"],
      vector: { pace: -1.0, client: 0.2, risk: 0.2, craft: -0.1, order: -0.2 },
    },
    {
      id: "quant_research",
      name: "量化研究（Quant Research）",
      family: "量化",
      desc: "构建因子/策略/风险模型，回测验证并迭代，强调统计严谨与可复现。",
      keywords: ["模型与回测", "数据", "严谨验证"],
      vector: { pace: 0.1, client: 0.9, risk: -0.2, craft: -1.0, order: 0.3 },
    },
    {
      id: "quant_dev",
      name: "量化开发 / 交易系统工程（Quant Dev / Eng）",
      family: "量化",
      desc: "把策略与模型工程化落地：数据管道、系统稳定性、性能与监控。",
      keywords: ["工程落地", "稳定性", "性能与数据质量"],
      vector: { pace: 0.0, client: 0.9, risk: 0.2, craft: -1.0, order: -0.5 },
    },
    {
      id: "data_risk_strategy",
      name: "数据分析 / 风控策略 / 反欺诈（Data / Strategy）",
      family: "风控与数据",
      desc: "指标体系、策略实验与效果追踪：把数据变成可运营、可控的决策。",
      keywords: ["数据驱动", "策略迭代", "效果度量"],
      vector: { pace: 0.0, client: 0.8, risk: 0.6, craft: -0.8, order: -0.6 },
    },
    {
      id: "risk_management",
      name: "风险管理（信用 / 市场 / 模型）",
      family: "风控与合规",
      desc: "限额、压力测试与风险评估，平衡业务增长与风险底线。",
      keywords: ["底线思维", "量化与制度", "独立性"],
      vector: { pace: 0.2, client: 0.8, risk: 1.0, craft: -0.2, order: -1.0 },
    },
    {
      id: "compliance_aml",
      name: "合规 / 反洗钱（Compliance / AML）",
      family: "风控与合规",
      desc: "制度、监测与报告：在监管约束下保证业务可持续与可审计。",
      keywords: ["规则意识", "细致", "监管敏感"],
      vector: { pace: 0.4, client: 0.7, risk: 1.0, craft: 0.3, order: -1.0 },
    },
    {
      id: "legal",
      name: "法务（金融 / 资本市场）",
      family: "中后台",
      desc: "条款审阅与结构设计、交易文件与风险预判，强调严谨与证据链。",
      keywords: ["条款", "严谨", "风险预判"],
      vector: { pace: 0.3, client: 0.2, risk: 1.0, craft: 0.9, order: -0.8 },
    },
    {
      id: "operations",
      name: "运营（清算 / 交割 / 托管 / 对账）",
      family: "中后台",
      desc: "流程与差错控制：清算交割、对账、异常处理，追求稳定与低容错。",
      keywords: ["流程", "细节", "稳定性"],
      vector: { pace: -0.1, client: 0.9, risk: 0.8, craft: 0.2, order: -1.0 },
    },
    {
      id: "finance_fpa",
      name: "财务 / FP&A",
      family: "中后台",
      desc: "报表与预算、经营分析与资源配置，强调结构化与业务理解。",
      keywords: ["结构化", "经营分析", "沟通对齐"],
      vector: { pace: 0.5, client: 0.8, risk: 0.6, craft: 0.2, order: -0.7 },
    },
    {
      id: "treasury",
      name: "司库 / 资金管理（Treasury）",
      family: "中后台",
      desc: "流动性与融资、利率外汇管理：在成本、风险与现金流之间做平衡。",
      keywords: ["全局视角", "资金与流动性", "成本与风险平衡"],
      vector: { pace: 0.3, client: 0.6, risk: 0.4, craft: 0.0, order: -0.6 },
    },
    {
      id: "pe_vc_investing",
      name: "私募股权 / 创投投资（PE / VC）",
      family: "PE/VC",
      desc: "找项目、尽调、投决与投后，回报周期长但更强调商业判断与资源整合。",
      keywords: ["长周期", "高不确定性", "商业判断"],
      vector: { pace: 1.0, client: 0.1, risk: -0.7, craft: 0.2, order: 1.0 },
    },
    {
      id: "fundraising_ir",
      name: "募资 / IR（LP关系）",
      family: "PE/VC / 资管",
      desc: "对外讲清楚策略与业绩、维护LP关系、信息披露与长期信任建设。",
      keywords: ["强对客", "表达与信任", "长期关系"],
      vector: { pace: 0.4, client: -1.0, risk: 0.3, craft: 0.9, order: 0.4 },
    },
    {
      id: "am_product_channel",
      name: "资管产品 / 渠道（产品经理/渠道）",
      family: "资管与财富",
      desc: "产品设计与包装、渠道协同与客户沟通，在需求、合规与落地之间做平衡。",
      keywords: ["产品化", "对外协同", "合规约束"],
      vector: { pace: 0.1, client: -0.8, risk: 0.2, craft: 0.6, order: 0.7 },
    },
    {
      id: "actuary",
      name: "精算（Actuary）",
      family: "保险",
      desc: "定价、准备金与经验分析，围绕不确定性做长期风险定价与偿付能力评估。",
      keywords: ["数理", "长期", "审慎"],
      vector: { pace: 1.0, client: 0.9, risk: 0.8, craft: -1.0, order: -0.8 },
    },
    {
      id: "underwriting",
      name: "核保（Underwriting）",
      family: "保险",
      desc: "评估标的风险与承保条件，在增长与风险选择之间做权衡。",
      keywords: ["风险选择", "规则与经验", "审慎"],
      vector: { pace: 0.2, client: 0.3, risk: 0.8, craft: 0.0, order: -0.6 },
    },
    {
      id: "claims",
      name: "理赔（Claims）",
      family: "保险",
      desc: "案件审核、损失评估与反欺诈，强调证据、沟通与合规。",
      keywords: ["案件处理", "证据链", "合规"],
      vector: { pace: 0.1, client: 0.1, risk: 1.0, craft: 0.4, order: -0.8 },
    },
    {
      id: "insurance_asset_mgmt",
      name: "险资投资（Insurance Asset Mgmt）",
      family: "保险",
      desc: "以久期匹配与稳健为核心的资产配置：在收益、信用与流动性之间平衡。",
      keywords: ["资产负债匹配", "稳健", "信用与久期"],
      vector: { pace: 0.5, client: 0.7, risk: 0.4, craft: -0.1, order: -0.4 },
    },
    {
      id: "audit_consulting",
      name: "审计 / 咨询（四大/咨询）",
      family: "专业服务",
      desc: "项目制交付：鉴证、尽调、内控与转型，强调沟通与可交付成果。",
      keywords: ["项目交付", "客户协作", "结构化表达"],
      vector: { pace: 0.2, client: -0.3, risk: 0.6, craft: 0.4, order: -0.6 },
    },
    {
      id: "rating_index",
      name: "评级 / 指数（Rating / Index）",
      family: "基础设施",
      desc: "方法论与框架化分析：信用与指标体系，强调一致性与披露约束。",
      keywords: ["框架化", "一致性", "披露规范"],
      vector: { pace: 0.6, client: 0.4, risk: 0.8, craft: 0.2, order: -0.7 },
    },
    {
      id: "regulator_exchange",
      name: "监管 / 交易所 / 自律组织",
      family: "公共部门",
      desc: "规则制定与检查，强调制度执行、风险防控与行业秩序。",
      keywords: ["规则", "宏观视角", "审慎"],
      vector: { pace: 0.8, client: 0.5, risk: 1.0, craft: 0.3, order: -1.0 },
    },
    {
      id: "fintech_platform",
      name: "金融科技（平台/安全/架构/数据）",
      family: "科技与平台",
      desc: "用工程方法把金融能力产品化：稳定性、安全、合规与可观测性。",
      keywords: ["工程化", "稳定性", "安全合规"],
      vector: { pace: 0.0, client: 0.9, risk: 0.3, craft: -0.9, order: -0.7 },
    },
  ];

  window.FIN5_DIMENSIONS = FIN5_DIMENSIONS;
  window.FIN5_QUESTIONS = FIN5_QUESTIONS;
  window.FINANCE_CAREERS = FINANCE_CAREERS;
})();

