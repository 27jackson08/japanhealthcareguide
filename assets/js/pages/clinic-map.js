  // Therapy/rehab providers flagged showOnMap:false are listed in the finder only.
  const clinics = ALL_CLINICS.filter(function(c){ return c.showOnMap !== false; });

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

    // map — Mapbox interactive mini-map with marker, or fallback Google Maps link
    // Use coordinate-based Google Maps URL when we have coords (precise pin, not a search)
    const mapsURL = 'https://www.google.com/maps/search/' + encodeURIComponent(c.name + ' Tokyo Japan');
    const mapHTML = lat ? (
      '<div class="popup-map-section">' +
        '<p class="popup-section-label">Location on map</p>' +
        '<div id="popup-mapbox-container" style="width:100%;height:200px;border-radius:10px;overflow:hidden;border:1px solid var(--gray-light);"></div>' +
        '<a href="' + mapsURL + '" target="_blank" style="font-size:0.775rem;color:var(--teal);font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:4px;">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
          'Open in Google Maps for directions' +
        '</a>' +
      '</div>'
    ) : (
      '<div class="popup-map-section">' +
        '<p class="popup-section-label">Location</p>' +
        '<div class="popup-info-row">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
          '<a href="' + mapsURL + '" target="_blank" style="color:var(--teal);font-weight:500;">Open in Google Maps for directions</a>' +
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

    // ── MAPBOX MINI-MAP INIT ──
    // Destroy any previous instance before creating a new one
    if (window._popupMap) {
      window._popupMap.remove();
      window._popupMap = null;
    }

    if (lat && lng) {
      requestAnimationFrame(() => {
        const container = document.getElementById("popup-mapbox-container");
        if (!container) return;

        mapboxgl.accessToken = 'pk.eyJ1IjoiamJvMjAwMCIsImEiOiJjbXBxeGd3cDAwdnMyMnFxN2k2c2Q0NHAyIn0.ZGuPY2k5_FjUJF9KB-ibow';

        const miniMap = new mapboxgl.Map({
          container: 'popup-mapbox-container',
          style: 'mapbox://styles/mapbox/light-v11',
          center: [lng, lat],
          zoom: 15,
          scrollZoom: false,
          attributionControl: true
        });

        // Custom teal marker
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
          .addTo(miniMap);

        miniMap.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
        window._popupMap = miniMap;
      });
    }

  }

  function closeClinicPopup() {
    document.getElementById("clinicPopupOverlay").classList.remove("open");
    document.body.style.overflow = "";
    // Clean up Mapbox popup-map instance to free memory
    if (window._popupMap) {
      window._popupMap.remove();
      window._popupMap = null;
    }
  }

  mapboxgl.accessToken='pk.eyJ1IjoiamJvMjAwMCIsImEiOiJjbXBxeGd3cDAwdnMyMnFxN2k2c2Q0NHAyIn0.ZGuPY2k5_FjUJF9KB-ibow';
  var MAP_STYLES={light:'mapbox://styles/mapbox/light-v11',streets:'mapbox://styles/mapbox/streets-v12',dark:'mapbox://styles/mapbox/dark-v11',satellite:'mapbox://styles/mapbox/satellite-streets-v12'};
  var map=new mapboxgl.Map({container:'mapbox',style:MAP_STYLES.light,center:[139.7010,35.6895],zoom:12,trackResize:true});
  map.addControl(new mapboxgl.NavigationControl({showCompass:false}),'bottom-right');
  var activeMarkers=[],userMarker=null,userCoords=null,currentStyle='light',filteredClinics=clinics.slice(),highlightedName=null,savedFilterActive=false;

  // Populate dropdowns
  (function(){
    var specs=[];clinics.forEach(function(c){c.specialty.forEach(function(s){if(specs.indexOf(s)===-1)specs.push(s);});});specs.sort();
    var ss=document.getElementById('mapSpecialtyFilter');specs.forEach(function(s){var o=document.createElement('option');o.value=s;o.textContent=s;ss.appendChild(o);});
    var ls=document.getElementById('mapLocationFilter');Object.keys(locationCoords).sort().forEach(function(l){var o=document.createElement('option');o.value=l;o.textContent=l;ls.appendChild(o);});
  })();

  // On mobile: Search opens the results sheet and flies the map to the filtered area
  function applyMapFiltersAndOpen() {
    applyMapFilters();
    // On mobile, open the sheet to show results
    if (window.innerWidth <= 900) {
      openMobileSheet();
      // Fly map to fit the filtered results
      var coords = filteredClinics.map(function(c){ return getCoords(c); }).filter(Boolean);
      if (coords.length > 0) {
        var bounds = new mapboxgl.LngLatBounds();
        coords.forEach(function(co){ bounds.extend([co[1], co[0]]); });
        setTimeout(function(){
          map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 600 });
        }, 350); // slight delay so sheet animation doesn't fight flyTo
      }
    }
  }

  function getCoords(c){return clinicCoords[c.name]||locationCoords[c.location]||null;}

  function toggleLegend(){
    var leg=document.getElementById('mapLegend');
    var btn=document.getElementById('legendToggleBtn');
    var isOpen=leg.classList.toggle('open');
    // reposition: hide button when panel is open, show it when closed
    btn.style.display = isOpen ? 'none' : 'flex';
    // add a close X inside the legend on first open
    if(isOpen && !document.getElementById('legendCloseBtn')){
      var closeBtn=document.createElement('button');
      closeBtn.id='legendCloseBtn';
      closeBtn.style.cssText='position:absolute;top:6px;right:6px;background:none;border:none;cursor:pointer;color:#6B7280;padding:2px;font-size:14px;line-height:1;';
      closeBtn.innerHTML='&times;';
      closeBtn.onclick=function(){leg.classList.remove('open');btn.style.display='flex';};
      leg.style.position='absolute';
      leg.appendChild(closeBtn);
    }
  }

  function setMapStyle(n){
    if(n===currentStyle)return;currentStyle=n;map.setStyle(MAP_STYLES[n]);
    ['Light','Streets','Dark','Satellite'].forEach(function(x){document.getElementById('style'+x).classList.toggle('active',x.toLowerCase()===n);});
    map.once('style.load',function(){renderMarkers(filteredClinics);});
  }

  // Map specialty → CSS class
  const SPECIALTY_CLASS = {
    'General':                      'sp-general',
    'Dentist':                      'sp-dentist',
    'Orthodontist':                 'sp-dentist',
    'Pediatric':                    'sp-pediatric',
    'Gynecology':                   'sp-gynecology',
    'Mammogram':                    'sp-gynecology',
    'Dermatology':                  'sp-dermatology',
    'Mental Health':                'sp-mental-health',
    'Orthopedic':                   'sp-orthopedic',
    'Physiotherapy & Chiropractic': 'sp-physiotherapy',
    'Ophthalmology':                'sp-ophthalmology',
    'ENT (Ear, Nose & Throat)':     'sp-ent',
    'Oncology':                     'sp-oncology',
    'Cardiology':                   'sp-cardiology',
  };
  function getSpecialtyClass(c) {
    if (!c.specialty || !c.specialty[0]) return 'sp-other';
    return SPECIALTY_CLASS[c.specialty[0]] || 'sp-other';
  }

  function renderMarkers(list){
    activeMarkers.forEach(function(m){m.remove();});activeMarkers=[];
    var sv={};getSavedClinics().forEach(function(s){sv[s.name]=true;});
    list.forEach(function(c){
      var co=getCoords(c);if(!co)return;
      var el=document.createElement('div');
      el.className='map-marker ' + getSpecialtyClass(c);
      if(sv[c.name])el.classList.add('saved');
      if(c.name===highlightedName)el.classList.add('highlighted');
      el.dataset.name=c.name;
      (function(x){
        el.addEventListener('click',function(e){e.stopPropagation();highlightClinic(x.name);openClinicPopup(x);});
        el.addEventListener('mouseenter',function(){hlSidebar(x.name);});
        el.addEventListener('mouseleave',function(){unhlSidebar(x.name);});
      })(c);
      activeMarkers.push(new mapboxgl.Marker({element:el,anchor:'center'}).setLngLat([co[1],co[0]]).addTo(map));
    });
  }

  function highlightClinic(name){
    highlightedName=name;
    activeMarkers.forEach(function(m){
      var el=m.getElement();
      el.classList.toggle('highlighted',el.dataset.name===name);
    });
    var item=document.querySelector('.sidebar-clinic-item[data-name="'+name.replace(/"/g,'\\"')+'"]');
    if(item){document.querySelectorAll('.sidebar-clinic-item').forEach(function(i){i.classList.remove('highlighted');});item.classList.add('highlighted');item.scrollIntoView({block:'nearest',behavior:'smooth'});}
  }
  function hlSidebar(n){var e=document.querySelector('.sidebar-clinic-item[data-name="'+n.replace(/"/g,'\\"')+'"]');if(e)e.classList.add('highlighted');}
  function unhlSidebar(n){var e=document.querySelector('.sidebar-clinic-item[data-name="'+n.replace(/"/g,'\\"')+'"]');if(e&&highlightedName!==n)e.classList.remove('highlighted');}

  function renderSidebarList(list){
    document.getElementById('mapResultsCount').textContent=list.length+' clinic'+(list.length!==1?'s':'');
    var sorted=list.slice();
    if(userCoords)sorted.sort(function(a,b){var da=getDistanceFromUser(a.name,userCoords),db=getDistanceFromUser(b.name,userCoords);if(da===null)return 1;if(db===null)return -1;return da-db;});
    var ct=document.getElementById('sidebarResults');
    ct.innerHTML='';
    window._sidebarClinics={};

    sorted.forEach(function(clinic){
      var st=getOpenStatus(clinic.name),dist=userCoords?getDistanceFromUser(clinic.name,userCoords):null,op=st.status==='open';
      var d=document.createElement('div');
      d.className='sidebar-clinic-item';
      d.dataset.name=clinic.name;
      if(clinic.name===highlightedName)d.classList.add('highlighted');
      d.innerHTML=
        '<div class="sci-header"><div class="sci-name">'+clinic.name+'</div>'+
        (st.status!=='unknown'?'<div class="sci-open-dot '+(op?'open':'closed')+'"></div>':'')+
        '</div>'+
        '<div class="sci-meta"><span>'+clinic.address+'</span>'+
        (dist!==null?'<span class="sci-dist">'+dist.toFixed(1)+' km</span>':'')+
        '</div>'+
        (st.status!=='unknown'?'<div class="sci-meta"><span style="font-size:0.7rem;color:'+(op?'var(--green)':'var(--red)')+';font-weight:500;">'+st.label+'</span></div>':'')+
        '<div class="sci-tags">'+
        (clinic.specialty[0]?'<span class="sci-tag">'+clinic.specialty[0]+'</span>':'')+
        (clinic.insurance?'<span class="sci-tag insurance">Insurance</span>':'')+
        '</div>';
      window._sidebarClinics[clinic.name]=clinic;

      // Direct listener — closure captures clinic correctly
      (function(cl){
        d.addEventListener('mousedown', function(e){
          e.stopPropagation();
          highlightClinic(cl.name);
          console.log('Sidebar click:', cl.name);
          openClinicPopup(cl);
        });
        d.addEventListener('mouseover',function(){
          activeMarkers.forEach(function(m){if(m.getElement().dataset.name===cl.name)m.getElement().classList.add('highlighted');});
        });
        d.addEventListener('mouseout',function(){
          if(highlightedName!==cl.name)activeMarkers.forEach(function(m){if(m.getElement().dataset.name===cl.name)m.getElement().classList.remove('highlighted');});
        });
      })(clinic);

      ct.appendChild(d);
    });
  }

  function applyMapFilters(){
    var sp=document.getElementById('mapSpecialtyFilter').value,lo=document.getElementById('mapLocationFilter').value,
        ins=document.getElementById('mapInsuranceFilter').value,nv=document.getElementById('clinicNameSearch').value.trim().toLowerCase();
    var r=clinics.slice();
    if(sp)r=r.filter(function(c){return c.specialty.indexOf(sp)!==-1;});
    if(lo)r=r.filter(function(c){return c.location===lo;});
    if(ins)r=r.filter(function(c){return c.insurance;});
    if(nv)r=r.filter(function(c){return c.name.toLowerCase().indexOf(nv)!==-1;});
    if(savedFilterActive){var sn={};getSavedClinics().forEach(function(s){sn[s.name]=true;});r=r.filter(function(c){return sn[c.name];});}
    filteredClinics=r;renderMarkers(r);renderSidebarList(r);
    if(lo&&locationCoords[lo])map.flyTo({center:[locationCoords[lo][1],locationCoords[lo][0]],zoom:13,duration:700});
    else if(r.length>0&&r.length<clinics.length){var b=new mapboxgl.LngLatBounds(),n=0;r.forEach(function(c){var co=getCoords(c);if(co){b.extend([co[1],co[0]]);n++;}});if(n)map.fitBounds(b,{padding:80,maxZoom:14,duration:700});}
  }

  function clearMapFilters(){
    ['mapSpecialtyFilter','mapLocationFilter','mapInsuranceFilter'].forEach(function(id){document.getElementById(id).value='';});
    document.getElementById('clinicNameSearch').value='';document.getElementById('nameSuggestions').classList.remove('open');
    savedFilterActive=false;userCoords=null;
    ['btnMapNearMe','btnMapSaved'].forEach(function(id){document.getElementById(id).classList.remove('active');});
    document.getElementById('gpsErrorSidebar').classList.remove('show');
    if(userMarker){userMarker.remove();userMarker=null;}
    filteredClinics=clinics.slice();renderMarkers(clinics);renderSidebarList(clinics);
  }

  var stout=null;
  function handleNameSearch(val){
    clearTimeout(stout);
    var box=document.getElementById('nameSuggestions'),q=(val||'').trim().toLowerCase();
    if(!q){box.innerHTML='';box.classList.remove('open');return;}
    var m=clinics.filter(function(c){return c.name.toLowerCase().indexOf(q)!==-1||c.specialty.some(function(s){return s.toLowerCase().indexOf(q)!==-1;})||c.address.toLowerCase().indexOf(q)!==-1;}).slice(0,8);
    if(!m.length){box.innerHTML='<div class="suggestion-item"><span class="suggestion-sub">No clinics found</span></div>';box.classList.add('open');return;}
    box.innerHTML=m.map(function(c){
      var st=getOpenStatus(c.name),dot=st.status!=='unknown'?'<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:'+(st.status==='open'?'#388e3c':'#dc2626')+';margin-right:4px;vertical-align:middle;"></span>':'';
      var esc=c.name.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
      return '<div class="suggestion-item" data-clinic-name="'+esc+'"><div class="suggestion-name">'+c.name+'</div><div class="suggestion-sub">'+dot+c.specialty[0]+' &middot; '+c.address+'</div></div>';
    }).join('');
    box.querySelectorAll('.suggestion-item').forEach(function(el){
      el.addEventListener('mousedown',function(e){e.preventDefault();pickSuggestion(this.getAttribute('data-clinic-name'));});
    });
    box.classList.add('open');
    stout=setTimeout(function(){var nv=document.getElementById('clinicNameSearch').value.trim().toLowerCase();if(nv){var r=clinics.filter(function(c){return c.name.toLowerCase().indexOf(nv)!==-1;});renderMarkers(r);renderSidebarList(r);}},200);
  }

  function pickSuggestion(name){
    document.getElementById('clinicNameSearch').value=name;document.getElementById('nameSuggestions').classList.remove('open');
    var c=null;for(var i=0;i<clinics.length;i++){if(clinics[i].name===name){c=clinics[i];break;}}
    if(!c)return;filteredClinics=[c];renderMarkers([c]);renderSidebarList([c]);
    var co=getCoords(c);if(co)map.flyTo({center:[co[1],co[0]],zoom:16,duration:700});
    highlightClinic(c.name);setTimeout(function(){openClinicPopup(c);},500);
  }
  function hideSuggestions(){setTimeout(function(){document.getElementById('nameSuggestions').classList.remove('open');},180);}

  function mapNearMe(){
    var btn=document.getElementById('btnMapNearMe'),err=document.getElementById('gpsErrorSidebar');err.classList.remove('show');
    if(!navigator.geolocation){err.textContent='GPS not supported.';err.classList.add('show');return;}
    btn.classList.add('loading');btn.textContent='Locating...';
    navigator.geolocation.getCurrentPosition(function(pos){
      userCoords=[pos.coords.latitude,pos.coords.longitude];
      btn.classList.remove('loading');btn.classList.add('active');
      btn.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Near me';
      if(userMarker)userMarker.remove();var el=document.createElement('div');el.className='user-pulse';
      userMarker=new mapboxgl.Marker({element:el}).setLngLat([userCoords[1],userCoords[0]]).addTo(map);
      map.flyTo({center:[userCoords[1],userCoords[0]],zoom:13,duration:700});applyMapFilters();
    },function(e){
      btn.classList.remove('loading');btn.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg> Near me';
      err.textContent=({1:'Location access denied.',2:'Location unavailable.',3:'Timed out.'})[e.code]||'Location unavailable.';err.classList.add('show');
    },{timeout:10000,enableHighAccuracy:false});
  }
  function locateOnMap(){if(userCoords)map.flyTo({center:[userCoords[1],userCoords[0]],zoom:14,duration:600});else mapNearMe();}
  function toggleSavedFilter(){savedFilterActive=!savedFilterActive;document.getElementById('btnMapSaved').classList.toggle('active',savedFilterActive);applyMapFilters();}
  function fitAllMarkers(){
    var list=filteredClinics.length?filteredClinics:clinics,b=new mapboxgl.LngLatBounds(),n=0;
    list.forEach(function(c){var co=getCoords(c);if(co){b.extend([co[1],co[0]]);n++;}});
    if(n)map.fitBounds(b,{padding:60,maxZoom:14,duration:800});
  }
  function toggleMapSidebar(){
    if(window.innerWidth<=900){
      openMobileSheet();
    } else {
      document.getElementById('mapSidebar').classList.toggle('collapsed');
      setTimeout(function(){map.resize();},260);
    }
  }
  function openMobileSheet(){
    document.getElementById('mapSidebar').classList.add('mobile-open');
    document.getElementById('mapSidebar').classList.remove('collapsed');
    document.getElementById('mobileMapBackdrop').classList.add('open');
    // Block ALL map events by covering the canvas with a transparent div
    var blocker = document.getElementById('mapEventBlocker');
    if(blocker) blocker.style.display = 'block';
    // Also disable Mapbox handlers as belt-and-suspenders
    if(map){
      map.dragPan.disable();
      map.touchZoomRotate.disable();
      map.touchPitch.disable();
      map.scrollZoom.disable();
    }
    setTimeout(function(){map.resize();},320);
  }
  function closeMobileSheet(){
    document.getElementById('mapSidebar').classList.remove('mobile-open');
    document.getElementById('mapSidebar').classList.add('collapsed');
    document.getElementById('mobileMapBackdrop').classList.remove('open');
    // Remove the event blocker
    var blocker = document.getElementById('mapEventBlocker');
    if(blocker) blocker.style.display = 'none';
    // Re-enable Mapbox interaction handlers
    if(map){
      map.dragPan.enable();
      map.touchZoomRotate.enable();
      map.touchPitch.enable();
      map.scrollZoom.enable();
    }
    setTimeout(function(){map.resize();},320);
  }
  function toggleMobileNav(){document.getElementById('mnavSidebar').classList.toggle('open');document.getElementById('mnavOverlay').classList.toggle('open');}
  function closeMobileNav(){document.getElementById('mnavSidebar').classList.remove('open');document.getElementById('mnavOverlay').classList.remove('open');}

  // Init — run after full page load to ensure all DOM + Mapbox are ready
  function initMap(){
    renderSidebarList(clinics);
    if(map.loaded()){renderMarkers(clinics);}
    else{
      map.on('load',function(){renderMarkers(clinics);});
      setTimeout(function(){if(activeMarkers.length===0)renderMarkers(clinics);},3000);
    }
    // Force map resize to fix frozen/zero-size map issue
    setTimeout(function(){map.resize();},100);
  }
  if(document.readyState==='complete'){initMap();}
  else{window.addEventListener('load',initMap);}
  // Popup closes via overlay onclick (handlePopupOverlayClick) — no map.on('click') needed

  function closeModal() {
    document.getElementById("modalOverlay").classList.remove("open");
    document.getElementById("correctionForm").reset();
    document.getElementById("formSuccess").style.display = "none";
    document.getElementById("formError").style.display = "none";
    document.getElementById("formFields").style.display = "block";
    document.getElementById("btnModalSubmit").disabled = false;
    document.getElementById("btnModalSubmit").textContent = "Submit";
  }

  // Prevent Mapbox document-level touch handler from stealing touches on the sidebar
  document.getElementById('mapSidebar').addEventListener('touchstart', function(e){
    e.stopPropagation();
  }, {passive: true});
  document.getElementById('mapSidebar').addEventListener('touchmove', function(e){
    e.stopPropagation();
  }, {passive: true});
