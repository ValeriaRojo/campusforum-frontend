import { Injectable } from '@angular/core';

export type ReportTargetType = 'POST' | 'COMENTARIO';
export type ReportStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ARCHIVADO';

export interface ReporteForm {
  tipo: ReportTargetType;
  referenciaId: number;
  postId: number;
  motivo: string;
  descripcion: string;
  estado: ReportStatus;
}

export interface ReporteErrors {
  tipo?: string;
  referenciaId?: string;
  postId?: string;
  motivo?: string;
  descripcion?: string;
  estado?: string;
}

export interface ReportItem extends ReporteForm {
  id: number;
  fecha: string;
  reportadoPor: string;
  resueltoPor?: string;
  fechaResolucion?: string;
  notaModeracion?: string;
}

const REPORTS_STORAGE_KEY = 'campusforum_reports_front';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private reports: ReportItem[] = this.loadFromStorage();

  public esquemaReporte(): ReporteForm {
    return {
      tipo: 'POST',
      referenciaId: 0,
      postId: 0,
      motivo: '',
      descripcion: '',
      estado: 'PENDIENTE',
    };
  }

  public validarReporte(reporte: ReporteForm): ReporteErrors {
    const errors: ReporteErrors = {};

    if (reporte.tipo !== 'POST' && reporte.tipo !== 'COMENTARIO') {
      errors.tipo = 'Tipo de reporte inválido.';
    }

    if (!reporte.referenciaId || reporte.referenciaId <= 0) {
      errors.referenciaId = 'Referencia inválida.';
    }

    if (reporte.tipo === 'COMENTARIO' && (!reporte.postId || reporte.postId <= 0)) {
      errors.postId = 'El comentario debe pertenecer a una publicación.';
    }

    if (!reporte.motivo?.trim()) {
      errors.motivo = 'Debes seleccionar un motivo.';
    }

    if (reporte.descripcion?.trim().length > 500) {
      errors.descripcion = 'La descripción no puede exceder 500 caracteres.';
    }

    return errors;
  }

  public createReport(
    reporte: ReporteForm,
    reportadoPor: string = 'Usuario'
  ): { ok: boolean; errors?: ReporteErrors; reportId?: number } {
    const errors = this.validarReporte(reporte);

    if (Object.keys(errors).length > 0) {
      return { ok: false, errors };
    }

    const item: ReportItem = {
      ...reporte,
      id: this.generateId(),
      motivo: reporte.motivo.trim(),
      descripcion: reporte.descripcion.trim(),
      estado: 'PENDIENTE',
      fecha: this.getCurrentDate(),
      reportadoPor: reportadoPor.trim() || 'Usuario',
    };

    this.reports.unshift(item);
    this.saveToStorage();

    return {
      ok: true,
      reportId: item.id,
    };
  }

  public getAllReports(): ReportItem[] {
    return [...this.reports];
  }

  public getReportById(id: number): ReportItem | null {
    const found = this.reports.find((item) => item.id === id);
    return found ? { ...found } : null;
  }

  public resolveReport(
    reportId: number,
    status: ReportStatus,
    resolvedBy: string,
    note: string = ''
  ): boolean {
    const index = this.reports.findIndex((item) => item.id === reportId);

    if (index === -1) {
      return false;
    }

    this.reports[index] = {
      ...this.reports[index],
      estado: status,
      resueltoPor: resolvedBy || 'Moderador',
      fechaResolucion: this.getCurrentDate(),
      notaModeracion: note.trim(),
    };

    this.saveToStorage();
    return true;
  }

  public deleteReport(reportId: number): boolean {
    const before = this.reports.length;
    this.reports = this.reports.filter((item) => item.id !== reportId);
    this.saveToStorage();
    return this.reports.length < before;
  }

  public getPendingReportsCount(): number {
    return this.reports.filter((report) => report.estado === 'PENDIENTE').length;
  }

  private generateId(): number {
    return this.reports.length > 0
      ? Math.max(...this.reports.map((item) => item.id)) + 1
      : 1;
  }

  private getCurrentDate(): string {
    return new Date().toLocaleDateString('es-MX');
  }

  private loadFromStorage(): ReportItem[] {
    const stored = localStorage.getItem(REPORTS_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(this.reports));
  }
}
