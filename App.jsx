import { useMemo, useState } from "react";
import {
  Activity, CalendarDays, Check, CheckCheck, ChevronDown, CircleHelp,
  Clock3, Filter, LayoutDashboard, ListTodo, LogOut, MoreHorizontal,
  Plus, Search, Settings, SlidersHorizontal, Sparkles, Target, Trash2,
  X, Zap
} from "lucide-react";

const initialTasks = [
  { id: 1, title: "Finish database assignment", description: "Complete normalization exercises and review the ER diagram.", category: "University", priority: "High", dueDate: todayOffset(0), completed: false },
  { id: 2, title: "Read 20 pages of a book", description: "Continue reading before going to bed.", category: "Personal", priority: "Low", dueDate: todayOffset(0), completed: false },
  { id: 3, title: "Prepare React project structure", description: "Set up components, routes, and reusable styles.", category: "Work", priority: "Medium", dueDate: todayOffset(1), completed: false },
  { id: 4, title: "Review Python notes", description: "Revise functions, dictionaries, and file handling.", category: "Learning", priority: "Medium", dueDate: todayOffset(-1), completed: true },
  { id: 5, title: "Plan weekly goals", description: "Choose three priorities for the upcoming week.", category: "Personal", priority: "Low", dueDate: todayOffset(2), completed: false },
];

function todayOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
const dateLabel = (value) => {
  if (!value) return "No date";
  const d = new Date(`${value}T00:00:00`);
  if (value === todayOffset(0)) return "Today";
  if (value === todayOffset(1)) return "Tomorrow";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("focusflow-tasks");
      return saved ? JSON.parse(saved) : initialTasks;
    } catch { return initialTasks; }
  });
  const [activeView, setActiveView] = useState("Today");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [menuTask, setMenuTask] = useState(null);
  const [form, setForm] = useState(emptyForm());

  function persist(next) {
    setTasks(next);
    localStorage.setItem("focusflow-tasks", JSON.stringify(next));
  }
  function emptyForm() {
    return { title: "", description: "", category: "Personal", priority: "Medium", dueDate: todayOffset(0) };
  }
  const today = todayOffset(0);
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;
  const completion = tasks.length ? Math.round(completed / tasks.length * 100) : 0;

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || task.category === categoryFilter;
      let matchesView = true;
      if (activeView === "Today") matchesView = task.dueDate === today;
      if (activeView === "Upcoming") matchesView = task.dueDate > today && !task.completed;
      if (activeView === "Completed") matchesView = task.completed;
      if (activeView === "All Tasks") matchesView = true;
      return matchesSearch && matchesCategory && matchesView;
    }).sort((a,b) => Number(a.completed)-Number(b.completed) || (a.dueDate || "").localeCompare(b.dueDate || ""));
  }, [tasks, activeView, search, categoryFilter, today]);

  function openNew() {
    setEditing(null); setForm(emptyForm()); setShowModal(true);
  }
  function openEdit(task) {
    setEditing(task.id);
    setForm({ title: task.title, description: task.description || "", category: task.category, priority: task.priority, dueDate: task.dueDate || "" });
    setShowModal(true); setMenuTask(null);
  }
  function saveTask(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) persist(tasks.map(t => t.id === editing ? { ...t, ...form, title: form.title.trim() } : t));
    else persist([{ id: Date.now(), ...form, title: form.title.trim(), completed: false }, ...tasks]);
    setShowModal(false); setEditing(null);
  }
  function toggleTask(id) { persist(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); }
  function deleteTask(id) { persist(tasks.filter(t => t.id !== id)); setMenuTask(null); }

  const navItems = [
    { label: "Today", icon: CalendarDays, count: tasks.filter(t => t.dueDate === today && !t.completed).length },
    { label: "Upcoming", icon: Clock3, count: tasks.filter(t => t.dueDate > today && !t.completed).length },
    { label: "All Tasks", icon: ListTodo },
    { label: "Completed", icon: CheckCheck, count: completed },
  ];
  const categories = ["All", "University", "Work", "Personal", "Learning"];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Zap size={19} fill="currentColor" /></div><span>FocusFlow</span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(({label, icon: Icon, count}) => (
            <button key={label} className={`nav-item ${activeView===label ? "active" : ""}`} onClick={() => setActiveView(label)}>
              <Icon size={18}/><span>{label}</span>{count > 0 && <small>{count}</small>}
            </button>
          ))}
        </nav>
        <div className="side-divider"/>
        <div className="workspace-label category-heading">CATEGORIES <button title="Filter categories" onClick={() => setCategoryFilter("All")}><Plus size={15}/></button></div>
        <div className="category-list">
          {categories.slice(1).map((c,i) => <button key={c} className={`category-item ${categoryFilter===c ? "selected" : ""}`} onClick={() => setCategoryFilter(categoryFilter===c ? "All" : c)}><i className={`dot dot-${i}`}/>{c}<span>{tasks.filter(t=>t.category===c).length}</span></button>)}
        </div>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17}/></div><strong>Make space for focus.</strong><p>Small steps, meaningful progress. Keep your goals moving.</p><div className="upgrade-progress"><span style={{width:`${completion}%`}}/></div><small>{completion}% of tasks completed</small></div>
          <button className="nav-item muted"><Settings size={18}/>Settings</button>
          <div className="profile"><div className="avatar">A</div><div><strong>My Workspace</strong><small>Personal account</small></div><MoreHorizontal size={18}/></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activeView}</strong></div>
          <div className="top-actions">
            <div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..." /><kbd>⌘ K</kbd></div>
            <button className="icon-button" title="Help"><CircleHelp size={19}/></button>
            <div className="avatar small-avatar">A</div>
          </div>
        </header>

        <div className="content-wrap">
          <section className="welcome-row">
            <div><div className="eyebrow"><span className="live-dot"/> YOUR PRODUCTIVITY SPACE</div><h1>{activeView === "Today" ? "Good evening." : activeView + "."}</h1><p className="subheading">{activeView === "Today" ? "A little progress each day adds up to big results." : "Keep your priorities clear and your momentum going."}</p></div>
            <button className="primary-button" onClick={openNew}><Plus size={18}/> Add new task</button>
          </section>

          <section className="stats-grid">
            <StatCard icon={<Target size={18}/>} label="Total tasks" value={tasks.length} note="Across all categories" tone="purple"/>
            <StatCard icon={<Activity size={18}/>} label="In progress" value={pending} note="Tasks to keep moving" tone="blue"/>
            <StatCard icon={<CheckCheck size={18}/>} label="Completed" value={completed} note={`${completion}% completion rate`} tone="green"/>
            <StatCard icon={<Clock3 size={18}/>} label="Overdue" value={overdue} note={overdue ? "Needs your attention" : "You're all caught up"} tone="orange"/>
          </section>

          <section className="task-panel">
            <div className="panel-header">
              <div><h2>{activeView} tasks <span className="task-count">{filteredTasks.length}</span></h2><p>Organize your work and make today count.</p></div>
              <div className="panel-controls"><div className="filter-control"><Filter size={15}/><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><ChevronDown size={14}/></div><button className="icon-button filter-icon" onClick={()=>{setSearch("");setCategoryFilter("All")}} title="Clear filters"><SlidersHorizontal size={17}/></button></div>
            </div>
            <div className="task-list">
              {filteredTasks.length === 0 ? <div className="empty-state"><div className="empty-icon"><Check size={24}/></div><strong>Nothing on your list</strong><p>{search ? "Try a different search term." : "Enjoy the breathing room or add a new task."}</p><button className="text-button" onClick={openNew}><Plus size={15}/> Create a task</button></div> :
                filteredTasks.map(task => <div className={`task-row ${task.completed ? "is-complete" : ""}`} key={task.id}>
                  <button className={`check-circle ${task.completed ? "checked" : ""}`} onClick={()=>toggleTask(task.id)} aria-label={task.completed ? "Mark incomplete" : "Mark complete"}>{task.completed && <Check size={13}/>}</button>
                  <div className="task-main"><div className="task-title-line"><strong>{task.title}</strong>{task.dueDate < today && !task.completed && <span className="overdue-label">Overdue</span>}</div>{task.description && <p>{task.description}</p>}<div className="task-meta"><span className={`category-pill ${task.category.toLowerCase()}`}>{task.category}</span><span className={`priority ${task.priority.toLowerCase()}`}><i/> {task.priority} priority</span><span className="due-date"><CalendarDays size={13}/>{dateLabel(task.dueDate)}</span></div></div>
                  <div className="task-menu-wrap"><button className="icon-button task-more" onClick={()=>setMenuTask(menuTask===task.id?null:task.id)}><MoreHorizontal size={18}/></button>{menuTask===task.id && <div className="dropdown-menu"><button onClick={()=>openEdit(task)}>Edit task</button><button className="delete-option" onClick={()=>deleteTask(task.id)}><Trash2 size={14}/> Delete task</button></div>}</div>
                </div>)
              }
            </div>
            <div className="panel-footer"><span>Showing {filteredTasks.length} of {tasks.length} tasks</span><button onClick={()=>setActiveView("All Tasks")}>View all tasks <span>→</span></button></div>
          </section>
          <footer className="page-footer">Made for meaningful progress <span>✦</span></footer>
        </div>
      </main>

      {showModal && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowModal(false)}}><form className="task-modal" onSubmit={saveTask}>
        <div className="modal-heading"><div><span className="eyebrow">TASK DETAILS</span><h2>{editing ? "Edit task" : "Create a new task"}</h2></div><button type="button" className="icon-button" onClick={()=>setShowModal(false)}><X size={19}/></button></div>
        <label>Task title <input autoFocus required maxLength="100" placeholder="What needs to get done?" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
        <label>Description <textarea rows="3" placeholder="Add some details (optional)" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
        <div className="form-grid"><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><label>Priority<select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></label></div>
        <label>Due date <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></label>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={17}/>{editing ? "Save changes" : "Create task"}</button></div>
      </form></div>}
    </div>
  );
}

function StatCard({icon,label,value,note,tone}) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>;
}