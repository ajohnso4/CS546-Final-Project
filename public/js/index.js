$(document).ready(function () {
    var requestConfig = {
        method: "GET",
        url: "http://localhost:3000/reviews/allReviews"
    };
    $.ajax(requestConfig).then(function(responseMessage) {
        $.each(responseMessage, function (_, data) {
            var requestConfig1 = {
                method: "GET",
                url: `http://localhost:3000/restaurants/${data.restaurantId}`
            };
            $.ajax(requestConfig1).then(function(responseMessage1){
                $("#reviewsList").append(
                    `<li>
                        Restaurant: ${responseMessage1.name}
                        Customer: ${data.fullName}
                        Rating: ${data.rating}
                        Review: ${data.review}
                    </li>`
                );
            });

        });
        
    })

});