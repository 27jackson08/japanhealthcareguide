  // ── CARD DATA ──
  const conditionIcons = {
    diabetes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 3-4 8-4 8S8 9 8 6a4 4 0 0 1 4-4z"/><path d="M8 18h8"/><path d="M9 21h6"/></svg>',
    hypertension: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    asthma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-4 0-7 3-7 7 0 2.5 1.5 5 3 6.5V18h8v-2.5c1.5-1.5 3-4 3-6.5 0-4-3-7-7-7z"/><path d="M9 18v2a3 3 0 0 0 6 0v-2"/></svg>',
    epilepsy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    heartdisease: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><polyline points="12 8 12 12 14 14"/></svg>',
    stroke: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    depression: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    pregnancy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="3"/><path d="M9 12h6a3 3 0 0 1 3 3v1a2 2 0 0 1-2 2h-2l-2 3-2-3H8a2 2 0 0 1-2-2v-1a3 3 0 0 1 3-3z"/></svg>',
    pacemaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/><polyline points="9 15 11 17 15 13"/></svg>',
    celiac: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    nuts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c0 0-4 4-4 9s4 9 4 9"/><path d="M12 3c0 0 4 4 4 9s-4 9-4 9"/><line x1="3" y1="12" x2="21" y2="12"/></svg>',
    peanut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="9" cy="15" rx="5" ry="6"/><ellipse cx="15" cy="9" rx="5" ry="6"/><line x1="12" y1="12" x2="12" y2="12"/></svg>',
    shellfish: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 4 6 4 10c0 5 4 10 8 12 4-2 8-7 8-12 0-4-4-8-8-8z"/><path d="M12 2v20M4 10h16"/></svg>',
    fish: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12c0 0-1.5-6 5.5-6s9 6 9 6-2 6-9 6-5.5-6-5.5-6z"/><path d="M3 7l3.5 5L3 17"/><circle cx="15" cy="12" r="1"/></svg>',
    dairy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l2 6H6L8 2z"/><path d="M6 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/><line x1="10" y1="13" x2="14" y2="13"/></svg>',
    egg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 7 5 12a7 7 0 0 0 14 0c0-5-3-10-7-10z"/></svg>',
    wheat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12M12 12C12 12 7 10 7 5a5 5 0 0 1 5-3 5 5 0 0 1 5 3c0 5-5 7-5 7z"/><path d="M8 15s-3-1-4-4M16 15s3-1 4-4"/></svg>',
    soy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
    sesame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="12" cy="14" r="2"/><circle cx="8" cy="20" r="2"/><circle cx="16" cy="20" r="2"/></svg>',
    penicillin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="7" rx="2"/><path d="M6 9h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"/><line x1="10" y1="14" x2="14" y2="14"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',
    nsaid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="7" rx="2"/><path d="M6 9h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"/><line x1="10" y1="14" x2="14" y2="14"/></svg>',
    latex: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V7a6 6 0 0 0-12 0v4"/><path d="M4 11h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9z"/></svg>',
  };

  const conditions = [
    { id: "diabetes", name: "Diabetes", ja: "糖尿病", ro: "Tōnyōbyō", color: "#fef3c7", iconColor: "#d97706",
      sentence_en: "I have diabetes", sentence_ja: "私は糖尿病があります", sentence_ro: "Watashi wa tōnyōbyō ga arimasu",
      note_en: "May need glucose or insulin", note_ja: "ブドウ糖またはインスリンが必要な場合があります" },
    { id: "hypertension", name: "High Blood Pressure", ja: "高血圧", ro: "Kōketsuatsu", color: "#fee2e2", iconColor: "#dc2626",
      sentence_en: "I have high blood pressure", sentence_ja: "私は高血圧があります", sentence_ro: "Watashi wa kōketsuatsu ga arimasu",
      note_en: "I take blood pressure medication", note_ja: "血圧の薬を服用しています" },
    { id: "asthma", name: "Asthma", ja: "喘息", ro: "Zensoku", color: "#e0f2fe", iconColor: "#0284c7",
      sentence_en: "I have asthma", sentence_ja: "私は喘息があります", sentence_ro: "Watashi wa zensoku ga arimasu",
      note_en: "I use an inhaler", note_ja: "吸入器を使用しています" },
    { id: "epilepsy", name: "Epilepsy", ja: "てんかん", ro: "Tenkan", color: "#f3e8ff", iconColor: "#7c3aed",
      sentence_en: "I have epilepsy", sentence_ja: "私はてんかんがあります", sentence_ro: "Watashi wa tenkan ga arimasu",
      note_en: "Do not restrain me during a seizure", note_ja: "発作中は抑えないでください" },
    { id: "heartdisease", name: "Heart Disease", ja: "心臓病", ro: "Shinzōbyō", color: "#fee2e2", iconColor: "#dc2626",
      sentence_en: "I have heart disease", sentence_ja: "私は心臓病があります", sentence_ro: "Watashi wa shinzōbyō ga arimasu",
      note_en: "Please call an ambulance: 119", note_ja: "救急車を呼んでください：119" },
    { id: "stroke", name: "Stroke History", ja: "脳卒中", ro: "Nōsotchū", color: "#fdf2f8", iconColor: "#9d174d",
      sentence_en: "I have a history of stroke", sentence_ja: "私は脳卒中の既往歴があります", sentence_ro: "Watashi wa nōsotchū no kiōreki ga arimasu",
      note_en: "Please call an ambulance: 119", note_ja: "救急車を呼んでください：119" },
    { id: "depression", name: "Depression / Anxiety", ja: "うつ病・不安症", ro: "Utsubyō / Fuanshō", color: "#f0fdf4", iconColor: "#16a34a",
      sentence_en: "I have depression / anxiety", sentence_ja: "私はうつ病・不安症があります", sentence_ro: "Watashi wa utsubyō / fuanshō ga arimasu",
      note_en: "I am under psychiatric care", note_ja: "精神科の治療を受けています" },
    { id: "pregnancy", name: "Pregnant", ja: "妊娠中", ro: "Ninshōnchū", color: "#fdf8f0", iconColor: "#E8A838",
      sentence_en: "I am pregnant", sentence_ja: "私は妊娠中です", sentence_ro: "Watashi wa ninshōnchū desu",
      note_en: "Please inform medical staff immediately", note_ja: "すぐに医療スタッフに伝えてください" },
    { id: "pacemaker", name: "Pacemaker", ja: "ペースメーカー", ro: "Pēsumēkā", color: "#e0f2fe", iconColor: "#0284c7",
      sentence_en: "I have a pacemaker", sentence_ja: "私はペースメーカーを装着しています", sentence_ro: "Watashi wa pēsumēkā wo sōchaku shite imasu",
      note_en: "Avoid MRI and strong magnets", note_ja: "MRIや強力な磁石は避けてください" },
    { id: "celiac", name: "Celiac Disease", ja: "セリアック病", ro: "Seriakku-byō", color: "#fef3c7", iconColor: "#d97706",
      sentence_en: "I have celiac disease — no gluten", sentence_ja: "私はセリアック病です。グルテンは食べられません", sentence_ro: "Watashi wa seriakku-byō desu. Guruten wa taberaremasen",
      note_en: "No wheat, barley, or rye", note_ja: "小麦・大麦・ライ麦は不可" },
  ];

  const allergies = [
    { id: "nuts", name: "Tree Nut Allergy", ja: "ナッツ類アレルギー", ro: "Nattsu-rui arerugī", color: "#fef3c7", iconColor: "#d97706",
      sentence_en: "I am allergic to all tree nuts (almonds, walnuts, cashews, pistachios, etc.)", sentence_ja: "私はナッツ類（アーモンド、くるみ、カシューナッツ、ピスタチオ等）にアレルギーがあります", sentence_ro: "Watashi wa nattsu-rui ni arerugī ga arimasu",
      note_en: "Includes all tree nuts — anaphylaxis risk", note_ja: "全てのナッツ類を含む。アナフィラキシーのリスクあり" },
    { id: "peanut", name: "Peanut Allergy", ja: "ピーナッツアレルギー", ro: "Pīnattsu arerugī", color: "#fef3c7", iconColor: "#d97706",
      sentence_en: "I am allergic to peanuts", sentence_ja: "私はピーナッツにアレルギーがあります", sentence_ro: "Watashi wa pīnattsu ni arerugī ga arimasu",
      note_en: "Includes peanut oil — anaphylaxis risk", note_ja: "ピーナッツオイルを含む。アナフィラキシーのリスクあり" },
    { id: "shellfish", name: "Shellfish Allergy", ja: "甲殻類・貝類アレルギー", ro: "Kōkaku-rui / kai-rui arerugī", color: "#fdf2f8", iconColor: "#9d174d",
      sentence_en: "I am allergic to all shellfish (shrimp, crab, lobster, clams, oysters, scallops, squid, etc.)", sentence_ja: "私は甲殻類・貝類（エビ、カニ、ロブスター、ハマグリ、カキ、ホタテ、イカ等）にアレルギーがあります", sentence_ro: "Watashi wa kōkaku-rui / kai-rui ni arerugī ga arimasu",
      note_en: "All shellfish and mollusks — anaphylaxis risk", note_ja: "全ての甲殻類・軟体動物。アナフィラキシーのリスクあり" },
    { id: "fish", name: "Fish Allergy", ja: "魚アレルギー", ro: "Sakana arerugī", color: "#e0f2fe", iconColor: "#0284c7",
      sentence_en: "I am allergic to fish (all types)", sentence_ja: "私は魚（全種類）にアレルギーがあります", sentence_ro: "Watashi wa sakana ni arerugī ga arimasu",
      note_en: "Includes fish sauce and fish stock", note_ja: "魚醤・出汁を含む" },
    { id: "dairy", name: "Dairy / Milk Allergy", ja: "乳製品アレルギー", ro: "Nyūseihin arerugī", color: "#f0fdf4", iconColor: "#16a34a",
      sentence_en: "I am allergic to dairy and milk products", sentence_ja: "私は乳製品にアレルギーがあります", sentence_ro: "Watashi wa nyūseihin ni arerugī ga arimasu",
      note_en: "Includes milk, cheese, butter, cream", note_ja: "牛乳・チーズ・バター・クリームを含む" },
    { id: "egg", name: "Egg Allergy", ja: "卵アレルギー", ro: "Tamago arerugī", color: "#fef9c3", iconColor: "#ca8a04",
      sentence_en: "I am allergic to eggs", sentence_ja: "私は卵にアレルギーがあります", sentence_ro: "Watashi wa tamago ni arerugī ga arimasu",
      note_en: "Includes all egg products and mayonnaise", note_ja: "全ての卵製品・マヨネーズを含む" },
    { id: "wheat", name: "Wheat / Gluten Allergy", ja: "小麦・グルテンアレルギー", ro: "Komugi / Guruten arerugī", color: "#fef3c7", iconColor: "#d97706",
      sentence_en: "I am allergic to wheat and gluten", sentence_ja: "私は小麦・グルテンにアレルギーがあります", sentence_ro: "Watashi wa komugi / guruten ni arerugī ga arimasu",
      note_en: "Includes soy sauce, ramen, bread, tempura batter", note_ja: "醤油・ラーメン・パン・天ぷら粉を含む" },
    { id: "soy", name: "Soy Allergy", ja: "大豆アレルギー", ro: "Daizu arerugī", color: "#f0fdf4", iconColor: "#16a34a",
      sentence_en: "I am allergic to soy", sentence_ja: "私は大豆にアレルギーがあります", sentence_ro: "Watashi wa daizu ni arerugī ga arimasu",
      note_en: "Includes tofu, miso, edamame, soy sauce", note_ja: "豆腐・味噌・枝豆・醤油を含む" },
    { id: "sesame", name: "Sesame Allergy", ja: "ごまアレルギー", ro: "Goma arerugī", color: "#f9fafb", iconColor: "#6b7280",
      sentence_en: "I am allergic to sesame", sentence_ja: "私はごまにアレルギーがあります", sentence_ro: "Watashi wa goma ni arerugī ga arimasu",
      note_en: "Includes sesame oil and tahini", note_ja: "ごま油・タヒニを含む" },
    { id: "penicillin", name: "Penicillin / Antibiotic Allergy", ja: "ペニシリン・抗生物質アレルギー", ro: "Penishirin / kōseibusshitsu arerugī", color: "#fee2e2", iconColor: "#dc2626",
      sentence_en: "I am allergic to penicillin / antibiotics", sentence_ja: "私はペニシリン・抗生物質にアレルギーがあります", sentence_ro: "Watashi wa penishirin / kōseibusshitsu ni arerugī ga arimasu",
      note_en: "Please check before prescribing — anaphylaxis risk", note_ja: "処方前に確認してください。アナフィラキシーのリスクあり" },
    { id: "nsaid", name: "NSAID / Aspirin Allergy", ja: "NSAIDsアレルギー", ro: "Enuseeaidī arerugī", color: "#fee2e2", iconColor: "#dc2626",
      sentence_en: "I am allergic to NSAIDs and aspirin", sentence_ja: "私はNSAIDs・アスピリンにアレルギーがあります", sentence_ro: "Watashi wa NSAIDs / asupirin ni arerugī ga arimasu",
      note_en: "Includes ibuprofen and naproxen", note_ja: "イブプロフェン・ナプロキセンを含む" },
    { id: "latex", name: "Latex Allergy", ja: "ラテックスアレルギー", ro: "Ratekkusu arerugī", color: "#f3e8ff", iconColor: "#7c3aed",
      sentence_en: "I am allergic to latex", sentence_ja: "私はラテックスにアレルギーがあります", sentence_ro: "Watashi wa ratekkusu ni arerugī ga arimasu",
      note_en: "Please use latex-free gloves and equipment", note_ja: "ラテックスフリーの手袋・器具を使用してください" },
  ];

  const allItems = [...conditions.map(c => ({...c, type: 'condition'})), ...allergies.map(a => ({...a, type: 'allergy'}))];
  let selectedItems = [];

  function initCardBuilder() {
    const condEl = document.getElementById("conditionItems");
    const allergyEl = document.getElementById("allergyItems");

    conditions.forEach(c => condEl.appendChild(makeItemBtn(c, 'condition')));
    allergies.forEach(a => allergyEl.appendChild(makeItemBtn(a, 'allergy')));

    initCarousel();
  }

  function getIcon(id, color, size) {
    const s = size || 18;
    const svg = conditionIcons[id] || conditionIcons['penicillin'];
    return svg.replace('viewBox', 'width="' + s + '" height="' + s + '" viewBox').replace('stroke="currentColor"', 'stroke="' + color + '"');
  }

  function makeItemBtn(item, type) {
    const btn = document.createElement("button");
    btn.className = "card-item-btn";
    btn.id = "btn-" + item.id;
    btn.dataset.name = item.name.toLowerCase();
    btn.dataset.type = type;
    btn.innerHTML = '<span style="display:flex;align-items:center;">' + getIcon(item.id, item.iconColor, 14) + '</span>' + item.name;
    btn.onclick = () => toggleItem(item, type);
    return btn;
  }

  function toggleItem(item, type) {
    const btn = document.getElementById("btn-" + item.id);
    const idx = selectedItems.findIndex(s => s.id === item.id);
    if (idx >= 0) {
      selectedItems.splice(idx, 1);
      btn.classList.remove("selected");
    } else {
      selectedItems.push({...item, type});
      btn.classList.add("selected");
    }
    updateSelectedTags();
    updateGeneratedCard();
  }

  function updateSelectedTags() {
    const wrap = document.getElementById("selectedTagsWrap");
    const container = document.getElementById("selectedTags");
    container.innerHTML = "";
    if (!selectedItems.length) { wrap.style.display = "none"; return; }
    wrap.style.display = "block";
    selectedItems.forEach(item => {
      const tag = document.createElement("span");
      tag.className = "selected-tag";
      tag.innerHTML = item.icon + " " + item.name + " &times;";
      tag.onclick = () => toggleItem(item, item.type);
      container.appendChild(tag);
    });
  }

  function updateGeneratedCard() {
    const wrap = document.getElementById("generatedCardWrap");
    const body = document.getElementById("genCardBody");
    const titleEl = document.querySelector(".gen-card-title");
    if (!selectedItems.length) { wrap.style.display = "none"; return; }
    wrap.style.display = "block";

    // Update title with condition names
    const names = selectedItems.map(i => i.name).join(", ");
    titleEl.textContent = "Japan Emergency Medical Card: " + names;

    body.innerHTML = "";

    const headerRow = document.createElement("div");
    headerRow.className = "gen-card-row";
    headerRow.innerHTML =
      '<span class="gen-card-row-en">Please call an ambulance if needed: 119</span>' +
      '<span class="gen-card-row-ja">必要であれば救急車を呼んでください：119</span>';
    body.appendChild(headerRow);

    selectedItems.forEach(item => {
      const row = document.createElement("div");
      row.className = "gen-card-row";
      const iconSvg = getIcon(item.id, item.iconColor, 14);
      row.innerHTML =
        '<span class="gen-card-row-en" style="display:flex;align-items:center;gap:5px;">' + iconSvg + ' ' + item.sentence_en + '</span>' +
        '<span class="gen-card-row-ja">' + item.sentence_ja + '</span>' +
        '<span class="gen-card-row-ro">' + item.sentence_ro + '</span>' +
        (item.note_en ? '<span class="gen-card-row-en" style="font-size:0.72rem;color:var(--gray);font-weight:400;">' + item.note_en + ' / ' + item.note_ja + '</span>' : '');
      body.appendChild(row);
    });
  }

  function filterCardItems() {
    const val = document.getElementById("cardSearchInput").value.toLowerCase().trim();
    document.querySelectorAll(".card-item-btn").forEach(btn => {
      if (!val || btn.dataset.name.includes(val)) {
        btn.classList.remove("hidden");
      } else {
        btn.classList.add("hidden");
      }
    });
  }

  function clearSelections() {
    selectedItems = [];
    document.querySelectorAll(".card-item-btn").forEach(b => b.classList.remove("selected"));
    document.getElementById("selectedTagsWrap").style.display = "none";
    document.getElementById("generatedCardWrap").style.display = "none";
  }

  function printCard() {
    if (!selectedItems.length) return;

    const names = selectedItems.map(i => i.name).join(', ');
    const cardHTML = document.getElementById("generatedCard").outerHTML;

    const printWindow = window.open('', '_blank', 'width=500,height=700');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Japan Emergency Medical Card</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'DM Sans', 'Noto Sans JP', sans-serif; background: #fff; padding: 24px; }
          .generated-card { background: #fff; border: 2px solid #2d2d2d; border-radius: 12px; overflow: hidden; max-width: 420px; margin: 0 auto; }
          .gen-card-header { background: #2d2d2d; padding: 14px 18px; }
          .gen-card-title { font-family: 'DM Serif Display', serif; font-size: 1rem; color: #fff; margin-bottom: 2px; }
          .gen-card-sub { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
          .gen-card-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }
          .gen-card-row { display: flex; flex-direction: column; gap: 3px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
          .gen-card-row:last-child { border-bottom: none; padding-bottom: 0; }
          .gen-card-row-en { font-size: 0.8rem; font-weight: 600; color: #2d2d2d; display: flex; align-items: center; gap: 5px; }
          .gen-card-row-ja { font-size: 0.9rem; color: #2A7F7F; font-weight: 600; }
          .gen-card-row-ro { font-size: 0.7rem; color: #6b7280; font-style: italic; }
          .gen-card-footer { background: #fee2e2; padding: 10px 18px; border-top: 1px solid #fca5a5; }
          .gen-card-numbers { display: flex; gap: 12px; flex-wrap: wrap; font-size: 0.72rem; color: #dc2626; font-weight: 600; }
          svg { display: inline-block; vertical-align: middle; }
          @media print {
            body { padding: 0; }
            .generated-card { border-radius: 0; border: 1px solid #2d2d2d; }
          }
        
  /* =====================================================
     MOBILE-ONLY FIXES  (max-width: 900px)
     Zero effect on desktop — all rules inside media query
     ===================================================== */
  @media (max-width: 900px) {

    /* 1. Emergency Info button in mobile nav hamburger sidebar */
    .mobile-sidebar-links .sidebar-cta {
      display: block !important;
      background: var(--red, #dc2626) !important;
      color: #fff !important;
      border-radius: 8px !important;
      padding: 12px 16px !important;
      margin-top: 12px !important;
      text-align: center !important;
      font-weight: 600 !important;
    }

    /* 2. Footer — full width, stacked, no side padding bleed */
    footer {
      width: 100%;
      box-sizing: border-box;
      padding: 24px 20px !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }

    /* 3. Submit-a-correction bar — full width, no overflow */
    .correction-bar {
      width: 100%;
      box-sizing: border-box;
      padding: 16px 20px !important;
    }
    .correction-bar-inner {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 10px !important;
    }
    .btn-correction {
      width: 100% !important;
      text-align: center !important;
    }

    /* 4. Submit-a-correction MODAL — constrained, scrollable, not full-screen */
    .modal-overlay {
      padding: 16px !important;
      align-items: flex-end !important;
    }
    .modal {
      width: 100% !important;
      max-width: 100% !important;
      max-height: 88vh !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
      border-radius: 20px 20px 0 0 !important;
      padding: 24px 20px !important;
    }

  }

</style>
      </head>
      <body>
        ${cardHTML}
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); window.close(); }, 400);
          };
        <\/script>
      

</body>
      </html>
    `);
    printWindow.document.close();
  }

  // ── CAROUSEL ──
  function initCarousel() {
    const carouselItems = [...conditions, ...allergies];
    const track = document.getElementById("carouselTrack");

    [0,1].forEach(() => {
      carouselItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "carousel-card";
        card.style.borderColor = item.color;
        const iconSvg = getIcon(item.id, item.iconColor, 22);
        card.innerHTML =
          '<div class="carousel-card-icon" style="background:' + item.color + '">' + iconSvg + '</div>' +
          '<div class="carousel-card-name">' + item.name + '</div>' +
          '<div class="carousel-card-ja">' + item.ja + '</div>' +
          '<div class="carousel-card-ro">' + item.ro + '</div>' +
          '<div class="carousel-card-phrase">' +
            '<strong>' + item.sentence_en + '</strong>' +
            item.sentence_ja +
          '</div>';
        track.appendChild(card);
      });
    });
  }

  initCardBuilder();

  document.querySelectorAll('.sub-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (!target) return;
      const navHeight = document.querySelector('nav').offsetHeight;
      const subNavHeight = document.querySelector('.sub-nav').offsetHeight;
      const offset = navHeight + subNavHeight + 24;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Sub nav active state on scroll
  const sections = ['specialist', 'emergency', 'card'];
  const subLinks = document.querySelectorAll('.sub-nav a');

  window.addEventListener('scroll', () => {
    const navHeight = document.querySelector('nav').offsetHeight;
    const subNavHeight = document.querySelector('.sub-nav').offsetHeight;
    const offset = navHeight + subNavHeight + 40;
    let current = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - offset) current = id;
    });
    subLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  // Flowchart toggle


  function toggleSidebar() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('mobileOverlay');
    const btn = document.getElementById('hamburgerBtn');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    btn.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }

  function closeSidebar() {
    document.getElementById('mobileSidebar').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('open');
    document.getElementById('hamburgerBtn').classList.remove('open');
    document.body.style.overflow = '';
  }



  function toggleForm(id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  }
