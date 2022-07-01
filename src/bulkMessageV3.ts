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

interface BulkMessageResult {
	type: string;
	userList: string;
}

export function bulkMessage(
	results: BulkParamsV3[],
	operation: string
): string {
	const bulkQuery: BulkQueries = newBulkQuery(operation);
	const bulkMessages: BulkMessageResult[] = [];
	if (results.length == 0) {
		return "";
	}
	results.forEach((bulkParam: BulkParamsV3) => {
		bulkQuery.bulkParam = bulkParam;
		if (bulkParam.users.length == 0) {
			bulkQuery.operationQueries = processOperationalQueries(bulkQuery);
			bulkQuery.userList = processUserList(bulkQuery);
		} else {
			bulkParam.users.forEach((user: User) => {
				bulkQuery.user = user;
				bulkQuery.operationQueries += processOperationalQueries(bulkQuery);
				bulkQuery.userList = processUserList(bulkQuery);
			});
		}
		bulkMessages.push(setBulkMessageResult(bulkQuery));
		bulkQuery.userList = "";
		bulkQuery.operationQueries = "";
	});
	return processMessage(bulkMessages, operation);
}

function processOperationalQueries(bulkQuery: BulkQueries): string {
	const operationQueryParams: OperationQueryParams = newOperationQueryParams(
		bulkQuery.operation
	);
	let message: string = "";
	if (bulkQuery.user !== undefined) {
		operationQueryParams.user = bulkQuery.user;
	}
	bulkQuery.bulkParam.operationalQueries.forEach((query: Query) => {
		operationQueryParams.query = query;
		message +=
			OperationalQueryDetails[bulkQuery.bulkParam.type](operationQueryParams);
	});
	return message;
}

function processUserList(bulkQuery: BulkQueries): string {
	return bulkQuery.bulkParam.operationalQueries.length == 0
		? (bulkQuery.userList += UserList[bulkQuery.bulkParam.type](bulkQuery))
		: (bulkQuery.userList = UserList[bulkQuery.bulkParam.type](bulkQuery));
}

const OperationalQueryDetails: { [key: string]: any } = {
	success: (o: OperationQueryParams) => {
		o.query.query = dateFormat(o.query.query);
		return `\t\tUser ID ${o.user.id} ${o.user.firstName} ${
			o.user.lastName
		}'s ${formatQueryParamShort(o.query)} was ${o.operation}d to ${
			o.query.query
		}.\n`;
	},
	fail: (o: OperationQueryParams) => {
		o.query.query = dateFormat(o.query.query);
		return `\t\t${formatQueryParamShort(o.query)} could not be ${
			o.operation
		}d to ${o.query.query}.\n`;
	},
	error: (o: OperationQueryParams) => {
		return `\t\t${o.query.params}.\n`;
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

function newBulkQuery(operation: string): BulkQueries {
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
		operation: operation,
		operationQueries: "",
	};
}

function setBulkMessageResult(bulkQuery: BulkQueries): BulkMessageResult {
	return { type: bulkQuery.bulkParam.type, userList: bulkQuery.userList };
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
