import { FindUser, User } from "./api";
import { BulkParamsV3 } from "./bulkMessageV3";

export function bulkOperation(bulkParam: BulkParamsV3): BulkParamsV3 {
	const bulkUsers: User[] = FindUser(bulkParam.searchQuery);
	const successUsers: User[] = [];
	if (bulkUsers.length > 0) {
		bulkUsers.forEach((user: User) => {
			if (bulkParam.type == "delete") {
				const deletedUser = deleteUser(user);
				if (deletedUser !== undefined) {
					successUsers.push(user);
				}
			}
		});
	}
	return {
		type: "success",
		searchQuery: bulkParam.searchQuery,
		operationalQueries: bulkParam.operationalQueries,
		users: successUsers,
	};
}

function deleteUser(user: User): User {
	return user;
}
