import {
	Quantum,
	User,
	Query,
	formatQueryParamShort,
	formatQueryParamsComplete,
	dateFormat,
} from "./api";

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
