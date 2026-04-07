import axios from 'axios';
import { AnalysisResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function uploadAndAnalyze(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<AnalysisResponse>(`${API_BASE}/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
}

export function getTemplateUrl(): string {
  return `${API_BASE}/template`;
}
