const STORAGE_KEY = "eventforce-demo-v1";
const seed = {
  events: [
    {name:"Annual Tech Summit",date:"2026-11-12",type:"Conference",client:"Aarav Kumar",venue:"Grand Orchid Hall",status:"Confirmed"},
    {name:"Priya & Arjun Wedding",date:"2026-11-21",type:"Wedding",client:"Priya Sharma",venue:"Lakeview Gardens",status:"Planning"},
    {name:"Product Launch Night",date:"2026-12-04",type:"Corporate",client:"NovaTech Pvt Ltd",venue:"City Convention Centre",status:"Confirmed"}
  ],
  clients:[
    {name:"Aarav Kumar",email:"aarav@example.com",phone:"+91 98765 43210"},
    {name:"Priya Sharma",email:"priya@example.com",phone:"+91 98765 12340"},
    {name:"NovaTech Pvt Ltd",email:"events@novatech.example",phone:"+91 91234 56780"}
  ],
  venues:[
    {name:"Grand Orchid Hall",location:"Chennai",capacity:"500",availability:"Available"},
    {name:"Lakeview Gardens",location:"Coimbatore",capacity:"300",availability:"Available"},
    {name:"City Convention Centre",location:"Trichy",capacity:"800",availability:"Reserved"}
  ],
  vendors:[
    {name:"Bloom & Petal",service:"Decoration",contact:"bloom@example.com",status:"Active"},
    {name:"SoundWave Events",service:"Audio & Lighting",contact:"sound@example.com",status:"Active"},
    {name:"Tasty Trails Catering",service:"Catering",contact:"tasty@example.com",status:"Active"}
  ],
  feedback:[
    {event:"Annual Tech Summit",client:"Aarav Kumar",rating:"5",comments:"Excellent coordination and a smooth event experience."},
    {event:"Priya & Arjun Wedding",client:"Priya Sharma",rating:"4",comments:"Beautiful venue setup and helpful staff."}
  ]
};
let data;
try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(seed); } catch { data = structuredClone(seed); }
const $ = (s) => document.querySelector(s);
const esc = (v="") => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today = new Date();
$("#today").textContent = today.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const configs = {
 events:{title:"Add event",fields:[["name","Event name","text",true],["date","Event date","date",true],["type","Event type","select",true,["Conference","Wedding","Corporate","Birthday","Workshop","Other"]],["client","Client","text",true],["venue","Venue","text",true],["status","Status","select",true,["Planning","Confirmed","Completed","Canceled"]]]},
 clients:{title:"Add client",fields:[["name","Client name","text",true],["email","Email address","email",true],["phone","Phone number","tel",false]]},
 venues:{title:"Add venue",fields:[["name","Venue name","text",true],["location","Location","text",true],["capacity","Guest capacity","number",true],["availability","Availability","select",true,["Available","Reserved","Unavailable"]]]},
 vendors:{title:"Add vendor",fields:[["name","Vendor name","text",true],["service","Service type","text",true],["contact","Contact email or phone","text",true],["status","Status","select",true,["Active","Pending","Inactive"]]]},
 feedback:{title:"Add feedback",fields:[["event","Event name","text",true],["client","Client name","text",true],["rating","Rating (1–5)","select",true,["5","4","3","2","1"]],["comments","Comments","textarea",true]]}
};
let currentView="dashboard";
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));render();}
function emptyRow(cols,msg="No records yet. Add a record to get started."){return `<tr><td colspan="${cols}" class="empty">${msg}</td></tr>`;}
function render(){
 $("#stat-events").textContent=data.events.length; $("#stat-clients").textContent=data.clients.length; $("#stat-venues").textContent=data.venues.length; $("#stat-feedback").textContent=data.feedback.length;
 const upcoming=[...data.events].filter(e=>e.date).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
 $("#upcoming-list").innerHTML=upcoming.length?upcoming.map(e=>{const d=new Date(e.date+"T00:00:00");return `<div class="event-row"><div class="date-tile">${d.toLocaleDateString("en",{month:"short"}).toUpperCase()}<b>${d.getDate()}</b></div><div class="event-info"><b>${esc(e.name)}</b><small>${esc(e.type)} · ${esc(e.venue)}</small></div><span class="pill ${e.status==="Planning"?"planning":""}">${esc(e.status)}</span></div>`}).join(""):`<div class="empty">No events yet. Add your first event.</div>`;
 $("#events-table").innerHTML=data.events.length?data.events.map((e,i)=>`<tr><td>${esc(e.name)}</td><td>${esc(e.date)}</td><td>${esc(e.type)}</td><td>${esc(e.client)}</td><td>${esc(e.venue)}</td><td><span class="pill ${e.status==="Planning"?"planning":""}">${esc(e.status)}</span></td><td><button class="text-button delete" data-kind="events" data-index="${i}">Delete</button></td></tr>`).join(""):emptyRow(7);
 $("#clients-table").innerHTML=data.clients.length?data.clients.map((c,i)=>`<tr><td>${esc(c.name)}</td><td>${esc(c.email)}</td><td>${esc(c.phone||"—")}</td><td>${data.events.filter(e=>e.client===c.name).length}</td><td><button class="text-button delete" data-kind="clients" data-index="${i}">Delete</button></td></tr>`).join(""):emptyRow(5);
 $("#venues-table").innerHTML=data.venues.length?data.venues.map((v,i)=>`<tr><td>${esc(v.name)}</td><td>${esc(v.location)}</td><td>${esc(v.capacity)}</td><td><span class="pill ${v.availability!=="Available"?"planning":""}">${esc(v.availability)}</span></td><td><button class="text-button delete" data-kind="venues" data-index="${i}">Delete</button></td></tr>`).join(""):emptyRow(5);
 $("#vendors-table").innerHTML=data.vendors.length?data.vendors.map((v,i)=>`<tr><td>${esc(v.name)}</td><td>${esc(v.service)}</td><td>${esc(v.contact)}</td><td>${esc(v.status)}</td><td><button class="text-button delete" data-kind="vendors" data-index="${i}">Delete</button></td></tr>`).join(""):emptyRow(5);
 $("#feedback-list").innerHTML=data.feedback.length?data.feedback.map((f,i)=>`<article class="feedback-card"><div style="display:flex;justify-content:space-between;gap:10px"><h3>${esc(f.event)}</h3><span class="pill">${esc(f.rating)} / 5 ★</span></div><small>From ${esc(f.client)}</small><p>${esc(f.comments)}</p><button class="text-button delete" data-kind="feedback" data-index="${i}">Delete feedback</button></article>`).join(""):`<div class="panel empty">No feedback yet. Add a response to get started.</div>`;
}
function showView(view){
 currentView=view;
 document.querySelectorAll(".view").forEach(el=>el.classList.add("hidden"));
 $("#"+view+"-view").classList.remove("hidden");
 document.querySelectorAll(".nav").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
 const titles={dashboard:"Dashboard overview",events:"Event schedule",clients:"Client directory",venues:"Venue management",vendors:"Vendor coordination",feedback:"Client feedback"};
 $("#page-title").textContent=titles[view]||"EventForce";
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300);}
function openForm(kind){
 const cfg=configs[kind];$("#dialog-title").textContent=cfg.title;
 $("#form-fields").innerHTML=cfg.fields.map(([name,label,type,required,options])=>{
 let control="";
 if(type==="select") control=`<select name="${name}" ${required?"required":""}>${options.map(o=>`<option>${esc(o)}</option>`).join("")}</select>`;
 else if(type==="textarea") control=`<textarea name="${name}" rows="3" required></textarea>`;
 else control=`<input name="${name}" type="${type}" ${required?"required":""} ${name==="date"?'min="'+new Date().toISOString().slice(0,10)+'"':""} />`;
 return `<div class="field ${type==="textarea"?"full":""}"><label for="${name}">${label}${required?" *":""}</label>${control}</div>`;
 }).join("");
 $("#record-dialog").dataset.kind=kind;$("#record-dialog").showModal();
}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.goto)));
$("#add-event").addEventListener("click",()=>openForm("events"));$("#add-event-top").addEventListener("click",()=>openForm("events"));
$("#add-client").addEventListener("click",()=>openForm("clients"));$("#add-venue").addEventListener("click",()=>openForm("venues"));$("#add-vendor").addEventListener("click",()=>openForm("vendors"));$("#add-feedback").addEventListener("click",()=>openForm("feedback"));
$("#close-dialog").addEventListener("click",()=>$("#record-dialog").close());$("#cancel-dialog").addEventListener("click",()=>$("#record-dialog").close());
$("#record-form").addEventListener("submit",e=>{e.preventDefault();const kind=$("#record-dialog").dataset.kind;const item=Object.fromEntries(new FormData(e.currentTarget).entries());data[kind].push(item);save();$("#record-dialog").close();e.currentTarget.reset();toast("Record saved successfully.");});
document.body.addEventListener("click",e=>{const btn=e.target.closest(".delete");if(!btn)return;const kind=btn.dataset.kind,index=Number(btn.dataset.index);if(confirm("Delete this record?")){data[kind].splice(index,1);save();toast("Record deleted.");}});
render();
