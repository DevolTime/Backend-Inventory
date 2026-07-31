export const calculateAttendance = (history) => {

    let totalHours = 0;
    let lateHours = 0;

    history.forEach(h => {

        if (h.entry_time && h.exit_time) {

            const entry = new Date(h.entry_time);
            const exit = new Date(h.exit_time);

            totalHours += (exit - entry) / (1000 * 60 * 60);

            if (h.late_time) {
                const [hours, minutes] = h.late_time.split(":").map(Number);
                lateHours += (hours || 0) + ((minutes || 0) / 60);
            }
        }

    });

    return {
        totalHours,
        lateHours
    };
};