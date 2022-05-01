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

function filterOfficeStatus(data, status) {
    var new_data = data.filter(item => item.office_status == status);
    return new_data;
}

function filterSlaStatus(data, status) {
    var new_data = data.filter(item => item.sla_status == status);
    return new_data;
}

function filterServiceStatusCode(data, code) {
    var new_data = data.filter(item => item.service_status_code == code);
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
            var app = "Pending With Applicant";
            var applicant = filterOfficeStatus(data, app);
            var app_count = applicant.length;
            var pwo = "Pending With Office";
            var office = filterOfficeStatus(data, pwo);
            var off_count = office.length;
            var pro = "Processed";
            var processed = filterOfficeStatus(data, pro);
            var pro_count = processed.length;

            if (applicant.length > 0) {
                $('#btn1').text(applicant[0].office_status);
                $('#count1').text(app_count);
                $('#card1 > button').attr('id', 'applicant');
                $('#card1').show();
            }
            if (office.length > 0) {
                $('#btn2').text(office[0].office_status);
                $('#count2').text(off_count);
                $('#card2 > button').attr('id', 'office');
                $('#card2').show();
            }
            if (processed.length > 0) {
                $('#btn3').text(processed[0].office_status);
                $('#count3').text(pro_count);
                $('#card3 > button').attr('id', 'processed');
                $('#card3').show();
            }

            $('#applicant').on('click', function () {
                var pwa_data = applicant;
                var pwa_g_total = pwa_data.length;
                var ws_sla_status = filterSlaStatus(pwa_data, 'Within SLA');
                var cs_sla_status = filterSlaStatus(pwa_data, 'Crossed SLA');
                $('#sla > div > button').attr('id', 'appbtn');
                $('#caption').text(status);
                if (cs_sla_status.length > 0) {
                    var cs = '<td><a href="#" id="app_sla_cs" class="text-decoration-none">' + cs_sla_status.length + '</a></td>';
                }
                else {
                    var cs = '<td>' + cs_sla_status.length + '</td>';
                }

                if (ws_sla_status.length > 0) {
                    var ws = '<td><a href="#" id="app_sla_ws" class="text-decoration-none">' + ws_sla_status.length + '</a></td>';
                }
                else {
                    var ws = '<td>' + ws_sla_status.length + '</td>';
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
                    var code1 = filterServiceStatusCode(cs_sla_status, 1);
                    var code2 = filterServiceStatusCode(cs_sla_status, 2);
                    var code3 = filterServiceStatusCode(cs_sla_status, 3);
                    var code4 = filterServiceStatusCode(cs_sla_status, 4);
                    var code5 = filterServiceStatusCode(cs_sla_status, 5);
                    var code6 = filterServiceStatusCode(cs_sla_status, 6);
                    var code7 = filterServiceStatusCode(cs_sla_status, 7);

                    if (code1.length > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + code1.length + '</a></td>';
                    } else {
                        var sub = '<td>' + code1.length + '</td>';
                    }
                    if (code2.length > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + code2.length + '</a></td>';
                    } else {
                        var form1 = '<td>' + code2.length + '</td>';
                    }
                    if (code3.length > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + code3.length + '</a></td>';
                    } else {
                        var form2 = '<td>' + code3.length + '</td>';
                    }
                    if (code4.length > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + code4.length + '</a></td>';
                    } else {
                        var app_pay = '<td>' + code4.length + '</td>';
                    }
                    if (code5.length > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + code5.length + '</a></td>';
                    } else {
                        var rec_app = '<td>' + code5.length + '</td>';
                    }
                    if (code6.length > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + code6.length + '</a></td>';
                    } else {
                        var rejected = '<td>' + code6.length + '</td>';
                    }
                    if (code7.length > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + code7.length + '</a></td>';
                    } else {
                        var delivered = '<td>' + code7.length + '</td>';
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
                        $('#details_caption').text('Submission');
                        $('#details > div > button').attr('id', 'sub_det');
                        code1.forEach((item) => {
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
                        $('#details_caption').text('Form-I issued');
                        $('#details > div > button').attr('id', 'form1_det');
                        code2.forEach((item) => {
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
                        $('#details_caption').text('Form-II issued');
                        $('#details > div > button').attr('id', 'form2_det');
                        code3.forEach((item) => {
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
                        $('#details_caption').text('Returned to Applicant for Payment');
                        $('#details > div > button').attr('id', 'app_pay_det');
                        code4.forEach((item) => {
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
                        $('#details_caption').text('Received back from Applicant');
                        $('#details > div > button').attr('id', 'rec_app_det');
                        code5.forEach((item) => {
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
                        $('#details_caption').text('Rejected');
                        $('#details > div > button').attr('id', 'rej_det');
                        code6.forEach((item) => {
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
                        $('#details_caption').text('Delivered');
                        $('#details > div > button').attr('id', 'deliv_det');
                        code7.forEach((item) => {
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
                    var code1 = filterServiceStatusCode(ws_sla_status, 1);
                    var code2 = filterServiceStatusCode(ws_sla_status, 2);
                    var code3 = filterServiceStatusCode(ws_sla_status, 3);
                    var code4 = filterServiceStatusCode(ws_sla_status, 4);
                    var code5 = filterServiceStatusCode(ws_sla_status, 5);
                    var code6 = filterServiceStatusCode(ws_sla_status, 6);
                    var code7 = filterServiceStatusCode(ws_sla_status, 7);

                    if (code1.length > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + code1.length + '</a></td>';
                    } else {
                        var sub = '<td>' + code1.length + '</td>';
                    }
                    if (code2.length > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + code2.length + '</a></td>';
                    } else {
                        var form1 = '<td>' + code2.length + '</td>';
                    }
                    if (code3.length > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + code3.length + '</a></td>';
                    } else {
                        var form2 = '<td>' + code3.length + '</td>';
                    }
                    if (code4.length > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + code4.length + '</a></td>';
                    } else {
                        var app_pay = '<td>' + code4.length + '</td>';
                    }
                    if (code5.length > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + code5.length + '</a></td>';
                    } else {
                        var rec_app = '<td>' + code5.length + '</td>';
                    }
                    if (code6.length > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + code6.length + '</a></td>';
                    } else {
                        var rejected = '<td>' + code6.length + '</td>';
                    }
                    if (code7.length > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + code7.length + '</a></td>';
                    } else {
                        var delivered = '<td>' + code7.length + '</td>';
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
                        $('#details_caption').text('Submission');
                        $('#details > div > button').attr('id', 'sub_det');
                        code1.forEach((item) => {
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
                        $('#details_caption').text('Form-I issued');
                        $('#details > div > button').attr('id', 'form1_det');
                        code2.forEach((item) => {
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
                        $('#details_caption').text('Form-II issued');
                        $('#details > div > button').attr('id', 'form2_det');
                        code3.forEach((item) => {
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
                        $('#details_caption').text('Returned to Applicant for Payment');
                        $('#details > div > button').attr('id', 'app_pay_det');
                        code4.forEach((item) => {
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
                        $('#details_caption').text('Received back from Applicant');
                        $('#details > div > button').attr('id', 'rec_app_det');
                        code5.forEach((item) => {
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
                        $('#details_caption').text('Rejected');
                        $('#details > div > button').attr('id', 'rej_det');
                        code6.forEach((item) => {
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
                        $('#details_caption').text('Delivered');
                        $('#details > div > button').attr('id', 'deliv_det');
                        code7.forEach((item) => {
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
                var pwo_data = filterOfficeStatus(data, status);
                var pwo_g_total = pwo_data.length;
                var ws_sla_status = filterSlaStatus(pwo_data, 'Within SLA');
                var cs_sla_status = filterSlaStatus(pwo_data, 'Crossed SLA');
                $('#sla > div > button').attr('id', 'offbtn');
                $('#caption').text(status);
                if (cs_sla_status.length > 0) {
                    var cs = '<td><a href="#" id="off_sla_cs" class="text-decoration-none">' + cs_sla_status.length + '</a></td>';
                }
                else {
                    var cs = '<td>' + cs_sla_status.length + '</td>';
                }

                if (ws_sla_status.length > 0) {
                    var ws = '<td><a href="#" id="off_sla_ws" class="text-decoration-none">' + ws_sla_status.length + '</a></td>';
                }
                else {
                    var ws = '<td>' + ws_sla_status.length + '</td>';
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
                    var code1 = filterServiceStatusCode(cs_sla_status, 1);
                    var code2 = filterServiceStatusCode(cs_sla_status, 2);
                    var code3 = filterServiceStatusCode(cs_sla_status, 3);
                    var code4 = filterServiceStatusCode(cs_sla_status, 4);
                    var code5 = filterServiceStatusCode(cs_sla_status, 5);
                    var code6 = filterServiceStatusCode(cs_sla_status, 6);
                    var code7 = filterServiceStatusCode(cs_sla_status, 7);

                    if (code1.length > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + code1.length + '</a></td>';
                    } else {
                        var sub = '<td>' + code1.length + '</td>';
                    }
                    if (code2.length > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + code2.length + '</a></td>';
                    } else {
                        var form1 = '<td>' + code2.length + '</td>';
                    }
                    if (code3.length > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + code3.length + '</a></td>';
                    } else {
                        var form2 = '<td>' + code3.length + '</td>';
                    }
                    if (code4.length > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + code4.length + '</a></td>';
                    } else {
                        var app_pay = '<td>' + code4.length + '</td>';
                    }
                    if (code5.length > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + code5.length + '</a></td>';
                    } else {
                        var rec_app = '<td>' + code5.length + '</td>';
                    }
                    if (code6.length > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + code6.length + '</a></td>';
                    } else {
                        var rejected = '<td>' + code6.length + '</td>';
                    }
                    if (code7.length > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + code7.length + '</a></td>';
                    } else {
                        var delivered = '<td>' + code7.length + '</td>';
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
                        $('#details_caption').text('Submission');
                        $('#details > div > button').attr('id', 'sub_det');
                        code1.forEach((item) => {
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
                        $('#details_caption').text('Form-I issued');
                        $('#details > div > button').attr('id', 'form1_det');
                        code2.forEach((item) => {
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
                        $('#details_caption').text('Form-II issued');
                        $('#details > div > button').attr('id', 'form2_det');
                        code3.forEach((item) => {
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
                        $('#details_caption').text('Returned to Applicant for Payment');
                        $('#details > div > button').attr('id', 'app_pay_det');
                        code4.forEach((item) => {
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
                        $('#details_caption').text('Received back from Applicant');
                        $('#details > div > button').attr('id', 'rec_app_det');
                        code5.forEach((item) => {
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
                        $('#details_caption').text('Rejected');
                        $('#details > div > button').attr('id', 'rej_det');
                        code6.forEach((item) => {
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
                        $('#details_caption').text('Delivered');
                        $('#details > div > button').attr('id', 'deliv_det');
                        code7.forEach((item) => {
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
                    var code1 = filterServiceStatusCode(ws_sla_status, 1);
                    var code2 = filterServiceStatusCode(ws_sla_status, 2);
                    var code3 = filterServiceStatusCode(ws_sla_status, 3);
                    var code4 = filterServiceStatusCode(ws_sla_status, 4);
                    var code5 = filterServiceStatusCode(ws_sla_status, 5);
                    var code6 = filterServiceStatusCode(ws_sla_status, 6);
                    var code7 = filterServiceStatusCode(ws_sla_status, 7);

                    if (code1.length > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + code1.length + '</a></td>';
                    } else {
                        var sub = '<td>' + code1.length + '</td>';
                    }
                    if (code2.length > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + code2.length + '</a></td>';
                    } else {
                        var form1 = '<td>' + code2.length + '</td>';
                    }
                    if (code3.length > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + code3.length + '</a></td>';
                    } else {
                        var form2 = '<td>' + code3.length + '</td>';
                    }
                    if (code4.length > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + code4.length + '</a></td>';
                    } else {
                        var app_pay = '<td>' + code4.length + '</td>';
                    }
                    if (code5.length > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + code5.length + '</a></td>';
                    } else {
                        var rec_app = '<td>' + code5.length + '</td>';
                    }
                    if (code6.length > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + code6.length + '</a></td>';
                    } else {
                        var rejected = '<td>' + code6.length + '</td>';
                    }
                    if (code7.length > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + code7.length + '</a></td>';
                    } else {
                        var delivered = '<td>' + code7.length + '</td>';
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
                        $('#details_caption').text('Submission');
                        $('#details > div > button').attr('id', 'sub_det');
                        code1.forEach((item) => {
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
                        $('#details_caption').text('Form-I issued');
                        $('#details > div > button').attr('id', 'form1_det');
                        code2.forEach((item) => {
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
                        $('#details_caption').text('Form-II issued');
                        $('#details > div > button').attr('id', 'form2_det');
                        code3.forEach((item) => {
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
                        $('#details_caption').text('Returned to Applicant for Payment');
                        $('#details > div > button').attr('id', 'app_pay_det');
                        code4.forEach((item) => {
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
                        $('#details_caption').text('Received back from Applicant');
                        $('#details > div > button').attr('id', 'rec_app_det');
                        code5.forEach((item) => {
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
                        $('#details_caption').text('Rejected');
                        $('#details > div > button').attr('id', 'rej_det');
                        code6.forEach((item) => {
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
                        $('#details_caption').text('Delivered');
                        $('#details > div > button').attr('id', 'deliv_det');
                        code7.forEach((item) => {
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
                var pro_data = filterOfficeStatus(data, status);
                var pro_g_total = pro_data.length;
                var ws_sla_status = filterSlaStatus(pro_data, 'Within SLA');
                var cs_sla_status = filterSlaStatus(pro_data, 'Crossed SLA');

                $('#sla > div > button').attr('id', 'probtn');
                $('#caption').text(status);
                if (cs_sla_status.length > 0) {
                    var cs = '<td><a href="#" id="pro_sla_cs" class="text-decoration-none">' + cs_sla_status.length + '</a></td>';
                }
                else {
                    var cs = '<td>' + cs_sla_status.length + '</td>';
                }

                if (ws_sla_status.length > 0) {
                    var ws = '<td><a href="#" id="pro_sla_ws" class="text-decoration-none">' + ws_sla_status.length + '</a></td>';
                }
                else {
                    var ws = '<td>' + ws_sla_status.length + '</td>';
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
                    var code1 = filterServiceStatusCode(cs_sla_status, 1);
                    var code2 = filterServiceStatusCode(cs_sla_status, 2);
                    var code3 = filterServiceStatusCode(cs_sla_status, 3);
                    var code4 = filterServiceStatusCode(cs_sla_status, 4);
                    var code5 = filterServiceStatusCode(cs_sla_status, 5);
                    var code6 = filterServiceStatusCode(cs_sla_status, 6);
                    var code7 = filterServiceStatusCode(cs_sla_status, 7);

                    if (code1.length > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + code1.length + '</a></td>';
                    } else {
                        var sub = '<td>' + code1.length + '</td>';
                    }
                    if (code2.length > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + code2.length + '</a></td>';
                    } else {
                        var form1 = '<td>' + code2.length + '</td>';
                    }
                    if (code3.length > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + code3.length + '</a></td>';
                    } else {
                        var form2 = '<td>' + code3.length + '</td>';
                    }
                    if (code4.length > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + code4.length + '</a></td>';
                    } else {
                        var app_pay = '<td>' + code4.length + '</td>';
                    }
                    if (code5.length > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + code5.length + '</a></td>';
                    } else {
                        var rec_app = '<td>' + code5.length + '</td>';
                    }
                    if (code6.length > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + code6.length + '</a></td>';
                    } else {
                        var rejected = '<td>' + code6.length + '</td>';
                    }
                    if (code7.length > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + code7.length + '</a></td>';
                    } else {
                        var delivered = '<td>' + code7.length + '</td>';
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
                        $('#details_caption').text('Submission');
                        $('#details > div > button').attr('id', 'sub_det');
                        code1.forEach((item) => {
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
                        $('#details_caption').text('Form-I issued');
                        $('#details > div > button').attr('id', 'form1_det');
                        code2.forEach((item) => {
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
                        $('#details_caption').text('Form-II issued');
                        $('#details > div > button').attr('id', 'form2_det');
                        code3.forEach((item) => {
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
                        $('#details_caption').text('Returned to Applicant for Payment');
                        $('#details > div > button').attr('id', 'app_pay_det');
                        code4.forEach((item) => {
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
                        $('#details_caption').text('Received back from Applicant');
                        $('#details > div > button').attr('id', 'rec_app_det');
                        code5.forEach((item) => {
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
                        $('#details_caption').text('Rejected');
                        $('#details > div > button').attr('id', 'rej_det');
                        code6.forEach((item) => {
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
                        $('#details_caption').text('Delivered');
                        $('#details > div > button').attr('id', 'deliv_det');
                        code7.forEach((item) => {
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

                $('#pro_sla_ws').on('click', function () {
                    var code1 = filterServiceStatusCode(ws_sla_status, 1);
                    var code2 = filterServiceStatusCode(ws_sla_status, 2);
                    var code3 = filterServiceStatusCode(ws_sla_status, 3);
                    var code4 = filterServiceStatusCode(ws_sla_status, 4);
                    var code5 = filterServiceStatusCode(ws_sla_status, 5);
                    var code6 = filterServiceStatusCode(ws_sla_status, 6);
                    var code7 = filterServiceStatusCode(ws_sla_status, 7);

                    if (code1.length > 0) {
                        var sub = '<td><a href="#" id="sub_svc" class="text-decoration-none">' + code1.length + '</a></td>';
                    } else {
                        var sub = '<td>' + code1.length + '</td>';
                    }
                    if (code2.length > 0) {
                        var form1 = '<td><a href="#" id="form1_svc" class="text-decoration-none">' + code2.length + '</a></td>';
                    } else {
                        var form1 = '<td>' + code2.length + '</td>';
                    }
                    if (code3.length > 0) {
                        var form2 = '<td><a href="#" id="form2_svc" class="text-decoration-none">' + code3.length + '</a></td>';
                    } else {
                        var form2 = '<td>' + code3.length + '</td>';
                    }
                    if (code4.length > 0) {
                        var app_pay = '<td><a href="#" id="app_pay_svc" class="text-decoration-none">' + code4.length + '</a></td>';
                    } else {
                        var app_pay = '<td>' + code4.length + '</td>';
                    }
                    if (code5.length > 0) {
                        var rec_app = '<td><a href="#" id="rec_app_svc" class="text-decoration-none">' + code5.length + '</a></td>';
                    } else {
                        var rec_app = '<td>' + code5.length + '</td>';
                    }
                    if (code6.length > 0) {
                        var rejected = '<td><a href="#" id="rejected_svc" class="text-decoration-none">' + code6.length + '</a></td>';
                    } else {
                        var rejected = '<td>' + code6.length + '</td>';
                    }
                    if (code7.length > 0) {
                        var delivered = '<td><a href="#" id="delivered_svc" class="text-decoration-none">' + code7.length + '</a></td>';
                    } else {
                        var delivered = '<td>' + code7.length + '</td>';
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
                        $('#details_caption').text('Submission');
                        $('#details > div > button').attr('id', 'sub_det');
                        code1.forEach((item) => {
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
                        $('#details_caption').text('Form-I issued');
                        $('#details > div > button').attr('id', 'form1_det');
                        code2.forEach((item) => {
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
                        $('#details_caption').text('Form-II issued');
                        $('#details > div > button').attr('id', 'form2_det');
                        code3.forEach((item) => {
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
                        $('#details_caption').text('Returned to Applicant for Payment');
                        $('#details > div > button').attr('id', 'app_pay_det');
                        code4.forEach((item) => {
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
                        $('#details_caption').text('Received back from Applicant');
                        $('#details > div > button').attr('id', 'rec_app_det');
                        code5.forEach((item) => {
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
                        $('#details_caption').text('Rejected');
                        $('#details > div > button').attr('id', 'rej_det');
                        code6.forEach((item) => {
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
                        $('#details_caption').text('Delivered');
                        $('#details > div > button').attr('id', 'deliv_det');
                        code7.forEach((item) => {
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
        }
    });
    $.LoadingOverlay("hide");
});

