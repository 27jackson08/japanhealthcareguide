// Shared by /clinic-finder and /clinic-map: saved clinics, opening hours, Supabase
// reactions/comments/corrections, and distance helpers.

const SAVED_KEY = 'jhg_saved_clinics';

const SUPABASE_URL  = 'https://vthnhjcmjlyfgcutuvze.supabase.co';

const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0aG5oamNtamx5ZmdjdXR1dnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNDc5NjIsImV4cCI6MjA5NTYyMzk2Mn0._nATkowjt3OyPgIKPU7LQ3qQXHSAHh4odQ-mr6p0bU4';

const SB_HEADERS    = { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY };

const BAD_WORDS = [
    'fuck','shit','ass','bitch','cunt','dick','cock','pussy','bastard',
    'asshole','motherfucker','faggot','nigger','nigga','retard','whore',
    'slut','prick','twat','wanker','damn','crap','bullshit','jackass'
  ];

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

function getDistanceFromUser(clinicName, userCoords) {
    const cc = clinicCoords[clinicName];
    if (!cc || !userCoords) return 999;
    return haversine(userCoords[0], userCoords[1], cc[0], cc[1]);
  }

function getOpenStatus(clinicName) {
    const hours = clinicHours[clinicName];
    if (!hours) return { status: 'unknown' };

    // Get current Tokyo time. If user device is in Japan, this is just new Date().
    // For robustness, convert explicitly to JST (UTC+9).
    const now = new Date();
    const jstOffset = 9 * 60; // minutes
    const localOffset = now.getTimezoneOffset(); // negative east of UTC
    const jstMs = now.getTime() + (jstOffset + localOffset) * 60000;
    const jst = new Date(jstMs);

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dayName = days[jst.getDay()];
    const currentMinutes = jst.getHours() * 60 + jst.getMinutes();

    const dayHours = hours[dayName];
    if (!dayHours || dayHours === 'Closed') {
      return { status: 'closed', label: 'Closed today' };
    }

    // Parse one or more time ranges like "9:00–12:30, 14:00–17:00"
    // Handles both "–" (en-dash) and "-" (hyphen)
    const ranges = dayHours.split(',').map(r => r.trim());
    for (const range of ranges) {
      const parts = range.split(/[–\-]/).map(t => t.trim());
      if (parts.length < 2) continue;
      const [startH, startM] = parts[0].split(':').map(Number);
      const [endH, endM]   = parts[1].split(':').map(Number);
      if (isNaN(startH) || isNaN(endH)) continue;
      const start = startH * 60 + (startM || 0);
      const end   = endH   * 60 + (endM   || 0);
      if (currentMinutes >= start && currentMinutes < end) {
        // Open now — show closing time
        const closeStr = parts[1];
        return { status: 'open', label: 'Open · closes ' + closeStr };
      }
    }

    // Check if it opens later today
    for (const range of ranges) {
      const parts = range.split(/[–\-]/).map(t => t.trim());
      if (parts.length < 2) continue;
      const [startH, startM] = parts[0].split(':').map(Number);
      if (isNaN(startH)) continue;
      const start = startH * 60 + (startM || 0);
      if (currentMinutes < start) {
        return { status: 'closed', label: 'Opens at ' + parts[0] };
      }
    }

    // All ranges passed for today
    return { status: 'closed', label: 'Closed now' };
  }

function handlePopupOverlayClick(e) {
    if (e.target === document.getElementById("clinicPopupOverlay")) closeClinicPopup();
  }

function getSavedClinics() {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    } catch { return []; }
  }

function setSavedClinics(arr) {
    localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
    updateSavedBadge();
  }

function updateSavedBadge() {
    const count = getSavedClinics().length;
    const badge = document.getElementById('savedBadge');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

function toggleBookmark() {
    const c = window._currentClinic;
    if (!c) return;

    const saved = getSavedClinics();
    const idx = saved.findIndex(s => s.name === c.name);
    const btn = document.getElementById('btnBookmark');

    if (idx > -1) {
      // Remove
      saved.splice(idx, 1);
      setSavedClinics(saved);
      btn.classList.remove('saved');
    } else {
      // Add — store minimal data needed for the dashboard
      saved.push({
        name:      c.name,
        specialty: c.specialty,
        address:   c.address,
        location:  c.location,
        insurance: c.insurance || false,
        website:   c.website
      });
      setSavedClinics(saved);
      btn.classList.add('saved');
    }

    // Pop animation — remove then re-add so it can fire again
    btn.classList.remove('pop');
    void btn.offsetWidth; // force reflow
    btn.classList.add('pop');
    btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once: true });
  }

function openSavedModal() {
    renderSavedModal();
    document.getElementById('savedOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

function closeSavedModal() {
    document.getElementById('savedOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

function handleSavedOverlayClick(e) {
    if (e.target === document.getElementById('savedOverlay')) closeSavedModal();
  }

function renderSavedModal() {
    const body = document.getElementById('savedModalBody');
    const saved = getSavedClinics();

    if (saved.length === 0) {
      body.innerHTML =
        '<div class="saved-empty">' +
          '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>' +
          '<p>No saved clinics yet.</p>' +
          '<p style="font-size:0.8rem;">Click the bookmark icon in any clinic popup to save it here.</p>' +
        '</div>';
      return;
    }

    body.innerHTML = '';
    saved.forEach(s => {
      const status = getOpenStatus(s.name);
      const isDotOpen = status.status === 'open';
      const isDotClosed = status.status === 'closed';
      const statusText = status.status !== 'unknown' ? status.label : '';

      const row = document.createElement('div');
      row.className = 'saved-clinic-row';
      row.innerHTML =
        '<div class="saved-clinic-info">' +
          '<span class="saved-clinic-name">' + s.name + '</span>' +
          '<span class="saved-clinic-meta">' +
            (s.specialty && s.specialty[0] ? '<span>' + s.specialty[0] + '</span><span>·</span>' : '') +
            '<span>' + s.address + '</span>' +
            (statusText ?
              '<span>·</span>' +
              '<span class="saved-open-dot ' + (isDotOpen ? 'open' : isDotClosed ? 'closed' : '') + '"></span>' +
              '<span style="color:' + (isDotOpen ? 'var(--green)' : 'var(--red)') + ';font-weight:500;">' + statusText + '</span>'
            : '') +
          '</span>' +
        '</div>' +
        '<button class="btn-unsave" onclick="unsaveClinic(\'' + s.name.replace(/'/g,"\\'") + '\', event)" title="Remove">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
        '</button>';

      // Click row to open clinic popup
      row.addEventListener('click', (e) => {
        if (e.target.closest('.btn-unsave')) return;
        const clinic = clinics.find(c => c.name === s.name);
        if (clinic) {
          closeSavedModal();
          openClinicPopup(clinic);
        }
      });

      body.appendChild(row);
    });
  }

function unsaveClinic(name, e) {
    e.stopPropagation();
    const saved = getSavedClinics().filter(s => s.name !== name);
    setSavedClinics(saved);
    renderSavedModal();
    // If this clinic's popup is open, update its bookmark button too
    if (window._currentClinic && window._currentClinic.name === name) {
      document.getElementById('btnBookmark').classList.remove('saved');
    }
  }

async function sbFetch(path, opts = {}) {
    const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
      headers: SB_HEADERS,
      ...opts
    });
    if (!res.ok) throw new Error(await res.text());
    // 204 No Content has no body
    if (res.status === 204) return null;
    return res.json();
  }

function containsBadWord(text) {
    const lower = text.toLowerCase().replace(/[^a-z\s]/g, ' ');
    const words = lower.split(/\s+/);
    return words.some(w => BAD_WORDS.includes(w));
  }

async function loadReactions(clinicId) {
    try {
      const data = await sbFetch('clinic_reactions?clinic_id=eq.' + encodeURIComponent(clinicId) + '&select=helpful,neutral,unhelpful');
      const row = data && data[0];
      document.getElementById('count-helpful').textContent   = row ? row.helpful   : 0;
      document.getElementById('count-neutral').textContent   = row ? row.neutral   : 0;
      document.getElementById('count-unhelpful').textContent = row ? row.unhelpful : 0;

      // Restore prior selection from sessionStorage
      const prior = sessionStorage.getItem('reaction:' + clinicId);
      if (prior) {
        const btn = document.getElementById('btn-' + prior);
        if (btn) btn.classList.add('selected-' + prior);
      }
    } catch (e) {
      console.warn('Reactions load failed:', e);
      ['helpful','neutral','unhelpful'].forEach(t => {
        const el = document.getElementById('count-' + t);
        if (el) el.textContent = '–';
      });
    }
  }

async function submitReaction(clinicId, type) {
    // One reaction per clinic per session — deselect if same button clicked again
    const prior = sessionStorage.getItem('reaction:' + clinicId);

    // Remove any prior highlight
    ['helpful','neutral','unhelpful'].forEach(t => {
      const btn = document.getElementById('btn-' + t);
      if (btn) btn.classList.remove('selected-helpful','selected-neutral','selected-unhelpful');
    });

    if (prior === type) {
      // Toggle off — decrement the old reaction
      sessionStorage.removeItem('reaction:' + clinicId);
      await upsertReaction(clinicId, null, prior);
    } else {
      // Apply new reaction
      sessionStorage.setItem('reaction:' + clinicId, type);
      const btn = document.getElementById('btn-' + type);
      if (btn) btn.classList.add('selected-' + type);
      await upsertReaction(clinicId, type, prior);
    }

    // Reload fresh counts
    loadReactions(clinicId);
  }

async function upsertReaction(clinicId, addType, removeType) {
    try {
      // Try to get existing row
      const existing = await sbFetch('clinic_reactions?clinic_id=eq.' + encodeURIComponent(clinicId) + '&select=helpful,neutral,unhelpful');
      const row = existing && existing[0];

      if (!row) {
        // Insert fresh row — only increment the new type
        const body = { clinic_id: clinicId, helpful: 0, neutral: 0, unhelpful: 0 };
        if (addType) body[addType] = 1;
        await sbFetch('clinic_reactions', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' }
        });
      } else {
        // Patch existing counts
        const patch = {};
        if (addType)    patch[addType]    = Math.max(0, (row[addType]    || 0) + 1);
        if (removeType) patch[removeType] = Math.max(0, (row[removeType] || 0) - 1);
        await sbFetch('clinic_reactions?clinic_id=eq.' + encodeURIComponent(clinicId), {
          method: 'PATCH',
          body: JSON.stringify(patch),
          headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' }
        });
      }
    } catch (e) {
      console.warn('Reaction submit failed:', e);
    }
  }

async function loadComments(clinicId) {
    const list = document.getElementById('commentsList');
    if (!list) return;
    list.innerHTML = '<p class="comments-loading">Loading...</p>';

    try {
      const data = await sbFetch(
        'clinic_comments?clinic_id=eq.' + encodeURIComponent(clinicId) +
        '&order=created_at.desc&select=body,created_at'
      );

      if (!data || data.length === 0) {
        list.innerHTML = '<p class="comments-empty">No community tips yet — be the first to share one.</p>';
        return;
      }

      list.innerHTML = '';
      data.forEach(comment => {
        const date = new Date(comment.created_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        });
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML =
          '<div class="comment-meta">' +
            '<div class="comment-avatar">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2A7F7F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
            '</div>' +
            '<span class="comment-author">Anonymous</span>' +
            '<span class="comment-date">' + date + '</span>' +
          '</div>' +
          '<div class="comment-body">' + escapeHtml(comment.body) + '</div>';
        list.appendChild(div);
      });
    } catch (e) {
      console.warn('Comments load failed:', e);
      list.innerHTML = '<p class="comments-empty">No comments yet — be the first to share a tip.</p>';
    }
  }

function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

function updateCharCount() {
    const input = document.getElementById('commentInput');
    const counter = document.getElementById('charCount');
    if (!input || !counter) return;
    const len = input.value.length;
    counter.textContent = len + ' / 400';
    counter.classList.toggle('over', len > 380);
  }

async function submitComment(clinicId) {
    const input   = document.getElementById('commentInput');
    const errEl   = document.getElementById('commentError');
    const btn     = document.getElementById('btnCommentSubmit');
    if (!input || !errEl || !btn) return;

    const text = input.value.trim();
    errEl.classList.remove('show');
    errEl.textContent = '';

    if (!text) {
      errEl.textContent = 'Please write something before posting.';
      errEl.classList.add('show');
      return;
    }

    if (text.length > 400) {
      errEl.textContent = 'Keep it under 400 characters.';
      errEl.classList.add('show');
      return;
    }

    if (containsBadWord(text)) {
      errEl.textContent = 'Your comment contains language that isn\'t allowed. Please revise it.';
      errEl.classList.add('show');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Posting...';

    // ── Step 1: insert the comment ──
    let insertOk = false;
    try {
      const res = await fetch(SUPABASE_URL + '/rest/v1/clinic_comments', {
        method: 'POST',
        headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ clinic_id: clinicId, body: text })
      });
      // 201 Created or 204 No Content both mean success
      insertOk = res.status === 201 || res.status === 204 || res.ok;
    } catch (e) {
      console.warn('Comment insert failed:', e);
    }

    if (!insertOk) {
      errEl.textContent = 'Could not post your comment. Please try again.';
      errEl.classList.add('show');
      btn.disabled = false;
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Post';
      return;
    }

    // ── Step 2: mark this clinic as commented in localStorage ──
    try {
      const commented = JSON.parse(localStorage.getItem('jhg_commented') || '{}');
      commented[clinicId] = true;
      localStorage.setItem('jhg_commented', JSON.stringify(commented));
    } catch (e) { /* localStorage unavailable — non-fatal */ }

    // ── Step 3: clear input and reload comments ──
    input.value = '';
    updateCharCount();

    // Reload comments; if it fails that's non-fatal — comment was saved
    try {
      await loadComments(clinicId);
    } catch (e) {
      console.warn('Could not reload comments after post:', e);
    }

    // Hide input, show "already commented" notice
    renderCommentInput(clinicId);
  }

function renderCommentInput(clinicId) {
    const wrap = document.getElementById('commentInputWrap');
    if (!wrap) return;

    let hasCommented = false;
    try {
      const commented = JSON.parse(localStorage.getItem('jhg_commented') || '{}');
      hasCommented = !!commented[clinicId];
    } catch (e) {}

    if (hasCommented) {
      wrap.innerHTML =
        '<div style="background:var(--green-light);border:1px solid #86efac;border-radius:8px;padding:12px 16px;font-size:0.825rem;color:var(--green);display:flex;align-items:center;gap:8px;">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          'You\'ve already shared a tip for this clinic. Thanks for contributing!' +
        '</div>';
    } else {
      wrap.innerHTML =
        '<textarea class="comment-textarea" id="commentInput" maxlength="400" placeholder="Share a tip about this clinic — e.g. best time to visit, parking, what to bring..." oninput="updateCharCount()"></textarea>' +
        '<div class="comment-submit-row">' +
          '<span class="comment-char-count" id="charCount">0 / 400</span>' +
          '<button class="btn-comment-submit" id="btnCommentSubmit" onclick="submitComment(\'' + clinicId + '\')">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
            'Post' +
          '</button>' +
        '</div>' +
        '<span class="comment-error" id="commentError"></span>';
    }
  }

function openModalForClinic(clinicName) {
    document.getElementById("modalOverlay").classList.add("open");
    const nameInput = document.getElementById("correctionForm").querySelectorAll("input")[0];
    if (nameInput) nameInput.value = clinicName;
  }

function handleOverlayClick(e) { if (e.target === document.getElementById("modalOverlay")) closeModal(); }

async function submitCorrection() {
    const btn = document.getElementById("btnModalSubmit");
    const form = document.getElementById("correctionForm");
    const successEl = document.getElementById("formSuccess");
    const errorEl = document.getElementById("formError");
    const fieldsEl = document.getElementById("formFields");

    const type = form.querySelector("select").value;
    const clinicName = form.querySelectorAll("input")[0].value;
    const details = form.querySelector("textarea").value;
    const email = form.querySelectorAll("input")[1].value;

    if (!clinicName || !details) {
      errorEl.textContent = "Please fill in the clinic name and details before submitting.";
      errorEl.style.display = "block";
      return;
    }

    btn.disabled = true;
    btn.textContent = "Sending...";
    errorEl.style.display = "none";

    try {
      const response = await fetch("https://formspree.io/f/mjgldlpz", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ type, clinicName, details, email })
      });

      if (response.ok) {
        fieldsEl.style.display = "none";
        btn.style.display = "none";
        successEl.style.display = "block";
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      errorEl.textContent = "Something went wrong. Please try again or email us directly.";
      errorEl.style.display = "block";
      btn.disabled = false;
      btn.textContent = "Submit";
    }
  }
