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

gradesFromSubjects = (grades, subjects) => {
    let results = [];
    subjects.forEach(sbj => {
        results.push(grades[sbj])
    })
    return results;
}

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

gradesMean = grades => {
    return grades.reduce((a, b) => a + b) / grades.length
};


// Creating popup
function modal(result) {

    const text = session.translation.nl

    const container = document.createElement('div');
    container.id = 'modal-container';

    const modal = document.createElement('div');
    container.appendChild(modal);
    modal.id = 'modal';

    const title = document.createElement('h1');
    modal.appendChild(title);
    title.id = 'modal-title';

    const closeContainer = document.createElement('div');
    modal.appendChild(closeContainer);
    closeContainer.id = 'modal-close-container';

    const close = document.createElement('button');
    closeContainer.appendChild(close);
    close.id = 'modal-close';
    close.addEventListener('click', _ => {
        container.remove()
    });
    close.innerText = text.close;

    switch (result) {
        
        case 'pass':
            title.innerText = text.pass_text;
            break;

        case 'discuss':
            title.innerText = text.discuss_text;
            break;

        case 'fail':
            title.innerText = text.fail_text;
            break;

        default:
            title.innerText = text.error_text;
            break;
    }

    document.body.appendChild(container)
}


// Checking code
function calculate(grades) {
    // Combining CKV and MAAT

    if (grades.ckv !== undefined && grades.maat !== undefined) {
        grades.combine = Math.round((grades.ckv + grades.maat) / 2)
        delete grades.ckv;
        delete grades.maat;
    };

    console.log('Checking grades..')
    console.table(grades)

    let result = checkNorms(grades)
    console.log(result)

    switch (result.toString()) {

        case [true,false].toString():
            console.log(`Congrats, you passed!`);
            result = 'pass';
            break;

        case [false,false].toString():
            console.log(`There's still hope! You'll be discussed.`);
            result = 'discuss';
            break;

        case [false,true].toString():
            console.log(`You're not going to make it this year!`);
            result = 'fail';
            break;

        default:
            console.log(`There was an error`);
            result = 'error';
            break;

    };

    return result
};

function checkNorms(grades) {
    const pass = [];
    const fail = [];

    norm.pass.forEach(el => {
        pass.push(el(grades))
    })

    norm.fail.forEach(el => {
        fail.push(el(grades))
    })

    return [pass.includes(true), fail.includes(true)]
};


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
        input.addEventListener('input', evt => {
            if (
                evt.target.value === '' &&
                !evt.target.classList.contains('error')
            ) {
                evt.target.classList.add('error')
            };

            if (evt.target.value !== '' && evt.target.classList.contains('error')) {
                evt.target.classList.remove('error')
            };
        })
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
            const value = parseFloat(el.value);
            if (isNaN(value)) {
                el.classList.add('error');
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

        const result = calculate(means)
        modal(result);
    })
}

// Getting the data
function start() {
    getData()
        .then(([data, translation]) => {
            session.data = data;
            session.translation = translation
            init()
        })
}
window.onload = start