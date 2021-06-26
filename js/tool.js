fetch('assets/data.json')
    .then(r => r.json())
    .then(json => init(json))

const init = json => {
    console.log(json)
}
