import { CreateUser, FindUser, Query } from "../src/api";
import { BulkParamsV3 } from "../src/bulkMessageV3";
import { bulkOperation } from "../src/bulkOperationV2";

describe("Delete Bulk Operation suite", () => {
	let bulkParameters: BulkParamsV3 = {
		type: "",
		searchQuery: { params: "", query: "" },
		operationalQueries: [],
		users: [],
	};
	let result: BulkParamsV3 = {
		type: "",
		searchQuery: { params: "", query: "" },
		operationalQueries: [],
		users: [],
	};

	beforeEach(() => {
		bulkParameters = {
			type: "",
			searchQuery: { params: "", query: "" },
			operationalQueries: [],
			users: [],
		};
		result = {
			type: "",
			searchQuery: { params: "", query: "" },
			operationalQueries: [],
			users: [],
		};
	});
	it("Should return a BulkParamsV3 object with 1 deleted User", () => {
		CreateUser("Jack", "Daniels", new Date());
		const fullNameJackDaniels: Query = {
			params: "fullName",
			query: "Jack Daniels",
		};
		bulkParameters = {
			type: "delete",
			searchQuery: fullNameJackDaniels,
			operationalQueries: [],
			users: [],
		};
		result = {
			type: "success",
			searchQuery: fullNameJackDaniels,
			operationalQueries: [],
			users: FindUser(fullNameJackDaniels),
		};
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
});
