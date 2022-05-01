var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

function sortByProperty(property) {
    return function (a, b) {
        if (a[property] > b[property])
            return 1;
        else if (a[property] < b[property])
            return -1;

        return 0;
    }
}

function filterStatus(data, status) {
    var new_data = data.filter(item => item.office_status == status);
    return new_data;
}

function slaFilter(array1, array2) {
    array2.forEach(function (element) {
        var filtered = array1.filter(function (item) {
            return element.heading == item.heading;
        });
        if (filtered.length == 0) {
            array1.push({ "heading": element.heading, "total": 0 });
        }
    });
    return array1;
}

var sla_arr = [{ "heading": 'Crossed SLA' }, { "heading": 'Within SLA' }];

var service_arr = [
    {
        "service_status_code": 1,
        "service_status": 'Submission'
    },
    {
        "service_status_code": 2,
        "service_status": 'Form-I issued'
    },
    {
        "service_status_code": 3,
        "service_status": 'Form-II issued'
    },
    {
        "service_status_code": 4,
        "service_status": 'Returned to Applicant for Payment'
    },
    {
        "service_status_code": 5,
        "service_status": 'Received back from Applicant'
    },
    {
        "service_status_code": 6,
        "service_status": 'Rejected'
    },
    {
        "service_status_code": 7,
        "service_status": 'Delivered'
    },
];

function filterService(array1, array2) {
    array2.forEach(function (element) {
        var filtered = array1.filter(function (item) {
            return element.service_status_code == Number(item.service_status_code);
        });
        if (filtered.length == 0) {
            array1.push({ "service_status_code": element.service_status_code, "total": 0 });
        }
    });
    return array1;
}

// function headerFix(data) {
//     var array = [];
//     for (var a = 1; a <= data.length; a++) {
//         console.log(data[a][7])
//         var app_name = data[a][7];
//         array.push({
//             "applicant_name": app_name,
//             "application_code": data[a][15],
//             "date_of_action_as_per_service_status": data[a][12],
//             "due_date_if_form_I_issued_or_received_back_from_applicant": data[a][10],
//             "no_of_days_left": data[a][13],
//             "no_of_sla_days": data[a][0],
//             "office_code": data[a][3],
//             "office_name": data[a][8],
//             "sla_status": data[a][5],
//             "service_code": data[a][4],
//             "service_name": data[a][6],
//             "service_status": data[a][14],
//             "service_status_code": data[a][1],
//             "sub_service_code": data[a][11],
//             "sub_service_name": data[a][2],
//             "office_status": data[a][9],
//         });
//     }
//     return array;
// }

$(document).ready(function () {
    var data;
    $.ajax({
        type: "GET",
        url: "../public/assets/data/test1.csv",
        dataType: "text",
        success: function (response) {
            data = $.csv.toObjects(response);
            // console.log(data);
            // data = $.csv.toObjects(response, {}, function (err, data) {
            //     $.each(data, function (index, row) {
            //         $.each(row, function (key, value) {
            //             var newKey = $.trim(key);
            //             // if (typeof value === 'string') {
            //             data[index][newKey] = $.trim(value);
            //             // }
            //             // if (newKey !== key) {
            //             //     delete data[index][key];
            //             // }
            //         });
            //     });
            //     // processedData = data;
            // });

            var office_status = Object.values(groupBy(data, 'office_status'));
            // console.log(office_status.length);
            var level1arr = [];
            office_status.forEach((ele) => {
                var status = ele[0].office_status;
                var count = ele.length;
                var off_sts_name = status.match(/\w+$/)[0].toLowerCase();
                // console.log(off_sts_name);
                // console.log(status);
                // console.log(count);
                level1arr.push({ "heading": status, "total": count, "btnid": off_sts_name });
            });
            level1arr.sort(sortByProperty("heading"));
            // console.log(level1arr);

            for (var c = 0; c < level1arr.length;) {
                c++;
                $('#btn' + c).text(level1arr[c - 1].heading);
                $('#count' + c).text(level1arr[c - 1].total);
                $('#card' + c + ' > button').attr('id', level1arr[c - 1].btnid);
                $('#card' + c).show();
            }

            $('#applicant').on('click', function () {
                var status = "Pending With Applicant";
                var pwa_data = filterStatus(data, status);
                var pwa_g_total = pwa_data.length;
                // console.log(pwa_data);
                var pwa_sla_status = Object.values(groupBy(pwa_data, 'sla_status'));
                var sla_pwa_arr = [];
                pwa_sla_status.forEach((ele) => {
                    var status = ele[0].sla_status;
                    var count = ele.length;
                    sla_pwa_arr.push({ "heading": status, "total": count });
                });
                // console.log(sla_pwa_arr);
                var pwa_sla = slaFilter(sla_pwa_arr, sla_arr);
                sla_pwa_arr.sort(sortByProperty("heading"));
                // console.log(pwa_sla);
                $('#sla > div > button').attr('id', 'appbtn');
                $('#caption').text(status);
                if (pwa_sla[0].total > 0) {
                    var cs = '<td><a href="#" id="app_sla_cs" class="text-decoration-none">' + pwa_sla[0].total + '</a></td>';
                }
                else {
                    var cs = '<td>' + pwa_sla[0].total + '</td>';
                }

                if (pwa_sla[1].total > 0) {
                    var ws = '<td><a href="#" id="app_sla_ws" class="text-decoration-none">' + pwa_sla[1].total + '</a></td>';
                }
                else {
                    var ws = '<td>' + pwa_sla[1].total + '</td>';
                }

                $('#sla > table > tbody').append('<tr>' + cs + ws + '<td>' + pwa_g_total + '</td></tr>');
                $('#main').hide();
                $('#sla').show();

                $('#appbtn').on('click', function () {
                    $('#sla').hide();
                    $('#sla > table > tbody > tr').remove();
                    $('#main').show();
                });

                $('#app_sla_cs').on('click', function () {
                    var service_sts = Object.values(groupBy(pwa_sla_status[1], 'service_status_code'));
                    // console.log(service_sts);
                    var svc_sts_arr = [];
                    service_sts.forEach((ele) => {
                        var status = Number(ele[0].service_status_code);
                        var count = ele.length;
                        svc_sts_arr.push({ "service_status_code": status, "total": count });
                    });

                    var pwa_svc = filterService(svc_sts_arr, service_arr);

                    pwa_svc.sort(sortByProperty('service_status_code'));

                    if (pwa_svc[0].total > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + pwa_svc[0].total + '</a></td>';
                    } else {
                        var sub = '<td>' + pwa_svc[0].total + '</td>';
                    }
                    if (pwa_svc[1].total > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + pwa_svc[1].total + '</a></td>';
                    } else {
                        var form1 = '<td>' + pwa_svc[1].total + '</td>';
                    }
                    if (pwa_svc[2].total > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + pwa_svc[2].total + '</a></td>';
                    } else {
                        var form2 = '<td>' + pwa_svc[2].total + '</td>';
                    }
                    if (pwa_svc[3].total > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + pwa_svc[3].total + '</a></td>';
                    } else {
                        var app_pay = '<td>' + pwa_svc[3].total + '</td>';
                    }
                    if (pwa_svc[4].total > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + pwa_svc[4].total + '</a></td>';
                    } else {
                        var rec_app = '<td>' + pwa_svc[4].total + '</td>';
                    }
                    if (pwa_svc[5].total > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + pwa_svc[5].total + '</a></td>';
                    } else {
                        var rejected = '<td>' + pwa_svc[5].total + '</td>';
                    }
                    if (pwa_svc[6].total > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + pwa_svc[6].total + '</a></td>';
                    } else {
                        var delivered = '<td>' + pwa_svc[6].total + '</td>';
                    }
                    $('#service > div > button').attr('id', 'appservice');
                    $('#service_caption').text('Beyond SLA');
                    $('#service > table > tbody').append('<tr>' + sub + form1 + form2 + app_pay + rec_app + rejected + delivered + '</tr>');
                    $('#sla').hide();
                    $('#service').show();

                    $('#appservice').on('click', function () {
                        $('#service').hide();
                        $('#service > table > tbody > tr').remove();
                        $('#sla').show();
                    });

                    $('#sub_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 1);
                        $('#details_caption').text('Submission');
                        $('#details > div > button').attr('id', 'sub_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#sub_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#form1_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 2);
                        $('#details_caption').text('Form-I issued');
                        $('#details > div > button').attr('id', 'form1_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#form1_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#form2_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 3);
                        $('#details_caption').text('Form-II issued');
                        $('#details > div > button').attr('id', 'form2_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#form2_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#app_pay_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 4);
                        $('#details_caption').text('Returned to Applicant for Payment');
                        $('#details > div > button').attr('id', 'app_pay_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#app_pay_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#rec_app_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 5);
                        $('#details_caption').text('Received back from Applicant');
                        $('#details > div > button').attr('id', 'rec_app_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#rec_app_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#rejected_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 6);
                        $('#details_caption').text('Rejected');
                        $('#details > div > button').attr('id', 'rej_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#rej_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#delivered_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 7);
                        $('#details_caption').text('Delivered');
                        $('#details > div > button').attr('id', 'deliv_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#deliv_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                });

                $('#app_sla_ws').on('click', function () {
                    var service_sts = Object.values(groupBy(pwa_sla_status[0], 'service_status_code'));
                    console.log(service_sts);
                    var svc_sts_arr = [];
                    service_sts.forEach((ele) => {
                        var status = Number(ele[0].service_status_code);
                        var count = ele.length;
                        svc_sts_arr.push({ "service_status_code": status, "total": count });
                    });

                    var pwa_svc = filterService(svc_sts_arr, service_arr);

                    pwa_svc.sort(sortByProperty('service_status_code'));

                    if (pwa_svc[0].total > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + pwa_svc[0].total + '</a></td>';
                    } else {
                        var sub = '<td>' + pwa_svc[0].total + '</td>';
                    }
                    if (pwa_svc[1].total > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + pwa_svc[1].total + '</a></td>';
                    } else {
                        var form1 = '<td>' + pwa_svc[1].total + '</td>';
                    }
                    if (pwa_svc[2].total > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + pwa_svc[2].total + '</a></td>';
                    } else {
                        var form2 = '<td>' + pwa_svc[2].total + '</td>';
                    }
                    if (pwa_svc[3].total > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + pwa_svc[3].total + '</a></td>';
                    } else {
                        var app_pay = '<td>' + pwa_svc[3].total + '</td>';
                    }
                    if (pwa_svc[4].total > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + pwa_svc[4].total + '</a></td>';
                    } else {
                        var rec_app = '<td>' + pwa_svc[4].total + '</td>';
                    }
                    if (pwa_svc[5].total > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + pwa_svc[5].total + '</a></td>';
                    } else {
                        var rejected = '<td>' + pwa_svc[5].total + '</td>';
                    }
                    if (pwa_svc[6].total > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + pwa_svc[6].total + '</a></td>';
                    } else {
                        var delivered = '<td>' + pwa_svc[6].total + '</td>';
                    }
                    $('#service > div > button').attr('id', 'appservice');
                    $('#service_caption').text('Within SLA');
                    $('#service > table > tbody').append('<tr>' + sub + form1 + form2 + app_pay + rec_app + rejected + delivered + '</tr>');
                    $('#sla').hide();
                    $('#service').show();

                    $('#appservice').on('click', function () {
                        $('#service').hide();
                        $('#service > table > tbody > tr').remove();
                        $('#sla').show();
                    });
                    $('#sub_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Within SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 1);
                        $('#details_caption').text('Submission');
                        $('#details > div > button').attr('id', 'sub_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#sub_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#form1_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Within SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 2);
                        $('#details_caption').text('Form-I issued');
                        $('#details > div > button').attr('id', 'form1_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#form1_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#form2_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Within SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 3);
                        $('#details_caption').text('Form-II issued');
                        $('#details > div > button').attr('id', 'form2_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#form2_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#app_pay_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Within SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 4);
                        $('#details_caption').text('Returned to Applicant for Payment');
                        $('#details > div > button').attr('id', 'app_pay_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#app_pay_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#rec_app_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Within SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 5);
                        $('#details_caption').text('Received back from Applicant');
                        $('#details > div > button').attr('id', 'rec_app_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#rec_app_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#rejected_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Within SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 6);
                        $('#details_caption').text('Rejected');
                        $('#details > div > button').attr('id', 'rej_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#rej_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#delivered_svc').on('click', function () {
                        var pwa_sla_status = pwa_data.filter(item => item.sla_status == 'Within SLA');
                        var pwa_service_status = pwa_sla_status.filter(item => item.service_status_code == 7);
                        $('#details_caption').text('Delivered');
                        $('#details > div > button').attr('id', 'deliv_det');
                        pwa_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#deliv_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                });
            });



            $('#office').on('click', function () {
                var status = "Pending With Office";
                var pwo_data = filterStatus(data, status);
                var pwo_g_total = pwo_data.length;
                var pwo_sla_status = Object.values(groupBy(pwo_data, 'sla_status'));
                // console.log(pwo_sla_status);
                var sla_off_arr = [];
                pwo_sla_status.forEach((ele) => {
                    var status = ele[0].sla_status;
                    var count = ele.length;
                    // var sla_sts_name = status.match(/\w+$/)[0].toLowerCase();
                    // console.log(sla_sts_name);
                    // console.log(status);
                    // console.log(count);
                    sla_off_arr.push({ "heading": status, "total": count });
                });
                sla_off_arr.sort(sortByProperty("heading"));
                var off_sla = slaFilter(sla_off_arr, sla_arr);
                // console.log(off_sla);
                $('#sla > div > button').attr('id', 'offbtn');
                $('#caption').text(status);
                if (off_sla[0].total > 0) {
                    var cs = '<td><a href="#" id="off_sla_cs" class="text-decoration-none">' + off_sla[0].total + '</a></td>';
                }
                else {
                    var cs = '<td>' + off_sla[0].total + '</td>';
                }

                if (off_sla[1].total > 0) {
                    var ws = '<td><a href="#" id="off_sla_ws" class="text-decoration-none">' + off_sla[1].total + '</a></td>';
                }
                else {
                    var ws = '<td>' + off_sla[1].total + '</td>';
                }

                $('#sla > table > tbody').append('<tr>' + cs + ws + '<td>' + pwo_g_total + '</td></tr>');
                $('#main').hide();
                $('#sla').show();

                $('#offbtn').on('click', function () {
                    $('#sla').hide();
                    $('#sla > table > tbody > tr').remove();
                    $('#main').show();
                });

                $('#off_sla_cs').on('click', function () {
                    var service_sts = Object.values(groupBy(pwo_sla_status[1], 'service_status_code'));
                    var svc_sts_arr = [];
                    service_sts.forEach((ele) => {
                        var status = Number(ele[0].service_status_code);
                        var count = ele.length;
                        svc_sts_arr.push({ "service_status_code": status, "total": count });
                    });
                    var pwo_svc = filterService(svc_sts_arr, service_arr);

                    pwo_svc.sort(sortByProperty('service_status_code'));

                    if (pwo_svc[0].total > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + pwo_svc[0].total + '</a></td>';
                    } else {
                        var sub = '<td>' + pwo_svc[0].total + '</td>';
                    }
                    if (pwo_svc[1].total > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + pwo_svc[1].total + '</a></td>';
                    } else {
                        var form1 = '<td>' + pwo_svc[1].total + '</td>';
                    }
                    if (pwo_svc[2].total > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + pwo_svc[2].total + '</a></td>';
                    } else {
                        var form2 = '<td>' + pwo_svc[2].total + '</td>';
                    }
                    if (pwo_svc[3].total > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + pwo_svc[3].total + '</a></td>';
                    } else {
                        var app_pay = '<td>' + pwo_svc[3].total + '</td>';
                    }
                    if (pwo_svc[4].total > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + pwo_svc[4].total + '</a></td>';
                    } else {
                        var rec_app = '<td>' + pwo_svc[4].total + '</td>';
                    }
                    if (pwo_svc[5].total > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + pwo_svc[5].total + '</a></td>';
                    } else {
                        var rejected = '<td>' + pwo_svc[5].total + '</td>';
                    }
                    if (pwo_svc[6].total > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + pwo_svc[6].total + '</a></td>';
                    } else {
                        var delivered = '<td>' + pwo_svc[6].total + '</td>';
                    }
                    $('#service > div > button').attr('id', 'offservice');
                    $('#service_caption').text('Beyond SLA');
                    $('#service > table > tbody').append('<tr>' + sub + form1 + form2 + app_pay + rec_app + rejected + delivered + '</tr>');
                    $('#sla').hide();
                    $('#service').show();

                    $('#offservice').on('click', function () {
                        $('#service').hide();
                        $('#service > table > tbody > tr').remove();
                        $('#sla').show();
                    });

                    $('#sub_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 1);
                        $('#details_caption').text('Submission');
                        $('#details > div > button').attr('id', 'sub_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#sub_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#form1_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 2);
                        $('#details_caption').text('Form-I issued');
                        $('#details > div > button').attr('id', 'form1_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#form1_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#form2_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 3);
                        $('#details_caption').text('Form-II issued');
                        $('#details > div > button').attr('id', 'form2_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#form2_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#app_pay_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 4);
                        $('#details_caption').text('Returned to Applicant for Payment');
                        $('#details > div > button').attr('id', 'app_pay_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#app_pay_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#rec_app_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 5);
                        $('#details_caption').text('Received back from Applicant');
                        $('#details > div > button').attr('id', 'rec_app_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#rec_app_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#rejected_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 6);
                        $('#details_caption').text('Rejected');
                        $('#details > div > button').attr('id', 'rej_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#rej_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#delivered_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Crossed SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 7);
                        $('#details_caption').text('Delivered');
                        $('#details > div > button').attr('id', 'deliv_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#deliv_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                });

                $('#off_sla_ws').on('click', function () {
                    var service_sts = Object.values(groupBy(pwo_sla_status[1], 'service_status_code'));
                    var svc_sts_arr = [];
                    service_sts.forEach((ele) => {
                        var status = Number(ele[0].service_status_code);
                        var count = ele.length;
                        svc_sts_arr.push({ "service_status_code": status, "total": count });
                    });
                    var pwo_svc = filterService(svc_sts_arr, service_arr);

                    pwo_svc.sort(sortByProperty('service_status_code'));
                    console.log(pwo_svc);
                    if (pwo_svc[0].total > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + pwo_svc[0].total + '</a></td>';
                    } else {
                        var sub = '<td>' + pwo_svc[0].total + '</td>';
                    }
                    if (pwo_svc[1].total > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + pwo_svc[1].total + '</a></td>';
                    } else {
                        var form1 = '<td>' + pwo_svc[1].total + '</td>';
                    }
                    if (pwo_svc[2].total > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + pwo_svc[2].total + '</a></td>';
                    } else {
                        var form2 = '<td>' + pwo_svc[2].total + '</td>';
                    }
                    if (pwo_svc[3].total > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + pwo_svc[3].total + '</a></td>';
                    } else {
                        var app_pay = '<td>' + pwo_svc[3].total + '</td>';
                    }
                    if (pwo_svc[4].total > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + pwo_svc[4].total + '</a></td>';
                    } else {
                        var rec_app = '<td>' + pwo_svc[4].total + '</td>';
                    }
                    if (pwo_svc[5].total > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + pwo_svc[5].total + '</a></td>';
                    } else {
                        var rejected = '<td>' + pwo_svc[5].total + '</td>';
                    }
                    if (pwo_svc[6].total > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + pwo_svc[6].total + '</a></td>';
                    } else {
                        var delivered = '<td>' + pwo_svc[6].total + '</td>';
                    }
                    $('#service > div > button').attr('id', 'offservice');
                    $('#service_caption').text('Within SLA');
                    $('#service > table > tbody').append('<tr>' + sub + form1 + form2 + app_pay + rec_app + rejected + delivered + '</tr>');
                    $('#sla').hide();
                    $('#service').show();

                    $('#offservice').on('click', function () {
                        $('#service').hide();
                        $('#service > table > tbody > tr').remove();
                        $('#sla').show();
                    });
                    $('#sub_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Within SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 1);
                        $('#details_caption').text('Submission');
                        $('#details > div > button').attr('id', 'sub_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#sub_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#form1_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Within SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 2);
                        $('#details_caption').text('Form-I issued');
                        $('#details > div > button').attr('id', 'form1_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#form1_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#form2_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Within SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 3);
                        $('#details_caption').text('Form-II issued');
                        $('#details > div > button').attr('id', 'form2_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#form2_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#app_pay_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Within SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 4);
                        $('#details_caption').text('Returned to Applicant for Payment');
                        $('#details > div > button').attr('id', 'app_pay_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#app_pay_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#rec_app_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Within SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 5);
                        console.log(pwo_service_status);
                        $('#details_caption').text('Received back from Applicant');
                        $('#details > div > button').attr('id', 'rec_app_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#rec_app_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#rejected_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Within SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 6);
                        $('#details_caption').text('Rejected');
                        $('#details > div > button').attr('id', 'rej_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#rej_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                    $('#delivered_svc').on('click', function () {
                        var pwo_sla_status = pwo_data.filter(item => item.sla_status == 'Within SLA');
                        var pwo_service_status = pwo_sla_status.filter(item => item.service_status_code == 7);
                        $('#details_caption').text('Delivered');
                        $('#details > div > button').attr('id', 'deliv_det');
                        pwo_service_status.forEach((item) => {
                            $('#details > table > tbody').append('<tr><td>' + item.applicant_name + '</td><td>' + item.service_name + '</td><td>' + item.service_status + '</td><td>' + item.date_of_action_as_per_service_status + '</td></tr>');
                        });
                        $('#service').hide();
                        $('#details').show();
                        $('#deliv_det').on('click', function () {
                            $('#details').hide();
                            $('#details > table > tbody > tr').remove();
                            $('#service').show();
                        });
                    });
                });
            });

            $('#processed').on('click', function () {
                var status = "Processed";
                var pro_data = filterStatus(data, status);
                var pro_g_total = pro_data.length;
                var pro_sla_status = Object.values(groupBy(pro_data, 'sla_status'));
                var sla_pro_arr = [];
                pro_sla_status.forEach((ele) => {
                    var status = ele[0].sla_status;
                    var count = ele.length;
                    sla_pro_arr.push({ "heading": status, "total": count });
                });
                sla_pro_arr.sort(sortByProperty("heading"));
                var pro_sla = slaFilter(sla_pro_arr, sla_arr);
                $('#sla > div > button').attr('id', 'probtn');
                $('#caption').text(status);
                if (pro_sla[0].total > 0) {
                    var cs = '<td><a href="#" id="pro_sla_cs" class="text-decoration-none">' + pro_sla[0].total + '</a></td>';
                }
                else {
                    var cs = '<td>' + pro_sla[0].total + '</td>';
                }

                if (pro_sla[1].total > 0) {
                    var ws = '<td><a href="#" id="pro_sla_ws" class="text-decoration-none">' + pro_sla[1].total + '</a></td>';
                }
                else {
                    var ws = '<td>' + pro_sla[1].total + '</td>';
                }

                $('#sla > table > tbody').append('<tr>' + cs + ws + '<td>' + pro_g_total + '</td></tr>');
                $('#main').hide();
                $('#sla').show();
                $('#probtn').on('click', function () {
                    $('#sla').hide();
                    $('#sla > table > tbody > tr').remove();
                    $('#main').show();
                });

                $('#pro_sla_cs').on('click', function () {
                    var service_sts = Object.values(groupBy(pro_sla_status[1], 'service_status_code'));
                    var svc_sts_arr = [];
                    // console.log(service_sts);
                    service_sts.forEach((ele) => {
                        var status = Number(ele[0].service_status_code);
                        var count = ele.length;
                        svc_sts_arr.push({ "service_status_code": status, "total": count });
                    });
                    var pro_svc = filterService(svc_sts_arr, service_arr);

                    pro_svc.sort(sortByProperty('service_status_code'));

                    if (pro_svc[0].total > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + pro_svc[0].total + '</a></td>';
                    } else {
                        var sub = '<td>' + pro_svc[0].total + '</td>';
                    }
                    if (pro_svc[1].total > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + pro_svc[1].total + '</a></td>';
                    } else {
                        var form1 = '<td>' + pro_svc[1].total + '</td>';
                    }
                    if (pro_svc[2].total > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + pro_svc[2].total + '</a></td>';
                    } else {
                        var form2 = '<td>' + pro_svc[2].total + '</td>';
                    }
                    if (pro_svc[3].total > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + pro_svc[3].total + '</a></td>';
                    } else {
                        var app_pay = '<td>' + pro_svc[3].total + '</td>';
                    }
                    if (pro_svc[4].total > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + pro_svc[4].total + '</a></td>';
                    } else {
                        var rec_app = '<td>' + pro_svc[4].total + '</td>';
                    }
                    if (pro_svc[5].total > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + pro_svc[5].total + '</a></td>';
                    } else {
                        var rejected = '<td>' + pro_svc[5].total + '</td>';
                    }
                    if (pro_svc[6].total > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + pro_svc[6].total + '</a></td>';
                    } else {
                        var delivered = '<td>' + pro_svc[6].total + '</td>';
                    }
                    $('#service > div > button').attr('id', 'proservice');
                    $('#service_caption').text('Beyond SLA');
                    $('#service > table > tbody').append('<tr>' + sub + form1 + form2 + app_pay + rec_app + rejected + delivered + '</tr>');
                    $('#sla').hide();
                    $('#service').show();

                    $('#proservice').on('click', function () {
                        $('#service').hide();
                        $('#service > table > tbody > tr').remove();
                        $('#sla').show();
                    });
                });

                $('#pro_sla_ws').on('click', function () {
                    var service_sts = Object.values(groupBy(pro_sla_status[0], 'service_status_code'));
                    var svc_sts_arr = [];
                    // console.log(service_sts);
                    service_sts.forEach((ele) => {
                        var status = Number(ele[0].service_status_code);
                        var count = ele.length;
                        svc_sts_arr.push({ "service_status_code": status, "total": count });
                    });
                    var pro_svc = filterService(svc_sts_arr, service_arr);

                    pro_svc.sort(sortByProperty('service_status_code'));

                    if (pro_svc[0].total > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + pro_svc[0].total + '</a></td>';
                    } else {
                        var sub = '<td>' + pro_svc[0].total + '</td>';
                    }
                    if (pro_svc[1].total > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + pro_svc[1].total + '</a></td>';
                    } else {
                        var form1 = '<td>' + pro_svc[1].total + '</td>';
                    }
                    if (pro_svc[2].total > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + pro_svc[2].total + '</a></td>';
                    } else {
                        var form2 = '<td>' + pro_svc[2].total + '</td>';
                    }
                    if (pro_svc[3].total > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + pro_svc[3].total + '</a></td>';
                    } else {
                        var app_pay = '<td>' + pro_svc[3].total + '</td>';
                    }
                    if (pro_svc[4].total > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + pro_svc[4].total + '</a></td>';
                    } else {
                        var rec_app = '<td>' + pro_svc[4].total + '</td>';
                    }
                    if (pro_svc[5].total > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + pro_svc[5].total + '</a></td>';
                    } else {
                        var rejected = '<td>' + pro_svc[5].total + '</td>';
                    }
                    if (pro_svc[6].total > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + pro_svc[6].total + '</a></td>';
                    } else {
                        var delivered = '<td>' + pro_svc[6].total + '</td>';
                    }
                    $('#service > div > button').attr('id', 'proservice');
                    $('#service_caption').text('Within SLA');
                    $('#service > table > tbody').append('<tr>' + sub + form1 + form2 + app_pay + rec_app + rejected + delivered + '</tr>');
                    $('#sla').hide();
                    $('#service').show();

                    $('#proservice').on('click', function () {
                        $('#service').hide();
                        $('#service > table > tbody > tr').remove();
                        $('#sla').show();
                    });
                });


            });
        }
    });
    $.LoadingOverlay("hide");
});

