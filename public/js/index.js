$(document).ready(function () {
    var requestConfig = {
        method: "GET",
        url: "http://localhost:3000/reviews/allReviews"
    };
    $.ajax(requestConfig).then(function(responseMessage) {

        console.log(responseMessage);
    })

});