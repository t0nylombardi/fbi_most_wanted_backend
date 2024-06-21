export function isDatabaseOutdated(updatedAt) {
    if (!updatedAt)
        return false;
    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return now.getTime() - new Date(updatedAt).getTime() > oneDayInMs;
}
//# sourceMappingURL=dateUtils.js.map