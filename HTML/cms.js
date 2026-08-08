/* ============================================
   BITI CMS — Public Content Loader
   Reads CMS data from localStorage and
   dynamically renders it on public pages.
   Falls back to hardcoded HTML if no CMS data.
   ============================================ */
(function(){
'use strict';

var K={
  courses:'biti_courses',events:'biti_events',posts:'biti_posts',
  team:'biti_team',stories:'biti_stories',submissions:'biti_submissions',
  settings:'biti_settings',init:'biti_initialized',
  jobs:'biti_jobs'
};

function g(k){try{return JSON.parse(localStorage.getItem(k));}catch{return null;}}
function gO(k){try{return JSON.parse(localStorage.getItem(k))||{};}catch{return {};}}
function s(k,v){localStorage.setItem(k,JSON.stringify(v));}
function esc(t){var d=document.createElement('div');d.textContent=t||'';return d.innerHTML;}
function fmtDate(d){if(!d)return'';var dt=new Date(d+'T00:00:00');return dt.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}).toUpperCase();}
function fmtTime(t){if(!t)return'';var p=t.split(':');var h=+p[0],m=p[1],ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+m+' '+ap;}

// Detect current page
var path=location.pathname.split('/').pop().toLowerCase()||'index.html';

document.addEventListener('DOMContentLoaded',function(){
  // ── BLOG PAGE ───────────────────────────
  if(path==='blog.html')renderBlogPage();

  if(!localStorage.getItem(K.init))return; // No CMS data — keep hardcoded content

  // ── INDEX PAGE ──────────────────────────
  if(path===''||path==='index.html'){
    renderIndexCourses();
    renderIndexEvents();
    renderIndexPosts();
    renderIndexTestimonial();
  }

  // ── COURSES PAGE ────────────────────────
  if(path==='courses.html')renderCoursesPage();

  // ── EVENTS PAGE ─────────────────────────
  if(path==='events.html')renderEventsPage();

  // ── TEAM PAGE ───────────────────────────
  if(path==='team.html')renderTeamPage();

  // ── STORIES PAGE ────────────────────────
  if(path==='stories.html')renderStoriesPage();

  // ── CAREER PAGE ─────────────────────────
  if(path==='career.html')renderCareerPage();

  // ── CAPTURE FORM SUBMISSIONS ────────────
  captureFormSubmissions();
});

/* ── INDEX: COURSES ──────────────────────── */
function renderIndexCourses(){
  var items=g(K.courses);if(!items||!items.length)return;
  var grid=document.querySelector('.course-grid');if(!grid)return;
  var colors=['#eaf3ff','#e6f9f7','#f1f9de','#fff3e0','#fce4ec','#e8eaf6'];
  var html='';
  items.slice(0,3).forEach(function(c,i){
    html+='<a href="https://forms.gle/Wrhg5HbzHnz2CPxu5" target="_blank" rel="noopener" class="course"><div class="icon" style="background:'+colors[i%colors.length]+'">'+esc(c.icon)+'</div><h3>'+esc(c.title)+'</h3><p>'+esc(c.description)+'</p><footer><span>'+esc(c.duration).toUpperCase()+'</span><span>Explore →</span></footer></a>';
  });
  grid.innerHTML=html;
}

/* ── INDEX: EVENTS ───────────────────────── */
function renderIndexEvents(){
  var items=g(K.events);if(!items||!items.length)return;
  var grid=document.querySelector('.event-grid');if(!grid)return;
  var featured=items.find(function(e){return e.featured;})||items[0];
  var others=items.filter(function(e){return e.id!==featured.id;}).slice(0,2);
  var dateStr=fmtDate(featured.date)+(featured.time?' · '+fmtTime(featured.time):'');
  var html='<article class="event-major"><span class="date">'+esc(dateStr)+'</span><h3>'+esc(featured.title)+'</h3><p>'+esc(featured.description)+'</p></article><div>';
  others.forEach(function(e){
    var ds=fmtDate(e.date)+(e.time?' · '+fmtTime(e.time):'');
    html+='<article class="event-small"><span class="date">'+esc(ds)+'</span><h3>'+esc(e.title)+'</h3><p>'+esc(e.location||e.description)+'</p></article>';
  });
  html+='</div>';
  grid.innerHTML=html;
}

/* ── INDEX: POSTS ────────────────────────── */
function renderIndexPosts(){
  var items=g(K.posts);if(!items||!items.length)return;
  var grid=document.querySelector('.news-grid');if(!grid)return;
  var html='';
  items.slice(0,3).forEach(function(p){
    html+='<a href="HTML/blog.html?id='+esc(p.id)+'" class="post">';
    if(p.imageUrl)html+='<img src="'+esc(p.imageUrl)+'" alt="'+esc(p.title)+'">';
    html+='<small>'+esc(p.category)+' · '+esc(p.readTime)+'</small><h3>'+esc(p.title)+'</h3></a>';
  });
  grid.innerHTML=html;
}

/* ── INDEX: TESTIMONIAL ──────────────────── */
function renderIndexTestimonial(){
  var items=g(K.stories);if(!items||!items.length)return;
  var story=items[0];
  var quoteEl=document.querySelector('.testimonial .quote');
  var personEl=document.querySelector('.testimonial .person');
  if(quoteEl)quoteEl.textContent=story.quote;
  if(personEl){
    personEl.innerHTML='<img src="'+esc(story.photoUrl)+'" alt="'+esc(story.name)+'"><div><b>'+esc(story.name)+'</b><span>'+esc(story.role)+'</span></div>';
  }
}

/* ── COURSES PAGE ────────────────────────── */
function renderCoursesPage(){
  var items=g(K.courses);if(!items||!items.length)return;
  var grid=document.querySelector('.grid')||document.querySelector('.course-grid');if(!grid)return;
  var html='';
  items.forEach(function(c){
    html+='<a href="https://forms.gle/Wrhg5HbzHnz2CPxu5" target="_blank" rel="noopener" class="card"><div class="tag">'+esc(c.duration).toUpperCase()+'</div><h2>'+esc(c.title)+'</h2><p>'+esc(c.description)+'</p></a>';
  });
  grid.innerHTML=html;
}

/* ── EVENTS PAGE ─────────────────────────── */
function renderEventsPage(){
  var items=g(K.events);if(!items||!items.length)return;
  var container=document.querySelector('.content.container')||document.querySelector('section.content');
  if(!container)return;
  var html='';
  items.forEach(function(e){
    var ds=fmtDate(e.date)+(e.time?' · '+fmtTime(e.time):'');
    html+='<article class="event"><b>'+esc(ds)+'</b><h3>'+esc(e.title)+'</h3><p class="copy">'+esc(e.location)+(e.description?' · '+esc(e.description):'')+'</p></article>';
  });
  container.innerHTML=html;
}

/* ── TEAM PAGE ───────────────────────────── */
function renderTeamPage(){
  var items=g(K.team);if(!items||!items.length)return;
  var grid=document.querySelector('.team-grid');if(!grid)return;
  var html='';
  items.forEach(function(t){
    html+='<div class="member"><img src="'+esc(t.photoUrl)+'" alt="'+esc(t.name)+'"><h3>'+esc(t.name)+'</h3><p>'+esc(t.role)+'</p></div>';
  });
  grid.innerHTML=html;
}

/* ── STORIES PAGE ────────────────────────── */
function renderStoriesPage(){
  var items=g(K.stories);if(!items||!items.length)return;
  var grid=document.querySelector('.story-grid')||document.querySelector('.stories-grid');if(!grid)return;
  var html='';
  items.forEach(function(st){
    html+='<article class="story"><img src="'+esc(st.photoUrl)+'" alt="'+esc(st.name)+'"><blockquote>"'+esc(st.quote)+'"</blockquote><b>'+esc(st.name)+'</b><span>'+esc(st.role)+'</span></article>';
  });
  grid.innerHTML=html;
}

/* ── CAPTURE FORM SUBMISSIONS ────────────── */
function captureFormSubmissions(){
  var forms=document.querySelectorAll('form');
  forms.forEach(function(form){
    // Skip if it's the admin contact form
    if(form.closest('#app'))return;

    form.addEventListener('submit',function(e){
      e.preventDefault();
      var inputs=form.querySelectorAll('input,textarea,select');
      var data={id:'_'+Math.random().toString(36).substr(2,9),createdAt:Date.now(),read:false};
      var fields=['name','phone','email','message','course'];
      var fieldIdx=0;
      inputs.forEach(function(inp){
        if(inp.type==='submit'||inp.type==='button')return;
        var key=inp.getAttribute('aria-label')||inp.placeholder||fields[fieldIdx]||'field'+fieldIdx;
        key=key.toLowerCase();
        if(key.indexOf('name')>-1)data.name=inp.value;
        else if(key.indexOf('phone')>-1)data.phone=inp.value;
        else if(key.indexOf('email')>-1)data.email=inp.value;
        else if(key.indexOf('message')>-1||key.indexOf('help')>-1)data.message=inp.value;
        else if(key.indexOf('course')>-1||key.indexOf('interest')>-1)data.course=inp.value;
        else data.message=(data.message?data.message+' ':'')+(inp.value||'');
        fieldIdx++;
      });

      // Save to localStorage
      var subs=[];
      try{subs=JSON.parse(localStorage.getItem(K.submissions))||[];}catch{}
      subs.push(data);
      localStorage.setItem(K.submissions,JSON.stringify(subs));

      // Show thank you
      var btn=form.querySelector('button[type="submit"]')||form.querySelector('button');
      if(btn)btn.textContent='Thanks! We will be in touch ✓';

      // Reset form after delay
      setTimeout(function(){form.reset();if(btn)btn.textContent=btn.dataset.original||'Send message →';},3000);

      // Store original button text
      if(btn&&!btn.dataset.original)btn.dataset.original=btn.textContent;
    });
  });
}

var defaultPosts = [
  {id:'p1',title:'7 tech skills that will make you stand out in 2026',category:'CAREER',readTime:'5 MIN READ',imageUrl:'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=700&q=80',content:"In 2026, the technology landscape is evolving faster than ever. To secure a premium job and stand out as a software engineer or designer, mastering the basics is no longer enough. Here are seven tech skills you must prioritize:\n\n1. AI-Assisted Development: Knowing how to effectively pair program with AI systems to accelerate your productivity.\n2. Full Stack Adaptability: Bridging frontend polish with reliable backend databases and structures.\n3. Responsive Systems Design: Creating experiences that look incredible on mobile, tablet, and ultra-wide desktops.\n4. Clean Cybersecurity Hygiene: Writing secure inputs, verifying APIs, and understanding vulnerability scanning.\n5. Practical Cloud Infrastructure: Familiarity with basic deployment, serverless hosting, and modern edge networks.\n6. Interactive Data Analytics: Interpreting tracking metrics and utilizing data to optimize web performance.\n7. Strong Communication: Explaining technical decisions clearly and documenting work for collaboration.\n\nBy focusing on these practical skills, you can launch a resilient career in tech."},
  {id:'p2',title:"From learner to team lead: Rafi's BITI journey",category:'STUDENT STORIES',readTime:'4 MIN READ',imageUrl:'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80',content:"Rafi's journey is a proof of what project-based learning can accomplish. Starting with zero coding experience, Rafi enrolled in the Full Stack Web Development program at BITI. Through months of hands-on mentoring and real-world projects, he didn't just study concepts—he built real software.\n\nWithin two months of graduation, Rafi landed a junior frontend role at a growing startup. By applying his project-first mindset, he solved critical product bottlenecks and supported team members. Today, Rafi works as a team lead, guiding other developers and designing production architectures.\n\n'BITI didn't just teach me how to write code,' Rafi shares. 'It taught me how to think, collaborate, and deliver value. My projects were my proof.'"},
  {id:'p3',title:'Why building projects beats watching tutorials',category:'LEARNING',readTime:'6 MIN READ',imageUrl:'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=700&q=80',content:"It is easy to fall into the 'tutorial hell' trap—spending hours watching video lectures and feeling productive, only to realize you cannot build a project from scratch when the video ends. Research shows that active creation beats passive consumption every single time.\n\nWhen you watch a tutorial, you are following someone else's logical path. However, when you build a project, you face unexpected bugs, design challenges, and architectural decisions. Solving these problems forces deep conceptual understanding and forms lasting synapses.\n\nTo break the cycle: watch tutorials only to understand core concepts, then immediately close the video and build something unique. Start small, write messy code, and iterate. The struggle is exactly where learning happens."}
];

function renderBlogPage(){
  var items=g(K.posts);
  if(!items||!items.length)items=defaultPosts;
  var container=document.getElementById('blog-container');
  if(!container)return;

  var params=new URLSearchParams(window.location.search);
  var postId=params.get('id');

  if(postId){
    var post=items.find(function(p){return p.id===postId;});
    if(post){
      var contentHtml='';
      if(post.content){
        contentHtml=post.content.split('\n\n').map(function(para){
          return '<p>'+esc(para)+'</p>';
        }).join('');
      } else {
        contentHtml='<p>No content available for this post.</p>';
      }

      container.innerHTML=
        '<article class="single-post">'+
        '<a href="blog.html" class="back-link">← Back to all posts</a>'+
        '<div class="post-meta">'+
        '<span class="category">'+esc(post.category)+'</span>'+
        '<span class="separator"> · </span>'+
        '<span class="read-time">'+esc(post.readTime)+'</span>'+
        '</div>'+
        '<h1 class="post-title">'+esc(post.title)+'</h1>'+
        (post.imageUrl?'<img class="post-image" src="'+esc(post.imageUrl)+'" alt="'+esc(post.title)+'">':'')+
        '<div class="post-content">'+contentHtml+'</div>'+
        '</article>';
      return;
    }
  }

  var html='<div class="blog-grid">';
  items.forEach(function(p){
    var summary=p.content?p.content.split('\n')[0]:'';
    if(summary.length>120)summary=summary.substring(0,120)+'…';
    
    html+=
      '<a href="blog.html?id='+esc(p.id)+'" class="blog-post-card">'+
      (p.imageUrl?'<img src="'+esc(p.imageUrl)+'" alt="'+esc(p.title)+'">':'')+
      '<div class="meta">'+esc(p.category)+' · '+esc(p.readTime)+'</div>'+
      '<h3>'+esc(p.title)+'</h3>'+
      '<p>'+esc(summary)+'</p>'+
      '</a>';
  });
  html+='</div>';
  container.innerHTML=html;
}

/* ── CAREER PAGE ────────────────────────── */
function renderCareerPage(){
  var items=g(K.jobs);if(!items||!items.length){
    var grid=document.getElementById('jobs-grid');
    if(grid)grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px 0;">No active openings at this time. Check back later!</div>';
    return;
  }
  var grid=document.getElementById('jobs-grid');if(!grid)return;
  var html='';
  items.forEach(function(j){
    html+='<article class="card" style="display:flex; flex-direction:column; justify-content:space-between; min-height:220px;">'+
          '<div><div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">'+
          '<span class="tag" style="background:var(--cloud); padding:4px 8px; border-radius:4px;">'+esc(j.department).toUpperCase()+'</span>'+
          '<span style="font-size:11px; font-family:\'DM Mono\'; color:var(--muted)">'+esc(j.type)+'</span></div>'+
          '<h3 style="margin: 5px 0 10px; font-size:18px;">'+esc(j.title)+'</h3>'+
          '<p class="copy" style="margin-bottom:18px; font-size:13px;">'+esc(j.description)+'</p></div>'+
          '<div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--line); padding-top:14px; margin-top:auto;">'+
          '<span style="font-size:12px; color:var(--muted)">📍 '+esc(j.location)+'</span>'+
          '<a class="button" href="mailto:'+esc(j.link)+'?subject=Application for '+encodeURIComponent(j.title)+'" style="padding:8px 12px; font-size:11px;">Apply Now →</a></div>'+
          '</article>';
  });
  grid.innerHTML=html;
}

})();
