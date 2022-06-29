import { BulkParams, ProcessedError, User } from "../src/api";
import {
	BulkParamsV2,
	successHeading,
	successPredicate,
	failedPredicate,
	BulkParamsV3,
	bulkMessage,
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
			"The following Users could not be updated:\n" +
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
	it("Should return successful delete message for 1 User with 1 failed User", () => {
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
	it("Should return successful delete message for 3 Users with 3 failed Users", () => {
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
	it("Should return successful update message for 3 Users with 3 failed Users and 3 errors", () => {
		result =
			"Successfully updated 3 Users.\n" +
			"The following Users were updated:\n" +
			"\tUser with full name Jack Daniels had the following fields updated:\n" +
			"\t\tfirst name was updated to Gentleman Jack.\n" +
			"\t\tlast name was updated to Daniels Reserved.\n" +
			"\tUser with first name Jim had the following field updated:\n" +
			"\t\tfirst name was updated to James.\n" +
			"\tUser with last name Regal had the following field updated:\n" +
			"\t\tlast name was updated to Regal Sr.\n" +
			"The following Users could not be updated:\n" +
			"\tUser with full name William Lawson had the following incidents:\n" +
			"\t\tfirst name could not be updated to Bill.\n" +
			"\t\tlast name could not be updated to Lawson Jr.\n" +
			"\tUser with first name Captain had the following incident:\n" +
			"\t\tfirst name could not be updated to Comodore.\n" +
			"\tUser with last name Heineken had the following incident:\n" +
			"\t\tlast name could not be updated to Heinekensen.\n" +
			"\tUser with full name Woodford Reserve does not have the following fields:\n" +
			"\t\tnumber of distilleries.\n" +
			"\t\tnumber of casks.\n" +
			"\tUser with first name Johnny does not have the following field:\n" +
			"\t\tnumber of movies.\n" +
			"\tUser with date of birth June 6 2002 does not have the following field:\n" +
			"\t\tdays played.\n";
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
						birthDate: new Date("2001-5-23"),
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
						id: 22,
						firstName: "James",
						lastName: "Bean",
						birthDate: new Date("2001-5-23"),
					},
				],
			},
			{
				searchQuery: {
					params: "lastName",
					query: "Regal",
				},
				operationalQueries: [{ params: "lastName", query: "Regal Sr" }],
				users: [
					{
						id: 223,
						firstName: "Chivas",
						lastName: "Regal Sr",
						birthDate: new Date("2001-5-23"),
					},
				],
			},
		];
		failed = [
			{
				searchQuery: { params: "fullName", query: "William Lawson" },
				operationalQueries: [
					{ params: "firstName", query: "Bill" },
					{ params: "lastName", query: "Lawson Jr" },
				],
				users: [],
			},
			{
				searchQuery: { params: "firstName", query: "Captain" },
				operationalQueries: [{ params: "firstName", query: "Comodore" }],
				users: [],
			},
			{
				searchQuery: { params: "lastName", query: "Heineken" },
				operationalQueries: [{ params: "lastName", query: "Heinekensen" }],
				users: [],
			},
		];
		errors = [
			{
				bulkItem: {
					searchQuery: { params: "fullName", query: "Woodford Reserve" },
					operationQueries: [
						{ params: "number of distilleries", query: "3" },
						{ params: "number of casks", query: "1000" },
					],
				},
				message:
					"User with full name Woodford Reserve does not have a number of distilleries nor a number of casks. Please provide valid parameters.",
			},
			{
				bulkItem: {
					searchQuery: { params: "firstName", query: "Johnny" },
					operationQueries: [{ params: "number of movies", query: "233" }],
				},
				message:
					"User with first name Johnny does not have a number of movies. Please provide valid parameters.",
			},
			{
				bulkItem: {
					searchQuery: {
						params: "birthDate",
						query: new Date("2002-6-6").toString(),
					},
					operationQueries: [{ params: "days played", query: "2333" }],
				},
				message:
					"User with date of birth June 6 2002 does not have a days played. Please provide valid parameters.",
			},
		];
		successCases = success.length;
		operation = "update";
		expect(
			successHeading(successCases, operation) +
				successPredicate(success, operation) +
				failedPredicate(failed, errors, successCases, operation)
		).toBe(result);
	});
});

describe("bulkMessage returns a descriptive message of the bulk operation performed including success, fails and errors", () => {
	let results: BulkParamsV3[] = [];
	let operation: string = "";
	let message: string = "";
	const Donkey_Kong_Country: Date = new Date("1994-11-21");

	beforeEach(() => {
		results = [];
		operation = "";
		message = "";
	});
	it("Should return an empty message when no results provided", () => {
		message = "";
		results = [];
		operation = "delete";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return delete success message for 1 User", () => {
		message =
			"Successfully deleted 1 User:\n" +
			"The following User was deleted:\n" +
			"\tID 12 Jack Daniels.\n";
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Jack Daniels" },
				operationalQueries: [],
				users: [
					{
						id: 12,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: Donkey_Kong_Country,
					},
				],
			},
		];
		operation = "delete";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return update success message for 1 User", () => {
		message =
			"Successfully updated 1 User:\n" +
			"The following User was updated:\n" +
			"\tUser with full name Wild Turkey had the following fields updated:\n" +
			"\t\tUser ID 112 Wild Turkey's first name was updated to Wylde.\n" +
			"\t\tUser ID 112 Wild Turkey's last name was updated to Turk.\n" +
			"\t\tUser ID 112 Wild Turkey's date of birth was updated to September 19 2003.\n";
		results = [
			{
				type: "success",
				searchQuery: { params: "fullName", query: "Wild Turkey" },
				operationalQueries: [
					{ params: "firstName", query: "Wylde" },
					{ params: "lastName", query: "Turk" },
					{ params: "birthDate", query: new Date("2003-9-19").toString() },
				],
				users: [
					{
						id: 112,
						firstName: "Wild",
						lastName: "Turkey",
						birthDate: Donkey_Kong_Country,
					},
				],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return delete success message for 45 Users", () => {
		message =
			"Successfully deleted 45 Users:\n" +
			"The following Users were deleted:\n" +
			"\tID 1 Jack Daniels.\n" +
			"\tID 2 Jack Daniels.\n" +
			"\tID 3 Jack Daniels.\n" +
			"\tID 4 Jack Daniels.\n" +
			"\tID 5 Jack Daniels.\n" +
			"\tID 6 Jack Daniels.\n" +
			"\tID 7 Jack Daniels.\n" +
			"\tID 8 Jack Daniels.\n" +
			"\tID 9 Jack Daniels.\n" +
			"\tID 10 Jack Daniels.\n" +
			"\tID 11 Jack Daniels.\n" +
			"\tID 12 Jack Daniels.\n" +
			"\tID 13 Jack Daniels.\n" +
			"\tID 14 Jack Daniels.\n" +
			"\tID 15 Jack Daniels.\n" +
			"\tID 16 Jim Bean.\n" +
			"\tID 17 Jim Bean.\n" +
			"\tID 18 Jim Bean.\n" +
			"\tID 19 Jim Bean.\n" +
			"\tID 20 Jim Bean.\n" +
			"\tID 21 Jim Bean.\n" +
			"\tID 22 Jim Bean.\n" +
			"\tID 23 Jim Bean.\n" +
			"\tID 24 Jim Bean.\n" +
			"\tID 25 Jim Bean.\n" +
			"\tID 26 Jim Bean.\n" +
			"\tID 27 Jim Bean.\n" +
			"\tID 28 Jim Bean.\n" +
			"\tID 29 Jim Bean.\n" +
			"\tID 30 Jim Bean.\n" +
			"\tID 31 Johnny Walker.\n" +
			"\tID 32 Johnny Walker.\n" +
			"\tID 33 Johnny Walker.\n" +
			"\tID 34 Johnny Walker.\n" +
			"\tID 35 Johnny Walker.\n" +
			"\tID 36 Johnny Walker.\n" +
			"\tID 37 Johnny Walker.\n" +
			"\tID 38 Johnny Walker.\n" +
			"\tID 39 Johnny Walker.\n" +
			"\tID 40 Johnny Walker.\n" +
			"\tID 41 Johnny Walker.\n" +
			"\tID 42 Johnny Walker.\n" +
			"\tID 43 Johnny Walker.\n" +
			"\tID 44 Johnny Walker.\n" +
			"\tID 45 Johnny Walker.\n";

		let userArray: User[] = [];

		for (let i: number = 1; i < 16; i++) {
			userArray.push({
				id: i,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: Donkey_Kong_Country,
			});
		}
		results.push({
			type: "success",
			searchQuery: { params: "fullName", query: "Jack Daniels" },
			operationalQueries: [],
			users: userArray,
		});
		userArray = [];

		for (let i: number = 16; i < 31; i++) {
			userArray.push({
				id: i,
				firstName: "Jim",
				lastName: "Bean",
				birthDate: Donkey_Kong_Country,
			});
		}
		results.push({
			type: "success",
			searchQuery: { params: "fullName", query: "Jim Bean" },
			operationalQueries: [],
			users: userArray,
		});
		userArray = [];

		for (let i: number = 31; i < 46; i++) {
			userArray.push({
				id: i,
				firstName: "Johnny",
				lastName: "Walker",
				birthDate: Donkey_Kong_Country,
			});
		}
		results.push({
			type: "success",
			searchQuery: { params: "fullName", query: "Johnny Walker" },
			operationalQueries: [],
			users: userArray,
		});
		userArray = [];
		operation = "delete";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return an update success message for 3 queries with 4 Users each", () => {
		message =
			"Successfully updated 12 Users:\n" +
			"The following Users were updated:\n" +
			"\tUsers with full name Jack Daniels had the following fields updated:\n" +
			"\t\tUser ID 1 Jack Daniels's first name was updated to Gentleman Jack.\n" +
			"\t\tUser ID 1 Jack Daniels's last name was updated to Reserved.\n" +
			"\t\tUser ID 1 Jack Daniels's date of birth was updated to September 30 1998.\n" +
			"\t\tUser ID 11 Jack Daniels's first name was updated to Gentleman Jack.\n" +
			"\t\tUser ID 11 Jack Daniels's last name was updated to Reserved.\n" +
			"\t\tUser ID 11 Jack Daniels's date of birth was updated to September 30 1998.\n" +
			"\t\tUser ID 111 Jack Daniels's first name was updated to Gentleman Jack.\n" +
			"\t\tUser ID 111 Jack Daniels's last name was updated to Reserved.\n" +
			"\t\tUser ID 111 Jack Daniels's date of birth was updated to September 30 1998.\n" +
			"\t\tUser ID 1111 Jack Daniels's first name was updated to Gentleman Jack.\n" +
			"\t\tUser ID 1111 Jack Daniels's last name was updated to Reserved.\n" +
			"\t\tUser ID 1111 Jack Daniels's date of birth was updated to September 30 1998.\n" +
			"\tUsers with date of birth September 12 1977 had the following fields updated:\n" +
			"\t\tUser ID 2 Jim Bean's first name was updated to James.\n" +
			"\t\tUser ID 2 Jim Bean's last name was updated to McCallister.\n" +
			"\t\tUser ID 2 Jim Bean's date of birth was updated to November 2 1989.\n" +
			"\t\tUser ID 22 Jim Bean's first name was updated to James.\n" +
			"\t\tUser ID 22 Jim Bean's last name was updated to McCallister.\n" +
			"\t\tUser ID 22 Jim Bean's date of birth was updated to November 2 1989.\n" +
			"\t\tUser ID 222 Jim Bean's first name was updated to James.\n" +
			"\t\tUser ID 222 Jim Bean's last name was updated to McCallister.\n" +
			"\t\tUser ID 222 Jim Bean's date of birth was updated to November 2 1989.\n" +
			"\t\tUser ID 2222 Jim Bean's first name was updated to James.\n" +
			"\t\tUser ID 2222 Jim Bean's last name was updated to McCallister.\n" +
			"\t\tUser ID 2222 Jim Bean's date of birth was updated to November 2 1989.\n" +
			"\tUsers with last name Harris had the following fields updated:\n" +
			"\t\tUser ID 3 Steve Harris's first name was updated to Eddie.\n" +
			"\t\tUser ID 3 Steve Harris's last name was updated to T Head.\n" +
			"\t\tUser ID 3 Steve Harris's date of birth was updated to April 14 1980.\n" +
			"\t\tUser ID 33 Steve Harris's first name was updated to Eddie.\n" +
			"\t\tUser ID 33 Steve Harris's last name was updated to T Head.\n" +
			"\t\tUser ID 33 Steve Harris's date of birth was updated to April 14 1980.\n" +
			"\t\tUser ID 333 Steve Harris's first name was updated to Eddie.\n" +
			"\t\tUser ID 333 Steve Harris's last name was updated to T Head.\n" +
			"\t\tUser ID 333 Steve Harris's date of birth was updated to April 14 1980.\n" +
			"\t\tUser ID 3333 Steve Harris's first name was updated to Eddie.\n" +
			"\t\tUser ID 3333 Steve Harris's last name was updated to T Head.\n" +
			"\t\tUser ID 3333 Steve Harris's date of birth was updated to April 14 1980.\n";

		let userArray: User[] = [];
		for (let i: number = 1; i < 1112; i = i * 10 + 1) {
			userArray.push({
				id: i,
				firstName: "Jack",
				lastName: "Daniels",
				birthDate: new Date("1999-1-1"),
			});
		}
		results.push({
			type: "success",
			searchQuery: {
				params: "fullName",
				query: "Jack Daniels",
			},
			operationalQueries: [
				{ params: "firstName", query: "Gentleman Jack" },
				{ params: "lastName", query: "Reserved" },
				{ params: "birthDate", query: new Date("1998-9-30").toString() },
			],
			users: userArray,
		});
		userArray = [];
		for (let i: number = 2; i < 2223; i = i * 10 + 2) {
			userArray.push({
				id: i,
				firstName: "Jim",
				lastName: "Bean",
				birthDate: new Date("1999-01-01"),
			});
		}
		results.push({
			type: "success",
			searchQuery: {
				params: "birthDate",
				query: new Date("1977-9-12").toString(),
			},
			operationalQueries: [
				{ params: "firstName", query: "James" },
				{ params: "lastName", query: "McCallister" },
				{ params: "birthDate", query: new Date("1989-11-2").toString() },
			],
			users: userArray,
		});
		userArray = [];
		for (let i: number = 3; i < 3334; i = i * 10 + 3) {
			userArray.push({
				id: i,
				firstName: "Steve",
				lastName: "Harris",
				birthDate: new Date("1999-01-01"),
			});
		}
		results.push({
			type: "success",
			searchQuery: {
				params: "lastName",
				query: "Harris",
			},
			operationalQueries: [
				{ params: "firstName", query: "Eddie" },
				{ params: "lastName", query: "T Head" },
				{ params: "birthDate", query: new Date("1980-4-14").toString() },
			],
			users: userArray,
		});
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
	it("Should return update success message for 10 Users", () => {
		message =
			"Successfully updated 10 Users:\n" +
			"The following Users were updated:\n" +
			"\tUser with full name Jim Bean had the following fields updated:\n" +
			"\t\tUser ID 1 Jim Bean's first name was updated to James.\n" +
			"\t\tUser ID 1 Jim Bean's last name was updated to Bean Jr.\n" +
			"\tUsers with first name Julio had the following field updated:\n" +
			"\t\tUser ID 2 Julio Limon's first name was updated to Don Julio.\n" +
			"\t\tUser ID 23 Julio Bacardi's first name was updated to Don Julio.\n" +
			"\tUser with last name Walker had the following fields updated:\n" +
			"\t\tUser ID 3 John Walker's first name was updated to Johnnie.\n" +
			"\t\tUser ID 3 John Walker's last name was updated to Walker Green.\n" +
			"\tUser with date of birth October 25 1999 had the following fields updated:\n" +
			"\t\tUser ID 4 Jose Cuervo's first name was updated to Jose.\n" +
			"\t\tUser ID 4 Jose Cuervo's last name was updated to Cuervo.\n" +
			"\t\tUser ID 4 Jose Cuervo's date of birth was updated to October 26 1999.\n" +
			"\tUser with full name Jack Daniels had the following fields updated:\n" +
			"\t\tUser ID 5 Jack Daniels's first name was updated to Gentleman Jack.\n" +
			"\t\tUser ID 5 Jack Daniels's last name was updated to Daniels Reserved.\n" +
			"\tUser with first name Captain had the following field updated:\n" +
			"\t\tUser ID 6 Captain Morgan's first name was updated to Comodore.\n" +
			"\tUser with last name Buchannan had the following fields updated:\n" +
			"\t\tUser ID 7 James Buchannan's first name was updated to William.\n" +
			"\t\tUser ID 7 James Buchannan's last name was updated to Lawson.\n" +
			"\tUser with last name Regal had the following fields updated:\n" +
			"\t\tUser ID 8 Chivas Regal's first name was updated to Royal.\n" +
			"\t\tUser ID 8 Chivas Regal's last name was updated to Salute.\n" +
			"\tUser with date of birth August 31 2002 had the following fields updated:\n" +
			"\t\tUser ID 9 Courvoisier VS's first name was updated to Courvoisier.\n" +
			"\t\tUser ID 9 Courvoisier VS's last name was updated to XO.\n" +
			"\t\tUser ID 9 Courvoisier VS's date of birth was updated to November 20 1988.\n";
		results = [
			{
				type: "success",
				searchQuery: {
					params: "fullName",
					query: "Jim Bean",
				},
				operationalQueries: [
					{ params: "firstName", query: "James" },
					{ params: "lastName", query: "Bean Jr" },
				],
				users: [
					{
						id: 1,
						firstName: "Jim",
						lastName: "Bean",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "firstName",
					query: "Julio",
				},
				operationalQueries: [{ params: "firstName", query: "Don Julio" }],
				users: [
					{
						id: 2,
						firstName: "Julio",
						lastName: "Limon",
						birthDate: new Date("1999-01-01"),
					},
					{
						id: 23,
						firstName: "Julio",
						lastName: "Bacardi",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "lastName",
					query: "Walker",
				},
				operationalQueries: [
					{ params: "firstName", query: "Johnnie" },
					{ params: "lastName", query: "Walker Green" },
				],
				users: [
					{
						id: 3,
						firstName: "John",
						lastName: "Walker",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "birthDate",
					query: new Date("1999-10-26").toString(),
				},
				operationalQueries: [
					{ params: "firstName", query: "Jose" },
					{ params: "lastName", query: "Cuervo" },
					{ params: "birthDate", query: new Date("1999-10-27").toString() },
				],
				users: [
					{
						id: 4,
						firstName: "Jose",
						lastName: "Cuervo",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
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
						id: 5,
						firstName: "Jack",
						lastName: "Daniels",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "firstName",
					query: "Captain",
				},
				operationalQueries: [{ params: "firstName", query: "Comodore" }],
				users: [
					{
						id: 6,
						firstName: "Captain",
						lastName: "Morgan",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "lastName",
					query: "Buchannan",
				},
				operationalQueries: [
					{ params: "firstName", query: "William" },
					{ params: "lastName", query: "Lawson" },
				],
				users: [
					{
						id: 7,
						firstName: "James",
						lastName: "Buchannan",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "lastName",
					query: "Regal",
				},
				operationalQueries: [
					{ params: "firstName", query: "Royal" },
					{ params: "lastName", query: "Salute" },
				],
				users: [
					{
						id: 8,
						firstName: "Chivas",
						lastName: "Regal",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
			{
				type: "success",
				searchQuery: {
					params: "birthDate",
					query: new Date("2002-8-31").toString(),
				},
				operationalQueries: [
					{ params: "firstName", query: "Courvoisier" },
					{ params: "lastName", query: "XO" },
					{ params: "birthDate", query: new Date("1988-11-21").toString() },
				],
				users: [
					{
						id: 9,
						firstName: "Courvoisier",
						lastName: "VS",
						birthDate: new Date("1999-01-01"),
					},
				],
			},
		];
		operation = "update";
		expect(bulkMessage(results, operation)).toBe(message);
	});
});
