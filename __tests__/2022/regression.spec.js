const { getDayModules } = require("../..");

const dir = __dirname.split("/").pop();

[
  [68775, 202585],
  [11449, 13187],
  [8018, 2788],
  [576, 905],
  ["HNSNMTLHQ", "RNLFDJMCT"],
  [1929, 3298],
  [1582412, 3696336],
  [1814, 330786],
  [6018, 2619],
  [14360, "BGKAEREZ"],
].forEach(([answerA, answerB], index) => {
  describe(`Day ${index + 1}`, () => {
    const { A, B } = getDayModules(dir, index + 1);

    it("should be the same", () => {
      expect(A).toBe(answerA);
      expect(B).toBe(answerB);
    });
  });
});
