import {
	BulkResults,
	Quantum,
	User,
	Query,
	formatQueryParamShort,
	formatQueryParamsComplete,
} from "./api";

export interface BulkParamsV2 {
	searchQuery: Query;
	operationalQueries: Query[];
	users: User[];
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
	bulkParams: BulkParamsV2[],
	operation: string
): string {
	let userList: string = "";
	let operationQuery: string = "";
	let operationQueryDetails: string = "";
	const q: Quantum = getQuantum(bulkParams.length);
	if (bulkParams.length == 0) {
		return "";
	}
	bulkParams.forEach((bulkParam: BulkParamsV2) => {
		bulkParam.users.forEach((user: User) => {
			bulkParam.operationalQueries.forEach((query: Query) => {
				operationQueryDetails += shortQueryFormat(query, operation);
			});
			if (bulkParam.operationalQueries.length == 0) {
				userList += `\tID ${user.id} ${user.firstName} ${user.lastName}.\n`;
			} else {
				operationQuery += longQueryFormat(
					bulkParam,
					operation,
					operationQueryDetails
				);
				operationQueryDetails = "";
			}
		});
	});
	return (
		`The following ${q.pronoun} ${q.verb} ${operation}d:\n` +
		userList +
		operationQuery
	);
}

function shortQueryFormat(query: Query, operation: string): string {
	return `\t\t${formatQueryParamShort(query)} was ${operation}d to ${
		query.query
	}.\n`;
}

function longQueryFormat(
	bulkParam: BulkParamsV2,
	operation: string,
	opQs: string
): string {
	const q: Quantum = getQuantum(bulkParam.operationalQueries.length);
	return (
		`\tUser with ${formatQueryParamsComplete(
			bulkParam.searchQuery
		)} had the following ${q.field} ${operation}d:\n` + opQs
	);
}

function getQuantum(num: number): Quantum {
	if (num == 1) {
		return {
			pronoun: "User",
			exists: "exists",
			verb: "was",
			field: "field",
		};
	}
	return {
		pronoun: "Users",
		exists: "exist",
		verb: "were",
		field: "fields",
	};
}
