const norm = []

// Pass
norm.pass = []

norm.pass.push(
    function(grades) {
        if (lowestGrade(grades) >= 6) {
            return true
        } else { return false };
    }
);

norm.pass.push(
    function(grades) {
        if (
            lowestGrade(grades) >= 5 &&
            gradeFrequency(grades, 5) <= 1
        ) {
            return true
        } else { return false };
    }
);

norm.pass.push(
    function(grades) {
        if(
            lowestGrade(grades) >= 4 &&
            gradeFrequency(grades, 4) <= 1 &&
            !isCoreSubject(subjectsFromGrades(4))
        ) {

        }
    }
)