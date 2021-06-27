const session = []

// Fetch data functions
function getJSON(file) {
    return fetch(file)
        .then(r => r.json())
}

function getData() {
    return Promise.all([getJSON('assets/data.json'), getJSON('assets/translation.json')])
}


// Utility code
gradeFrequency = (grades, request) => {
    grades = Object.values(grades)
    const count = new Map([...new Set(grades)].map(
        x => [x, grades.filter(y => y === x).length]
    ));
    let result = count.get(request);
    if (result === undefined) { result = 0 };
    return result
}

lowestGrade = grades => {
    return Math.min(...Object.values(grades))
};

subjectsFromGrades = (grades, request) => {
    return Object.keys(grades).filter(k => grades[k] === request);
};

isCoreSubject = subjects => {
    const core = session.data.core_subjects;
    return subjects.some(r=> core.includes(r))
};

coreSubjectMatches = subjects => {
    return subjects.filter(element => session.data.core_subjects.includes(element))
};

failedSubjects = grades => {
    const failed = [];
    for (const [key, value] of Object.entries(grades)) {
        if (value < 6) { failed.push(key) };
    };
    return failed
};


// Checking code
function check(grades) {
    console.log('Checking grades')
    console.table(grades)

    let result = failedSubjects(grades)

    console.log(result)

    // norm.pass.forEach(el => {
    //     const out = el(grades)
    //     console.log(out)
    // })
}


// Initiate function
function init() {
    const subjects = session.data.subjects;
    const names = session.translation.nl;

    // Creating the subject select buttons
    subjects.forEach(element => {
        const container = document.createElement('div');
        container.classList = 'subject-container';

        const box = document.createElement('input');
        box.setAttribute('type', 'checkbox');
        box.setAttribute('name', element);

        // Input
        const inputContainer = document.createElement('li');
        inputContainer.classList = 'input-container';
        const input = document.createElement('input');
        input.type = 'number'
        input.name = element;
        input.min = 1;
        input.max = 10;
        input.step = 0.1;
        input.required = true;
        input.classList = 'means-input';
        const inputLabel = document.createElement('label');
        inputLabel.for = element;
        inputLabel.innerText = names[element] + ': '
        inputContainer.appendChild(inputLabel);
        inputContainer.appendChild(input);
        
        box.addEventListener('input', el => {
            if (el.target.checked) {
                document.getElementById('means-input').appendChild(inputContainer)
            } else if (!el.target.checked) {
                inputContainer.remove()
            }
        })
        if (session.data.mandatory_subjects.includes(element)) {
            box.checked = true;
            box.disabled = true;
            document.getElementById('means-input').appendChild(inputContainer)
        };

        const label = document.createElement('label');
        label.setAttribute('for', element)
        label.innerText = names[element];

        container.appendChild(box);
        container.appendChild(label)
        document.getElementById('subject-select').appendChild(container);
    });

    document.getElementById('submit-subjects').addEventListener('click', el => {
        // Scroll to next
        const next = document.getElementById(el.target.dataset.scroll);
        if (next !== null) { next.scrollIntoView({ block: 'start',  behavior: 'smooth' }) }
    })
    
    document.getElementById('check').addEventListener('click', _ => {
        let error = false;
        const means = {}
        const els = document.getElementsByClassName('means-input')
        for (let i = 0; i < els.length; i++) {
            const el = els[i]
            const value = parseInt(el.value);
            if (isNaN(value)) {
                el.classList.add('error', true);
                error = true;
                continue;
            } else if (el.classList.contains('error')) {
                el.classList.remove('error')
            }
            means[el.name] = Math.round(value);
        }

        if (error) {
            console.error(`Wasn't able to check grades, an error occured (might not be properly filled in)`)
            return
        };

        check(means)
    })
}

// Getting the data
getData()
    .then(([data, translation]) => {
        session.data = data;
        session.translation = translation
        init()
    })