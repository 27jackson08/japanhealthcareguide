  function showLang(val) {
    document.querySelectorAll('.lang-panel').forEach(p => p.classList.remove('active'));
    var placeholder = document.getElementById('lang-placeholder');
    if (val) {
      placeholder.style.display = 'none';
      var panel = document.getElementById('lang-' + val);
      if (panel) panel.classList.add('active');
    } else {
      placeholder.style.display = 'block';
    }
  }

  function printCard(langCode) {
    var panel = document.getElementById('lang-' + langCode);
    if (!panel) return;
    var table = panel.querySelector('.lang-phrase-table');
    if (!table) return;
    var headers = table.querySelectorAll('thead th');
    var rows = table.querySelectorAll('tbody tr');
    var langName = headers[0] ? headers[0].textContent.trim() : 'Language';
    var titleMap = {zh:'Chinese / Japanese Medical Phrase Card',ko:'Korean / Japanese Medical Phrase Card',es:'Spanish / Japanese Medical Phrase Card',pt:'Portuguese / Japanese Medical Phrase Card',tl:'Filipino / Japanese Medical Phrase Card',vi:'Vietnamese / Japanese Medical Phrase Card',th:'Thai / Japanese Medical Phrase Card',id:'Indonesian / Japanese Medical Phrase Card',fr:'French / Japanese Medical Phrase Card'};
    var title = titleMap[langCode] || 'Medical Phrase Card';
    var tableRows = '';
    rows.forEach(function(row) {
      var cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        tableRows += '<tr><td>' + cells[0].textContent.trim() + '</td><td>' + cells[1].textContent.trim() + '</td></tr>';
      }
    });
    var printArea = document.getElementById('print-card-area');
    printArea.innerHTML = '<div class="print-card"><h2>' + title + '</h2><p>Japan Healthcare Guide — japanhealthcareguide.com | Emergency: 119 (ambulance) · 110 (police) · JNTO 24h: 050-3816-2787 · AMDA: 03-6233-9266</p><p style="font-size:8pt;color:#555;margin-bottom:10px;">To ask for an interpreter: <strong>通訳者を呼んでいただけますか？</strong> (Tsuyakusha o yonde itadakemasu ka?)</p><table><thead><tr><th>' + langName + '</th><th>日本語 (Japanese)</th></tr></thead><tbody>' + tableRows + '</tbody></table></div>';
    window.print();
  }

  function showLangTab(langCode, tabName) {
    // Deactivate all panels for this language
    var panels = document.querySelectorAll('[id^="ltab-' + langCode + '-"]');
    panels.forEach(function(p) { p.classList.remove('active'); });
    // Deactivate tab buttons within this language panel
    var langPanel = document.getElementById('lang-' + langCode);
    if (langPanel) {
      langPanel.querySelectorAll('.trans-tab').forEach(function(b) { b.classList.remove('active'); });
      // Activate clicked tab button
      langPanel.querySelectorAll('.trans-tab').forEach(function(b) {
        if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + tabName + "'")) {
          b.classList.add('active');
        }
      });
    }
    // Activate chosen panel
    var target = document.getElementById('ltab-' + langCode + '-' + tabName);
    if (target) target.classList.add('active');
  }
