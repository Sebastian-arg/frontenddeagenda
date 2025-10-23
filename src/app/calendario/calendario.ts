import { Component, effect, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { EventService } from './event.service';
import { CalendarEvent } from './event.model';

type ViewMode = 'month' | 'week';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css']
})
export class CalendarioComponent implements OnInit {
  view = signal<ViewMode>('month');
  current = signal<Date>(this.stripTime(new Date()));
  modalOpen = signal(false);
  editing = signal(false);
  private editingId: string | null = null;

  form: CalendarEvent = { id:'', title:'', date: this.toISODate(new Date()), start:'', end:'', color:'#3b82f6', description:'' };

  weekDayNames = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  hours = Array.from({length: 24}, (_,i) => (i+'').padStart(2,'0') + ':00');

  constructor(
    private events: EventService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.events.listRange('0000-01-01','9999-12-31').length === 0) {
        const todayISO = this.toISODate(new Date());
        this.events.create({ id: this.generateId(), title: 'Ejemplo', date: todayISO, start:'09:00', end:'10:00', color:'#3b82f6', description:'Evento de ejemplo' });
      }
    }
  }

  setView(v: ViewMode){ this.view.set(v); }
  today(){ this.current.set(this.stripTime(new Date())); }
  prev(){ const d = new Date(this.current()); this.view()==='month'? d.setMonth(d.getMonth()-1): d.setDate(d.getDate()-7); this.current.set(this.stripTime(d)); }
  next(){ const d = new Date(this.current()); this.view()==='month'? d.setMonth(d.getMonth()+1): d.setDate(d.getDate()+7); this.current.set(this.stripTime(d)); }

  headerLabel(){
    const d = this.current();
    const intl = new Intl.DateTimeFormat('es-AR', { month:'long', year:'numeric' });
    if (this.view() === 'month') return intl.format(d);
    const [start, end] = this.weekRange(d);
    const fmt = new Intl.DateTimeFormat('es-AR', { day:'2-digit', month:'short' });
    return `Semana ${fmt.format(start)} – ${fmt.format(end)}`;
  }

  monthCells(){
    const base = this.current(), y = base.getFullYear(), m = base.getMonth();
    const first = new Date(y, m, 1), last = new Date(y, m+1, 0);
    const start = this.startOfWeek(first), end = this.endOfWeek(last);
    const cells: { date: Date; dateISO: string; day: number; inCurrent: boolean; isToday: boolean }[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      const inCurrent = cur.getMonth() === m;
      const isToday = this.toISODate(cur) === this.toISODate(new Date());
      cells.push({ date: new Date(cur), dateISO: this.toISODate(cur), day: cur.getDate(), inCurrent, isToday });
      cur.setDate(cur.getDate()+1);
    }
    return cells;
  }
  eventsByDay(dateISO: string){ return this.events.listByDate(dateISO); }

  weekRange(d: Date){ const s = this.startOfWeek(d); const e = this.endOfWeek(d); return [s,e] as const; }
  weekDays(){
    const [start] = this.weekRange(this.current());
    const days = [];
    for (let i=0;i<7;i++){
      const day = new Date(start); day.setDate(start.getDate()+i);
      days.push({ date: day, dateISO: this.toISODate(day),
        label: new Intl.DateTimeFormat('es-AR', { weekday:'short', day:'2-digit', month:'short' }).format(day),
        isToday: this.toISODate(day) === this.toISODate(new Date())
      });
    }
    return days;
  }

  blockTop(ev: CalendarEvent){ const s = this.toMinutes(ev.start || '00:00'); return (s/1440)*100; }
  blockHeight(ev: CalendarEvent){
    const s = this.toMinutes(ev.start || '00:00');
    const e = this.toMinutes(ev.end || ev.start || '00:00') || s+30;
    const dur = Math.max(30, e - s);
    return (dur/1440)*100;
  }
  timeLabel(ev: CalendarEvent){ if (ev.start && ev.end) return `${ev.start}–${ev.end}`; if (ev.start) return ev.start; return ''; }

  openCreate(dateISO: string, startTime?: string){
    this.editing.set(false); this.editingId = null;
    this.form = { id: '', title:'', date: dateISO, start: startTime || '', end:'', color:'#3b82f6', description:'' };
    this.modalOpen.set(true);
  }
  openEdit(ev: CalendarEvent){ this.editing.set(true); this.editingId = ev.id; this.form = { ...ev }; this.modalOpen.set(true); }

  saveModal(){
    if (!this.form.title?.trim() || !this.form.date) return;
    if (this.editing() && this.editingId){
      this.events.update(this.editingId, { title:this.form.title, date:this.form.date, start:this.form.start, end:this.form.end, color:this.form.color, description:this.form.description });
    } else {
      this.events.create({ ...this.form, id: this.generateId() });
    }
    this.closeModal();
  }
  remove(){ if (this.editingId) this.events.remove(this.editingId); this.closeModal(); }
  closeModal(){ this.modalOpen.set(false); }

  startOfWeek(d: Date){ const x = this.stripTime(d); const day = (x.getDay()+6)%7; x.setDate(x.getDate()-day); return x; }
  endOfWeek(d: Date){ const s = this.startOfWeek(d); const e = new Date(s); e.setDate(s.getDate()+6); return e; }
  stripTime(d: Date){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  toISODate(d: Date){ return d.toISOString().slice(0,10); }
  toMinutes(hm: string){ const [h,m] = hm.split(':').map(n => parseInt(n||'0',10)); return h*60 + (m||0); }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
