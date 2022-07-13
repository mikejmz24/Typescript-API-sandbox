import { User, Query, FindUser, CreateUser } from "../src/api"
import { BulkParamsV3 } from "../src/bulkMessageV3"
import { getErrors } from "../src/utils"

describe("getErrors test suite", () => {
	let users: User[] = [];
	let bulkParam: BulkParamsV3 = {
		type: "delete",
		searchQuery: { params: "", query: "" },
		operationalQueries: [],
		users: [],
	};
	let result: Query[] = [];
	beforeEach(() => {
		users = [];
		bulkParam = {
			type: "delete",
			searchQuery: { params: "", query: "" },
			operationalQueries: [],
			users: [],
		};
		result = [];
	});

	it("Should return 2 undefined Queries out of 4 provided", () => {
		CreateUser("Johnnie", "Walker Black", new Date());
		CreateUser("Johnnie", "Walker Red", new Date());
		CreateUser("Johnnie", "Walker Green", new Date());
		CreateUser("Johnnie", "Walker Blue", new Date());
		bulkParam = {
			type: "update",
			searchQuery: { params: "firstName", query: "Johnnie" },
			operationalQueries: [
				{ params: "birthDate", query: new Date("2000-1-3").toString() },
				{ params: "Number of distilleries", query: "4" },
				{ params: "firstName", query: "John" },
				{ params: "Favorite Whiskey Brand", query: "Johnnie Walker Blue" },
			],
			users: users,
		};
		users = FindUser(bulkParam.searchQuery);
		result = [
			{ params: "Number of distilleries", query: "4" },
			{ params: "Favorite Whiskey Brand", query: "Johnnie Walker Blue" },
		];
		expect(getErrors(users, bulkParam)).toEqual(result);
	});
});