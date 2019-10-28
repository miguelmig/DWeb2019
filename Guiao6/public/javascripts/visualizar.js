
function visualizaItem(id)
{
    console.log('Vou tentar visualizar o ' + id + '...');
    //document.getElementById('modal').style.display='block';
    axios.get('/' + id)
        .then(response => fillModal(response.data))
        .catch(error => console.log(error));
}

function fillModal(response)
{
    document.getElementsByTagName("html")[0].innerHTML = response;
}
