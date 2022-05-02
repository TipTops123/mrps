function filterServiceStatusCode(data, code) {
    var new_data = data.filter(item => item.service_status_code == code);
    return new_data;
}
$(document).ready(function () {
    var data;
    const labels = [
        'Submission',
        'Form-I issued',
        'Form-II issued',
        'Returned to Applicant for Payment',
        'Received back from Applicant',
        'Rejected',
        'Delivered'
    ];
    $.ajax({
        type: "GET",
        url: "../public/assets/data/test.csv",
        dataType: "text",
        success: function (response) {
            data = $.csv.toObjects(response);
            var code1 = filterServiceStatusCode(data, 1).length;
            var code2 = filterServiceStatusCode(data, 2).length;
            var code3 = filterServiceStatusCode(data, 3).length;
            var code4 = filterServiceStatusCode(data, 4).length;
            var code5 = filterServiceStatusCode(data, 5).length;
            var code6 = filterServiceStatusCode(data, 6).length;
            var code7 = filterServiceStatusCode(data, 7).length;

            var ctx = document.getElementById('serviceChart').getContext('2d');
            var serviceChart = new Chart(ctx, {
                type: 'pie',
                data:
                {
                    labels: labels,
                    datasets: [{
                        label: 'Service Status',
                        backgroundColor: [
                            'rgb(32, 83, 117)',
                            'rgb(68, 106, 70)',
                            'rgb(238, 80, 7)',
                            'rgb(222, 182, 171)',
                            'rgb(248, 203, 46)',
                            'rgb(130, 115, 151)',
                            'rgb(97, 65, 36)'
                        ],
                        data: [code1, code2, code3, code4, code5, code6, code7],
                    }]
                },
                options: {
                    cutoutPercentage: 60,
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        }
    });
    $.LoadingOverlay("hide");
});
