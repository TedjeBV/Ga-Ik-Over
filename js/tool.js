const session = []

// Fetch data functions
function getJSON(file) {
    return fetch(file)
        .then(r => r.json())
}

function getData() {
    return Promise.all([getJSON('assets/data.json'), getJSON('assets/translation.json')])
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
        input.name = element;
        input.min = 1;
        input.max = 10;
        input.step = 0.1;
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
        if (session.data.core_subjects.includes(element)) {
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
}

// Getting the data
getData()
    .then(([data, translation]) => {
        session.data = data;
        session.translation = translation
        init()
    })