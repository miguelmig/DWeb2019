
function editaItem(id)
{
    console.log('Vou tentar editar o ' + id + '...');
    axios.get('/edit-item/' + id)
        .then(response => fillModal(response.data))
        .catch(error => console.log(error));
}

function fillModal(response)
{
    document.getElementsByTagName("html")[0].innerHTML = response;
}

function sendEditarItem(id)
{
    console.log('Enviar informação para alteração do arquivo');
    var formElement = document.getElementById('form');

    const formData = new FormData(formElement);
    const formEntries = formData.entries();
    const json = Object.assign(...Array.from(formEntries, ([x,y]) => ({[x]:y})));
    axios.put('/filmes/' + id, json).then(_ => window.location.assign('/filmes'));
    return false;
}