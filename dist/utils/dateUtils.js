export function isDatabaseOutdated(updatedAt) {
    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return now.getTime() - updatedAt.getTime() > oneDayInMs;
}
//# sourceMappingURL=dateUtils.js.map