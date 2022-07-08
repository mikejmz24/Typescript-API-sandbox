import { FindUser, User, DeleteUser, Query, UpdateUser } from "./api";
import { BulkParamsV3 } from "./bulkMessageV3";

// export function bulkOperation(bulkParams: BulkParamsV3[]): BulkParamsV3[] {
// 	let result: BulkParamsV3[] = [];

// 	bulkParams.forEach((bulkParam: BulkParamsV3) => {
// 		const bulkUsers: User[] = FindUser(bulkParam.searchQuery);
// 		let successUsers: User[] = [];
// 		let errorOperationQueries: Query[] = [];
// 		if (bulkUsers.length > 0) {
// 			bulkUsers.forEach((user: User) => {
// 				let newUser: User = user;
// 				if (bulkParam.operationalQueries.length == 0) {
// 					successUsers = successUsers.concat(DeleteUser([user]));
// 				} else {
// 					bulkParam.operationalQueries.forEach((query: Query) => {
// 						if (user[`${query.params}`] == undefined) {
// 							errorOperationQueries.push(query);
// 						} else {
// 							newUser[`${query.params}`] = query.query;
// 						}
// 					});
// 					if (errorOperationQueries.length > 0) {
// 						result = result.concat({
// 							type: "error",
// 							searchQuery: bulkParam.searchQuery,
// 							operationalQueries: bulkParam.operationalQueries,
// 							users: successUsers,
// 						});
// 					} else {
// 						successUsers = successUsers.concat(UpdateUser([user], [newUser]));
// 					}
// 				}
// 			});
// 		} else {
// 			const testUser: User = {
// 				id: 0,
// 				firstName: "",
// 				lastName: "",
// 				birthDate: new Date(),
// 			};
// 			bulkParam.operationalQueries.forEach((query: Query) => {
// 				if (testUser[`${query.params}`] == undefined) {
// 					errorOperationQueries.push(query);
// 				}
// 			});
// 			if (errorOperationQueries.length > 0) {
// 				result = result.concat({
// 					type: "error",
// 					searchQuery: bulkParam.searchQuery,
// 					operationalQueries: bulkParam.operationalQueries,
// 					users: successUsers,
// 				});
// 			} else {
// 				result = result.concat({
// 					type: "fail",
// 					searchQuery: bulkParam.searchQuery,
// 					operationalQueries: bulkParam.operationalQueries,
// 					users: successUsers,
// 				});
// 			}
// 			if (successUsers.length > 0) {
// 				result = result.concat({
// 					type: "success",
// 					searchQuery: bulkParam.searchQuery,
// 					operationalQueries: bulkParam.operationalQueries,
// 					users: successUsers,
// 				});
// 			}
// 		}
// 		if (successUsers.length > 0) {
// 			result = result.concat({
// 				type: "success",
// 				searchQuery: bulkParam.searchQuery,
// 				operationalQueries: bulkParam.operationalQueries,
// 				users: successUsers,
// 			});
// 		}
// 		successUsers = [];
// 	});
// 	return result;
// }

export function bulkOperation(bulkParams: BulkParamsV3[]): BulkParamsV3[] {
	const result: ResultParams = newResultParam();

	bulkParams.forEach((bulkParam: BulkParamsV3) => {
		result.bulkParam = bulkParam;
		const bulkUsers: User[] = FindUser(bulkParam.searchQuery);
		let errorOperationQueries: Query[] = [];
		if (bulkUsers.length > 0) {
			bulkUsers.forEach((user: User) => {
				let newUser: User = user;
				if (result.bulkParam.operationalQueries.length == 0) {
					result.successUsers = result.successUsers.concat(DeleteUser([user]));
				} else {
					result.bulkParam.operationalQueries.forEach((query: Query) => {
						user[query.params] == undefined
							? (errorOperationQueries = operationQueryError(user, result))
							: (newUser[query.params] = query.query);
					});
					errorOperationQueries.length > 0
						? (result.result = resultConcat(result, "error"))
						: (result.successUsers = result.successUsers.concat(
								UpdateUser([user], [newUser])
						  ));
				}
			});
		} else {
			errorOperationQueries = operationQueryError(newUser(), result);
			errorOperationQueries.length > 0
				? (result.result = resultConcat(result, "error"))
				: (result.result = resultConcat(result, "fail"));
		}
		if (result.successUsers.length > 0) {
			result.result = resultConcat(result, "success");
		}
		result.successUsers = [];
	});
	return result.result;
}

// export function bulkOperation(bulkParams: BulkParamsV3[]): BulkParamsV3[] {
// 	return bulkParams.map((bulkParams: BulkParamsV3) => {
// 		const r: ResParam = newResParam(bulkParams);
// 		const bulkUsers: User[] = FindUser(bulkParams.searchQuery);
// 		if (bulkUsers.length > 0) {
// 			if (bulkParams.operationalQueries.length == 0) {
// 				r.success = DeleteUser(bulkUsers);
// 			} else {
// 				// r.error = bulkParams.operationalQueries.filter(
// 				// 	(query: Query) => bulkUsers[0][query.params] == undefined
// 				// );
// 				bulkUsers.forEach((user: User) => {
// 					bulkParams.operationalQueries.forEach((query: Query) => {
// 						if (user[query.params] == undefined) {
// 							r.error = r.error.concat(query);
// 							return setBulkParam(r, "error");
// 						}
// 					});
// 				});
// 				if (r.error.length > 0) {
// 					return setBulkParam(r, "error");
// 				} else {
// 					const newUsers: User[] = bulkUsers
// 						.filter((user: User) => {
// 							// bulkParams.operationalQueries.filter(
// 							// 	(query: Query) => user[query.params] != undefined
// 							// );
// 							// return user;
// 							bulkParams.operationalQueries.forEach(
// 								(query: Query) => user[query.params] == undefined
// 							);
// 						})
// 						.map((user: User) => {
// 							bulkParams.operationalQueries.forEach((query: Query) => {
// 								user[query.params] = query.query;
// 							});
// 							return user;
// 						});
// 					r.success = UpdateUser(bulkUsers, newUsers);
// 				}
// 			}
// 		} else {
// 			r.error = bulkParams.operationalQueries.filter(
// 				(query: Query) => newUser()[query.params] == undefined
// 			);
// 			if (r.error.length > 0) {
// 				return setBulkParam(r, "error");
// 			} else {
// 				return setBulkParam(r, "fail");
// 			}
// 		}
// 		return setBulkParam(r, "success");
// 	});
// }

interface ResultParams {
	result: BulkParamsV3[];
	bulkParam: BulkParamsV3;
	successUsers: User[];
}

interface ResParam {
	type: string;
	bulkParam: BulkParamsV3;
	success: User[];
	error: Query[];
}

function newResParam(bulkParam: BulkParamsV3): ResParam {
	return {
		type: "",
		bulkParam: bulkParam,
		success: [],
		error: [],
	};
}

function setBulkParam(r: ResParam, type: string): BulkParamsV3 {
	return {
		type: type,
		searchQuery: r.bulkParam.searchQuery,
		operationalQueries: r.bulkParam.operationalQueries,
		users: r.success,
	};
}

function newUser(): User {
	return {
		id: 0,
		firstName: "",
		lastName: "",
		birthDate: new Date(),
	};
}

function newResultParam(): ResultParams {
	return {
		result: [],
		bulkParam: {
			type: "",
			searchQuery: { params: "", query: "" },
			operationalQueries: [],
			users: [],
		},
		successUsers: [],
	};
}

function resultConcat(r: ResultParams, type: string): BulkParamsV3[] {
	return (r.result = r.result.concat({
		type: type,
		searchQuery: r.bulkParam.searchQuery,
		operationalQueries: r.bulkParam.operationalQueries,
		users: r.successUsers,
	}));
}

function operationQueryError(user: User, result: ResultParams): Query[] {
	const res: Query[] = [];
	result.bulkParam.operationalQueries.forEach((query: Query) => {
		if (user[query.params] == undefined) {
			res.push(query);
		}
	});
	return res;
}
