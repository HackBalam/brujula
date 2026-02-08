"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import type {
  Application,
  ApplicationInsert,
  ApplicationUpdate,
  ApplicationStatus,
  ApplicationTimeline
} from '../types/database';

// Cliente de Supabase sin tipos genéricos estrictos para evitar problemas de inferencia
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UseApplicationsOptions {
  walletAddress: string | null;
}

interface ApplicationStats {
  total: number;
  pendientes: number;
  enRevision: number;
  entrevistas: number;
  aceptadas: number;
  rechazadas: number;
  tasaRespuesta: number;
  thisMonth: number;
  lastMonth: number;
}

export function useApplications({ walletAddress }: UseApplicationsOptions) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all applications for the wallet
  const fetchApplications = useCallback(async () => {
    if (!walletAddress) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('application_date', { ascending: false });

      if (fetchError) throw fetchError;
      setApplications((data as Application[]) || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Error al cargar las postulaciones');
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  // Load applications when wallet changes
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Create a new application
  const createApplication = async (data: Omit<ApplicationInsert, 'wallet_address'>) => {
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    const { data: newApp, error: insertError } = await supabase
      .from('applications')
      .insert({
        ...data,
        wallet_address: walletAddress,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Refresh the list
    await fetchApplications();
    return newApp as Application;
  };

  // Update an application
  const updateApplication = async (id: string, data: ApplicationUpdate) => {
    const { data: updatedApp, error: updateError } = await supabase
      .from('applications')
      .update(data)
      .eq('id', id)
      .eq('wallet_address', walletAddress || '')
      .select()
      .single();

    if (updateError) throw updateError;

    // Refresh the list
    await fetchApplications();
    return updatedApp as Application;
  };

  // Update only the status (quick update)
  const updateStatus = async (id: string, status: ApplicationStatus, notes?: string) => {
    const { data: updatedApp, error: updateError } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .eq('wallet_address', walletAddress || '')
      .select()
      .single();

    if (updateError) throw updateError;

    // Optionally add notes to timeline
    if (notes) {
      await supabase
        .from('application_timeline')
        .insert({
          application_id: id,
          old_status: applications.find(a => a.id === id)?.status || null,
          new_status: status,
          notes,
        });
    }

    // Refresh the list
    await fetchApplications();
    return updatedApp as Application;
  };

  // Delete an application
  const deleteApplication = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('wallet_address', walletAddress || '');

    if (deleteError) throw deleteError;

    // Refresh the list
    await fetchApplications();
  };

  // Get timeline for an application
  const getTimeline = async (applicationId: string): Promise<ApplicationTimeline[]> => {
    const { data, error: timelineError } = await supabase
      .from('application_timeline')
      .select('*')
      .eq('application_id', applicationId)
      .order('changed_at', { ascending: false });

    if (timelineError) throw timelineError;
    return (data as ApplicationTimeline[]) || [];
  };

  // Calculate statistics
  const getStats = useCallback((): ApplicationStats => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const thisMonthCount = applications.filter(app => {
      const date = new Date(app.application_date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;

    const lastMonthCount = applications.filter(app => {
      const date = new Date(app.application_date);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    }).length;

    const total = applications.length;
    const pendientes = applications.filter(a => a.status === 'pendiente').length;
    const enRevision = applications.filter(a => a.status === 'en_revision').length;
    const entrevistas = applications.filter(a => a.status === 'entrevista_programada').length;
    const aceptadas = applications.filter(a => a.status === 'aceptada').length;
    const rechazadas = applications.filter(a => a.status === 'rechazada').length;

    // Tasa de respuesta = (Entrevistas + Aceptadas + Te contestaron) / Total
    const responded = applications.filter(a =>
      ['entrevista_programada', 'aceptada', 'te_contestaron', 'rechazada'].includes(a.status)
    ).length;
    const tasaRespuesta = total > 0 ? (responded / total) * 100 : 0;

    return {
      total,
      pendientes,
      enRevision,
      entrevistas,
      aceptadas,
      rechazadas,
      tasaRespuesta,
      thisMonth: thisMonthCount,
      lastMonth: lastMonthCount,
    };
  }, [applications]);

  // Get unique company names for autocomplete
  const getCompanyNames = useCallback(() => {
    const companies = new Set(applications.map(a => a.company_name));
    return Array.from(companies).sort();
  }, [applications]);

  // Get applications by status
  const getByStatus = useCallback((status: ApplicationStatus) => {
    return applications.filter(a => a.status === status);
  }, [applications]);

  // Get platform statistics
  const getPlatformStats = useCallback(() => {
    const platformCounts: Record<string, number> = {};
    const platformEntrevistas: Record<string, number> = {};

    applications.forEach(app => {
      const platform = app.platform;
      platformCounts[platform] = (platformCounts[platform] || 0) + 1;

      if (app.status === 'entrevista_programada' || app.status === 'aceptada') {
        platformEntrevistas[platform] = (platformEntrevistas[platform] || 0) + 1;
      }
    });

    return Object.entries(platformCounts).map(([platform, count]) => ({
      platform,
      count,
      entrevistas: platformEntrevistas[platform] || 0,
      efectividad: count > 0 ? ((platformEntrevistas[platform] || 0) / count) * 100 : 0,
    })).sort((a, b) => b.count - a.count);
  }, [applications]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
    getTimeline,
    getStats,
    getCompanyNames,
    getByStatus,
    getPlatformStats,
  };
}
