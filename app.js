const clubs = [
  { id: "ai", name: "AI 创新实践社", category: "tech", active: 88, heat: 92, intro: "算法竞赛、AI应用开发与项目实战。", tags: ["项目实战", "技术分享", "算法竞赛"], calendar: "每周三晚 + 周六下午", reviews: "学习氛围强，技术成长快。", quota: 60 },
  { id: "music", name: "校园音乐社", category: "art", active: 78, heat: 86, intro: "乐队排练、原创作品和校园演出。", tags: ["舞台演出", "创作共建", "乐队合作"], calendar: "每周二晚 + 周末彩排", reviews: "氛围热烈，舞台机会多。", quota: 50 },
  { id: "basket", name: "篮球协会", category: "sports", active: 84, heat: 89, intro: "训练营、院系联赛、校内友谊赛。", tags: ["体能提升", "联赛活动", "团队协作"], calendar: "每周一/四晚", reviews: "组织规范，训练强度适中。", quota: 70 },
  { id: "vol", name: "青年志愿者协会", category: "volunteer", active: 76, heat: 74, intro: "社区服务、公益项目、社会实践。", tags: ["公益实践", "活动组织", "社会影响"], calendar: "每周末机动", reviews: "活动有意义，伙伴友好。", quota: 80 },
  { id: "biz", name: "创业与商业社", category: "business", active: 81, heat: 85, intro: "商业案例、路演模拟、导师交流。", tags: ["路演训练", "商业分析", "资源链接"], calendar: "每周三/周日", reviews: "能接触真实创业案例。", quota: 45 },
  { id: "photo", name: "光影摄影社", category: "art", active: 73, heat: 70, intro: "摄影技巧、外拍采风和影展策划。", tags: ["摄影技巧", "外拍活动", "作品展"], calendar: "周末外拍", reviews: "节奏舒适，作品产出稳定。", quota: 40 }
];

const studentsPool = [
  { name: "李晨", grade: "大一", skill: "设计", match: 91 },
  { name: "王雨", grade: "大一", skill: "前端", match: 88 },
  { name: "赵昊", grade: "大二", skill: "视频剪辑", match: 84 },
  { name: "陈诺", grade: "大一", skill: "运营", match: 82 }
];

const evaluationQuestions = [
  { key: "q1", label: "你更感兴趣的活动？", options: [["tech", "编程/技术"], ["art", "艺术创作"], ["sports", "体育竞技"], ["volunteer", "公益服务"], ["business", "商业实践"]] },
  { key: "q2", label: "你希望的社交氛围？", options: [["social_high", "高频社交"], ["social_mid", "适中"], ["social_low", "小团队"]] },
  { key: "q3", label: "你每周可投入时间？", options: [["time_high", "8小时以上"], ["time_mid", "4-8小时"], ["time_low", "4小时以内"]] },
  { key: "q4", label: "你更关注哪类成长？", options: [["goal_skill", "技能提升"], ["goal_net", "拓展人脉"], ["goal_hobby", "兴趣发展"], ["goal_comp", "竞赛成果"]] },
  { key: "q5", label: "你喜欢的活动时间？", options: [["weekday", "工作日晚间"], ["weekend", "周末"], ["both", "都可以"]] },
  { key: "q6", label: "你是否愿意参与项目制任务？", options: [["project_yes", "非常愿意"], ["project_mid", "可尝试"], ["project_no", "更偏兴趣轻量"]] },
  { key: "q7", label: "你希望社团节奏？", options: [["pace_fast", "快节奏"], ["pace_mid", "平衡"], ["pace_slow", "慢节奏"]] },
  { key: "q8", label: "你偏好的输出形式？", options: [["out_work", "作品/成果"], ["out_event", "活动组织"], ["out_comp", "比赛成绩"]] },
  { key: "q9", label: "你是否接受跨社联动活动？", options: [["cross_yes", "接受"], ["cross_mid", "看情况"], ["cross_no", "不太接受"]] },
  { key: "q10", label: "你更在意？", options: [["culture", "社团氛围"], ["growth", "能力成长"], ["resource", "资源机会"]] }
];

const state = {
  selectedClubId: "",
  evaluations: {},
  matchedClubs: [],
  applications: [],
  interviewSlots: [
    { id: "S1", time: "2026-09-03 19:00", location: "学生活动中心 301", cap: 20, booked: 8 },
    { id: "S2", time: "2026-09-05 14:00", location: "创客空间 A2", cap: 15, booked: 10 }
  ],
  inviteCountToday: 0,
  chatLimit: 20,
  recruitEnabled: true,
  recruitQuota: 60,
  auditItems: [
    { id: "A-001", name: "校园戏剧社", type: "新建社团", status: "待审核" },
    { id: "A-002", name: "航模协会", type: "信息变更", status: "待审核" }
  ]
};

const byId = (id) => document.getElementById(id);

function init() {
  initTabs();
  renderEvaluationForm();
  renderInterviewSlots();
  renderRecommendations();
  renderMyClubs();
  renderSessionList();
  renderApplicantTable();
  renderClubDashboard();
  renderAuditList();
  renderMonitorBoard();
  bindEvents();
}

function initTabs() {
  const tabs = Array.from(document.querySelectorAll(".tab"));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.target;
      Array.from(document.querySelectorAll(".panel")).forEach((p) => p.classList.toggle("active", p.id === target));
    });
  });
}

function renderEvaluationForm() {
  const form = byId("evaluationForm");
  form.innerHTML = evaluationQuestions.map((q) => `
    <label>${q.label}
      <select data-q="${q.key}">
        ${q.options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
      </select>
    </label>
  `).join("");
}

function collectEvaluation() {
  const answers = {};
  Array.from(byId("evaluationForm").querySelectorAll("select")).forEach((select) => {
    answers[select.dataset.q] = select.value;
  });
  state.evaluations = answers;
  return answers;
}

function getPersonaTags(answers) {
  const tags = [];
  const values = Object.values(answers);
  if (values.includes("tech")) tags.push("技术探索型");
  if (values.includes("art")) tags.push("创意表达型");
  if (values.includes("sports")) tags.push("活力竞技型");
  if (values.includes("volunteer")) tags.push("公益参与型");
  if (values.includes("business")) tags.push("商业实践型");
  if (values.includes("time_high")) tags.push("高投入");
  if (values.includes("project_yes")) tags.push("项目驱动");
  if (values.includes("social_high")) tags.push("社交活跃");
  return tags.slice(0, 4);
}

function interestFitScore(club, answers) {
  let score = 55;
  const picks = Object.values(answers);
  if (picks.includes(club.category)) score += 30;
  if (picks.includes("goal_skill") && (club.id === "ai" || club.id === "biz" || club.id === "photo")) score += 8;
  if (picks.includes("goal_comp") && (club.id === "ai" || club.id === "basket")) score += 7;
  if (picks.includes("goal_hobby") && (club.id === "music" || club.id === "photo")) score += 7;
  if (picks.includes("goal_net") && (club.id === "biz" || club.id === "vol")) score += 6;
  return Math.min(score, 100);
}

function matchClubs() {
  const answers = state.evaluations;
  state.matchedClubs = clubs.map((club) => {
    const interestScore = interestFitScore(club, answers);
    const total = Math.round(interestScore * 0.6 + club.active * 0.2 + club.heat * 0.2);
    return { ...club, total, interestScore };
  }).sort((a, b) => b.total - a.total);
}

function renderRecommendations() {
  const wrap = byId("recommendList");
  const filter = byId("categoryFilter") ? byId("categoryFilter").value : "all";
  const list = (state.matchedClubs.length ? state.matchedClubs : clubs.map((x) => ({ ...x, total: Math.round(x.active * 0.4 + x.heat * 0.6), interestScore: 60 })))
    .filter((x) => (filter === "all" ? true : x.category === filter));

  wrap.innerHTML = list.map((club, index) => `
    <article class="recommend-item">
      <div class="row-between">
        <div>
          <h3>${index + 1}. ${club.name}</h3>
          <p>${club.intro}</p>
        </div>
        <div class="score">匹配度 ${club.total}%</div>
      </div>
      <p class="muted">推荐依据：兴趣匹配 ${club.interestScore}% + 活跃度 ${club.active}% + 热度 ${club.heat}%</p>
      <div class="tags-wrap">${club.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="actions">
        <button class="btn" data-action="detail" data-id="${club.id}">查看详情</button>
        <button class="btn primary" data-action="apply" data-id="${club.id}">一键报名</button>
      </div>
    </article>
  `).join("");
}

function renderMyClubs() {
  const wrap = byId("myClubsList");
  if (!state.applications.length) {
    wrap.innerHTML = `<div class="list-item muted">暂无报名记录</div>`;
    return;
  }
  wrap.innerHTML = state.applications.map((app, idx) => `
    <div class="list-item">
      <div class="row-between">
        <strong>${app.clubName}</strong>
        <span class="status ${app.statusClass}">${app.statusText}</span>
      </div>
      <div class="muted">面试：${app.slot || "未预约"} ${app.groupLink ? `| 入群：${app.groupLink}` : ""}</div>
      <div class="actions">
        <button class="btn danger" data-action="cancel" data-index="${idx}">取消报名</button>
      </div>
    </div>
  `).join("");
}

function renderInterviewSlots() {
  const select = byId("interviewSlotSelect");
  select.innerHTML = state.interviewSlots.map((s) => `<option value="${s.id}">${s.time} · ${s.location}（余量 ${s.cap - s.booked}）</option>`).join("");
}

function applyToClub(clubId) {
  const club = clubs.find((c) => c.id === clubId);
  if (!club) return;
  state.selectedClubId = clubId;
  if (!state.applications.some((x) => x.clubId === clubId)) {
    state.applications.unshift({
      clubId,
      clubName: club.name,
      statusText: "待面试",
      statusClass: "pending",
      slot: "",
      groupLink: ""
    });
  }
  renderMyClubs();
  renderApplicantTable();
  alert(`已完成 ${club.name} 报名。请在“报名与面试”模块预约场次。`);
}

function bookInterview() {
  const slotId = byId("interviewSlotSelect").value;
  if (!state.selectedClubId) {
    alert("请先在推荐区点击任一社团的“一键报名”。");
    return;
  }
  const slot = state.interviewSlots.find((s) => s.id === slotId);
  const app = state.applications.find((x) => x.clubId === state.selectedClubId);
  if (!slot || !app) return;
  slot.booked += 1;
  app.slot = `${slot.time} @ ${slot.location}`;
  byId("reminderText").textContent = `已预约 ${slot.time}，将于前一天和前一小时推送提醒。`;
  renderInterviewSlots();
  renderMyClubs();
  renderSessionList();
}

function renderSessionList() {
  const list = byId("sessionList");
  list.innerHTML = state.interviewSlots.map((s) => `
    <div class="list-item">
      <strong>${s.id}</strong> - ${s.time} @ ${s.location}
      <div class="muted">预约 ${s.booked} / ${s.cap}</div>
    </div>
  `).join("");
}

function renderApplicantTable() {
  const applicants = state.applications.length
    ? state.applications.map((x, i) => ({ id: i + 1, name: `新生${i + 1}`, club: x.clubName, status: x.statusText }))
    : [
      { id: 1, name: "新生示例A", club: "AI 创新实践社", status: "待审核" },
      { id: 2, name: "新生示例B", club: "校园音乐社", status: "待审核" }
    ];
  byId("applicantTableWrap").innerHTML = `
    <table>
      <thead><tr><th>ID</th><th>学生</th><th>报名社团</th><th>状态</th><th>操作</th></tr></thead>
      <tbody>
        ${applicants.map((a) => `
          <tr>
            <td>${a.id}</td><td>${a.name}</td><td>${a.club}</td><td>${a.status}</td>
            <td>
              <button class="btn" data-action="pass" data-id="${a.id}">通过</button>
              <button class="btn" data-action="hold" data-id="${a.id}">待定</button>
              <button class="btn danger" data-action="reject" data-id="${a.id}">拒绝并跨社推荐</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderClubDashboard() {
  const totalApply = state.applications.length || 12;
  const interviewBooked = state.applications.filter((x) => x.slot).length || 7;
  const pass = state.applications.filter((x) => x.statusClass === "pass").length || 3;
  const channelRecommend = 62;
  byId("clubDashboard").innerHTML = `
    <div class="kpi"><div>报名总数</div><div class="num">${totalApply}</div></div>
    <div class="kpi"><div>面试预约</div><div class="num">${interviewBooked}</div></div>
    <div class="kpi"><div>通过人数</div><div class="num">${pass}</div></div>
    <div class="kpi"><div>推荐来源占比</div><div class="num">${channelRecommend}%</div></div>
  `;
}

function renderAuditList() {
  byId("auditList").innerHTML = state.auditItems.map((item, index) => `
    <div class="list-item">
      <div class="row-between">
        <strong>${item.name}</strong>
        <span class="status pending">${item.status}</span>
      </div>
      <div class="muted">${item.id} · ${item.type}</div>
      <div class="actions">
        <button class="btn primary" data-action="approve" data-index="${index}">通过</button>
        <button class="btn danger" data-action="rejectAudit" data-index="${index}">驳回</button>
      </div>
    </div>
  `).join("");
}

function renderMonitorBoard() {
  const totalUsers = 10240;
  const participation = 67;
  const realtimeApply = state.applications.length + 136;
  const overLimit = state.recruitQuota < 30 ? "发现异常：社团招新上限过低，可能导致流失。" : "当前无异常告警。";

  byId("monitorBoard").innerHTML = `
    <div class="kpi"><div>全校参与人数</div><div class="num">${totalUsers}</div></div>
    <div class="kpi"><div>参与率</div><div class="num">${participation}%</div></div>
    <div class="kpi"><div>实时报名量</div><div class="num">${realtimeApply}</div></div>
    <div class="kpi"><div>可用性</div><div class="num">99.9%</div></div>
  `;
  byId("alertBox").textContent = overLimit;

  const ranked = [...clubs].sort((a, b) => b.heat - a.heat).slice(0, 5);
  byId("topClubsTable").innerHTML = `
    <table>
      <thead><tr><th>排名</th><th>社团</th><th>热度</th><th>活跃度</th></tr></thead>
      <tbody>
        ${ranked.map((c, i) => `<tr><td>${i + 1}</td><td>${c.name}</td><td>${c.heat}</td><td>${c.active}</td></tr>`).join("")}
      </tbody>
    </table>
  `;
}

function bindEvents() {
  byId("evaluateBtn").addEventListener("click", () => {
    const answers = collectEvaluation();
    const tags = getPersonaTags(answers);
    byId("personaTags").innerHTML = tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
    matchClubs();
    renderRecommendations();
  });

  byId("categoryFilter").addEventListener("change", renderRecommendations);

  byId("recommendList").addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;
    const club = clubs.find((c) => c.id === id);
    if (!club) return;
    if (action === "detail") {
      alert(`${club.name}\n\n简介：${club.intro}\n活动日历：${club.calendar}\n学长学姐说：${club.reviews}`);
    }
    if (action === "apply") {
      applyToClub(id);
    }
  });

  byId("myClubsList").addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action !== "cancel") return;
    const index = Number(target.dataset.index);
    state.applications.splice(index, 1);
    renderMyClubs();
    renderApplicantTable();
    renderClubDashboard();
  });

  byId("bookInterviewBtn").addEventListener("click", bookInterview);

  byId("saveClubConfigBtn").addEventListener("click", () => {
    state.recruitEnabled = byId("recruitSwitch").checked;
    state.recruitQuota = Number(byId("quotaInput").value || 60);
    const msg = state.recruitEnabled
      ? `已开启招新，当前上限 ${state.recruitQuota} 人。`
      : "已关闭招新。";
    byId("quotaStatus").textContent = msg;
    renderMonitorBoard();
  });

  byId("sendInviteBtn").addEventListener("click", () => {
    const remain = state.chatLimit - state.inviteCountToday;
    if (remain <= 0) {
      alert("今日邀约已达上限。");
      return;
    }
    const target = studentsPool[state.inviteCountToday % studentsPool.length];
    state.inviteCountToday += 1;
    byId("inviteCounter").textContent = `今日已发送 ${state.inviteCountToday} / ${state.chatLimit}`;
    alert(`已向 ${target.name} 发送邀约。\n匹配度 ${target.match}% | 技能：${target.skill}`);
  });

  byId("createSessionBtn").addEventListener("click", () => {
    const time = byId("sessionTime").value;
    const location = byId("sessionLocation").value.trim();
    const cap = Number(byId("sessionCap").value || 10);
    if (!time || !location) {
      alert("请填写完整的面试时间和地点。");
      return;
    }
    state.interviewSlots.push({
      id: `S${state.interviewSlots.length + 1}`,
      time: time.replace("T", " "),
      location,
      cap,
      booked: 0
    });
    renderInterviewSlots();
    renderSessionList();
  });

  byId("exportSessionBtn").addEventListener("click", () => {
    alert("已导出面试预约名单（模拟）。");
  });

  byId("applicantTableWrap").addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = Number(target.dataset.id);
    if (!action || !id) return;
    const app = state.applications[id - 1];
    if (!app) return;
    if (action === "pass") {
      app.statusText = "已通过";
      app.statusClass = "pass";
      app.groupLink = "点击加入新生群";
    }
    if (action === "hold") {
      app.statusText = "待定";
      app.statusClass = "pending";
    }
    if (action === "reject") {
      app.statusText = "已拒绝";
      app.statusClass = "reject";
      const candidate = clubs.filter((c) => c.id !== app.clubId).sort((a, b) => b.heat - a.heat)[0];
      alert(`已拒绝该申请，并推荐到 ${candidate.name}。`);
    }
    renderMyClubs();
    renderApplicantTable();
    renderClubDashboard();
  });

  byId("auditList").addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const index = Number(target.dataset.index);
    if (!action) return;
    const item = state.auditItems[index];
    if (!item) return;
    item.status = action === "approve" ? "已通过" : "已驳回";
    renderAuditList();
  });

  byId("saveSystemConfigBtn").addEventListener("click", () => {
    state.chatLimit = Number(byId("chatLimitInput").value || 20);
    if (state.inviteCountToday > state.chatLimit) {
      state.inviteCountToday = state.chatLimit;
    }
    byId("inviteCounter").textContent = `今日已发送 ${state.inviteCountToday} / ${state.chatLimit}`;
    alert(`系统配置已保存。\n招新季：${byId("seasonRange").value}\n私聊上限：${state.chatLimit}/日`);
  });

  byId("exportReportBtn").addEventListener("click", () => {
    alert("已导出全校招新数据报表（模拟）。");
  });
}

init();
