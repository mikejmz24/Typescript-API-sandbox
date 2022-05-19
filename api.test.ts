import { CreateUser, sum } from "./api"

test("Sum 3 + 5 returns 8", () => {
    expect(sum(3, 5)).toBe(8);
});

test("Create new User returns Jack Daniel's data", ()=> {
    expect(CreateUser("Jack", "Daniels", 10)).toEqual({
        "id": 1,
        "firstName": "Jack",
        "lastName": "Daniels",
        "age": 10
    });
});