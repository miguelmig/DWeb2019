
function confirmDelete(id)
{
    document.getElementById("modal").style = 'display:block';
    document.getElementById("confirm").onclick = function() { apagaItem(id); }
}


function apagaItem(id)
{
    console.log('Vou tentar apagar o ' + id + '...');
    axios.delete('/' + id)
        .then(response => window.location.assign('/'))
        .catch(error => console.log(error));
}