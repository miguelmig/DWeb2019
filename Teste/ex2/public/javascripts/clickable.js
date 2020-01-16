$(document).ready(function() {
    $('.clickable').on("click",function(){
        console.log('here');
        window.location = $(this).data('href');
        return false;
    });
});

