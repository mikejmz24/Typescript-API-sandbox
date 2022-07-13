import { User, Query } from "../src/api";
import { BulkParamsV3 } from "../src/bulkMessageV3";

export function getErrors(users: User[], bulkParam: BulkParamsV3): Query[] {
	return bulkParam.operationalQueries.filter((query: Query) =>
		users.find((user: User) => user[query.params] == undefined)
	);
}
