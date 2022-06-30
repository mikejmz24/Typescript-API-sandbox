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
	let bulkQuery: BulkQueries = newBulkQuery();
	bulkQuery.operation = operation;
	let result: BulkMessageResult[] = [];
	if (results.length == 0) {
		return "";
	}
	results.forEach((bulkParam: BulkParamsV3) => {
		bulkQuery.bulkParam = bulkParam;
		const operationQueryParams: OperationQueryParams =
			newOperationQueryParams(operation);
		if (bulkParam.users.length == 0) {
			bulkParam.operationalQueries.forEach((query: Query) => {
				operationQueryParams.query = query;
				bulkQuery.operationQueries +=
					OperationalQueryDetails[bulkParam.type](operationQueryParams);
			});
			// repeated code
			bulkParam.operationalQueries.length == 0
				? (bulkQuery.userList += UserList[bulkParam.type](bulkQuery))
				: (bulkQuery.userList = UserList[bulkParam.type](bulkQuery));
		} else {
			bulkParam.users.forEach((user: User) => {
				bulkQuery.user = user;
				operationQueryParams.user = user;
				bulkParam.operationalQueries.forEach((query: Query) => {
					operationQueryParams.query = query;
					bulkQuery.operationQueries +=
						OperationalQueryDetails[bulkParam.type](operationQueryParams);
				});
				// repeated code
				bulkParam.operationalQueries.length == 0
					? (bulkQuery.userList += UserList[bulkParam.type](bulkQuery))
					: (bulkQuery.userList = UserList[bulkParam.type](bulkQuery));
			});
		}
		result.push({ type: bulkParam.type, userList: bulkQuery.userList });
		bulkQuery.userList = "";
		bulkQuery.operationQueries = "";
	});
	res = processMessage(result, operation);
	return res;
}

interface BulkQueries {
	bulkParam: BulkParamsV3;
	user: User;
	userList: string;
	operation: string;
	operationQueries: string;
}

interface OperationQueryParams {
	user: User;
	query: Query;
	operation: string;
}

function newOperationQueryParams(operation: string): OperationQueryParams {
	return {
		user: {
			id: 0,
			firstName: "",
			lastName: "",
			birthDate: new Date(),
		},
		query: { params: "", query: "" },
		operation: operation,
	};
}

function newBulkQuery(): BulkQueries {
	return {
		bulkParam: {
			type: "",
			searchQuery: { query: "", params: "" },
			operationalQueries: [],
			users: [],
		},
		user: {
			id: 0,
			firstName: "",
			lastName: "",
			birthDate: new Date(),
		},
		userList: "",
		operation: "",
		operationQueries: "",
	};
}

interface BulkMessageResult {
	type: string;
	userList: string;
}

const OperationalQueryDetails: { [key: string]: any } = {
	success: (O: OperationQueryParams) => {
		O.query.query = dateFormat(O.query.query);
		return `\t\tUser ID ${O.user.id} ${O.user.firstName} ${
			O.user.lastName
		}'s ${formatQueryParamShort(O.query)} was ${O.operation}d to ${
			O.query.query
		}.\n`;
	},
	fail: (O: OperationQueryParams) => {
		O.query.query = dateFormat(O.query.query);
		return `\t\t${formatQueryParamShort(O.query)} could not be ${
			O.operation
		}d to ${O.query.query}.\n`;
	},
	error: (O: OperationQueryParams) => {
		return `\t\t${O.query.params}.\n`;
	},
};

const UserList: { [key: string]: any } = {
	success: (bulkQuery: BulkQueries) => {
		if (bulkQuery.bulkParam.operationalQueries.length == 0) {
			return `\tID ${bulkQuery.user.id} ${bulkQuery.user.firstName} ${bulkQuery.user.lastName}.\n`;
		} else {
			const q: Quantum = getQuantum(bulkQuery.bulkParam.users.length);
			const qu: Quantum = getQuantum(
				bulkQuery.bulkParam.operationalQueries.length
			);
			return (
				`\t${q.pronoun} with ${formatQueryParamsComplete(
					bulkQuery.bulkParam.searchQuery
				)} had the following ${qu.field} ${bulkQuery.operation}d:\n` +
				bulkQuery.operationQueries
			);
		}
	},
	fail: (bulkQuery: BulkQueries) => {
		if (bulkQuery.bulkParam.operationalQueries.length == 0) {
			const q: Quantum = getQuantum(
				bulkQuery.bulkParam.operationalQueries.length
			);
			return `\tUser with ${formatQueryParamsComplete(
				bulkQuery.bulkParam.searchQuery
			)}.\n`;
		} else {
			const q: Quantum = getQuantum(
				bulkQuery.bulkParam.operationalQueries.length
			);
			return (
				`\tUser with ${formatQueryParamsComplete(
					bulkQuery.bulkParam.searchQuery
				)} had the following ${q.incident}:\n` + bulkQuery.operationQueries
			);
		}
	},
	error: (bulkQuery: BulkQueries) => {
		const q: Quantum = getQuantum(
			bulkQuery.bulkParam.operationalQueries.length
		);
		return (
			`\tUser with ${formatQueryParamsComplete(
				bulkQuery.bulkParam.searchQuery
			)} does not have the following ${q.field}:\n` + bulkQuery.operationQueries
		);
	},
};

function processMessage(
	results: BulkMessageResult[],
	operation: string
): string {
	const successCases: BulkMessageResult[] = getCases(results, "success");
	const successUsers: number = getSuccessCases(getUserList(successCases));
	const failedCases: BulkMessageResult[] = getCases(results, "fail");
	const errorCases: BulkMessageResult[] = getCases(results, "error");
	const q: Quantum = getQuantum(successUsers);
	const qu: Quantum = getQuantum(failedCases.length + errorCases.length);
	let message: string = "";
	if (successCases.length > 0) {
		message =
			`Successfully ${operation}d ${successUsers} ${q.pronoun}:\n` +
			`The following ${q.pronoun} ${q.verb} ${operation}d:\n` +
			`${getUserList(successCases)}`;
	}
	if (failedCases.length > 0 || errorCases.length > 0) {
		message +=
			`The following ${qu.pronoun} could not be ${operation}d:\n` +
			`${getUserList(failedCases)}` +
			`${getUserList(errorCases)}`;
	}
	return message;
}

function getSuccessCases(list: string): number {
	return Object.keys(
		(list.match(/(?<=D\s+).*?(?=\s+\D)/g) || []).reduce(
			(accumulator: object, item: string) => (
				(accumulator[item] = accumulator[item] + 1 || 1), accumulator
			),
			{}
		)
	).length;
}

function getCases(
	bulkMessageResults: BulkMessageResult[],
	type: string
): BulkMessageResult[] {
	return bulkMessageResults.filter(
		(item: BulkMessageResult) => item.type == type
	);
}

function getUserList(list: BulkMessageResult[]): string {
	return `${list.reduce((acc: string, item: BulkMessageResult) => {
		return acc + item.userList;
	}, "")}`;
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
