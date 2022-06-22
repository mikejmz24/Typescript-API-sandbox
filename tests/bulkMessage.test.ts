import { BulkParams, User } from "../src/api";
import {
	BulkParamsV2,
	successHeading,
	successPredicate,
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
	let bulkParams: BulkParamsV2[] = [];
	let operation: string = "";
	const DT_Scenes_From_A_Memory: Date = new Date("1999-10-26");

	beforeEach(() => {
		result = "";
		bulkParams = [];
		operation = "";
	});
	it("Should return an empty string when no Users are provided", () => {
		result = "";
		bulkParams = [];
		operation = "delete";
		expect(successPredicate(bulkParams, operation)).toBe(result);
	});
	it("Should return User with last name Jack Daniels was deleted when provided there are no operational queries and User Jack Daniels is the only User provided", () => {
		result = "The following User was deleted:\n" + "\tID 1 Jack Daniels.\n";
		bulkParams = [
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
		expect(successPredicate(bulkParams, operation)).toBe(result);
	});
	it("Should return deleted message The following Users were deleted, along with Users Jack Daniels, Jim Bean & Johnnie Walker's data", () => {
		result =
			"The following Users were deleted:\n" +
			"\tID 1 Jack Daniels.\n" +
			"\tID 2 Jim Bean.\n" +
			"\tID 3 Johnnie Walker.\n";
		bulkParams = [
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
		expect(successPredicate(bulkParams, operation)).toBe(result);
	});
	it("Should return updated message, along with Users Jack Daniels, Jim Bean and Johnnie Walker's data", () => {
		result =
			"The following Users were updated:\n" +
			"\tUser with full name Jack Daniels had the following fields updated:\n" +
			"\t\tfirst name was updated to Gentleman Jack.\n" +
			"\t\tlast name was updated to Daniels Reserved.\n" +
			"\tUser with first name Jim had the following field updated:\n" +
			"\t\tfirst name was updated to James.\n" +
			"\tUser with last name Walker had the following fields updated:\n" +
			"\t\tfirst name was updated to John.\n" +
			"\t\tlast name was updated to Walker Green.\n";
		bulkParams = [
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
		];
		operation = "update";
		expect(successPredicate(bulkParams, operation)).toBe(result);
	});
});
