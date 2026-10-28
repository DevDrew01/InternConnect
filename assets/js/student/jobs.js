function initStudentJobs({currentUserRecord, isAlumni, session, show, hide, toast, getJSON}){
  // ---------------- Jobs ----------------

  function filterJobs(){
    const list=document.getElementById('jobList'); if(!list)return;
    const user=currentUserRecord(); const alumni=isAlumni(user);
    const course=document.getElementById('courseFilter')?.value||'';
    const type=document.getElementById('typeFilter')?.value||'';
    const arrangement=document.getElementById('arrangementFilter')?.value||'';
    let visible=0;
    list.querySelectorAll('.job-card').forEach(card=>{
      const courseOk=!course||card.dataset.course===course;
      const typeOk=alumni ? (card.dataset.type!=='Internship' && (!type || card.dataset.type===type)) : card.dataset.type==='Internship';
      const arrangeOk=!arrangement||card.dataset.arrangement===arrangement;
      const ok=courseOk&&typeOk&&arrangeOk;
      card.classList.toggle('hidden',!ok); if(ok)visible++;
    });
    document.getElementById('fallbackAlert')?.classList.toggle('hidden',visible!==0);
    document.getElementById('typeFilter')?.classList.toggle('hidden',!alumni);
  }

  function openJobModal(id){
    const j=jobDetails[id]; if(!j)return;
    const match=jobMatch(j,session()||{}), aiScore=aiMatchScores.get(id);
    const displayScore=Number.isFinite(aiScore)?Math.round(aiScore*100):match.score;
    const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
    set('jobModalTitle',j.title);set('jobModalCompany',j.company);set('jobModalType',j.type);set('jobModalSalary',j.salary);set('jobModalDescription',j.description);set('jobModalDeadline',j.deadline);
    const score=document.getElementById('jobModalScore');if(score)score.innerHTML='<i class="fa-solid fa-wand-magic-sparkles mr-1"></i>'+displayScore+'% match';
    const loc=document.getElementById('jobModalLocation');if(loc)loc.innerHTML='<i class="fa-solid fa-location-dot mr-1"></i>'+j.location;
    const req=document.getElementById('jobModalRequirements');if(req)req.innerHTML=j.requirements.map(x=>'<li>'+esc(x)+'</li>').join('');
    const tags=document.getElementById('jobModalSkillTags');if(tags)tags.innerHTML=match.skills.map(([n,m])=>(m ? '<span class="tag-chip matched"><i class="fa-solid fa-check"></i>'+esc(n)+'</span>' : '<span class="tag-chip gap">'+esc(n)+' <span class="chip-note">gap</span></span>')).join('');
    document.getElementById('jobModalApplyBtn')?.setAttribute('data-job',id);
    const ab=document.getElementById('jobModalApplyBtn'); if(ab){ const done=jmApplied(id,session()||{}); ab.textContent=done?'Applied':'Apply Now'; ab.disabled=done; ab.classList.toggle('opacity-60',done); }
    show('jobModal');
  }
  const chipHtml = (skills) => skills.map(([n,m]) => m ? '<span class="tag-chip matched"><i class="fa-solid fa-check"></i>'+esc(n)+'</span>' : '<span class="tag-chip gap">'+esc(n)+' <span class="chip-note">gap</span></span>').join('');
  let jobSort = 'match';
  let aiMatchScores = new Map();
  function renderJobCards(){
    const me = session() || {}, list = document.getElementById('jobList'); if(!list) return;
    const cards = [...list.querySelectorAll('.job-card')];
    cards.forEach(card => {
      const j = jobDetails[card.dataset.job]; if(!j) return;
      const m = jobMatch(j, me), aiScore = aiMatchScores.get(card.dataset.job);
      const score = Number.isFinite(aiScore) ? aiScore : m.score / 100;
      card.dataset.score = score; card.dataset.km = parseFloat((j.location.match(/([\d.]+) km/) || [0, 0])[1]) || 0;
      const badge = card.querySelector('.fa-wand-magic-sparkles')?.parentElement; if(badge) badge.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles mr-1"></i>' + Math.round(score * 100) + '%';
      const chips = card.querySelector('.tag-chip')?.parentElement; if(chips) chips.innerHTML = chipHtml(m.skills);
      const btn = card.querySelector('.apply-btn'), done = jmApplied(card.dataset.job, me);
      if(btn){ btn.textContent = done ? 'Applied' : 'Apply Now'; btn.disabled = done; btn.classList.toggle('opacity-60', done); btn.classList.toggle('cursor-default', done); }
    });
    cards.sort((x, y) => jobSort === 'distance' ? x.dataset.km - y.dataset.km : y.dataset.score - x.dataset.score).forEach(c => list.insertBefore(c, document.getElementById('fallbackAlert')));
    const tbody = [...document.querySelectorAll('h2')].find(h => h.textContent.trim() === 'Application Status')?.closest('.bg-white')?.querySelector('tbody');
    if(!tbody) return;
    const apps = myJobApps(me).slice().reverse();
    tbody.innerHTML = apps.length ? apps.map(a => { const st = jobAppStatus(a, me);
      const badge = !a.internship ? jobBadge(st) : st === 'Cancelled' ? '<span class="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Cancelled</span>' : placementBadge(st);
      return '<tr><td class="px-5 py-3 text-slate-700">' + esc(a.title) + '</td><td class="px-5 py-3 text-slate-600">' + esc(a.company) + '</td><td class="px-5 py-3 text-slate-500">' + formatDate(a.date) + '</td><td class="px-5 py-3">' + badge + '</td></tr>'; }).join('')
      : '<tr><td colspan="4" class="px-5 py-6 text-center text-[12.5px] text-slate-400">No applications yet. Apply to a job above.</td></tr>';
  }
  async function loadAiMatchScores(){
    const me = session() || {};
    const studentSkills = jmSkills(me).map(skill => String(skill).trim()).filter(Boolean);
    const postings = Object.entries(jobDetails).map(([id, job]) => ({
      id,
      ...(job.onet_soc_code ? {onet_soc_code: job.onet_soc_code} : {}),
      required_skills: (job.skills || []).map(skill => Array.isArray(skill) ? skill[0] : skill).filter(Boolean)
    })).filter(posting => posting.required_skills.length);
    if(!studentSkills.length || !postings.length || !window.ICCore?.aiMatching?.rankJobs) return;
    try{
      aiMatchScores = await window.ICCore.aiMatching.rankJobs(studentSkills, postings);
      renderJobCards();
    }catch(error){
      // The existing local score remains available when the optional local AI service is stopped.
      console.debug('Local AI matching is unavailable; keeping the existing match ranking.');
    }
  }
  async function applyJob(id){
    const j = jobDetails[id], me = session() || {}; if(!j) return false;
    if(jmApplied(id, me)){ toast('You already applied to this job.', 'info'); return false; }
    const internship = isInternshipJob(j);
    if(internship){
      const p = placementList().find(x => x.name === me.name || (me.email && x.email === me.email));
      if(p && !['Not placed', 'Withdrawn'].includes(p.status)){ toast('You already have an active OJT application' + (p.company ? ' with ' + p.company : '') + '. Only one at a time.', 'warn'); return false; }
      if(!partnerCompanies().includes(j.company)){ toast(j.company + ' is not a partner company yet. Ask your coordinator.', 'warn'); return false; }
      if(!await askConfirm('Apply to ' + j.company + ' as ' + j.title + '?\n\nThis records your OJT application and your coordinator will review it.')) return false;
      savePlacement(me.name, {status: 'Applied', company: j.company, position: j.title, source: 'student', email: me.email, history: ((p || {}).history || []).concat({status: 'Applied', date: todayISO(), note: j.company + ' · ' + j.title + ' · by student via Job Matching'})});
    }
    const all = getJSON(JOB_APPS_KEY, {}), k = jmKey(me);
    all[k] = (all[k] || []).filter(a => a.job !== id).concat({job: id, title: j.title, company: j.company, date: todayISO(), internship, name: me.name, email: me.email, program: me.program});
    localStorage.setItem(JOB_APPS_KEY, JSON.stringify(all));
    toast(internship ? 'Application to ' + j.company + ' recorded. Your coordinator will review it.' : 'Application submitted to ' + j.company + '.', 'success');
    renderJobCards(); return true;
  }
  function initJobs(){
    renderJobList();
    document.getElementById('courseFilter')?.addEventListener('change',filterJobs);
    document.getElementById('typeFilter')?.addEventListener('change',filterJobs);
    document.getElementById('arrangementFilter')?.addEventListener('change',filterJobs);
    document.querySelectorAll('.job-card').forEach(card=>card.addEventListener('click',e=>{if(e.target.closest('.apply-btn'))return;openJobModal(card.dataset.job);}));
    document.querySelectorAll('.apply-btn').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();applyJob(btn.closest('.job-card')?.dataset.job);}));
    document.querySelectorAll('.sort-btn').forEach(btn=>btn.addEventListener('click',()=>{jobSort=btn.dataset.sort;document.querySelectorAll('.sort-btn').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);['bg-slate-900','text-white'].forEach(c=>b.classList.toggle(c,on));['bg-white','border','border-slate-200','text-slate-600'].forEach(c=>b.classList.toggle(c,!on));});renderJobCards();}));
    document.getElementById('closeJobModalBtn')?.addEventListener('click',()=>hide('jobModal'));
    document.getElementById('jobModalApplyBtn')?.addEventListener('click',()=>{applyJob(document.getElementById('jobModalApplyBtn').dataset.job).then(ok=>{if(ok) hide('jobModal');});});
    renderJobCards();
    loadAiMatchScores();
    filterJobs();
  }
  initJobs();
}

function jobCardHtml(id, j){
    const [kind, arrangement] = j.type.split(' · ');
    return '<div class="job-card bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:border-sky-300 transition cursor-pointer" data-arrangement="' + esc(arrangement || '') + '" data-course="' + esc(j.course) + '" data-job="' + esc(id) + '" data-type="' + esc(kind) + '">'
      + '<div class="flex items-start justify-between gap-3"><div><div class="font-semibold text-slate-900">' + esc(j.title) + '</div>'
      + '<div class="text-[12px] text-slate-500 mt-0.5">' + esc(j.company) + ' · <i class="fa-solid fa-location-dot text-[10px]"></i> ' + esc(j.location) + ' · <span class="text-slate-400">' + esc(j.course) + ' · ' + esc(j.type) + '</span></div></div>'
      + '<span class="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 flex-shrink-0"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i>0%</span></div>'
      + '<div class="flex flex-wrap gap-1.5 mt-3"><span class="tag-chip"></span></div>'
      + '<button class="apply-btn mt-3 text-[12.5px] font-semibold text-white bg-sky-600 hover:bg-sky-700 px-3.5 py-2 rounded-md transition">Apply Now</button></div>';
}
function renderJobList(){
    const list = document.getElementById('jobList'); if(!list) return;
    list.querySelectorAll('.job-card').forEach(c => c.remove());
    list.insertAdjacentHTML('afterbegin', Object.entries(jobDetails).map(([id, j]) => jobCardHtml(id, j)).join(''));
}

(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'jobs' && window.ICCore?.student?.initJobs) window.ICCore.student.initJobs();
  }, { once: true });
})();
