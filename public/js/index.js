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
                        <a href="http://localhost:3000/restaurants/${responseMessage1._id}">${responseMessage1.name}</a>
                    </li>`
                );
            });

        });
        
    }).then(function () {
        $("#reviewsList").show();
    });
});

(function ($) {
    $("#reviewsList").on("click", "li a", function(event) {
        event.preventDefault();
        $("#reviewsList").css({display:"none"});
        $("#review").empty();
        var requestConfig = {
            method: "GET",
            url: event.target.href
        };
        $.ajax(requestConfig).then(function(responseMessage) {
            for (let review of responseMessage.reviews) {
                $("#review").append(`<ul>
                    <li>Restaurant: ${responseMessage.name}</li>
                    <li>Customer: ${review.fullName}</li>
                    <li>Rating: ${review.rating}</li>
                    <li>Review: ${review.review}</li>
                </ul>`);
            }
        }).then(function () {
            $("#review").show();
        });

    })
})(window.jQuery);