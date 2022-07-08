import {
	BulkParams,
	ClearUsers,
	CreateUser,
	dateFormat,
	FindUser,
	Query,
	User,
} from "../src/api";
import { BulkParamsV3 } from "../src/bulkMessageV3";
import { bulkOperation } from "../src/bulkOperationV2";

describe("Delete Bulk Operation suite", () => {
	let bulkParameters: BulkParamsV3[] = [];
	let result: BulkParamsV3[] = [];

	beforeEach(() => {
		ClearUsers();
		bulkParameters = [];
		result = [];
	});
	it("Should return 1 deleted User inside 1 Param object", () => {
		const fullNameJackDaniels: Query = {
			params: "fullName",
			query: "Jack Daniels",
		};

		for (let i: number = 1; i < 101; i++) {
			CreateUser("Jim", "Bean", new Date());
			CreateUser("Johnnie", "Walker", new Date());
		}
		CreateUser("Jack", "Daniels", new Date());

		bulkParameters = [
			{
				type: "delete",
				searchQuery: fullNameJackDaniels,
				operationalQueries: [],
				users: [],
			},
		];
		result = [
			{
				type: "success",
				searchQuery: fullNameJackDaniels,
				operationalQueries: [],
				users: FindUser(fullNameJackDaniels),
			},
		];
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 100 deleted Users iside 1 BulkParam object", () => {
		const fullNameJackDaniels: Query = {
			params: "fullName",
			query: "Jack Daniels",
		};

		for (let i: number = 1; i < 101; i++) {
			CreateUser("Jack", "Daniels", new Date());
			CreateUser("Jim", "Bean", new Date());
			CreateUser("Johnnie", "Walker", new Date());
		}

		bulkParameters = [
			{
				type: "delete",
				searchQuery: fullNameJackDaniels,
				operationalQueries: [],
				users: [],
			},
		];
		result = [
			{
				type: "success",
				searchQuery: fullNameJackDaniels,
				operationalQueries: [],
				users: FindUser(fullNameJackDaniels),
			},
		];
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 2 deleted Users inside 2 BulkParam objects", () => {
		const testQueries: Query[] = [
			{
				params: "fullName",
				query: "Jack Daniels",
			},
			{
				params: "lastName",
				query: "Regal",
			},
		];

		for (let i: number = 1; i < 101; i++) {
			CreateUser("Jim", "Bean", new Date());
			CreateUser("Johnnie", "Walker", new Date());
		}
		CreateUser("Jack", "Daniels", new Date());
		CreateUser("Chivas", "Regal", new Date());

		testQueries.forEach((query: Query) => {
			bulkParameters.push({
				type: "success",
				searchQuery: query,
				operationalQueries: [],
				users: [],
			});
			result.push({
				type: "success",
				searchQuery: query,
				operationalQueries: [],
				users: FindUser(query),
			});
		});

		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 400 deleted Users inside 4 BulkParam objects", () => {
		const SomewhereInTime: Date = new Date("1986-9-29");
		const testQueries: Query[] = [
			{
				params: "fullName",
				query: "Jack Daniels",
			},
			{
				params: "firstName",
				query: "William",
			},
			{
				params: "lastName",
				query: "Regal",
			},
			{
				params: "birthDate",
				query: SomewhereInTime.toString(),
			},
		];

		for (let i: number = 1; i < 10001; i++) {
			CreateUser("Jack", "Daniels", new Date());
			CreateUser("Jim", "Bean", new Date());
			CreateUser("William", "Lawson", new Date());
			CreateUser("Chivas", "Regal", new Date());
			CreateUser("Johnnie", "Walker", new Date());
			CreateUser("Bruce", "Dickinson", SomewhereInTime);
		}

		testQueries.forEach((query: Query) => {
			bulkParameters.push({
				type: "success",
				searchQuery: query,
				operationalQueries: [],
				users: [],
			});
			result.push({
				type: "success",
				searchQuery: query,
				operationalQueries: [],
				users: FindUser(query),
			});
		});
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 1 failed deleted User inside 1 BulkParam object", () => {
		for (let i: number = 1; i < 101; i++) {
			CreateUser("Jim", "Bean", new Date());
			CreateUser("Johnnie", "Walker", new Date());
		}
		const fullNameJackDaniels: Query = {
			params: "fullName",
			query: "Jack Daniels",
		};
		bulkParameters = [
			{
				type: "delete",
				searchQuery: fullNameJackDaniels,
				operationalQueries: [],
				users: [],
			},
		];
		result = [
			{
				type: "fail",
				searchQuery: fullNameJackDaniels,
				operationalQueries: [],
				users: [],
			},
		];
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 100 failed deleted Users", () => {
		let testQuery: Query[] = [];
		for (let i: number = 1; i < 101; i++) {
			CreateUser("Jim", "Bean", new Date());
			CreateUser("Johnnie", "Walker", new Date());
			testQuery.push({ params: "fullName", query: `User with ID ${i}` });
		}

		testQuery.forEach((query: Query) => {
			bulkParameters.push({
				type: "delete",
				searchQuery: query,
				operationalQueries: [],
				users: [],
			});
			result.push({
				type: "fail",
				searchQuery: query,
				operationalQueries: [],
				users: [],
			});
		});
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 400 fail deleted Users inside 100 for each Query parameter", () => {
		let testQuery: Query[] = [];
		for (let i: number = 1; i < 101; i++) {
			CreateUser("Jim", "Bean", new Date());
			CreateUser("Johnnie", "Walker", new Date());
			testQuery.push({
				params: "fullName",
				query: `User with full name ID ${i + 500}`,
			});
			testQuery.push({
				params: "firstName",
				query: `User with first name ID ${i + 600}`,
			});
			testQuery.push({
				params: "lastName",
				query: `User with last name ID ${i + 700}`,
			});
			testQuery.push({
				params: "birthDate",
				query: new Date("2012-12-21").toString(),
			});
		}

		testQuery.forEach((query: Query) => {
			bulkParameters.push({
				type: "delete",
				searchQuery: query,
				operationalQueries: [],
				users: [],
			});
			result.push({
				type: "fail",
				searchQuery: query,
				operationalQueries: [],
				users: [],
			});
		});
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 1 success and 1 failed deleted User", () => {
		const testQueries: Query[] = [
			{
				params: "fullName",
				query: "Jack Daniels",
			},
			{
				params: "firstName",
				query: "Jim",
			},
		];

		CreateUser("Jack", "Daniels", new Date());
		testQueries.forEach((query: Query) => {
			bulkParameters.push({
				type: "delete",
				searchQuery: query,
				operationalQueries: [],
				users: [],
			});
		});
		result = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [],
				users: FindUser({ params: "fullName", query: "Jack Daniels" }),
			},
			{
				type: "fail",
				searchQuery: { params: "firstName", query: "Jim" },
				operationalQueries: [],
				users: FindUser({ params: "firstName", query: "Jim" }),
			},
		];

		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 1 success with 100 Users and 4 failed deleted Users one for each User parameter", () => {
		const peaceSellsButWhosBuying: Date = new Date("1986-9-19");
		const testQueries: Query[] = [
			{
				params: "fullName",
				query: "Jack Daniels",
			},
			{
				params: "fullName",
				query: "Don Julio",
			},
			{
				params: "firstName",
				query: "Jim",
			},
			{
				params: "lastName",
				query: "Cuervo",
			},
			{
				params: "birthDate",
				query: peaceSellsButWhosBuying.toString(),
			},
		];
		for (let i: number = 0; i < 100; i++) {
			CreateUser("Jack", "Daniels", new Date());
		}
		testQueries.forEach((query: Query, index: number) => {
			bulkParameters.push({
				type: "delete",
				searchQuery: query,
				operationalQueries: [],
				users: [],
			});
			if (index == 0) {
				result.push({
					type: "success",
					searchQuery: query,
					operationalQueries: [],
					users: FindUser(query),
				});
			} else {
				result.push({
					type: "fail",
					searchQuery: query,
					operationalQueries: [],
					users: FindUser(query),
				});
			}
		});

		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 4 success with 100 Users and 4 failed deleted Users one for each User parameter", () => {
		const theNumberOfTheBeast: Date = new Date("1982-3-22");
		const peaceSellsButWhosBuying: Date = new Date("1986-9-19");
		const testQueries: Query[] = [
			{
				params: "fullName",
				query: "Jack Daniels",
			},
			{
				params: "firstName",
				query: "Johnnie",
			},
			{
				params: "lastName",
				query: "Van Winkle",
			},
			{
				params: "birthDate",
				query: peaceSellsButWhosBuying.toString(),
			},
			{
				params: "fullName",
				query: "Don Julio",
			},
			{
				params: "firstName",
				query: "Jim",
			},
			{
				params: "lastName",
				query: "Cuervo",
			},
			{
				params: "birthDate",
				query: theNumberOfTheBeast.toString(),
			},
		];
		for (let i: number = 0; i < 100; i++) {
			CreateUser("Jack", "Daniels", new Date());
			CreateUser("Johnnie", "Walker", new Date());
			CreateUser("Pappy", "Van Winkle", new Date());
			CreateUser("Dave", "Mustaine", peaceSellsButWhosBuying);
		}
		testQueries.forEach((query: Query, index: number) => {
			bulkParameters.push({
				type: "delete",
				searchQuery: query,
				operationalQueries: [],
				users: [],
			});
			if (index < 4) {
				result.push({
					type: "success",
					searchQuery: query,
					operationalQueries: [],
					users: FindUser(query),
				});
			} else {
				result.push({
					type: "fail",
					searchQuery: query,
					operationalQueries: [],
					users: FindUser(query),
				});
			}
		});

		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
});

describe("Update Bulk Operation suite", () => {
	let bulkParameters: BulkParamsV3[] = [];
	let result: BulkParamsV3[] = [];

	beforeEach(() => {
		bulkParameters = [];
		result = [];
		ClearUsers();
	});
	it("Should return 1 updated User inside 1 BulkParam object", () => {
		CreateUser("Jack", "Daniels", new Date());
		bulkParameters = [
			{
				type: "update",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [{ params: "firstName", query: "Gentleman" }],
				users: [],
			},
		];
		result = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [{ params: "firstName", query: "Gentleman" }],
				users: FindUser({ params: "fullName", query: "Jack Daniels" }),
			},
		];
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 2 updated User inside 2 BulkParam object", () => {
		const killers: Date = new Date("1981-2-2");
		const testQueries: BulkParams[] = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationQueries: [{ params: "firstName", query: "Gentleman" }],
			},
			{
				searchQuery: { params: "firstName", query: "Jim" },
				operationQueries: [
					{ params: "firstName", query: "James" },
					{ params: "lastName", query: "Bean Sr" },
					{ params: "birthDate", query: killers.toString() },
				],
			},
		];
		CreateUser("Jack", "Daniels", new Date());
		CreateUser("Jim", "Bean", new Date("1980-2-1"));
		CreateUser("Jim", "Bean Jr", new Date("1985-4-1"));
		testQueries.forEach((bulkParam: BulkParams) => {
			bulkParameters.push({
				type: "update",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationQueries,
				users: [],
			});
			result.push({
				type: "success",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationQueries,
				users: FindUser(bulkParam.searchQuery),
			});
		});
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 1 fail updated User inside 1 BulkParam object", () => {
		bulkParameters = [
			{
				type: "update",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [{ params: "firstName", query: "Gentleman" }],
				users: [],
			},
		];
		result = [
			{
				type: "fail",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [{ params: "firstName", query: "Gentleman" }],
				users: FindUser({ params: "fullName", query: "Jack Daniels" }),
			},
		];
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 2 fail updated User inside 2 BulkParam object", () => {
		const killers: Date = new Date("1981-2-2");
		const testQueries: BulkParams[] = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationQueries: [{ params: "firstName", query: "Gentleman" }],
			},
			{
				searchQuery: { params: "firstName", query: "Jim" },
				operationQueries: [
					{ params: "firstName", query: "James" },
					{ params: "lastName", query: "Bean Sr" },
					{ params: "birthDate", query: killers.toString() },
				],
			},
		];
		testQueries.forEach((bulkParam: BulkParams) => {
			bulkParameters.push({
				type: "update",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationQueries,
				users: [],
			});
			result.push({
				type: "fail",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationQueries,
				users: FindUser(bulkParam.searchQuery),
			});
		});
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 1 error updated User inside 1 BulkParam object when User exist", () => {
		CreateUser("Jack", "Daniels", new Date());
		bulkParameters = [
			{
				type: "update",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [{ params: "Rank", query: "Comodore" }],
				users: [],
			},
		];
		result = [
			{
				type: "error",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [{ params: "Rank", query: "Comodore" }],
				users: [],
			},
		];
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 1 error updated User inside 1 BulkParam object when No Users exist", () => {
		bulkParameters = [
			{
				type: "update",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [{ params: "Rank", query: "Comodore" }],
				users: [],
			},
		];
		result = [
			{
				type: "error",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [{ params: "Rank", query: "Comodore" }],
				users: [],
			},
		];
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 2 error updated Users inside 4 BulkParam object when No Users & Users exist", () => {
		const testQueries: BulkParams[] = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationQueries: [{ params: "Rank", query: "Comodore" }],
			},
			{
				searchQuery: { params: "firstName", query: "Johnnie" },
				operationQueries: [
					{ params: "Number of children", query: "3" },
					{ params: "lastName", query: "Bean Sr" },
				],
			},
		];
		CreateUser("Johnnie", "Walker Black", new Date());
		CreateUser("Johnnie", "Walker Green", new Date());
		CreateUser("Johnnie", "Walker Blue", new Date());

		testQueries.forEach((query: BulkParams) => {
			bulkParameters.push({
				type: "update",
				searchQuery: query.searchQuery,
				operationalQueries: query.operationQueries,
				users: [],
			});
			result.push({
				type: "error",
				searchQuery: query.searchQuery,
				operationalQueries: query.operationQueries,
				users: [],
			});
		});

		FindUser(testQueries[1].searchQuery).forEach(
			(user: User, index: number) => {
				if (index > 0) {
					result.push({
						type: "error",
						searchQuery: testQueries[1].searchQuery,
						operationalQueries: testQueries[1].operationQueries,
						users: [],
					});
				}
			}
		);

		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 100 errors", () => {
		const testQueries: BulkParams[] = [
			{
				searchQuery: { params: "fullName", query: "Jim Bean" },
				operationQueries: [
					{ params: "Number of pets", query: "1" },
					{ params: "lastName", query: "Bean Sr" },
				],
			},
			{
				searchQuery: { params: "firstName", query: "William" },
				operationQueries: [
					{ params: "firstName", query: "Bill" },
					{ params: "lastName", query: "Lawson Jr" },
					{
						params: "Favorite Whisky",
						query: "Arran Robert Burns Single Malt Scotch Whisky",
					},
				],
			},
		];
		for (let i: number = 0; i < 50; i++) {
			testQueries.forEach((bulkParam: BulkParams) => {
				bulkParameters.push({
					type: "update",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationQueries,
					users: FindUser(bulkParam.searchQuery),
				});
				result.push({
					type: "error",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationQueries,
					users: [],
				});
			});
		}
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 3 errors, 1 for a non-existing User & 2 for 2 existing Users", () => {
		const testQueries: BulkParams[] = [
			{
				searchQuery: { params: "fullName", query: "Jim Bean" },
				operationQueries: [
					{ params: "Number of pets", query: "1" },
					{ params: "lastName", query: "Bean Sr" },
				],
			},
			{
				searchQuery: { params: "firstName", query: "William" },
				operationQueries: [
					{ params: "firstName", query: "Bill" },
					{ params: "lastName", query: "Lawson Jr" },
					{
						params: "Favorite Whisky",
						query: "Arran Robert Burns Single Malt Scotch Whisky",
					},
				],
			},
		];
		CreateUser("William", "Lawson Sr", new Date());
		CreateUser("William", "Lawson Jr", new Date());
		testQueries.forEach((bulkParam: BulkParams) => {
			bulkParameters.push({
				type: "update",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationQueries,
				users: FindUser(bulkParam.searchQuery),
			});
			for (
				let i: number = 0;
				i <=
				(FindUser(bulkParam.searchQuery).length == 0
					? 0
					: FindUser(bulkParam.searchQuery).length - 1);
				i++
			) {
				result.push({
					type: "error",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationQueries,
					users: [],
				});
			}
		});

		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 5 errors, 1 per user", () => {
		const testQueries: BulkParams[] = [
			{
				searchQuery: { params: "fullName", query: "Jim Bean" },
				operationQueries: [
					{ params: "Number of distilleries", query: "12" },
					{ params: "Favorite cocktail", query: "old-fashioned" },
				],
			},
		];
		for (let i: number = 0; i < 5; i++) {
			CreateUser("Jim", "Bean", new Date());
		}
		bulkParameters = [
			{
				type: "update",
				searchQuery: testQueries[0].searchQuery,
				operationalQueries: testQueries[0].operationQueries,
				users: FindUser(testQueries[0].searchQuery),
			},
		];
		for (let i: number = 0; i < 5; i++) {
			result.push({
				type: "error",
				searchQuery: testQueries[0].searchQuery,
				operationalQueries: testQueries[0].operationQueries,
				users: [],
			});
		}
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 1 fail update & 1 error", () => {
		const testQueries: BulkParams[] = [
			{
				searchQuery: {
					params: "birthDate",
					query: new Date("2002-2-2").toString(),
				},
				operationQueries: [
					{ params: "firstName", query: "Johnny" },
					{ params: "lastName", query: "Walker Sr" },
				],
			},
			{
				searchQuery: { params: "lastName", query: "Jameson" },
				operationQueries: [
					{ params: "Number of cars", query: "1" },
					{ params: "Age of eldest child", query: "20" },
				],
			},
		];
		CreateUser("Johnnie", "Walker Black Label", new Date("2022-2-12"));
		testQueries.forEach((bulkParam: BulkParams, index: number) => {
			bulkParameters.push({
				type: "update",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationQueries,
				users: [],
			});
			if (index == 0) {
				result.push({
					type: "fail",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationQueries,
					users: [],
				});
			} else {
				result.push({
					type: "error",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationQueries,
					users: [],
				});
			}
		});
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 10 fail update & 10 error2", () => {
		const testQueries: BulkParams[] = [
			{
				searchQuery: {
					params: "birthDate",
					query: new Date("2002-2-2").toString(),
				},
				operationQueries: [
					{ params: "firstName", query: "Johnny" },
					{ params: "lastName", query: "Walker Sr" },
				],
			},
			{
				searchQuery: { params: "lastName", query: "Jameson" },
				operationQueries: [
					{ params: "Number of cars", query: "1" },
					{ params: "Age of eldest child", query: "20" },
				],
			},
		];
		CreateUser("Johnnie", "Walker Black Label", new Date("2022-2-12"));
		for (let i: number = 0; i < 10; i++) {
			testQueries.forEach((bulkParam: BulkParams, index: number) => {
				bulkParameters.push({
					type: "update",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationQueries,
					users: [],
				});
				if (index == 0) {
					result.push({
						type: "fail",
						searchQuery: bulkParam.searchQuery,
						operationalQueries: bulkParam.operationQueries,
						users: [],
					});
				} else {
					result.push({
						type: "error",
						searchQuery: bulkParam.searchQuery,
						operationalQueries: bulkParam.operationQueries,
						users: [],
					});
				}
			});
		}
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 1 success & 1 fail", () => {
		const testQueries: BulkParams[] = [
			{
				searchQuery: { params: "firstName", query: "Don Julio" },
				operationQueries: [
					{ params: "lastName", query: "Blanco" },
					{ params: "birthDate", query: new Date("2000-7-1").toString() },
				],
			},
			{
				searchQuery: { params: "lastName", query: "Bulleit" },
				operationQueries: [
					{ params: "birthDate", query: new Date("2000-1-3").toString() },
				],
			},
		];
		CreateUser("Don Julio", "Reposado", new Date());
		CreateUser("Don Julio", "Anejo", new Date());
		CreateUser("Don Julio", "Cristalino", new Date());
		testQueries.forEach((bulkParam: BulkParams, index: number) => {
			bulkParameters.push({
				type: "update",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationQueries,
				users: [],
			});
			if (index == 0) {
				result.push({
					type: "success",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationQueries,
					users: FindUser(bulkParam.searchQuery),
				});
			} else {
				result.push({
					type: "fail",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationQueries,
					users: FindUser(bulkParam.searchQuery),
				});
			}
		});
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 1 success & 1 error", () => {
		const testQueries: BulkParams[] = [
			{
				searchQuery: { params: "firstName", query: "Don Julio" },
				operationQueries: [
					{ params: "lastName", query: "Blanco" },
					{ params: "birthDate", query: new Date("2000-7-1").toString() },
				],
			},
			{
				searchQuery: { params: "lastName", query: "Glenfiddich" },
				operationQueries: [{ params: "Aged years", query: "12" }],
			},
		];
		CreateUser("Don Julio", "Reposado", new Date());
		CreateUser("Don Julio", "Anejo", new Date());
		CreateUser("Don Julio", "Cristalino", new Date());
		testQueries.forEach((bulkParam: BulkParams, index: number) => {
			bulkParameters.push({
				type: "update",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationQueries,
				users: [],
			});
			if (index == 0) {
				result.push({
					type: "success",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationQueries,
					users: FindUser(bulkParam.searchQuery),
				});
			} else {
				result.push({
					type: "error",
					searchQuery: bulkParam.searchQuery,
					operationalQueries: bulkParam.operationQueries,
					users: FindUser(bulkParam.searchQuery),
				});
			}
		});
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 1 update success, fail and error for 1 User", () => {
		const MortalKombat: Date = new Date("1992-10-8");
		const testQueries: BulkParams[] = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationQueries: [
					{ params: "firstName", query: "Gentleman" },
					{ params: "lastName", query: "Jack Reserved" },
				],
			},
			{
				searchQuery: { params: "birthDate", query: MortalKombat.toString() },
				operationQueries: [
					{ params: "firstName", query: "Ed" },
					{ params: "lastName", query: "Boon" },
				],
			},
			{
				searchQuery: { params: "fullName", query: "Knob Creek" },
				operationQueries: [{ params: "Number of aged years", query: "15" }],
			},
		];
		CreateUser("Jack", "Daniels", new Date());

		testQueries.forEach((bulkParam: BulkParams) => {
			bulkParameters.push({
				type: "update",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationQueries,
				users: [],
			});
		});
		result = [
			{
				type: "success",
				searchQuery: testQueries[0].searchQuery,
				operationalQueries: testQueries[0].operationQueries,
				users: FindUser(testQueries[0].searchQuery),
			},
			{
				type: "fail",
				searchQuery: testQueries[1].searchQuery,
				operationalQueries: testQueries[1].operationQueries,
				users: FindUser(testQueries[1].searchQuery),
			},
			{
				type: "error",
				searchQuery: testQueries[2].searchQuery,
				operationalQueries: testQueries[2].operationQueries,
				users: FindUser(testQueries[2].searchQuery),
			},
		];
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
	it("Should return 40 update success, 3 fails and 2 errors", () => {
		const MortalKombat: Date = new Date("1992-10-8");
		const testQueries: BulkParams[] = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationQueries: [
					{ params: "firstName", query: "Gentleman" },
					{ params: "lastName", query: "Jack Reserved" },
				],
			},
			{
				searchQuery: { params: "firstName", query: "Jim" },
				operationQueries: [{ params: "firstName", query: "James" }],
			},
			{
				searchQuery: { params: "lastName", query: "Macallan" },
				operationQueries: [
					{ params: "firstName", query: "The Single Malt Scotch Whisky" },
				],
			},
			{
				searchQuery: { params: "birthDate", query: MortalKombat.toString() },
				operationQueries: [
					{ params: "firstName", query: "Ed" },
					{ params: "lastName", query: "Boon" },
				],
			},
			{
				searchQuery: {
					params: "birthDate",
					query: new Date("2000-12-1").toString(),
				},
				operationQueries: [
					{ params: "firstName", query: "Jose" },
					{ params: "lastName", query: "Cuervo" },
				],
			},
			{
				searchQuery: { params: "firstName", query: "Ron" },
				operationQueries: [{ params: "lastName", query: "Morgan" }],
			},
			{
				searchQuery: { params: "fullName", query: "Bacardi Limon" },
				operationQueries: [
					{ params: "firstName", query: "Havana" },
					{ params: "lastName", query: "Club" },
				],
			},
			{
				searchQuery: { params: "fullName", query: "Knob Creek" },
				operationQueries: [{ params: "Number of aged years", query: "15" }],
			},
			{
				searchQuery: { params: "lastName", query: "Snirnoff" },
				operationQueries: [
					{ params: "Number of aged years", query: "15" },
					{ params: "Parent Company", query: "Diageo" },
				],
			},
		];
		for (let i: number = 0; i < 10; i++) {
			CreateUser("Jack", "Daniels", new Date());
			CreateUser("Jim", "Bean", new Date());
			CreateUser("Alexander Reid", "Macallan", new Date());
			CreateUser("John", "Tobias", MortalKombat);
		}

		testQueries.forEach((bulkParam: BulkParams, index: number) => {
			bulkParameters.push({
				type: "update",
				searchQuery: bulkParam.searchQuery,
				operationalQueries: bulkParam.operationQueries,
				users: [],
			});
			if (index < 4) {
				result.push({
					type: "success",
					searchQuery: testQueries[index].searchQuery,
					operationalQueries: testQueries[index].operationQueries,
					users: FindUser(testQueries[index].searchQuery),
				});
			} else if (index > 3 && index < 7) {
				result.push({
					type: "fail",
					searchQuery: testQueries[index].searchQuery,
					operationalQueries: testQueries[index].operationQueries,
					users: FindUser(testQueries[index].searchQuery),
				});
			} else {
				result.push({
					type: "error",
					searchQuery: testQueries[index].searchQuery,
					operationalQueries: testQueries[index].operationQueries,
					users: FindUser(testQueries[index].searchQuery),
				});
			}
		});

		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
});

describe("Full integration test", () => {
	let bulkParameters: BulkParamsV3[] = [];
	let result: BulkParamsV3[] = [];

	beforeEach(() => {
		bulkParameters = [];
		result = [];
		ClearUsers();
	});
	it("Should return 1 success delete, 1 failed delete, 1 success update, 1 failed update, 1 error update", () => {
		CreateUser("Jack", "Daniels", new Date());
		CreateUser("Jim", "Bean", new Date());
		bulkParameters = [
			{
				type: "delete",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [],
				users: [],
			},
			{
				type: "delete",
				searchQuery: { params: "fullName", query: "Captain Morgan" },
				operationalQueries: [],
				users: [],
			},
			{
				type: "update",
				searchQuery: { params: "fullName", query: "Jim Bean" },
				operationalQueries: [{ params: "firstName", query: "James" }],
				users: [],
			},
			{
				type: "update",
				searchQuery: { params: "fullName", query: "Johnnie Walker" },
				operationalQueries: [{ params: "firstName", query: "John" }],
				users: [],
			},
			{
				type: "update",
				searchQuery: { params: "fullName", query: "Don Julio" },
				operationalQueries: [{ params: "Nick Name", query: "Patron" }],
				users: [],
			},
		];
		result = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [],
				users: FindUser({ params: "fullName", query: "Jack Daniels" }),
			},
			{
				type: "fail",
				searchQuery: { params: "fullName", query: "Captain Morgan" },
				operationalQueries: [],
				users: FindUser({ params: "fullName", query: "Captain Morgan" }),
			},
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Jim Bean" },
				operationalQueries: [{ params: "firstName", query: "James" }],
				users: FindUser({ params: "fullName", query: "Jim Bean" }),
			},
			{
				type: "fail",
				searchQuery: { params: "fullName", query: "Johnnie Walker" },
				operationalQueries: [{ params: "firstName", query: "John" }],
				users: FindUser({ params: "fullName", query: "Johnnie Walker" }),
			},
			{
				type: "error",
				searchQuery: { params: "fullName", query: "Don Julio" },
				operationalQueries: [{ params: "Nick Name", query: "Patron" }],
				users: FindUser({ params: "fullName", query: "Don Julio" }),
			},
		];
		expect(bulkOperation(bulkParameters)).toEqual(result);
	});
});
