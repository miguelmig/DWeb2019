
function visualizaItem(id)
{
    console.log('Vou tentar visualizar o ' + id + '...');
    window.location.assign('/nobel/premio/' + id);
}

function fillModal(response)
{
    document.getElementsByTagName("html")[0].innerHTML = response;
}
