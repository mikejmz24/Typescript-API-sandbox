import { FindUser, User, DeleteUser, Query, UpdateUser } from "./api";
import { BulkParamsV3 } from "./bulkMessageV3";

export function bulkOperation(bulkParams: BulkParamsV3[]): BulkParamsV3[] {
	let result: BulkParamsV3[] = [];

	bulkParams.forEach((bulkParam: BulkParamsV3) => {
		const bulkUsers: User[] = FindUser(bulkParam.searchQuery);
		let successUsers: User[] = [];
		let errorOperationQueries: Query[] = [];
		if (bulkUsers.length > 0) {
			bulkUsers.forEach((user: User) => {
				let newUser: User = user;
				if (bulkParam.operationalQueries.length == 0) {
					successUsers = successUsers.concat(DeleteUser([user]));
				} else {
					bulkParam.operationalQueries.forEach((query: Query) => {
						if (user[`${query.params}`] == undefined) {
							errorOperationQueries.push(query);
						} else {
							newUser[`${query.params}`] = query.query;
						}
					});
					if (errorOperationQueries.length > 0) {
						result = result.concat({
							type: "error",
							searchQuery: bulkParam.searchQuery,
							operationalQueries: bulkParam.operationalQueries,
							users: successUsers,
						});
					} else {
						successUsers = successUsers.concat(UpdateUser([user], [newUser]));
					}
				}
			});
		} else {
			const testUser: User = {
				id: 0,
				firstName: "",
				lastName: "",
				birthDate: new Date(),
			};
			bulkParam.operationalQueries.forEach((query: Query) => {
				if (testUser[`${query.params}`] == undefined) {
					errorOperationQueries.push(query);
				}
			});
			if (errorOperationQueries.length > 0) {
				result = result.concat({
					type: "error",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationalQueries,
					users: successUsers,
				});
			} else {
				result = result.concat({
					type: "fail",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationalQueries,
					users: successUsers,
				});
			}
			if (successUsers.length > 0) {
				result = result.concat({
					type: "success",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationalQueries,
					users: successUsers,
				});
			}
		}
		if (successUsers.length > 0) {
			result = result.concat({
				type: "success",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationalQueries,
				users: successUsers,
			});
		}
		successUsers = [];
	});
	return result;
}