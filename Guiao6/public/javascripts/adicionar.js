
function adicionarItem()
{
    console.log('Vou tentar adicionar um novo item ...');
    axios.get('/add-item/')
        .then(response => fillModal(response.data))
        .catch(error => console.log(error));
}

function fillModal(response)
{
    document.getElementsByTagName("html")[0].innerHTML = response;
}
