  const clinics = ALL_CLINICS;

  // ── CLINIC DATA ──

  const specialties = [...new Set(clinics.flatMap(c => c.specialty))].sort();

  const tokyoLocations = [
    // West Tokyo (near ASIJ)
    "Fuchu","Koganei","Mitaka","Musashino","Kichijoji","Musashisakai","Chofu","Kokubunji",
    "Higashi-Koganei","Higashi Fuchu","Tachikawa","Hachioji","Fussa","Akishima","Kodaira",
    "Kunitachi","Higashimurayama","Higashikurume","Nishitokyo","Musashimurayama","Higashiyamato",
    // Suginami / Nakano / Setagaya
    "Shimokitazawa","Ogikubo","Koenji","Higashi-Koenji","Nakano","Suginami","Setagaya",
    "Sangenjaya","Daikanyama","Nakameguro","Ebisu","Meguro","Jiyugaoka",
    // Shibuya / Shinjuku area
    "Shibuya","Shinjuku","Yoyogi","Takadanobaba","Harajuku","Omotesando","Sendagaya",
    // Minato / central
    "Roppongi","Nishiazabu","Azabu","Hiroo","Azabujuban","Minato","Aoyama","Akasaka",
    "Toranomon","Shiba","Mita","Shiodome","Shimbashi","Tamachi",
    // Central Tokyo
    "Chiyoda","Otemachi","Marunouchi","Hibiya","Yaesu","Ginza","Tsukiji","Chuo",
    "Nihonbashi","Kyobashi","Iidabashi","Jimbocho",
    // Shinagawa / South
    "Shinagawa","Shirokane","Takanawa","Gotanda","Osaki","Meguro",
    // East Tokyo
    "Taito","Asakusa","Ueno","Akihabara","Sumida","Koto","Kiba","Shinonome",
    "Toshima","Ikebukuro","Sugamo","Kita","Oji","Arakawa","Nishi-Nippori",
    "Itabashi","Nerima","Adachi","Katsushika","Edogawa",
    // Other
    "Machida","Hachimanyama","Musashidai"
  ].filter((v, i, a) => a.indexOf(v) === i).sort();

  // location ordering by proximity to Fuchu (rough ordering)
  // Coordinates for each location and each clinic

  function getUserCoords(locVal) {
    if (!locVal) return null;
    const key = Object.keys(locationCoords).find(k => k.toLowerCase() === locVal.toLowerCase())
             || Object.keys(locationCoords).find(k => locVal.toLowerCase().includes(k.toLowerCase()))
             || Object.keys(locationCoords).find(k => k.toLowerCase().includes(locVal.toLowerCase()));
    return key ? locationCoords[key] : null;
  }

  let selectedSpecialty = "";
  let selectedLocation = "";

  // ── SPECIALTY INPUT ──
  const specialtyInput = document.getElementById("specialtyInput");
  const specialtyDropdown = document.getElementById("specialtyDropdown");

  specialtyInput.addEventListener("input", () => {
    const val = specialtyInput.value.trim().toLowerCase();
    const matches = val ? specialties.filter(s => s.toLowerCase().includes(val)) : specialties;
    renderDropdown(specialtyDropdown, matches, (s) => {
      specialtyInput.value = s;
      selectedSpecialty = s;
      specialtyDropdown.classList.remove("open");
    });
    selectedSpecialty = "";
  });

  specialtyInput.addEventListener("focus", () => {
    const val = specialtyInput.value.trim().toLowerCase();
    const matches = val ? specialties.filter(s => s.toLowerCase().includes(val)) : specialties;
    renderDropdown(specialtyDropdown, matches, (s) => {
      specialtyInput.value = s;
      selectedSpecialty = s;
      specialtyDropdown.classList.remove("open");
    });
  });

  // ── LOCATION INPUT ──
  const locationInput = document.getElementById("locationInput");
  const locationDropdown = document.getElementById("locationDropdown");

  locationInput.addEventListener("input", () => {
    const val = locationInput.value.trim().toLowerCase();
    const matches = val ? tokyoLocations.filter(l => l.toLowerCase().includes(val)) : tokyoLocations;
    renderDropdown(locationDropdown, matches, (l) => {
      locationInput.value = l;
      selectedLocation = l;
      locationDropdown.classList.remove("open");
    });
    selectedLocation = "";
  });

  locationInput.addEventListener("focus", () => {
    const val = locationInput.value.trim().toLowerCase();
    const matches = val ? tokyoLocations.filter(l => l.toLowerCase().includes(val)) : tokyoLocations;
    renderDropdown(locationDropdown, matches, (l) => {
      locationInput.value = l;
      selectedLocation = l;
      locationDropdown.classList.remove("open");
    });
  });

  // close dropdowns on outside click
  document.addEventListener("click", (e) => {
    if (!document.getElementById("specialtyField").contains(e.target)) specialtyDropdown.classList.remove("open");
    if (!document.getElementById("locationField").contains(e.target)) locationDropdown.classList.remove("open");
  });

  // enter key triggers search
  [specialtyInput, locationInput].forEach(inp => {
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { closeAllDropdowns(); runSearch(); } });
  });

  function closeAllDropdowns() {
    specialtyDropdown.classList.remove("open");
    locationDropdown.classList.remove("open");
  }

  function renderDropdown(dropdown, items, onSelect) {
    if (!items.length) {
      dropdown.innerHTML = `<div class="dropdown-empty">No matches found</div>`;
    } else {
      dropdown.innerHTML = "";
      items.forEach(item => {
        const div = document.createElement("div");
        div.className = "dropdown-item";
        div.innerHTML = `<span class="dot"></span>${item}`;
        div.addEventListener("click", () => onSelect(item));
        dropdown.appendChild(div);
      });
    }
    dropdown.classList.add("open");
  }

  // ── SPECIALTY PILLS ──
  const pillsContainer = document.getElementById("specialtyPills");
  specialties.forEach(s => {
    const btn = document.createElement("button");
    btn.className = "specialty-pill-btn";
    btn.textContent = s;
    btn.onclick = () => {
      specialtyInput.value = s;
      selectedSpecialty = s;
      runSearch();
    };
    pillsContainer.appendChild(btn);
  });

  // ── SEARCH ──
  function runSearch() {
    const specVal = specialtyInput.value.trim();
    const locVal = locationInput.value.trim();
    selectedSpecialty = specVal;
    selectedLocation = locVal;

    let results = clinics;

    // filter by specialty only
    if (specVal) {
      results = results.filter(c =>
        c.specialty.some(s => s.toLowerCase().includes(specVal.toLowerCase()))
      );
    }

    document.getElementById("defaultState").style.display = "none";
    document.getElementById("resultsSection").style.display = "block";

    const grid = document.getElementById("clinicGrid");
    const empty = document.getElementById("emptyState");
    const countEl = document.getElementById("resultsCount");
    const filtersEl = document.getElementById("activeFilters");

    // active filter tags
    filtersEl.innerHTML = "";
    if (specVal) filtersEl.innerHTML += '<span class="filter-tag">' + specVal + '</span>';
    if (locVal) filtersEl.innerHTML += '<span class="filter-tag">' + locVal + '</span>';

    if (!results.length) {
      grid.innerHTML = "";
      grid.style.display = "block";
      empty.classList.add("show");
      countEl.innerHTML = "<strong>0</strong> clinics found";
      return;
    }

    empty.classList.remove("show");
    grid.style.display = "block";

    const userCoords = getUserCoords(locVal);

    if (userCoords) {
      const sorted = results.slice().sort((a, b) =>
        getDistanceFromUser(a.name, userCoords) - getDistanceFromUser(b.name, userCoords)
      );

      // A clinic is "in the neighborhood" only if its location name matches the search term
      const locLower = locVal.toLowerCase();
      const inNeighborhood = sorted.filter(c =>
        c.location.toLowerCase().includes(locLower) ||
        locLower.includes(c.location.toLowerCase()) ||
        c.address.toLowerCase().includes(locLower)
      );
      const nearby = sorted.filter(c =>
        !c.location.toLowerCase().includes(locLower) &&
        !locLower.includes(c.location.toLowerCase()) &&
        !c.address.toLowerCase().includes(locLower)
      ).slice(0, 5);

      grid.innerHTML = "";

      if (inNeighborhood.length > 0) {
        countEl.innerHTML = "<strong>" + inNeighborhood.length + "</strong> clinic" + (inNeighborhood.length !== 1 ? "s" : "") + " in your neighborhood";

        const neighborhoodHeader = document.createElement("div");
        neighborhoodHeader.className = "results-section-header";
        neighborhoodHeader.innerHTML =
          '<div class="results-section-title green">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
            inNeighborhood.length + ' clinic' + (inNeighborhood.length !== 1 ? 's' : '') + ' in ' + locVal +
          '</div>';
        grid.appendChild(neighborhoodHeader);

        const neighborhoodGrid = document.createElement("div");
        neighborhoodGrid.className = "clinic-grid";
        inNeighborhood.forEach(c => neighborhoodGrid.appendChild(buildCard(c, userCoords, locVal)));
        grid.appendChild(neighborhoodGrid);

        if (nearby.length > 0) {
          const divider = document.createElement("div");
          divider.className = "results-section-divider";
          grid.appendChild(divider);

          const nearbyHeader = document.createElement("div");
          nearbyHeader.className = "results-section-header";
          nearbyHeader.innerHTML =
            '<div class="results-section-title gray">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
              'Other nearby options' +
            '</div>';
          grid.appendChild(nearbyHeader);

          const nearbyGrid = document.createElement("div");
          nearbyGrid.className = "clinic-grid";
          nearby.forEach(c => nearbyGrid.appendChild(buildCard(c, userCoords, locVal)));
          grid.appendChild(nearbyGrid);
        }

      } else {
        // no clinics in neighborhood
        countEl.innerHTML = "No clinics found in <strong>" + locVal + "</strong> — showing nearest options";

        const noLocalMsg = document.createElement("div");
        noLocalMsg.className = "no-local-msg";
        noLocalMsg.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
          'No ' + (specVal || '') + ' clinics found directly in <strong>' + locVal + '</strong>. Here are the closest options nearby:';
        grid.appendChild(noLocalMsg);

        const nearbyHeader = document.createElement("div");
        nearbyHeader.className = "results-section-header";
        nearbyHeader.innerHTML =
          '<div class="results-section-title teal">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
            'Closest to ' + locVal +
          '</div>';
        grid.appendChild(nearbyHeader);

        const nearbyGrid = document.createElement("div");
        nearbyGrid.className = "clinic-grid";
        nearby.forEach(c => nearbyGrid.appendChild(buildCard(c, userCoords, locVal)));
        grid.appendChild(nearbyGrid);
      }

    } else {
      // no location — just show all alphabetically
      const sorted = results.slice().sort((a, b) => a.name.localeCompare(b.name));
      countEl.innerHTML = "<strong>" + sorted.length + "</strong> clinic" + (sorted.length !== 1 ? "s" : "") + " found";

      grid.innerHTML = "";
      const allGrid = document.createElement("div");
      allGrid.className = "clinic-grid";
      sorted.forEach(c => allGrid.appendChild(buildCard(c, null, null)));
      grid.appendChild(allGrid);
    }
  }

  // ── OPEN/CLOSED STATUS ──
  // Uses browser's local time. Since users are in Tokyo this is JST.
  // If the device clock is set correctly, this is accurate.

  function buildCard(c, userCoords, locVal) {
    const card = document.createElement("div");
    card.className = "clinic-card";
    card.addEventListener("click", () => openClinicPopup(c));

    const extraSpecialties = c.specialty.length > 1
      ? c.specialty.slice(1).map(s => '<span class="clinic-tag" style="background:var(--teal-light);color:var(--teal);font-size:0.7rem;padding:3px 8px;border-radius:6px;">' + s + '</span>').join("")
      : "";

    const insuranceTag = c.insurance ? '<span class="clinic-tag tag-insurance">Insurance accepted</span>' : "";
    const noteTag = c.note ? '<span class="clinic-tag tag-note">' + c.note + '</span>' : "";

    const openStatus = getOpenStatus(c.name);
    const openTag = openStatus.status === 'open'
      ? '<span class="clinic-tag tag-open">● ' + openStatus.label + '</span>'
      : openStatus.status === 'closed'
        ? '<span class="clinic-tag tag-closed">● ' + openStatus.label + '</span>'
        : "";

    const dist = userCoords ? getDistanceFromUser(c.name, userCoords) : null;
    const distLabel = dist !== null
      ? '<div class="clinic-meta-row"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' + dist.toFixed(1) + ' km from ' + (locVal === "your location" ? 'your location' : locVal) + '</div>'
      : "";

    card.innerHTML =
      '<div class="clinic-card-top">' +
        '<span class="clinic-name">' + c.name + '</span>' +
        '<span class="clinic-specialty-badge">' + c.specialty[0] + '</span>' +
      '</div>' +
      '<div class="clinic-meta">' +
        '<div class="clinic-meta-row">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
          c.address +
        '</div>' +
        distLabel +
        '<div class="clinic-meta-row">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' +
          '<a href="' + c.website + '" target="_blank" style="color:var(--teal);text-decoration:none;font-size:0.825rem;">Visit website</a>' +
        '</div>' +
      '</div>' +
      '<div class="clinic-tags">' +
        '<span class="clinic-tag tag-english">' +
          '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          c.englishNote +
        '</span>' +
        openTag + insuranceTag + noteTag + extraSpecialties +
      '</div>' +
      '<div class="clinic-card-footer">' +
        '<span class="verified-badge">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
          'Last verified: 2025' +
        '</span>' +
        '<span class="clinic-link-btn">View details ' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</span>' +
      '</div>';

    return card;
  }

  function clearSearch() {
    specialtyInput.value = "";
    locationInput.value = "";
    selectedSpecialty = "";
    selectedLocation = "";
    window._gpsCoords = null;
    const btn = document.getElementById("btnNearMe");
    btn.classList.remove("loading", "active");
    btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8" opacity="0.3"/></svg> Near me';
    const errEl = document.getElementById("gpsError");
    errEl.textContent = "";
    errEl.classList.remove("show");
    document.getElementById("defaultState").style.display = "block";
    document.getElementById("resultsSection").style.display = "none";
  }

  // ── GPS NEAR ME ──
  function findNearMe() {
    const btn = document.getElementById("btnNearMe");
    const errEl = document.getElementById("gpsError");

    errEl.textContent = "";
    errEl.classList.remove("show");

    if (!navigator.geolocation) {
      errEl.textContent = "Your browser doesn't support GPS location. Try typing a neighborhood instead.";
      errEl.classList.add("show");
      return;
    }

    // Loading state
    btn.classList.add("loading");
    btn.classList.remove("active");
    btn.innerHTML = '<span class="spinner"></span> Locating...';

    navigator.geolocation.getCurrentPosition(
      // ── SUCCESS ──
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        window._gpsCoords = [userLat, userLng];

        // Active state
        btn.classList.remove("loading");
        btn.classList.add("active");
        btn.innerHTML =
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Location found';

        // Run results using real GPS coords
        runNearMeResults(userLat, userLng);
      },
      // ── ERROR ──
      (err) => {
        btn.classList.remove("loading");
        btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8" opacity="0.3"/></svg> Near me';
        const messages = {
          1: "Location access was denied. Please allow location access in your browser, then try again. On Chrome, click the lock icon in the address bar.",
          2: "Your location couldn't be determined right now. Try again or type a neighborhood.",
          3: "Location request timed out. Try again or type a neighborhood."
        };
        errEl.textContent = messages[err.code] || "Location unavailable. Try typing a neighborhood instead.";
        errEl.classList.add("show");
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }

  function runNearMeResults(userLat, userLng) {
    const specVal = specialtyInput.value.trim();
    const userCoords = [userLat, userLng];

    let results = clinics;
    if (specVal) {
      results = results.filter(c =>
        c.specialty.some(s => s.toLowerCase().includes(specVal.toLowerCase()))
      );
    }

    document.getElementById("defaultState").style.display = "none";
    document.getElementById("resultsSection").style.display = "block";

    const grid = document.getElementById("clinicGrid");
    const empty = document.getElementById("emptyState");
    const countEl = document.getElementById("resultsCount");
    const filtersEl = document.getElementById("activeFilters");

    filtersEl.innerHTML = "";
    if (specVal) filtersEl.innerHTML += '<span class="filter-tag">' + specVal + '</span>';
    filtersEl.innerHTML +=
      '<span class="filter-tag" style="background:var(--green-light);color:var(--green);">' +
        '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:3px;"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>' +
        'Near me' +
      '</span>';

    if (!results.length) {
      grid.innerHTML = "";
      grid.style.display = "block";
      empty.classList.add("show");
      countEl.innerHTML = "<strong>0</strong> clinics found";
      return;
    }

    empty.classList.remove("show");
    grid.style.display = "block";

    // Sort all by real GPS distance
    const sorted = results.slice().sort((a, b) =>
      getDistanceFromUser(a.name, userCoords) - getDistanceFromUser(b.name, userCoords)
    );

    // Split into ≤5km and beyond
    const close   = sorted.filter(c => getDistanceFromUser(c.name, userCoords) <= 5);
    const further = sorted.filter(c => getDistanceFromUser(c.name, userCoords) >  5).slice(0, 6);

    grid.innerHTML = "";

    const label = specVal ? specVal + ' clinics' : 'clinics';

    if (close.length > 0) {
      countEl.innerHTML = "<strong>" + close.length + "</strong> " + label + " within 5 km of you";

      const closeHeader = document.createElement("div");
      closeHeader.className = "results-section-header";
      closeHeader.innerHTML =
        '<div class="results-section-title green">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>' +
          close.length + ' ' + label + ' within 5 km' +
        '</div>';
      grid.appendChild(closeHeader);

      const closeGrid = document.createElement("div");
      closeGrid.className = "clinic-grid";
      close.forEach(c => closeGrid.appendChild(buildCard(c, userCoords, "your location")));
      grid.appendChild(closeGrid);

    } else {
      countEl.innerHTML = "No " + label + " found within 5 km — showing nearest options";
    }

    if (further.length > 0) {
      if (close.length > 0) {
        const divider = document.createElement("div");
        divider.className = "results-section-divider";
        grid.appendChild(divider);
      }

      const furtherHeader = document.createElement("div");
      furtherHeader.className = "results-section-header";
      furtherHeader.innerHTML =
        '<div class="results-section-title gray">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
          'Further away' +
        '</div>';
      grid.appendChild(furtherHeader);

      const furtherGrid = document.createElement("div");
      furtherGrid.className = "clinic-grid";
      further.forEach(c => furtherGrid.appendChild(buildCard(c, userCoords, "your location")));
      grid.appendChild(furtherGrid);
    }
  }

  // ── CLINIC HOURS ──
  // Verified from official websites and Metropolis Japan 2026, Tokyo Cheapo, US Embassy lists.
  // phone: verified phone number where found.
  // englishDays: days where English-specific support is confirmed available.
  
  // ── MODAL ──
  function openClinicPopup(c) {
    window._currentClinic = c; // track for bookmark toggle

    document.getElementById("popupName").textContent = c.name;

    // Set bookmark button state
    const saved = getSavedClinics();
    const isSaved = saved.some(s => s.name === c.name);
    const bookmarkBtn = document.getElementById("btnBookmark");
    bookmarkBtn.classList.toggle("saved", isSaved);

    // badges
    const badges = document.getElementById("popupBadges");
    badges.innerHTML = c.specialty.map(s =>
      '<span class="clinic-specialty-badge">' + s + '</span>'
    ).join("") + (c.insurance ? '<span class="clinic-tag tag-insurance" style="margin-left:4px;">Insurance accepted</span>' : "");

    // get coordinates for map
    const coords = clinicCoords[c.name] || locationCoords[c.location] || null;
    const lat = coords ? coords[0] : null;
    const lng = coords ? coords[1] : null;

    // Stable ID for Supabase — lowercase slug of clinic name
    const clinicId = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // map — Mapbox interactive map with marker, or fallback Google Maps link
    // Use coordinate-based Google Maps URL when we have coords (much more precise than name search)
    const mapsURL = 'https://www.google.com/maps/search/' + encodeURIComponent(c.name + ' Tokyo Japan');
    const mapHTML = lat ? (
      '<div class="popup-map-section">' +
        '<p class="popup-section-label">Location on map</p>' +
        '<div id="popup-mapbox-container"></div>' +
        '<a href="' + mapsURL + '" target="_blank" style="font-size:0.775rem;color:var(--teal);font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:4px;">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
          'Open in Google Maps for directions' +
        '</a>' +
      '</div>'
    ) : (
      '<div class="popup-map-section">' +
        '<p class="popup-section-label">Location</p>' +
        '<div class="popup-info-row">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' +
          '<a href="' + mapsURL + '" target="_blank">Search on Google Maps</a>' +
        '</div>' +
      '</div>'
    );

    // hours — check clinic data, fall back to honest placeholder
    const hoursData = clinicHours[c.name] || null;
    const hoursHTML = '<div class="popup-section">' +
      '<p class="popup-section-label">Opening hours</p>' +
      (hoursData ? (
        '<table class="popup-hours-table">' +
        ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
          const h = hoursData[day] || 'Closed';
          const closed = h === 'Closed';
          const englishDay = hoursData.englishDays && hoursData.englishDays.includes(day);
          return '<tr>' +
            '<td>' + day.slice(0,3) + '</td>' +
            '<td class="' + (closed ? 'popup-hours-closed' : '') + (englishDay ? ' popup-hours-english' : '') + '">' +
              h + (englishDay ? ' ✓ English' : '') +
            '</td>' +
          '</tr>';
        }).join('') +
        '</table>' +
        (hoursData.note ? '<p class="popup-hours-note">' + hoursData.note + '</p>' : '')
      ) : (
        '<div class="popup-info-row">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
          '<span class="popup-placeholder">Hours not confirmed — please check the clinic\'s website or call ahead before visiting</span>' +
        '</div>'
      )) +
    '</div>';

    // body
    const body = document.getElementById("popupBody");
    body.innerHTML =

      // English support
      '<div class="popup-english-box">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
        c.englishNote +
      '</div>' +

      // special note if any
      (c.note ? '<div class="popup-note-box">' + c.note + '</div>' : '') +

      '<hr class="popup-divider"/>' +

      // Map
      mapHTML +

      '<hr class="popup-divider"/>' +

      // Address
      '<div class="popup-section">' +
        '<p class="popup-section-label">Address</p>' +
        '<div class="popup-info-row">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
          c.address +
        '</div>' +
      '</div>' +

      '<hr class="popup-divider"/>' +

      // Hours
      hoursHTML +

      '<hr class="popup-divider"/>' +

      // Contact
      '<div class="popup-section">' +
        '<p class="popup-section-label">Contact</p>' +
        '<div class="popup-info-row">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
          (hoursData && hoursData.phone
            ? '<a href="tel:' + hoursData.phone + '" style="color:var(--teal);font-weight:500;">' + hoursData.phone + '</a>'
            : '<span class="popup-placeholder">Phone — check clinic website for contact details</span>') +
        '</div>' +
        '<div class="popup-info-row">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' +
          '<a href="' + c.website + '" target="_blank">' + c.website.replace('https://','').replace('http://','').split('/')[0] + '</a>' +
        '</div>' +
      '</div>' +

      '<hr class="popup-divider"/>' +

      // Community section
      '<div class="community-section">' +
        '<p class="popup-section-label">Community</p>' +

        // Reactions
        '<div>' +
          '<p style="font-size:0.8rem;color:var(--gray);margin-bottom:10px;">Was this clinic information helpful?</p>' +
          '<div class="reaction-row">' +
            '<button class="reaction-btn" id="btn-helpful" onclick="submitReaction(\'' + clinicId + '\', \'helpful\')" title="Helpful">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' +
              '<span class="reaction-count" id="count-helpful">–</span>' +
              '<span class="reaction-label">Helpful</span>' +
            '</button>' +
            '<button class="reaction-btn" id="btn-neutral" onclick="submitReaction(\'' + clinicId + '\', \'neutral\')" title="Neutral">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' +
              '<span class="reaction-count" id="count-neutral">–</span>' +
              '<span class="reaction-label">Neutral</span>' +
            '</button>' +
            '<button class="reaction-btn" id="btn-unhelpful" onclick="submitReaction(\'' + clinicId + '\', \'unhelpful\')" title="Not helpful">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' +
              '<span class="reaction-count" id="count-unhelpful">–</span>' +
              '<span class="reaction-label">Not helpful</span>' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<hr class="popup-divider"/>' +

        // Comments list
        '<div>' +
          '<p style="font-size:0.8rem;color:var(--gray);margin-bottom:10px;">Community tips &amp; experiences</p>' +
          '<div class="comments-list" id="commentsList">' +
            '<p class="comments-loading">Loading comments...</p>' +
          '</div>' +
        '</div>' +

        // Comment input
        '<div class="comment-input-wrap" id="commentInputWrap">' +
          '<textarea class="comment-textarea" id="commentInput" maxlength="400" placeholder="Share a tip about this clinic — e.g. best time to visit, parking, what to bring..." oninput="updateCharCount()"></textarea>' +
          '<div class="comment-submit-row">' +
            '<span class="comment-char-count" id="charCount">0 / 400</span>' +
            '<button class="btn-comment-submit" id="btnCommentSubmit" onclick="submitComment(\'' + clinicId + '\')">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
              'Post' +
            '</button>' +
          '</div>' +
          '<span class="comment-error" id="commentError"></span>' +
        '</div>' +

      '</div>';

    // footer
    const footer = document.getElementById("popupFooter");
    footer.innerHTML =
      '<span class="popup-verified">' +
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
        'Last verified: 2025' +
      '</span>' +
      '<div style="display:flex;gap:8px;align-items:center;">' +
        '<button class="btn-popup-correction" onclick="closeClinicPopup(); openModalForClinic(\'' + c.name.replace(/'/g, "\\'") + '\')">Report an issue</button>' +
        '<a href="' + c.website + '" target="_blank" class="btn-popup-website">' +
          'Visit website ' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
        '</a>' +
      '</div>';

    document.getElementById("clinicPopupOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
    // scroll popup back to top on each open
    document.getElementById("clinicPopup").scrollTop = 0;

    // Load reactions and comments from Supabase
    loadReactions(clinicId);
    loadComments(clinicId);
    // Render correct comment input state (fresh or already-commented notice)
    renderCommentInput(clinicId);

    // ── MAPBOX INIT ──
    // Destroy any previous instance before creating a new one
    if (window._popupMap) {
      window._popupMap.remove();
      window._popupMap = null;
    }

    if (lat && lng) {
      // Use requestAnimationFrame to ensure the container is rendered in the DOM
      requestAnimationFrame(() => {
        const container = document.getElementById("popup-mapbox-container");
        if (!container) return;

        mapboxgl.accessToken = 'pk.eyJ1IjoiamJvMjAwMCIsImEiOiJjbXBxeGd3cDAwdnMyMnFxN2k2c2Q0NHAyIn0.ZGuPY2k5_FjUJF9KB-ibow';

        const map = new mapboxgl.Map({
          container: 'popup-mapbox-container',
          style: 'mapbox://styles/mapbox/light-v11',
          center: [lng, lat],
          zoom: 15,
          scrollZoom: false,        // prevent accidental scroll hijack inside popup
          attributionControl: true
        });

        // Custom teal marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'mapbox-clinic-marker';

        new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25, closeButton: false })
              .setHTML(
                '<strong style="font-size:0.8rem;color:#2D2D2D;">' + c.name + '</strong>' +
                '<br><span style="font-size:0.72rem;color:#6B7280;">' + c.address + '</span>'
              )
          )
          .addTo(map);

        // Add zoom controls
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

        window._popupMap = map;
      });
    }
  }

  function closeClinicPopup() {
    document.getElementById("clinicPopupOverlay").classList.remove("open");
    document.body.style.overflow = "";
    // Clean up Mapbox instance to free memory
    if (window._popupMap) {
      window._popupMap.remove();
      window._popupMap = null;
    }
  }

  // close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeClinicPopup();
      closeModal();
    }
  });
  function openModal() { document.getElementById("modalOverlay").classList.add("open"); }
  
  function closeModal() {
    document.getElementById("modalOverlay").classList.remove("open");
    // reset form state
    document.getElementById("correctionForm").reset();
    document.getElementById("formSuccess").style.display = "none";
    document.getElementById("formError").style.display = "none";
    document.getElementById("formFields").style.display = "block";
    document.getElementById("btnModalSubmit").disabled = false;
    document.getElementById("btnModalSubmit").textContent = "Submit";
  }

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

  // ── BOOKMARKS / SAVED CLINICS ──

  // Init badge on page load
  updateSavedBadge();

  // ── BAD WORD FILTER ──
  // Lightweight English profanity blocklist — not exhaustive but catches casual misuse

  // ── REACTIONS ──

  // ── COMMENTS ──

  // Render the comment input area — shows input or "already commented" notice
