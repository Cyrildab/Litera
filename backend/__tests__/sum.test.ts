function sum(a: number, b: number) {
  return a + b;
}

test("addition de 2 et 3 donne 5", () => {
  expect(sum(2, 3)).toBe(5);
});
