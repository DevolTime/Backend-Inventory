export const calculateAttendance = (history, todayRecord = null) => {
    let totalHours = 0;
    let lateHours = 0;
    let dailyHours = 0;

    history.forEach(h => {
        // Procesar matemáticamente solo los días con jornadas de trabajo cerradas (Entrada y Salida final presentes)
        if (h.entry_time && h.exit_time) {
            const entry = new Date(h.entry_time);
            const exit = new Date(h.exit_time);

            // Calcular bloque bruto total transcurrido (en ms)
            const totalShiftMs = exit - entry;

            // Calcular bloque consumido en el almuerzo (si existen ambos marcajes)
            const lunchOut = h.lunch_out_time ? new Date(h.lunch_out_time) : null;
            const lunchIn = h.lunch_in_time ? new Date(h.lunch_in_time) : null;
            const lunchMs = (lunchIn && lunchOut) ? (lunchIn - lunchOut) : 0;

            // Tiempo neto efectivo real trabajado
            const effectiveWorkMs = totalShiftMs - lunchMs;
            const computedHours = effectiveWorkMs > 0 ? effectiveWorkMs / (1000 * 60 * 60) : 0;

            totalHours += computedHours;

            // Identificar si estamos parados sobre el registro de hoy para aislar sus horas diarias individuales
            if (todayRecord && h._id && todayRecord._id && h._id.toString() === todayRecord._id.toString()) {
                dailyHours = parseFloat(computedHours.toFixed(2));
            } else if (todayRecord && h.date && todayRecord.date && new Date(h.date).getTime() === new Date(todayRecord.date).getTime()) {
                dailyHours = parseFloat(computedHours.toFixed(2));
            }
        }

        // Sumar retardos diarios en el total histórico acumulado (convirtiendo minutos a horas)
        if (h.daily_late_minutes) {
            lateHours += h.daily_late_minutes / 60;
        }
    });

    return {
        totalHours: parseFloat(totalHours.toFixed(2)),
        lateHours: parseFloat(lateHours.toFixed(2)),
        dailyHours: dailyHours
    };
};
