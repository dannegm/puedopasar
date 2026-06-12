export const getClosureStatus = dates => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const entry = dates.find(d => d.date === todayStr);
    if (!entry) return { active: false, upcomingAt: null };

    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const [h, m] = entry.partialClosure.split(':').map(Number);
    const partialMins = h * 60 + m;

    if (entry.prevDay || nowMins >= partialMins) {
        return { active: true, upcomingAt: null };
    }
    return { active: false, upcomingAt: entry.partialClosure };
};
