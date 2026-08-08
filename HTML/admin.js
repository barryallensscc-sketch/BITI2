/* ============================================
   BITI CMS — Admin Panel Logic
   Auth, CRUD, Modals, Export/Import
   ============================================ */
(function(){
'use strict';

/* ── CONSTANTS ───────────────────────────── */
const K={
  session:'biti_session',admin:'biti_admin',courses:'biti_courses',events:'biti_events',
  posts:'biti_posts',team:'biti_team',stories:'biti_stories',submissions:'biti_submissions',
  settings:'biti_settings',init:'biti_initialized',
  jobs:'biti_jobs'
};

/* ── HELPERS ─────────────────────────────── */
function g(k){try{return JSON.parse(localStorage.getItem(k))||[];}catch{return[];}}
function gO(k){try{return JSON.parse(localStorage.getItem(k))||{};}catch{return {};}}
function s(k,v){localStorage.setItem(k,JSON.stringify(v));}
function id(){return'_'+Math.random().toString(36).substr(2,9);}
function esc(t){var d=document.createElement('div');d.textContent=t||'';return d.innerHTML;}
function $(sel){return document.querySelector(sel);}
function $$(sel){return document.querySelectorAll(sel);}
function fmtDate(d){if(!d)return'—';var dt=new Date(d);return dt.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
function fmtTime(t){if(!t)return'';var p=t.split(':');var h=+p[0],m=p[1],ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+m+' '+ap;}

var currentSection='dashboard',editType=null,editId=null;

/* ── SEED DEFAULTS ───────────────────────── */
function seedDefaults(){
  var isNew=!localStorage.getItem(K.init);
  if(isNew){
    s(K.admin,{username:'admin',password:'biti2026'});
    s(K.settings,{
      phone:'+88 01701 292270',
      email:'info@bditinstitute.com',
      address:'Anowar Mansion (4th Floor), 15 Senpara Parbota, Mirpur-10, Dhaka-1216',
      admissionText:'Admissions are open for September 2026',
      siteName:'Bangladesh IT Institute',
      slides: [
        { src: 'IMAGES/student_hero.png', caption: '✦ Future Innovator' },
        { src: 'IMAGES/student_hero_2.png', caption: '✦ Industry Ready' },
        { src: 'IMAGES/student_hero_3.png', caption: '✦ Creative Collaboration' }
      ]
    });
    s(K.submissions,[]);
  }

  if(!localStorage.getItem(K.courses)){
    s(K.courses,[
      {id:'c1',title:'Full Stack Web Development',description:'Master the complete web stack and create powerful digital experiences from scratch.',duration:'06 Months',icon:'⌘'},
      {id:'c2',title:'UI/UX & Graphic Design',description:'Design intuitive interfaces and visual identities that people remember.',duration:'04 Months',icon:'◈'},
      {id:'c3',title:'Digital Marketing',description:'Learn strategies that grow brands, audiences, and meaningful conversations.',duration:'03 Months',icon:'◉'},
      {id:'c4',title:'Data Analytics',description:'Turn raw information into clear decisions using spreadsheets, SQL, and modern tools.',duration:'04 Months',icon:'◎'},
      {id:'c5',title:'Cyber Security',description:'Learn the fundamentals of digital defense and safer systems.',duration:'03 Months',icon:'◇'},
      {id:'c6',title:'Freelancing Essentials',description:'Package your skills, find clients, and build a sustainable independent career.',duration:'02 Months',icon:'◆'}
    ]);
  }
  if(!localStorage.getItem(K.events)){
    s(K.events,[
      {id:'e1',title:'BITI Tech Career Summit 2026',description:'Meet innovators, recruiters, and the next generation of digital talent.',date:'2026-08-18',time:'15:00',location:'BITI Campus, Mirpur',featured:true},
      {id:'e2',title:'Web Development Open House',description:'Explore our learning spaces and meet the instructors.',date:'2026-08-09',time:'11:00',location:'BITI Campus, Dhanmondi',featured:false},
      {id:'e3',title:'Design Portfolio Review Session',description:'Bring your work and get focused feedback.',date:'2026-08-24',time:'16:00',location:'Live online workshop',featured:false}
    ]);
  }
  if(!localStorage.getItem(K.posts)){
    s(K.posts,[
      {id:'p1',title:'7 tech skills that will make you stand out in 2026',category:'CAREER',readTime:'5 MIN READ',imageUrl:'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=700&q=80',content:"In 2026, the technology landscape is evolving faster than ever. To secure a premium job and stand out as a software engineer or designer, mastering the basics is no longer enough. Here are seven tech skills you must prioritize:\n\n1. AI-Assisted Development: Knowing how to effectively pair program with AI systems to accelerate your productivity.\n2. Full Stack Adaptability: Bridging frontend polish with reliable backend databases and structures.\n3. Responsive Systems Design: Creating experiences that look incredible on mobile, tablet, and ultra-wide desktops.\n4. Clean Cybersecurity Hygiene: Writing secure inputs, verifying APIs, and understanding vulnerability scanning.\n5. Practical Cloud Infrastructure: Familiarity with basic deployment, serverless hosting, and modern edge networks.\n6. Interactive Data Analytics: Interpreting tracking metrics and utilizing data to optimize web performance.\n7. Strong Communication: Explaining technical decisions clearly and documenting work for collaboration.\n\nBy focusing on these practical skills, you can launch a resilient career in tech."},
      {id:'p2',title:"From learner to team lead: Rafi's BITI journey",category:'STUDENT STORIES',readTime:'4 MIN READ',imageUrl:'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80',content:"Rafi's journey is a proof of what project-based learning can accomplish. Starting with zero coding experience, Rafi enrolled in the Full Stack Web Development program at BITI. Through months of hands-on mentoring and real-world projects, he didn't just study concepts—he built real software.\n\nWithin two months of graduation, Rafi landed a junior frontend role at a growing startup. By applying his project-first mindset, he solved critical product bottlenecks and supported team members. Today, Rafi works as a team lead, guiding other developers and designing production architectures.\n\n'BITI didn't just teach me how to write code,' Rafi shares. 'It taught me how to think, collaborate, and deliver value. My projects were my proof.'"},
      {id:'p3',title:'Why building projects beats watching tutorials',category:'LEARNING',readTime:'6 MIN READ',imageUrl:'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=700&q=80',content:"It is easy to fall into the 'tutorial hell' trap—spending hours watching video lectures and feeling productive, only to realize you cannot build a project from scratch when the video ends. Research shows that active creation beats passive consumption every single time.\n\nWhen you watch a tutorial, you are following someone else's logical path. However, when you build a project, you face unexpected bugs, design challenges, and architectural decisions. Solving these problems forces deep conceptual understanding and forms lasting synapses.\n\nTo break the cycle: watch tutorials only to understand core concepts, then immediately close the video and build something unique. Start small, write messy code, and iterate. The struggle is exactly where learning happens."}
    ]);
  }
  if(!localStorage.getItem(K.team)){
    s(K.team,[
      {id:'t1',name:'Farhana Rahman',role:'Head of Learning',photoUrl:'https://i.pravatar.cc/100?img=12'},
      {id:'t2',name:'Tanvir Ahmed',role:'Lead Web Instructor',photoUrl:'https://i.pravatar.cc/100?img=11'},
      {id:'t3',name:'Nusrat Jahan',role:'Career Success Lead',photoUrl:'https://i.pravatar.cc/100?img=47'}
    ]);
  }
  if(!localStorage.getItem(K.stories)){
    s(K.stories,[
      {id:'s1',name:'Farhana Rahman',quote:'BITI gave me the confidence to walk into my first interview knowing I belonged in the room.',role:'UI/UX Designer at bKash · BITI Graduate',photoUrl:'https://i.pravatar.cc/100?img=12'},
      {id:'s2',name:'Mahin Hasan',quote:'My projects became my proof. I joined a product team just two months after graduating.',role:'Frontend Developer · BITI Graduate',photoUrl:'https://i.pravatar.cc/100?img=14'},
      {id:'s3',name:'Sadia Akter',quote:'The mentor feedback changed how I think about design and my own potential.',role:'Graphic Designer · BITI Graduate',photoUrl:'https://i.pravatar.cc/100?img=49'}
    ]);
  }
  if(!localStorage.getItem(K.jobs)){
    s(K.jobs,[
      {id:'j1',title:'Frontend Developer',department:'Engineering',location:'Dhaka (Mirpur)',type:'Full-time',description:'Help us build clean, responsive user interfaces for our students and internal products. Requires HTML, CSS, JavaScript, and React familiarity.',link:'info@bditinstitute.com'},
      {id:'j2',title:'UI/UX Designer',department:'Design',location:'Remote',type:'Full-time',description:'Create clean and modern user journeys, wireframes, and high-fidelity mockups. Requires Figma proficiency and a strong portfolio.',link:'info@bditinstitute.com'},
      {id:'j3',title:'Digital Marketing Specialist',department:'Marketing',location:'Dhaka (Mirpur)',type:'Part-time',description:'Manage social media campaigns, SEO optimizations, and reach out to prospective students. Experience with Google Ads and Meta Ads is a plus.',link:'info@bditinstitute.com'}
    ]);
  }

  if(isNew){
    localStorage.setItem(K.init,'1');
  }
}

/* ── AUTH ─────────────────────────────────── */
function isLoggedIn(){return!!localStorage.getItem(K.session);}

function login(){
  var u=$('#login-user').value.trim(),p=$('#login-pass').value,a=gO(K.admin);
  if(u===a.username&&p===a.password){s(K.session,{loggedIn:true,time:Date.now()});showApp();$('#login-error').textContent='';}
  else{$('#login-error').textContent='Invalid username or password.';$('#login-pass').value='';}
}

function logout(){localStorage.removeItem(K.session);location.reload();}
function showLogin(){$('#login-screen').style.display='';$('#app').style.display='none';}
function showApp(){$('#login-screen').style.display='none';$('#app').style.display='';navigate('dashboard');updateBadges();}

/* ── NAVIGATION ──────────────────────────── */
function navigate(sec){
  currentSection=sec;
  $$('#sidebar nav a').forEach(function(a){a.classList.toggle('active',a.dataset.section===sec);});
  var h={
    dashboard:['Dashboard','Overview of your content'],courses:['Courses','Manage your learning programs'],
    events:['Events','Manage upcoming events and workshops'],posts:['Blog Posts','Manage journal articles'],
    team:['Team','Manage team members'],stories:['Student Stories','Manage graduate testimonials'],
    jobs:['Jobs','Manage active job openings on the career page'],
    submissions:['Submissions','Review contact form messages'],settings:['Settings','Site configuration and data management']
  };
  var info=h[sec]||['',''];
  $('#page-title').textContent=info[0];
  $('#page-subtitle').textContent=info[1];
  var addSections=['courses','events','posts','team','stories','jobs'];
  if(addSections.indexOf(sec)>-1){
    $('#header-actions').innerHTML='<button class="btn btn-primary" onclick="CMS.openModal(\''+sec+'\')">+ Add New</button>';
  }else{$('#header-actions').innerHTML='';}
  var render={dashboard:renderDashboard,courses:renderCourses,events:renderEvents,posts:renderPosts,team:renderTeam,stories:renderStories,submissions:renderSubmissions,settings:renderSettings,jobs:renderJobs};
  if(render[sec])render[sec]();
  $('#sidebar').classList.remove('open');
}

function updateBadges(){
  var subs=g(K.submissions),unread=subs.filter(function(x){return!x.read;}).length;
  var b=$('#sub-badge');
  if(b){if(unread>0){b.style.display='';b.textContent=unread;}else{b.style.display='none';}}
}

/* ── RENDER: DASHBOARD ───────────────────── */
function renderDashboard(){
  var courses=g(K.courses),events=g(K.events),posts=g(K.posts),team=g(K.team),stories=g(K.stories),subs=g(K.submissions),jobs=g(K.jobs);
  var html='<div class="stat-grid">'+
    '<div class="stat-card"><div class="stat-icon blue">📚</div><div class="stat-value">'+courses.length+'</div><div class="stat-label">Courses</div></div>'+
    '<div class="stat-card"><div class="stat-icon green">📅</div><div class="stat-value">'+events.length+'</div><div class="stat-label">Events</div></div>'+
    '<div class="stat-card"><div class="stat-icon orange">📝</div><div class="stat-value">'+posts.length+'</div><div class="stat-label">Blog Posts</div></div>'+
    '<div class="stat-card"><div class="stat-icon lime">💼</div><div class="stat-value">'+jobs.length+'</div><div class="stat-label">Jobs</div></div>'+
    '<div class="stat-card"><div class="stat-icon purple">📩</div><div class="stat-value">'+subs.length+'</div><div class="stat-label">Submissions</div></div>'+
  '</div>';

  // Recent items
  html+='<div class="data-table-wrap"><div class="data-table-header"><h3>Recent Content</h3></div><table class="data-table"><thead><tr><th>Type</th><th>Title</th><th>Action</th></tr></thead><tbody>';
  var recent=[];
  courses.slice(-3).forEach(function(c){recent.push({type:'Course',title:c.title,sec:'courses'});});
  events.slice(-3).forEach(function(e){recent.push({type:'Event',title:e.title,sec:'events'});});
  posts.slice(-3).forEach(function(p){recent.push({type:'Post',title:p.title,sec:'posts'});});
  jobs.slice(-3).forEach(function(j){recent.push({type:'Job',title:j.title,sec:'jobs'});});
  recent.reverse().slice(0,8).forEach(function(r){
    html+='<tr><td><span class="tag tag-blue">'+esc(r.type)+'</span></td><td class="cell-title">'+esc(r.title)+'</td><td><button class="btn btn-secondary btn-sm" onclick="CMS.navigate(\''+r.sec+'\')">View</button></td></tr>';
  });
  if(recent.length===0)html+='<tr><td colspan="3" style="text-align:center;color:var(--muted);padding:30px">No content yet. Start adding content.</td></tr>';
  html+='</tbody></table></div>';
  $('#content-area').innerHTML=html;
}

/* ── RENDER: COURSES ─────────────────────── */
function renderCourses(){
  var items=g(K.courses);
  if(!items.length){$('#content-area').innerHTML=emptyState('📚','No courses yet','Add your first course to get started.','courses');return;}
  var html='<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Icon</th><th>Title</th><th>Duration</th><th>Actions</th></tr></thead><tbody>';
  items.forEach(function(c){
    html+='<tr><td style="font-size:20px">'+esc(c.icon)+'</td><td><span class="cell-title">'+esc(c.title)+'</span><div class="cell-meta">'+esc(c.description).substring(0,60)+'…</div></td><td><span class="tag tag-blue">'+esc(c.duration)+'</span></td><td class="cell-actions"><button class="btn btn-secondary btn-sm" onclick="CMS.openModal(\'courses\',\''+c.id+'\')">Edit</button><button class="btn btn-danger btn-sm" onclick="CMS.deleteItem(\'courses\',\''+c.id+'\')">Delete</button></td></tr>';
  });
  html+='</tbody></table></div>';
  $('#content-area').innerHTML=html;
}

/* ── RENDER: EVENTS ──────────────────────── */
function renderEvents(){
  var items=g(K.events);
  if(!items.length){$('#content-area').innerHTML=emptyState('📅','No events yet','Add your first event.','events');return;}
  var html='<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Title</th><th>Location</th><th>Featured</th><th>Actions</th></tr></thead><tbody>';
  items.forEach(function(e){
    var dateStr=fmtDate(e.date)+(e.time?' · '+fmtTime(e.time):'');
    html+='<tr><td class="cell-meta">'+esc(dateStr)+'</td><td class="cell-title">'+esc(e.title)+'</td><td class="cell-meta">'+esc(e.location)+'</td><td>'+(e.featured?'<span class="tag tag-green">Yes</span>':'<span class="tag tag-orange">No</span>')+'</td><td class="cell-actions"><button class="btn btn-secondary btn-sm" onclick="CMS.openModal(\'events\',\''+e.id+'\')">Edit</button><button class="btn btn-danger btn-sm" onclick="CMS.deleteItem(\'events\',\''+e.id+'\')">Delete</button></td></tr>';
  });
  html+='</tbody></table></div>';
  $('#content-area').innerHTML=html;
}

/* ── RENDER: POSTS ───────────────────────── */
function renderPosts(){
  var items=g(K.posts);
  if(!items.length){$('#content-area').innerHTML=emptyState('📝','No posts yet','Write your first article.','posts');return;}
  var html='<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Read Time</th><th>Actions</th></tr></thead><tbody>';
  items.forEach(function(p){
    html+='<tr><td><img src="'+esc(p.imageUrl)+'" alt="" style="width:60px;height:40px;object-fit:cover;border-radius:4px"></td><td class="cell-title">'+esc(p.title)+'</td><td><span class="tag tag-blue">'+esc(p.category)+'</span></td><td class="cell-meta">'+esc(p.readTime)+'</td><td class="cell-actions"><button class="btn btn-secondary btn-sm" onclick="CMS.openModal(\'posts\',\''+p.id+'\')">Edit</button><button class="btn btn-danger btn-sm" onclick="CMS.deleteItem(\'posts\',\''+p.id+'\')">Delete</button></td></tr>';
  });
  html+='</tbody></table></div>';
  $('#content-area').innerHTML=html;
}

/* ── RENDER: TEAM ────────────────────────── */
function renderTeam(){
  var items=g(K.team);
  if(!items.length){$('#content-area').innerHTML=emptyState('👥','No team members yet','Add your first team member.','team');return;}
  var html='<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Photo</th><th>Name</th><th>Role</th><th>Actions</th></tr></thead><tbody>';
  items.forEach(function(t){
    html+='<tr><td><img src="'+esc(t.photoUrl)+'" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover"></td><td class="cell-title">'+esc(t.name)+'</td><td class="cell-meta">'+esc(t.role)+'</td><td class="cell-actions"><button class="btn btn-secondary btn-sm" onclick="CMS.openModal(\'team\',\''+t.id+'\')">Edit</button><button class="btn btn-danger btn-sm" onclick="CMS.deleteItem(\'team\',\''+t.id+'\')">Delete</button></td></tr>';
  });
  html+='</tbody></table></div>';
  $('#content-area').innerHTML=html;
}

/* ── RENDER: STORIES ─────────────────────── */
function renderStories(){
  var items=g(K.stories);
  if(!items.length){$('#content-area').innerHTML=emptyState('💬','No stories yet','Add your first student story.','stories');return;}
  var html='<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Photo</th><th>Name</th><th>Role</th><th>Quote</th><th>Actions</th></tr></thead><tbody>';
  items.forEach(function(st){
    html+='<tr><td><img src="'+esc(st.photoUrl)+'" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover"></td><td class="cell-title">'+esc(st.name)+'</td><td class="cell-meta">'+esc(st.role)+'</td><td class="cell-meta">'+esc(st.quote).substring(0,50)+'…</td><td class="cell-actions"><button class="btn btn-secondary btn-sm" onclick="CMS.openModal(\'stories\',\''+st.id+'\')">Edit</button><button class="btn btn-danger btn-sm" onclick="CMS.deleteItem(\'stories\',\''+st.id+'\')">Delete</button></td></tr>';
  });
  html+='</tbody></table></div>';
  $('#content-area').innerHTML=html;
}

/* ── RENDER: JOBS ────────────────────────── */
function renderJobs(){
  var items=g(K.jobs);
  if(!items.length){$('#content-area').innerHTML=emptyState('💼','No jobs posted yet','Add your first job opening to show on the career page.','jobs');return;}
  var html='<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Title</th><th>Department</th><th>Location</th><th>Type</th><th>Actions</th></tr></thead><tbody>';
  items.forEach(function(j){
    html+='<tr><td><span class="cell-title">'+esc(j.title)+'</span><div class="cell-meta">'+esc(j.description).substring(0,60)+'…</div></td><td><span class="tag tag-blue">'+esc(j.department)+'</span></td><td>'+esc(j.location)+'</td><td><span class="tag tag-green">'+esc(j.type)+'</span></td><td class="cell-actions"><button class="btn btn-secondary btn-sm" onclick="CMS.openModal(\'jobs\',\''+j.id+'\')">Edit</button><button class="btn btn-danger btn-sm" onclick="CMS.deleteItem(\'jobs\',\''+j.id+'\')">Delete</button></td></tr>';
  });
  html+='</tbody></table></div>';
  $('#content-area').innerHTML=html;
}

/* ── RENDER: SUBMISSIONS ─────────────────── */
function renderSubmissions(){
  var items=g(K.submissions);
  if(!items.length){$('#content-area').innerHTML=emptyState('📩','No submissions yet','Form submissions from your website will appear here.');return;}
  // Mark all as read
  items.forEach(function(x){x.read=true;});
  s(K.submissions,items);updateBadges();
  var html='';
  items.slice().reverse().forEach(function(sub){
    html+='<div class="submission-card"><div class="sub-header"><span class="sub-name">'+esc(sub.name||'Anonymous')+'</span><span class="sub-date">'+fmtDate(sub.createdAt)+'</span></div><div class="sub-details">';
    if(sub.email)html+='<span>✉ '+esc(sub.email)+'</span>';
    if(sub.phone)html+='<span>☎ '+esc(sub.phone)+'</span>';
    if(sub.course)html+='<span>📚 '+esc(sub.course)+'</span>';
    html+='</div>';
    if(sub.message)html+='<div class="sub-message">'+esc(sub.message)+'</div>';
    html+='<div class="sub-actions"><button class="btn btn-danger btn-sm" onclick="CMS.deleteSub(\''+sub.id+'\')">Delete</button></div></div>';
  });
  $('#content-area').innerHTML=html;
}

/* ── RENDER: SETTINGS ────────────────────── */
function renderSettings(){
  var st=gO(K.settings),admin=gO(K.admin);
  
  var slides = st.slides || [
    { src: 'IMAGES/student_hero.png', caption: '✦ Future Innovator' },
    { src: 'IMAGES/student_hero_2.png', caption: '✦ Industry Ready' },
    { src: 'IMAGES/student_hero_3.png', caption: '✦ Creative Collaboration' }
  ];

  var slideshowHtml = '<div class="settings-card" style="grid-column: 1 / -1; margin-top: 20px;">'+
    '<h3>Homepage Slideshow</h3>'+
    '<p style="font-size: 13px; color: var(--muted); margin-bottom: 18px;">Manage the rotating images and caption text in the homepage photo frame. You can add new slides, remove slides, or upload custom images from your device.</p>'+
    '<div id="slides-list-container">';

  slides.forEach(function(slide, idx) {
    var previewSrc = slide.src;
    if (previewSrc && !previewSrc.startsWith('http') && !previewSrc.startsWith('../') && !previewSrc.startsWith('data:')) {
      previewSrc = '../' + previewSrc;
    }
    slideshowHtml += '<div class="slide-item-row" style="display: grid; grid-template-columns: 90px 1fr 1fr auto; gap: 20px; align-items: center; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border);">' +
      '<div style="width: 90px; height: 65px; border-radius: 6px; border: 1px solid var(--border); overflow: hidden; background: #000;">' +
        '<img class="slide-preview" src="' + esc(previewSrc) + '" style="width: 100%; height: 100%; object-fit: cover;">' +
      '</div>' +
      '<div class="form-group" style="margin-bottom:0;">' +
        '<label>Image URL / Path</label>' +
        '<div style="display: flex; gap: 8px; align-items: center;">' +
          '<input class="set-slide-src" value="' + esc(slide.src) + '" oninput="CMS.updateSlidePreview(this)" style="flex:1;">' +
          '<label class="btn btn-secondary" style="padding: 8px 12px; margin: 0; font-size: 11px; cursor: pointer;">' +
            'Upload' +
            '<input type="file" accept="image/*" style="display:none;" onchange="CMS.handleSlideUpload(this)">' +
          '</label>' +
        '</div>' +
      '</div>' +
      '<div class="form-group" style="margin-bottom:0;"><label>Caption</label><input class="set-slide-caption" value="' + esc(slide.caption) + '"></div>' +
      '<div><button class="btn btn-danger" style="padding: 10px 14px; margin-top: 5px;" onclick="CMS.removeSlideRow(this)">✕ Remove</button></div>' +
      '</div>';
  });
  slideshowHtml += '</div>' + 
    '<button class="btn btn-secondary" style="margin-top: 10px;" onclick="CMS.addSlideRow()">+ Add Slide</button>' +
    '</div>';

  var html='<div class="settings-grid">'+
    '<div class="settings-card"><h3>Site Information</h3>'+
    '<div class="form-group"><label>Site Name</label><input id="set-name" value="'+esc(st.siteName)+'"></div>'+
    '<div class="form-group"><label>Phone</label><input id="set-phone" value="'+esc(st.phone)+'"></div>'+
    '<div class="form-group"><label>Email</label><input id="set-email" value="'+esc(st.email)+'"></div>'+
    '<div class="form-group"><label>Address</label><textarea id="set-address">'+esc(st.address)+'</textarea></div>'+
    '<div class="form-group"><label>Admission Text</label><input id="set-admission" value="'+esc(st.admissionText)+'"></div>'+
    '<button class="btn btn-primary" onclick="CMS.saveSettings()">Save Settings</button></div>'+
    '<div>'+
    '<div class="settings-card" style="margin-bottom:20px"><h3>Admin Credentials</h3>'+
    '<div class="form-group"><label>Username</label><input id="set-user" value="'+esc(admin.username)+'"></div>'+
    '<div class="form-group"><label>New Password</label><input id="set-pass" type="password" placeholder="Leave blank to keep current"></div>'+
    '<button class="btn btn-primary" onclick="CMS.saveAdmin()">Update Credentials</button></div>'+
    '<div class="settings-card"><h3>Data Management</h3>'+
    '<p style="font-size: 13px; color: var(--muted); margin-bottom: 16px;">Export all CMS data as JSON for backup, or import a previous backup to restore.</p>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap">'+
    '<button class="btn btn-secondary" onclick="CMS.exportData()">↓ Export JSON</button>'+
    '<label class="btn btn-secondary" style="cursor:pointer">↑ Import JSON<input type="file" accept=".json" style="display:none" onchange="CMS.importData(event)"></label>'+
    '</div>'+
    '<div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">'+
    '<button class="btn btn-danger" onclick="CMS.resetAll()">Reset All Data</button>'+
    '<p class="form-hint" style="margin-top:8px">This will delete all CMS data and restore factory defaults.</p>'+
    '</div></div></div>' + slideshowHtml + '</div>';
  $('#content-area').innerHTML=html;
}

/* ── EMPTY STATE HELPER ──────────────────── */
function emptyState(icon,title,desc,type){
  var btn=type?'<button class="btn btn-primary" onclick="CMS.openModal(\''+type+'\')">+ Add New</button>':'';
  return'<div class="empty-state"><div class="empty-icon">'+icon+'</div><h3>'+title+'</h3><p>'+desc+'</p>'+btn+'</div>';
}

/* ── MODAL ───────────────────────────────── */
function openModal(type,itemId){
  editType=type;editId=itemId||null;
  var isEdit=!!editId,item=null;
  if(isEdit){var items=g(K[type]);item=items.find(function(x){return x.id===editId;});}
  var titleText=isEdit?'Edit ':'Add ';
  var forms={
    courses:function(){
      titleText+='Course';
      return'<div class="form-row"><div class="form-group"><label>Icon (emoji)</label><input id="m-icon" value="'+esc(item?item.icon:'⌘')+'" maxlength="2"></div><div class="form-group"><label>Duration</label><input id="m-duration" value="'+esc(item?item.duration:'')+'" placeholder="e.g. 06 Months"></div></div><div class="form-group"><label>Title</label><input id="m-title" value="'+esc(item?item.title:'')+'"></div><div class="form-group"><label>Description</label><textarea id="m-desc">'+esc(item?item.description:'')+'</textarea></div>';
    },
    events:function(){
      titleText+='Event';
      return'<div class="form-group"><label>Title</label><input id="m-title" value="'+esc(item?item.title:'')+'"></div><div class="form-group"><label>Description</label><textarea id="m-desc">'+esc(item?item.description:'')+'</textarea></div><div class="form-row"><div class="form-group"><label>Date</label><input id="m-date" type="date" value="'+(item?item.date:'')+'"></div><div class="form-group"><label>Time</label><input id="m-time" type="time" value="'+(item?item.time:'')+'"></div></div><div class="form-group"><label>Location</label><input id="m-location" value="'+esc(item?item.location:'')+'"></div><div class="form-group"><label class="form-check"><input type="checkbox" id="m-featured" '+(item&&item.featured?'checked':'')+'>Featured event</label></div>';
    },
    posts:function(){
      titleText+='Blog Post';
      return'<div class="form-group"><label>Title</label><input id="m-title" value="'+esc(item?item.title:'')+'"></div><div class="form-row"><div class="form-group"><label>Category</label><input id="m-category" value="'+esc(item?item.category:'')+'" placeholder="e.g. CAREER"></div><div class="form-group"><label>Read Time</label><input id="m-readtime" value="'+esc(item?item.readTime:'')+'" placeholder="e.g. 5 MIN READ"></div></div><div class="form-group"><label>Image URL</label><input id="m-image" value="'+esc(item?item.imageUrl:'')+'" placeholder="https://..."></div><div class="form-group"><label>Content</label><textarea id="m-content" style="min-height:160px" placeholder="Write your post here...">'+esc(item?item.content:'')+'</textarea></div>';
    },
    team:function(){
      titleText+='Team Member';
      return'<div class="form-group"><label>Name</label><input id="m-name" value="'+esc(item?item.name:'')+'"></div><div class="form-group"><label>Role</label><input id="m-role" value="'+esc(item?item.role:'')+'"></div><div class="form-group"><label>Photo URL</label><input id="m-photo" value="'+esc(item?item.photoUrl:'')+'" placeholder="https://..."></div>';
    },
    stories:function(){
      titleText+='Student Story';
      return'<div class="form-group"><label>Name</label><input id="m-name" value="'+esc(item?item.name:'')+'"></div><div class="form-group"><label>Role / Company</label><input id="m-role" value="'+esc(item?item.role:'')+'"></div><div class="form-group"><label>Quote</label><textarea id="m-quote">'+esc(item?item.quote:'')+'</textarea></div><div class="form-group"><label>Photo URL</label><input id="m-photo" value="'+esc(item?item.photoUrl:'')+'" placeholder="https://..."></div>';
    },
    jobs:function(){
      titleText+='Job Opening';
      return'<div class="form-group"><label>Job Title</label><input id="m-title" value="'+esc(item?item.title:'')+'"></div>'+
             '<div class="form-row"><div class="form-group"><label>Department</label><input id="m-dept" value="'+esc(item?item.department:'')+'" placeholder="e.g. Engineering"></div>'+
             '<div class="form-group"><label>Location</label><input id="m-location" value="'+esc(item?item.location:'')+'" placeholder="e.g. Dhaka (Mirpur) / Remote"></div></div>'+
             '<div class="form-row"><div class="form-group"><label>Employment Type</label><select id="m-type">'+
             '<option '+(item&&item.type==='Full-time'?'selected':'')+'>Full-time</option>'+
             '<option '+(item&&item.type==='Part-time'?'selected':'')+'>Part-time</option>'+
             '<option '+(item&&item.type==='Internship'?'selected':'')+'>Internship</option>'+
             '<option '+(item&&item.type==='Contract'?'selected':'')+'>Contract</option></select></div>'+
             '<div class="form-group"><label>Application Link / Email</label><input id="m-link" value="'+esc(item?item.link:'info@bditinstitute.com')+'"></div></div>'+
             '<div class="form-group"><label>Description</label><textarea id="m-desc">'+esc(item?item.description:'')+'</textarea></div>';
    }
  };
  if(!forms[type])return;
  $('#modal-title').textContent=titleText;
  $('#modal-body').innerHTML=forms[type]();
  $('#modal').style.display='';
}

function closeModal(){$('#modal').style.display='none';editType=null;editId=null;}

function saveModal(){
  if(!editType)return;
  var items=g(K[editType]);
  var data=null;

  if(editType==='courses'){
    var t=$('#m-title').value.trim();if(!t){toast('Title is required','error');return;}
    data={id:editId||id(),title:t,description:$('#m-desc').value.trim(),duration:$('#m-duration').value.trim(),icon:$('#m-icon').value.trim()||'⌘'};
  }
  else if(editType==='events'){
    var t=$('#m-title').value.trim();if(!t){toast('Title is required','error');return;}
    data={id:editId||id(),title:t,description:$('#m-desc').value.trim(),date:$('#m-date').value,time:$('#m-time').value,location:$('#m-location').value.trim(),featured:$('#m-featured').checked};
  }
  else if(editType==='posts'){
    var t=$('#m-title').value.trim();if(!t){toast('Title is required','error');return;}
    data={id:editId||id(),title:t,category:$('#m-category').value.trim().toUpperCase(),readTime:$('#m-readtime').value.trim(),imageUrl:$('#m-image').value.trim(),content:$('#m-content').value.trim()};
  }
  else if(editType==='team'){
    var n=$('#m-name').value.trim();if(!n){toast('Name is required','error');return;}
    data={id:editId||id(),name:n,role:$('#m-role').value.trim(),photoUrl:$('#m-photo').value.trim()};
  }
  else if(editType==='stories'){
    var n=$('#m-name').value.trim();if(!n){toast('Name is required','error');return;}
    data={id:editId||id(),name:n,role:$('#m-role').value.trim(),quote:$('#m-quote').value.trim(),photoUrl:$('#m-photo').value.trim()};
  }
  else if(editType==='jobs'){
    var t=$('#m-title').value.trim();if(!t){toast('Title is required','error');return;}
    data={id:editId||id(),title:t,department:$('#m-dept').value.trim(),location:$('#m-location').value.trim(),type:$('#m-type').value,link:$('#m-link').value.trim(),description:$('#m-desc').value.trim()};
  }

  if(!data)return;

  if(editId){
    var idx=items.findIndex(function(x){return x.id===editId;});
    if(idx>-1)items[idx]=data;
  }else{items.push(data);}

  s(K[editType],items);
  closeModal();
  navigate(currentSection);
  toast(editId?'Item updated':'Item added','success');
}

/* ── DELETE ───────────────────────────────── */
function deleteItem(type,itemId){
  if(!confirm('Are you sure you want to delete this item?'))return;
  var items=g(K[type]).filter(function(x){return x.id!==itemId;});
  s(K[type],items);
  navigate(currentSection);
  toast('Item deleted','success');
}

function deleteSub(subId){
  var items=g(K.submissions).filter(function(x){return x.id!==subId;});
  s(K.submissions,items);
  navigate('submissions');
  updateBadges();
  toast('Submission deleted','success');
}

/* ── SETTINGS SAVE ───────────────────────── */
function saveSettings(){
  var slideSrcs = $$('.set-slide-src');
  var slideCaps = $$('.set-slide-caption');
  var slides = [];
  for (var i = 0; i < slideSrcs.length; i++) {
    slides.push({
      src: slideSrcs[i].value.trim(),
      caption: slideCaps[i].value.trim()
    });
  }

  var st={
    siteName:$('#set-name').value.trim(),phone:$('#set-phone').value.trim(),
    email:$('#set-email').value.trim(),address:$('#set-address').value.trim(),
    admissionText:$('#set-admission').value.trim(),
    slides: slides
  };
  s(K.settings,st);
  toast('Settings saved','success');
  setTimeout(navigate, 500, 'settings');
}

function removeSlideRow(btn) {
  var row = btn.closest('.slide-item-row');
  if (row) row.remove();
}

function addSlideRow() {
  var container = $('#slides-list-container');
  if (!container) return;
  var div = document.createElement('div');
  div.className = 'slide-item-row';
  div.style.cssText = 'display: grid; grid-template-columns: 90px 1fr 1fr auto; gap: 20px; align-items: center; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border);';
  div.innerHTML = '<div style="width: 90px; height: 65px; border-radius: 6px; border: 1px solid var(--border); overflow: hidden; background: #000;">' +
      '<img class="slide-preview" src="../IMAGES/student_hero.png" style="width: 100%; height: 100%; object-fit: cover;">' +
    '</div>' +
    '<div class="form-group" style="margin-bottom:0;">' +
      '<label>Image URL / Path</label>' +
      '<div style="display: flex; gap: 8px; align-items: center;">' +
        '<input class="set-slide-src" value="IMAGES/student_hero.png" oninput="CMS.updateSlidePreview(this)" style="flex:1;">' +
        '<label class="btn btn-secondary" style="padding: 8px 12px; margin: 0; font-size: 11px; cursor: pointer;">' +
          'Upload' +
          '<input type="file" accept="image/*" style="display:none;" onchange="CMS.handleSlideUpload(this)">' +
        '</label>' +
      '</div>' +
    '</div>' +
    '<div class="form-group" style="margin-bottom:0;"><label>Caption</label><input class="set-slide-caption" value="✦ New Future Innovator"></div>' +
    '<div><button class="btn btn-danger" style="padding: 10px 14px; margin-top: 5px;" onclick="CMS.removeSlideRow(this)">✕ Remove</button></div>';
  container.appendChild(div);
}

function updateSlidePreview(input) {
  var row = input.closest('.slide-item-row');
  if (!row) return;
  var img = row.querySelector('.slide-preview');
  if (!img) return;
  var val = input.value.trim();
  if (val && !val.startsWith('http') && !val.startsWith('../') && !val.startsWith('data:')) {
    val = '../' + val;
  }
  img.src = val || '../IMAGES/student_hero.png';
}

function handleSlideUpload(fileInput) {
  var file = fileInput.files[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) {
    toast('Image is too large. Please upload an image under 2MB to fit local storage.', 'error');
    fileInput.value = '';
    return;
  }

  var reader = new FileReader();
  reader.onload = function(e) {
    var base64 = e.target.result;
    var row = fileInput.closest('.slide-item-row');
    if (row) {
      var txtInput = row.querySelector('.set-slide-src');
      if (txtInput) {
        txtInput.value = base64;
        updateSlidePreview(txtInput);
      }
    }
  };
  reader.readAsDataURL(file);
  fileInput.value = '';
}

function saveAdmin(){
  var admin=gO(K.admin),u=$('#set-user').value.trim(),p=$('#set-pass').value;
  if(!u){toast('Username is required','error');return;}
  admin.username=u;
  if(p)admin.password=p;
  s(K.admin,admin);toast('Credentials updated','success');
}

/* ── EXPORT / IMPORT ─────────────────────── */
function exportData(){
  var data={};
  [K.courses,K.events,K.posts,K.team,K.stories,K.submissions,K.settings,K.admin,K.jobs].forEach(function(k){
    data[k]=localStorage.getItem(k);
  });
  var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='biti-cms-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();
  toast('Backup downloaded','success');
}

function importData(e){
  var file=e.target.files[0];if(!file)return;
  var reader=new FileReader();
  reader.onload=function(ev){
    try{
      var data=JSON.parse(ev.target.result);
      Object.keys(data).forEach(function(k){localStorage.setItem(k,data[k]);});
      toast('Data imported successfully','success');
      navigate(currentSection);
      updateBadges();
    }catch(err){toast('Invalid JSON file','error');}
  };
  reader.readAsText(file);
  e.target.value='';
}

function resetAll(){
  if(!confirm('This will delete ALL CMS data and restore factory defaults. Are you sure?'))return;
  Object.values(K).forEach(function(k){localStorage.removeItem(k);});
  localStorage.removeItem(K.init);
  seedDefaults();
  navigate('dashboard');
  toast('All data reset to defaults','success');
}

/* ── TOAST ───────────────────────────────── */
function toast(msg,type){
  var el=document.createElement('div');
  el.className='toast '+(type||'');
  el.innerHTML=(type==='success'?'✓ ':'⚠ ')+esc(msg);
  document.body.appendChild(el);
  setTimeout(function(){el.remove();},3000);
}

/* ── EVENT BINDING ───────────────────────── */
function bindEvents(){
  // Login
  $('#login-btn').addEventListener('click',login);
  $('#login-pass').addEventListener('keydown',function(e){if(e.key==='Enter')login();});
  $('#login-user').addEventListener('keydown',function(e){if(e.key==='Enter')$('#login-pass').focus();});

  // Logout
  $('#logout-btn').addEventListener('click',logout);

  // Sidebar navigation
  $$('#sidebar nav a').forEach(function(a){
    a.addEventListener('click',function(){navigate(this.dataset.section);});
  });

  // Modal
  $('#modal-close').addEventListener('click',closeModal);
  $('#modal-cancel').addEventListener('click',closeModal);
  $('#modal-save').addEventListener('click',saveModal);
  $('#modal').addEventListener('click',function(e){if(e.target===this)closeModal();});

  // Mobile toggle
  $('#mobile-toggle').addEventListener('click',function(){$('#sidebar').classList.toggle('open');});
}

/* ── INIT ────────────────────────────────── */
function init(){
  seedDefaults();
  bindEvents();
  if(isLoggedIn()){showApp();}else{showLogin();}
}

/* ── PUBLIC API ───────────────────────────── */
window.CMS={
  navigate:navigate,openModal:openModal,deleteItem:deleteItem,deleteSub:deleteSub,
  saveSettings:saveSettings,saveAdmin:saveAdmin,exportData:exportData,importData:importData,resetAll:resetAll,
  removeSlideRow:removeSlideRow,addSlideRow:addSlideRow,updateSlidePreview:updateSlidePreview,handleSlideUpload:handleSlideUpload
};

document.addEventListener('DOMContentLoaded',init);
})();
