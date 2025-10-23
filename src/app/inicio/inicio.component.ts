import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registrar locale para español
registerLocaleData(localeEs);

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvent: boolean;
}

interface Event {
    date: Date;
    title: string;
    description: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  currentMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];
  // Corregido para que empiece en Lunes
  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  allEvents: Event[] = [];
  weekEvents: Event[] = [];

  ngOnInit(): void {
    this.loadMockEvents();
    this.generateCalendar();
    this.updateWeekEvents();
  }

  loadMockEvents(): void {
    const today = new Date();
    this.allEvents = [
      {
        date: new Date(today.getFullYear(), today.getMonth(), 24, 10, 0),
        title: 'Reunión de equipo',
        description: 'Revisión semanal de proyectos'
      },
      {
        date: new Date(today.getFullYear(), today.getMonth(), 25, 13, 0),
        title: 'Almuerzo con cliente',
        description: 'Presentación de nuevas propuestas'
      },
      {
        date: new Date(today.getFullYear(), today.getMonth(), 26, 18, 0),
        title: 'Gimnasio',
        description: 'Entrenamiento personal'
      }
    ];
  }

  get currentYear(): number {
    return this.currentMonth.getFullYear();
  }

  generateCalendar(): void {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth.getMonth(), 1);
    const lastDay = new Date(this.currentYear, this.currentMonth.getMonth() + 1, 0);

    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    // Días del mes anterior
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth.getMonth(), 0).getDate();
    for (let i = firstDayOfWeek; i > 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth.getMonth() - 1, prevMonthLastDay - i + 1);
      this.calendarDays.push({ date, isCurrentMonth: false, isToday: false, hasEvent: false });
    }

    // Días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(this.currentYear, this.currentMonth.getMonth(), i);
      const isToday = date.toDateString() === new Date().toDateString();
      const hasEvent = this.allEvents.some(e => e.date.toDateString() === date.toDateString());
      this.calendarDays.push({ date, isCurrentMonth: true, isToday, hasEvent });
    }

    // Días del mes siguiente
    const lastDayOfWeek = lastDay.getDay() === 0 ? 6 : lastDay.getDay() - 1;
    const nextDays = 6 - lastDayOfWeek;
    for (let i = 1; i <= nextDays; i++) {
        const date = new Date(this.currentYear, this.currentMonth.getMonth() + 1, i);
        this.calendarDays.push({ date, isCurrentMonth: false, isToday: false, hasEvent: false });
    }
  }

  updateWeekEvents(): void {
    const today = new Date();
    const weekStart = new Date(today);
    // Ajustar al inicio de la semana (Lunes)
    const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
    weekStart.setDate(today.getDate() - dayOfWeek);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    this.weekEvents = this.allEvents
      .filter(event => event.date >= weekStart && event.date <= weekEnd)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  changeMonth(direction: number): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
    this.currentMonth = new Date(this.currentMonth);
    this.generateCalendar();
  }

  goToToday(): void {
    this.currentMonth = new Date();
    this.generateCalendar();
  }

  selectDay(day: CalendarDay): void {
    // Lógica futura para mostrar eventos del día seleccionado
    console.log(`Día seleccionado: ${day.date.toDateString()}`);
  }
}
