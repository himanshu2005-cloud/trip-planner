/**
 * calendarExport.js
 * Generates and downloads RFC 5545 compliant iCalendar (.ics) files,
 * enabling 1-click import into Google Calendar, Apple Calendar, and Outlook.
 */

// Formats a Date object to YYYYMMDDTHHmmSSZ
const formatToIcsDate = (date) => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export const generateIcsContent = ({
  destination = 'India',
  days = [],
  startDate = new Date(),
}) => {
  const events = [];

  days.forEach((day, dayIndex) => {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + dayIndex);

    (day.stops || []).forEach((stop, stopIndex) => {
      // Parse stop.startTime e.g. "09:30"
      const [hoursStr, minutesStr] = (stop.startTime || '09:00').split(':');
      const hours = parseInt(hoursStr || '9', 10);
      const minutes = parseInt(minutesStr || '0', 10);

      const eventStart = new Date(dayDate);
      eventStart.setHours(hours, minutes, 0, 0);

      const durationMinutes = stop.duration || 60;
      const eventEnd = new Date(eventStart.getTime() + durationMinutes * 60 * 1000);

      const cleanSummary = (stop.name || 'Waypoint').replace(/[,;]/g, ' ');
      const cleanLocation = `${stop.name}, ${destination}`.replace(/[,;]/g, ' ');
      const cleanDescription = (stop.description || `Stop ${stopIndex + 1} on Day ${day.dayNumber}`)
        .replace(/\n/g, '\\n')
        .replace(/[,;]/g, ' ');

      const eventStr = [
        'BEGIN:VEVENT',
        `UID:trippilot-${day.dayNumber}-${stopIndex}-${Date.now()}@trippilot.in`,
        `DTSTAMP:${formatToIcsDate(new Date())}`,
        `DTSTART:${formatToIcsDate(eventStart)}`,
        `DTEND:${formatToIcsDate(eventEnd)}`,
        `SUMMARY:${cleanSummary} · TripPilot`,
        `DESCRIPTION:${cleanDescription} (Est. Cost: ₹${stop.cost || 0})`,
        `LOCATION:${cleanLocation}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
      ].join('\r\n');

      events.push(eventStr);
    });
  });

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TripPilot//India Itinerary Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Trip to ${destination} · TripPilot`,
    'X-WR-TIMEZONE:Asia/Kolkata',
    ...events,
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
};

/**
 * Initiates download of the .ics calendar file
 */
export const downloadIcsCalendar = ({
  destination = 'Trip',
  days = [],
}) => {
  const content = generateIcsContent({ destination, days });
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const cleanFilename = `${destination.split(',')[0].trim().toLowerCase()}-itinerary.ics`;
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', cleanFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
