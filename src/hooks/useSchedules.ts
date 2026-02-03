import { useState, useEffect, useCallback } from "react";
import { schedulesApi, type ClassSchedule } from "@/api";

export function useSchedules() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await schedulesApi.getAll();
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch schedules");
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const getStudentSchedule = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await schedulesApi.getStudentSchedule(id);
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch student schedule");
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    schedules,
    isLoading,
    error,
    refetch: fetchSchedules,
    getStudentSchedule,
  };
}