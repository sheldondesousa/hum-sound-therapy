import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useUserMetrics = (userId) => {
  const [metrics, setMetrics] = useState({
    activeDays: 0,
    exercisesComplete: 0,
    averageTime: 0,
    weeklyProgress: 0,
    loading: true
  });

  useEffect(() => {
    if (!userId) {
      setMetrics({ activeDays: 0, exercisesComplete: 0, averageTime: 0, weeklyProgress: 0, loading: false });
      return;
    }

    let isMounted = true;

    const fetchMetrics = async () => {
      try {
        if (!isMounted) return;
        // Query all events for this user
        const eventsRef = collection(db, 'analytics_events');
        const q = query(eventsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const events = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          events.push({
            ...data,
            timestamp: data.timestamp?.toDate() || new Date()
          });
        });

        console.log('📊 Fetched events:', events.length);
        console.log('📊 Sample events:', events.slice(0, 5));

        // Debug: Show all unique event types and actions
        const eventTypes = new Set();
        const eventActions = new Set();
        events.forEach(e => {
          eventTypes.add(e.eventType);
          if (e.action) eventActions.add(`${e.eventType}:${e.action}`);
        });
        console.log('📋 Event types found:', Array.from(eventTypes));
        console.log('📋 Event actions found:', Array.from(eventActions));

        // Calculate Active Days (successful logins THIS MONTH only)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const loginEvents = events.filter(e => e.eventType === 'auth' && e.action === 'login');
        console.log('🔐 Login events:', loginEvents.length, loginEvents);

        const uniqueLoginDays = new Set();
        loginEvents.forEach(event => {
          const eventDate = event.timestamp;
          // Only count logins from current month
          if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
            const dateStr = eventDate.toISOString().split('T')[0];
            uniqueLoginDays.add(dateStr);
            console.log('📅 Login date:', dateStr);
          }
        });
        const activeDays = uniqueLoginDays.size;
        console.log('✅ Active Days:', activeDays);

        // Calculate Exercises Complete
        const completeEvents = events.filter(
          e => e.eventType === 'breathing_exercise' && e.action === 'complete'
        );
        console.log('🏃 Complete events:', completeEvents.length, completeEvents);
        const exercisesComplete = completeEvents.length;

        // Calculate Average Time per day (in minutes)
        // Group events by day and calculate time spent each day
        const eventsByDay = {};
        events.forEach(event => {
          const dateStr = event.timestamp.toISOString().split('T')[0];
          if (!eventsByDay[dateStr]) {
            eventsByDay[dateStr] = [];
          }
          eventsByDay[dateStr].push(event);
        });

        let totalMinutes = 0;
        let daysWithActivity = 0;

        Object.values(eventsByDay).forEach(dayEvents => {
          if (dayEvents.length > 0) {
            daysWithActivity++;
            // Find session start and end times
            const sessionStarts = dayEvents.filter(e => e.eventType === 'session' && e.action === 'start');
            const sessionEnds = dayEvents.filter(e => e.eventType === 'session' && e.action === 'end');

            // Simple calculation: if we have both start and end, calculate difference
            if (sessionStarts.length > 0 && sessionEnds.length > 0) {
              const firstStart = Math.min(...sessionStarts.map(e => e.timestamp.getTime()));
              const lastEnd = Math.max(...sessionEnds.map(e => e.timestamp.getTime()));
              const minutesSpent = (lastEnd - firstStart) / (1000 * 60);
              totalMinutes += minutesSpent;
            } else if (sessionStarts.length > 0) {
              // If no end, estimate based on completed exercises (assume 5 min per exercise)
              const completedInDay = dayEvents.filter(
                e => e.eventType === 'breathing_exercise' && e.action === 'complete'
              );
              totalMinutes += completedInDay.length * 5;
            }
          }
        });

        const averageTime = daysWithActivity > 0 ? Math.round(totalMinutes / daysWithActivity) : 0;

        // Calculate Weekly Progress (days active this week)
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Get to Monday
        const monday = new Date(now);
        monday.setDate(now.getDate() + mondayOffset);
        monday.setHours(0, 0, 0, 0);

        const thisWeekEvents = events.filter(e => e.timestamp >= monday);
        const uniqueWeekDays = new Set();
        thisWeekEvents.forEach(event => {
          const dateStr = event.timestamp.toISOString().split('T')[0];
          uniqueWeekDays.add(dateStr);
        });
        const weeklyProgress = uniqueWeekDays.size;

        if (isMounted) {
          setMetrics({
            activeDays,
            exercisesComplete,
            averageTime,
            weeklyProgress,
            loading: false
          });
        }
      } catch (error) {
        console.error('❌ Error fetching metrics:', error);
        if (isMounted) {
          setMetrics({ activeDays: 0, exercisesComplete: 0, averageTime: 0, weeklyProgress: 0, loading: false });
        }
      }
    };

    fetchMetrics();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return metrics;
};
