const defaultValues = {
	precision: 0,
	recall: 0,
	f1: 0,
};

export const majorMetrics = (relevantStrings: string[], retrievedStrings: string[]) => {
	if (relevantStrings.length === 0 || retrievedStrings.length === 0) {
		return defaultValues;
	}

	const relevantSet = new Set(relevantStrings);
	const uniqueRelevant = Array.from(relevantSet);

	const retrievedSet = new Set(retrievedStrings);
	const uniqueRetrieved = Array.from(retrievedSet);

	const intersection = uniqueRelevant.filter(x => retrievedSet.has(x));

	if (!intersection || intersection.length === 0) {
		return defaultValues;
	}

	const precision = intersection.length / uniqueRetrieved.length;
	const recall = intersection.length / uniqueRelevant.length;
	const f1 = 2 * (precision * recall) / (precision + recall);

	return {
    precision,
    recall,
    f1,
	};
};