const A = countSections(0); // is range inside other range
const B = countSections(1); // is upper range overlapping with lower range

function countSections(lowerBoundaryIndex) {
  return (sections) =>
    sections.filter(([a, b]) =>
      areSectionsOverlapping(a, b, lowerBoundaryIndex)
    ).length;
}

function areSectionsOverlapping(assignment1, assigment2, lowerBoundaryIndex) {
  if (
    assignment1[lowerBoundaryIndex] >= assigment2[0] &&
    assignment1[1] <= assigment2[1]
  )
    return true;
  if (
    assigment2[lowerBoundaryIndex] >= assignment1[0] &&
    assigment2[1] <= assignment1[1]
  )
    return true;
  return false;
}

function parse(input) {
  return input.map((line) =>
    line.split(",").map((p) => p.split("-").map(Number))
  );
}

module.exports = { A, B, parse };
