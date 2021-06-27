const norm = []

// Pass
norm.pass = [];

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
            return true
        } else { return false };
    }
);

norm.pass.push(
    function(grades) {
        if (
            lowestGrade(grades) >= 5 &&
            coreSubjectMatches(subjectsFromGrades(grades, 5)).length <= 1
        ) {
            return true
        } else { return false };
    }
);

// Fail
norm.fail = [];

norm.fail.push(
    grades => {
        if (failedSubjects(grades).length > 3) {
            return true
        } else { return false };
    }
);

norm.fail.push(
    grades => {
        if (
            failedSubjects(grades).length > 3 &&
            lowestGrade(grades) >= 4 &&
            !(
                subjectsFromGrades(grades, 5).length <= 3 ||
                (
                    subjectsFromGrades(grades, 5).length <= 2 &&
                    subjectsFromGrades(grades, 1).length <= 1
                )
            )
        ) {
            return true
        } else { return false };
    }
)

norm.fail.push(
    grades => {
        if(
            coreSubjectMatches(failedSubjects(grades)).length > 2 &&
            !(
                subjectsFromGrades(grades, coreSubjectMatches(failedSubjects(grades))) === [5, 5]
            )
        ) {
            return true
        } else { return false };
    }
);
