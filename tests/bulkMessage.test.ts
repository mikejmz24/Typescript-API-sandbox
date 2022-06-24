import { BulkParams, ProcessedError, User } from "../src/api";
import {
	BulkParamsV2,
	successHeading,
	successPredicate,
	failedPredicate,
} from "../src/bulkMessage";

describe("SuccessHeading function returns how many users had successful bulk operations", () => {
	let result: string = "";
	let successCases: number = 0;
	let operation: string = "";

	beforeEach(() => {
		result = "";
		successCases = 0;
		operation = "";
	});
	it("Should return an empty string when there are 0 successful delete cases", () => {
		successCases = 0;
		operation = "delete";
		result = "";
		expect(successHeading(successCases, operation)).toBe(result);
	});
	it("Should return an empty string when there are 0 successful update cases", () => {
		successCases = 0;
		operation = "update";
		result = "";
		expect(successHeading(successCases, operation)).toBe(result);
	});
	it("Should return Successfully deleted 1 User when provided 1 successful cases and delete as parameters", () => {
		successCases = 1;
		operation = "delete";
		result = "Successfully deleted 1 User.\n";
		expect(successHeading(successCases, operation)).toBe(result);
	});
	it("Should return Successfully deleted 2 Users when provided 2 successful cases and delete as parameters", () => {
		successCases = 2;
		operation = "delete";
		result = "Successfully deleted 2 Users.\n";
		expect(successHeading(successCases, operation)).toBe(result);
	});
	it("Should return Successfully deleted 69 Users when provided 69 successful cases and delete as parameters", () => {
		successCases = 69;
		operation = "delete";
		result = "Successfully deleted 69 Users.\n";
		expect(successHeading(successCases, operation)).toBe(result);
	});
});

describe("SuccessPredicate function returns a detailed description of the Users who had successful bulk operations", () => {
	let result: string = "";
	let success: BulkParamsV2[] = [];
	let operation: string = "";
	const DT_Scenes_From_A_Memory: Date = new Date("1999-10-26");

	beforeEach(() => {
		result = "";
		success = [];
		operation = "";
	});
	it("Should return an empty string when no Users are provided", () => {
		result = "";
		success = [];
		operation = "delete";
		expect(successPredicate(success, operation)).toBe(result);
	});
	it("Should return User with last name Jack Daniels was deleted when provided there are no operational queries and User Jack Daniels is the only User provided", () => {
		result = "The following User was deleted:\n" + "\tID 1 Jack Daniels.\n";
		success = [
			{
				searchQuery: {
					params: "fullName",
					query: "Jack Daniels",
				},
				operationalQueries: [],
				users: [
					{
						id: 1,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: DT_Scenes_From_A_Memory,
					},
				],
			},
		];
		operation = "delete";
		expect(successPredicate(success, operation)).toBe(result);
	});
	it("Should return deleted message The following Users were deleted, along with Users Jack Daniels, Jim Bean & Johnnie Walker's data", () => {
		result =
			"The following Users were deleted:\n" +
			"\tID 1 Jack Daniels.\n" +
			"\tID 2 Jim Bean.\n" +
			"\tID 3 Johnnie Walker.\n";
		success = [
			{
				searchQuery: {
					params: "fullName",
					query: "Jack Daniels",
				},
				operationalQueries: [],
				users: [
					{
						id: 1,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: DT_Scenes_From_A_Memory,
					},
				],
			},
			{
				searchQuery: {
					params: "fullName",
					query: "Jim Bean",
				},
				operationalQueries: [],
				users: [
					{
						id: 2,
						firstName: "Jim",
						lastName: "Bean",
						birthDate: DT_Scenes_From_A_Memory,
					},
				],
			},
			{
				searchQuery: {
					params: "fullName",
					query: "Johnnie Walker",
				},
				operationalQueries: [],
				users: [
					{
						id: 3,
						firstName: "Johnnie",
						lastName: "Walker",
						birthDate: DT_Scenes_From_A_Memory,
					},
				],
			},
		];
		operation = "delete";
		expect(successPredicate(success, operation)).toBe(result);
	});
	it("Should return updated message, along with Users Jack Daniels, Jim Bean and Johnnie Walker and Don Julio's data", () => {
		result =
			"The following Users were updated:\n" +
			"\tUser with full name Jack Daniels had the following fields updated:\n" +
			"\t\tfirst name was updated to Gentleman Jack.\n" +
			"\t\tlast name was updated to Daniels Reserved.\n" +
			"\tUser with first name Jim had the following field updated:\n" +
			"\t\tfirst name was updated to James.\n" +
			"\tUser with last name Walker had the following fields updated:\n" +
			"\t\tfirst name was updated to John.\n" +
			"\t\tlast name was updated to Walker Green.\n" +
			"\tUser with date of birth October 25 1999 had the following fields updated:\n" +
			"\t\tfirst name was updated to Don.\n" +
			"\t\tlast name was updated to Julio.\n" +
			"\t\tdate of birth was updated to October 26 1999.\n";
		success = [
			{
				searchQuery: {
					params: "fullName",
					query: "Jack Daniels",
				},
				operationalQueries: [
					{ params: "firstName", query: "Gentleman Jack" },
					{ params: "lastName", query: "Daniels Reserved" },
				],
				users: [
					{
						id: 1,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: DT_Scenes_From_A_Memory,
					},
				],
			},
			{
				searchQuery: {
					params: "firstName",
					query: "Jim",
				},
				operationalQueries: [{ params: "firstName", query: "James" }],
				users: [
					{
						id: 2,
						firstName: "Jim",
						lastName: "Bean",
						birthDate: DT_Scenes_From_A_Memory,
					},
				],
			},
			{
				searchQuery: {
					params: "lastName",
					query: "Walker",
				},
				operationalQueries: [
					{ params: "firstName", query: "John" },
					{ params: "lastName", query: "Walker Green" },
				],
				users: [
					{
						id: 3,
						firstName: "Johnnie",
						lastName: "Walker",
						birthDate: DT_Scenes_From_A_Memory,
					},
				],
			},
			{
				searchQuery: {
					params: "birthDate",
					query: DT_Scenes_From_A_Memory.toString(),
				},
				operationalQueries: [
					{ params: "firstName", query: "Don" },
					{ params: "lastName", query: "Julio" },
					{
						params: "birthDate",
						query: new Date(DT_Scenes_From_A_Memory.setDate(26)).toString(),
					},
				],
				users: [
					{
						id: 4,
						firstName: "Jose",
						lastName: "Cuervo",
						birthDate: DT_Scenes_From_A_Memory,
					},
				],
			},
		];
		operation = "update";
		expect(successPredicate(success, operation)).toBe(result);
	});
});

describe("FailedPredicate function returns a detailed description of the Users who had failed bulk operations", () => {
	let result: string = "";
	let failed: BulkParamsV2[] = [];
	let errors: ProcessedError[] = [];
	let successCases: number = 0;
	let operation: string = "";
	const DT_Scenes_From_A_Memory: Date = new Date("1999-10-26");

	beforeEach(() => {
		result = "";
		failed = [];
		errors = [];
		successCases = 0;
		operation = "";
	});
	it("Should return an empty string when there are no success cases nor failed or errors provided", () => {
		result = "";
		failed = [];
		errors = [];
		successCases = 0;
		operation = "delete";

		expect(failedPredicate(failed, errors, successCases, operation)).toBe(
			result
		);
	});
	it("Should return a No Users could be deleted message when there are no failed or errors provided", () => {
		result =
			"No Users could be deleted. Make sure Users exist or correct parameters are provided.";
		failed = [];
		errors = [];
		successCases = 1;
		operation = "delete";

		expect(failedPredicate(failed, errors, successCases, operation)).toBe(
			result
		);
	});
	it("Should return a No Users could be updated message when there are no failed or errors provided", () => {
		result =
			"No Users could be updated. Make sure Users exist or correct parameters are provided.";
		failed = [];
		errors = [];
		successCases = 1;
		operation = "update";

		expect(failedPredicate(failed, errors, successCases, operation)).toBe(
			result
		);
	});
	it("Should return failed delete message for 1 User", () => {
		result =
			"The following User could not be deleted:\n" +
			"\tUser with full name Don Julio.\n";
		failed = [
			{
				searchQuery: { params: "fullName", query: "Don Julio" },
				operationalQueries: [],
				users: [],
			},
		];
		errors = [];
		successCases = 1;
		operation = "delete";

		expect(failedPredicate(failed, errors, successCases, operation)).toEqual(
			result
		);
	});
	it("Should return failed delete message for 4 Users using every User parameter", () => {
		result =
			"The following Users could not be deleted:\n" +
			"\tUser with full name Jack Daniels.\n" +
			"\tUser with first name Jim.\n" +
			"\tUser with last name Walkers.\n" +
			"\tUser with date of birth October 25 1999.\n";
		failed = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [],
				users: [],
			},
			{
				searchQuery: { params: "firstName", query: "Jim" },
				operationalQueries: [],
				users: [],
			},
			{
				searchQuery: { params: "lastName", query: "Walkers" },
				operationalQueries: [],
				users: [],
			},
			{
				searchQuery: {
					params: "birthDate",
					query: DT_Scenes_From_A_Memory.toString(),
				},
				operationalQueries: [],
				users: [],
			},
		];
		errors = [];
		successCases = 2;
		operation = "delete";

		expect(failedPredicate(failed, errors, successCases, operation)).toEqual(
			result
		);
	});
	it("Should return failed update message for 1 User", () => {
		result =
			"The following User could not be updated:\n" +
			"\tUser with full name Jack Daniels had the following incident:\n" +
			"\t\tfirst name could not be updated to Gentleman Jack.\n";
		failed = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [{ params: "firstName", query: "Gentleman Jack" }],
				users: [],
			},
		];
		errors = [];
		successCases = 12;
		operation = "update";
		expect(failedPredicate(failed, errors, successCases, operation)).toBe(
			result
		);
	});
	it("Should return failed update message for 4 Users using every User parameter", () => {
		result =
			"The following Users could not be updated:\n" +
			"\tUser with full name Jack Daniels had the following incidents:\n" +
			"\t\tfirst name could not be updated to Gentleman Jack.\n" +
			"\t\tlast name could not be updated to Reserved.\n" +
			"\tUser with first name Jim had the following incident:\n" +
			"\t\tfirst name could not be updated to James.\n" +
			"\tUser with last name Walker had the following incident:\n" +
			"\t\tlast name could not be updated to Walker Sr.\n" +
			"\tUser with date of birth June 1 1995 had the following incident:\n" +
			"\t\tdate of birth could not be updated to July 24 1995.\n";
		failed = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [
					{ params: "firstName", query: "Gentleman Jack" },
					{ params: "lastName", query: "Reserved" },
				],
				users: [],
			},
			{
				searchQuery: { params: "firstName", query: "Jim" },
				operationalQueries: [{ params: "firstName", query: "James" }],
				users: [],
			},
			{
				searchQuery: { params: "lastName", query: "Walker" },
				operationalQueries: [{ params: "lastName", query: "Walker Sr" }],
				users: [],
			},
			{
				searchQuery: {
					params: "birthDate",
					query: new Date("1995-6-1").toString(),
				},
				operationalQueries: [
					{ params: "birthDate", query: new Date("1995-7-24").toString() },
				],
				users: [],
			},
		];
		errors = [];
		successCases = 10;
		operation = "update";
		expect(failedPredicate(failed, errors, successCases, operation)).toBe(
			result
		);
	});
	it("Should return failed error message with 1 incident for 1 User", () => {
		result =
			"The following User could not be updated:\n" +
			"\tUser with full name Jack Daniels does not have the following field:\n" +
			"\t\tnickName.\n";
		failed = [];
		errors = [
			{
				bulkItem: {
					searchQuery: { params: "fullName", query: "Jack Daniels" },
					operationQueries: [{ params: "nickName", query: "Jackity Jacks" }],
				},
				message:
					"User with full name Jack Daniels does not have a nick name. Please provide valid parameters",
			},
		];
		successCases = 1;
		operation = "update";
		expect(failedPredicate(failed, errors, successCases, operation)).toBe(
			result
		);
	});
	it("Should return failed error message with 3 incidents for 1 User", () => {
		result =
			"The following User could not be updated:\n" +
			"\tUser with first name Jim does not have the following fields:\n" +
			"\t\tnickName.\n" +
			"\t\tnumber of pets.\n" +
			"\t\tnumber of friends.\n";
		failed = [];
		errors = [
			{
				bulkItem: {
					searchQuery: { params: "firstName", query: "Jim" },
					operationQueries: [
						{ params: "nickName", query: "Jackity Jacks" },
						{ params: "number of pets", query: "4" },
						{ params: "number of friends", query: "100" },
					],
				},
				message:
					"User with full name Jack Daniels does not have a nick name nor number of pets & number of friends. Please provide valid parameters",
			},
		];
		successCases = 1;
		operation = "update";
		expect(failedPredicate(failed, errors, successCases, operation)).toBe(
			result
		);
	});
	it("Should return failed error message with 1 & 2 incidents for 2 User", () => {
		result =
			"The following Users could noe be updated:\n" +
			"\tUser with full name Jack Daniels does not have the following field:\n" +
			"\t\t.nickName\n" +
			"\tUser with first name Jim does not have the following fields:\n" +
			"\t\tnumber of pets.\n" +
			"\t\tnumber of friends.\n";
		failed = [];
		errors = [
			{
				bulkItem: {
					searchQuery: { params: "fullName", query: "Jack Daniels" },
					operationQueries: [{ params: "nickName", query: "The Reaper" }],
				},
				message:
					"User with full name Jack Daniels does not have a nick name. Please provide valid parameters.",
			},
			{
				bulkItem: {
					searchQuery: { params: "firstName", query: "Jim" },
					operationQueries: [
						{ params: "number of pets", query: "2" },
						{ params: "number of friends", query: "200" },
					],
				},
				message:
					"User with first name Jim does not have a number of pets nor number of friends. Please provide valid parameters.",
			},
		];
	});
	it("Should return failed message and error message with 1 incident for 1 User", () => {
		result =
			"The following Users could not be updated:\n" +
			"\tUser with full name Pappy Van Winkle had the following incident:\n" +
			"\t\tfirst name could not be updated to Julian Prentice.\n" +
			"\tUser with full name Pappy Van Winkle does not have the following field:\n" +
			"\t\tnickName.\n";
		failed = [
			{
				searchQuery: { params: "fullName", query: "Pappy Van Winkle" },
				operationalQueries: [{ params: "firstName", query: "Julian Prentice" }],
				users: [],
			},
		];
		errors = [
			{
				bulkItem: {
					searchQuery: { params: "fullName", query: "Pappy Van Winkle" },
					operationQueries: [{ params: "nickName", query: "Pappy Sr" }],
				},
				message:
					"User with full name Pappy Van Winkle does not have a nick name. Please provide valid parameters.",
			},
		];
		successCases = 2;
		operation = "update";
		expect(failedPredicate(failed, errors, successCases, operation)).toBe(
			result
		);
	});
	it("Should return failed message and error message with 3 incidents for 4 Users using every User parameter", () => {
		result =
			"The following Users could not be updated:\n" +
			"\tUser with full name Jack Daniels had the following incidents:\n" +
			"\t\tfirst name could not be updated to Gentleman.\n" +
			"\t\tlast name could not be updated to Reserved.\n" +
			"\tUser with first name Jim had the following incident:\n" +
			"\t\tfirst name could not be updated to James.\n" +
			"\tUser with last name Walker had the following incident:\n" +
			"\t\tlast name could not be updated to Walker Sr.\n" +
			"\tUser with date of birth June 12 1990 had the following incidents:\n" +
			"\t\tdate of birth could not be updated to June 14 1990.\n" +
			"\t\tlast name could not be updated to Pepper.\n" +
			"\tUser with full name Pappy Van Winkle does not have the following fields:\n" +
			"\t\tnickName.\n" +
			"\t\tfavorite sport team.\n" +
			"\tUser with first name Jose does not have the following field:\n" +
			"\t\tfavorite color.\n" +
			"\tUser with last name Buchannan does not have the following field:\n" +
			"\t\tnumber of houses.\n" +
			"\tUser with date of birth August 31 1991 does not have the following fields:\n" +
			"\t\tnumber of pets.\n" +
			"\t\tfavorite dog breed.\n" +
			"\t\tleast favorite cat breed.\n";
		failed = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [
					{ params: "firstName", query: "Gentleman" },
					{ params: "lastName", query: "Reserved" },
				],
				users: [],
			},
			{
				searchQuery: { params: "firstName", query: "Jim" },
				operationalQueries: [{ params: "firstName", query: "James" }],
				users: [],
			},
			{
				searchQuery: { params: "lastName", query: "Walker" },
				operationalQueries: [{ params: "lastName", query: "Walker Sr" }],
				users: [],
			},
			{
				searchQuery: {
					params: "birthDate",
					query: new Date("1990-6-12").toString(),
				},
				operationalQueries: [
					{ params: "birthDate", query: new Date("1990-6-14").toString() },
					{ params: "lastName", query: "Pepper" },
				],
				users: [],
			},
		];
		errors = [
			{
				bulkItem: {
					searchQuery: { params: "fullName", query: "Pappy Van Winkle" },
					operationQueries: [
						{ params: "nickName", query: "Pappy Sr" },
						{ params: "favorite sport team", query: "Kentucky Wildcats" },
					],
				},
				message:
					"User with full name Pappy Van Winkle does not have a nick name nor a favorite sport team. Please provide valid parameters.",
			},
			{
				bulkItem: {
					searchQuery: { params: "firstName", query: "Jose" },
					operationQueries: [{ params: "favorite color", query: "Green" }],
				},
				message:
					"User with first name Jose does not have a favorite color. Please provide valid parameters.",
			},
			{
				bulkItem: {
					searchQuery: { params: "lastName", query: "Buchannan" },
					operationQueries: [{ params: "number of houses", query: "1" }],
				},
				message:
					"User with last name Buchannan does not have a number of houses. Please provide valid parameters.",
			},
			{
				bulkItem: {
					searchQuery: {
						params: "birthDate",
						query: new Date("1991-8-31").toString(),
					},
					operationQueries: [
						{ params: "number of pets", query: "3" },
						{ params: "favorite dog breed", query: "Golden Retriever" },
						{ params: "least favorite cat breed", query: "Exotic Shorthair" },
					],
				},
				message:
					"User with date of birth August 31 1991 does not have a number of pets nor a favorite dog breed and least favorite cat breed. Please provide valid parameters.",
			},
		];
		successCases = 1;
		operation = "update";
		expect(failedPredicate(failed, errors, successCases, operation)).toBe(
			result
		);
	});
});

describe("Full test, SuccessHeading, SuccessPredicate, Failed Predicate", () => {
	let result: string = "";
	let success: BulkParamsV2[] = [];
	let failed: BulkParamsV2[] = [];
	let errors: ProcessedError[] = [];
	let successCases: number = 0;
	let operation: string = "";

	beforeEach(() => {
		result = "";
		success = [];
		failed = [];
		errors = [];
		successCases = 0;
		operation = "";
	});
	it("Should return successful deleted message for 1 User with 1 failed User", () => {
		result =
			"Successfully deleted 1 User.\n" +
			"The following User was deleted:\n" +
			"\tID 1 Jack Daniels.\n" +
			"The following User could not be deleted:\n" +
			"\tUser with full name Don Julio.\n";
		success = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [],
				users: [
					{
						id: 1,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: new Date("2001-2-12"),
					},
				],
			},
		];
		failed = [
			{
				searchQuery: { params: "fullName", query: "Don Julio" },
				operationalQueries: [],
				users: [],
			},
		];
		errors = [];
		successCases = success.length;
		operation = "delete";
		expect(
			successHeading(successCases, operation) +
				successPredicate(success, operation) +
				failedPredicate(failed, errors, successCases, operation)
		).toBe(result);
	});
	it("Should return successful deleted message for 3 Users with 3 failed Users", () => {
		result =
			"Successfully deleted 3 Users.\n" +
			"The following Users were deleted:\n" +
			"\tID 3 Jack Daniels.\n" +
			"\tID 5 Buffalo Trace.\n" +
			"\tID 12 Wild Turkey.\n" +
			"The following Users could not be deleted:\n" +
			"\tUser with full name James Buchannan.\n" +
			"\tUser with first name William.\n" +
			"\tUser with date of birth September 30 2004.\n";
		success = [
			{
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [],
				users: [
					{
						id: 3,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: new Date("2001-2-12"),
					},
				],
			},
			{
				searchQuery: { params: "firstName", query: "Buffalo" },
				operationalQueries: [],
				users: [
					{
						id: 5,
						firstName: "Buffalo",
						lastName: "Trace",
						birthDate: new Date("2001-2-12"),
					},
				],
			},
			{
				searchQuery: { params: "lastName", query: "Turkey" },
				operationalQueries: [],
				users: [
					{
						id: 12,
						firstName: "Wild",
						lastName: "Turkey",
						birthDate: new Date("2001-2-12"),
					},
				],
			},
		];
		failed = [
			{
				searchQuery: { params: "fullName", query: "James Buchannan" },
				operationalQueries: [],
				users: [],
			},
			{
				searchQuery: { params: "firstName", query: "William" },
				operationalQueries: [],
				users: [],
			},
			{
				searchQuery: {
					params: "birthDate",
					query: new Date("2004-9-30").toString(),
				},
				operationalQueries: [],
				users: [],
			},
		];
		errors = [];
		successCases = success.length;
		operation = "delete";
		expect(
			successHeading(successCases, operation) +
				successPredicate(success, operation) +
				failedPredicate(failed, errors, successCases, operation)
		).toBe(result);
	});
});
