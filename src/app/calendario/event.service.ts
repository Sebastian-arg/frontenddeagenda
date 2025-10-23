import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CalendarEvent } from './event.model';

const KEY = 'calendar_events_v1';

@Injectable({ providedIn: 'root' })
export class EventService {
  private cache: CalendarEvent[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.cache = this.load();
    }
  }

  private load(): CalendarEvent[] {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }
  private save(){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(KEY, JSON.stringify(this.cache));
    }
  }

  listByDate(dateISO: string){
    return this.cache
      .filter(e => e.date === dateISO)
      .sort((a,b) => (a.start||'') < (b.start||'') ? -1 : 1);
  }
  listRange(fromISO: string, toISO: string){
    return this.cache
      .filter(e => e.date >= fromISO && e.date <= toISO)
      .sort((a,b) => a.date === b.date
        ? ((a.start||'') < (b.start||'') ? -1 : 1)
        : (a.date < b.date ? -1 : 1));
  }
  get(id: string){ return this.cache.find(e => e.id === id); }
  create(ev: CalendarEvent){ this.cache.push(ev); this.save(); }
  update(id: string, patch: Partial<CalendarEvent>){
    const i = this.cache.findIndex(e => e.id === id);
    if (i >= 0){ this.cache[i] = { ...this.cache[i], ...patch }; this.save(); }
  }
  remove(id: string){ this.cache = this.cache.filter(e => e.id !== id); this.save(); }
}
