import {
	Quantum,
	User,
	Query,
	formatQueryParamShort,
	formatQueryParamsComplete,
	ProcessedError,
	dateFormat,
} from "./api";

export interface BulkParamsV2 {
	searchQuery: Query;
	operationalQueries: Query[];
	users: User[];
}

export interface BulkParamsV3 {
	type: string;
	searchQuery: Query;
	operationalQueries: Query[];
	users: User[];
}

export function bulkMessage(
	results: BulkParamsV3[],
	operation: string
): string {
	let res: string = "I'm error";
	let operationQueryDetails: string = "";
	let userList: string = "";
	let result: BulkMessageResult[] = [];
	const q: Quantum = getQuantum(results.length);
	if (results.length == 0) {
		return "";
	}
	results.forEach((bulkParam: BulkParamsV3) => {
		if (bulkParam.users.length == 0) {
		}
		bulkParam.users.forEach((user: User) => {
			bulkParam.operationalQueries.forEach((query: Query) => {
				// Process Queries here...
			});
			if (bulkParam.operationalQueries.length == 0) {
				switch (bulkParam.type) {
					case "success":
						userList += `\tID ${user.id} ${user.firstName} ${user.lastName}.\n`;
						result.push({ type: bulkParam.type, userList: userList });
						break;
					default:
						break;
				}
			}
		});
	});
	const successCases: BulkMessageResult[] = result.filter(
		(item: BulkMessageResult) => item.type == "success"
	);
	if (successCases.length > 0) {
		res =
			`Successfully ${operation}d ${successCases.length} ${q.pronoun}:\n` +
			`The following ${q.pronoun} ${q.verb} ${operation}d:\n` +
			`${successCases.reduce((acc: string, item: BulkMessageResult) => {
				return acc + item.userList;
			}, "")}`;
	}
	return res;
}

interface BulkMessageResult {
	type: string;
	userList: string;
}

export function successHeading(
	successCases: number,
	operation: string
): string {
	const q: Quantum = getQuantum(successCases);
	if (successCases == 0) {
		return "";
	}
	return `Successfully ${operation}d ${successCases} ${q.pronoun}.\n`;
}

export function successPredicate(
	success: BulkParamsV2[],
	operation: string
): string {
	let userList: string = "";
	let operationQueryDetails: string = "";
	const q: Quantum = getQuantum(success.length);
	if (success.length == 0) {
		return "";
	}
	success.forEach((bulkParam: BulkParamsV2) => {
		bulkParam.users.forEach((user: User) => {
			bulkParam.operationalQueries.forEach((query: Query) => {
				operationQueryDetails += shortQueryFormat(query, operation);
			});
			if (bulkParam.operationalQueries.length == 0) {
				userList += `\tID ${user.id} ${user.firstName} ${user.lastName}.\n`;
			} else {
				userList += longQueryFormat(
					bulkParam,
					operation,
					operationQueryDetails
				);
				operationQueryDetails = "";
			}
		});
	});
	return `The following ${q.pronoun} ${q.verb} ${operation}d:\n` + userList;
}

// export function successPredicate(
// 	success: BulkParamsV2[],
// 	operation: string
// ): string {
// 	const q: Quantum = getQuantum(success.length);
// 	if (success.length == 0) {
// 		return "";
// 	}
// 	return (
// 		`The following ${q.pronoun} ${q.verb} ${operation}d:\n` +
// 		success.reduce((accumulator: string, bulkParam: BulkParamsV2) => {
// 			return (
// 				accumulator +
// 				bulkParam.users.reduce((accumulator: string, user: User) => {
// 					if (bulkParam.operationalQueries.length == 0) {
// 						return (
// 							accumulator +
// 							`\tID ${user.id} ${user.firstName} ${user.lastName}.\n`
// 						);
// 					} else {
// 						return (
// 							accumulator +
// 							longQueryFormat(
// 								bulkParam,
// 								operation,
// 								bulkParam.operationalQueries.reduce(
// 									(accumulator: string, query: Query) => {
// 										return accumulator + shortQueryFormat(query, operation);
// 									},
// 									""
// 								)
// 							)
// 						);
// 					}
// 				}, "")
// 			);
// 		}, "")
// 	);
// }

export function failedPredicate(
	failed: BulkParamsV2[],
	errors: ProcessedError[],
	successCases: number,
	operation: string
): string {
	let operationQueryDetails: string = "";
	let userList: string = "";
	const qu: Quantum = getQuantum(failed.length + errors.length);
	if (successCases == 0 && failed.length == 0 && errors.length == 0) {
		return "";
	}
	if (failed.length == 0 && errors.length == 0) {
		return `No Users could be ${operation}d. Make sure Users exist or correct parameters are provided.`;
	}
	failed.forEach((bulkParam: BulkParamsV2) => {
		bulkParam.operationalQueries.forEach((query: Query) => {
			query.query = dateFormat(query.query);
			operationQueryDetails += `\t\t${formatQueryParamShort(
				query
			)} could not be ${operation}d to ${query.query}.\n`;
		});
		if (bulkParam.operationalQueries.length == 0) {
			userList += `\tUser with ${formatQueryParamsComplete(
				bulkParam.searchQuery
			)}.\n`;
		} else {
			const qua: Quantum = getQuantum(bulkParam.operationalQueries.length);
			userList +=
				`\tUser with ${formatQueryParamsComplete(
					bulkParam.searchQuery
				)} had the following ${qua.incident}:\n` + operationQueryDetails;
		}
		operationQueryDetails = "";
	});
	errors.forEach((processError: ProcessedError) => {
		processError.bulkItem.operationQueries.forEach((query: Query) => {
			operationQueryDetails += `\t\t${query.params}.\n`;
		});
		const q: Quantum = getQuantum(
			processError.bulkItem.operationQueries.length
		);
		userList +=
			`\tUser with ${formatQueryParamsComplete(
				processError.bulkItem.searchQuery
			)} does not have the following ${q.field}:\n` + operationQueryDetails;
		operationQueryDetails = "";
	});
	return `The following ${qu.pronoun} could not be ${operation}d:\n` + userList;
}

function shortQueryFormat(query: Query, operation: string): string {
	query.query = dateFormat(query.query);
	return `\t\t${formatQueryParamShort(query)} was ${operation}d to ${
		query.query
	}.\n`;
}

function longQueryFormat(
	bulkParam: BulkParamsV2,
	operation: string,
	operationQueryDetails: string
): string {
	const q: Quantum = getQuantum(bulkParam.operationalQueries.length);
	return (
		`\tUser with ${formatQueryParamsComplete(
			bulkParam.searchQuery
		)} had the following ${q.field} ${operation}d:\n` + operationQueryDetails
	);
}

function getQuantum(num: number): Quantum {
	if (num == 1) {
		return {
			pronoun: "User",
			exists: "exists",
			verb: "was",
			field: "field",
			incident: "incident",
		};
	}
	return {
		pronoun: "Users",
		exists: "exist",
		verb: "were",
		field: "fields",
		incident: "incidents",
	};
}
