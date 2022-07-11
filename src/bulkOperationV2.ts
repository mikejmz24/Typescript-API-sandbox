import { FindUser, User, DeleteUser, Query, UpdateUser } from "./api";
import { BulkParamsV3 } from "./bulkMessageV3";

export function bulkOperation(bulkParams: BulkParamsV3[]): BulkParamsV3[] {
	let res: BulkParamsV3[] = [];
	bulkParams.forEach((bulkParam: BulkParamsV3) => {
		const foundUsers: User[] = FindUser(bulkParam.searchQuery);
		foundUsers.length > 0
			? bulkParam.operationalQueries.length == 0
				? res.push(deleteUser(foundUsers, bulkParam))
				: (res = res.concat(updateProcesss(foundUsers, bulkParam)))
			: res.push(noUsersvalidation(bulkParam));
	});
	return res;
}

function deleteUser(users: User[], bulkParam: BulkParamsV3): BulkParamsV3 {
	return {
		type: "success",
		searchQuery: bulkParam.searchQuery,
		operationalQueries: bulkParam.operationalQueries,
		users: DeleteUser(users),
	};
}

function updateUser(users: User[], bulkParam: BulkParamsV3): BulkParamsV3 {
	const errors: Query[] = getErrors(users, bulkParam);
	if (errors.length == 0) {
		return {
			type: "success",
			searchQuery: bulkParam.searchQuery,
			operationalQueries: bulkParam.operationalQueries,
			users: UpdateUser(users, users),
		};
	} else {
		return {
			type: "error",
			searchQuery: bulkParam.searchQuery,
			operationalQueries: bulkParam.operationalQueries,
			users: [],
		};
	}
}

function updateProcesss(
	foundUsers: User[],
	bulkParam: BulkParamsV3
): BulkParamsV3[] {
	let res: BulkParamsV3[] = [];
	getErrors(foundUsers, bulkParam).length == 0
		? res.push(updateUser(foundUsers, bulkParam))
		: foundUsers.map((user: User) =>
				res.push(updateUser(foundUsers, bulkParam))
		  );
	return res;
}

function noUsersvalidation(bulkParam: BulkParamsV3): BulkParamsV3 {
	const user: User = {
		id: 0,
		firstName: "",
		lastName: "",
		birthDate: new Date(),
	};
	const errors = bulkParam.operationalQueries.filter(
		(query: Query) => user[query.params] == undefined
	);
	let res: BulkParamsV3 = bulkParam;
	errors.length == 0 ? (res.type = "fail") : (res.type = "error");
	return res;
}

function getErrors(users: User[], bulkParam: BulkParamsV3): Query[] {
	return bulkParam.operationalQueries.filter((query: Query) =>
		users.find((user: User) => user[query.params] == undefined)
	);
}
