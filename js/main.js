$(document).ready(function () {
    /**
     * SETUP
     */

    // Punto di partenza
    moment.locale('it');
    var baseMonth = moment('2018-01-01');   
    var prev = $('.prev-month');
    var next = $('.next-month');
    var monthTitle = $('h1.month');
    
    // Init Handlebars
    var source = $('#day-template').html();
    var template = Handlebars.compile(source);

    // print giorno
    printMonth(template, baseMonth, monthTitle);

    // ottieni festività mese corrente
    printHoliday(baseMonth);

    // click su next
    $(next).click(function () {
        navigateMonth(template, 'next', baseMonth,monthTitle)
    }); // END NEXT CLICK

    //click su prev
    $(prev).click(function () {   
        navigateMonth(template, 'prev', baseMonth,monthTitle)

    }); // END PREV CLICK

}); // <-- End doc ready


/*************************************
    FUNCTIONS
 *************************************/

// Stampa a schermo i giorni del mese
function printMonth(template, date, monthTitle) {
    //cleanup dati precedenti
    $('.month-list').children().remove();
    // numero giorni nel mese
    var daysInMonth = date.daysInMonth();

    //  setta header
    $(monthTitle).html( date.format('MMMM YYYY') ); 
    // Imposta data attribute data visualizzata
    $(monthTitle).attr('data-this-date',  date.format('YYYY-MM-DD'));

    // genera giorni mese
    for (var i = 0; i < daysInMonth; i++) {
        // genera data con moment js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1
        });

        // imposta dati template
        var context = {
            class: 'day',
            day: thisDate.format('DD MMMM'),
            completeDate: thisDate.format('YYYY-MM-DD')
        };

        //compilare e aggiungere template
        var html = template(context);
        $('.month-list').append(html);
    }
}

// Ottieni e stampa festività
function printHoliday(date) {
    // chiamo API
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
        method: 'GET',
        data: {
            year: date.year(),
            month: date.month()
        },
        success: function(res) {
            var holidays = res.response;

            for (var i = 0; i < holidays.length; i++) {
                var thisHoliday = holidays[i];

                var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');

                if(listItem) {
                    listItem.addClass('holiday');
                    listItem.text( listItem.text() + ' - ' + thisHoliday.name );
                }
            }
        },
        error: function() {
            console.log('Errore chiamata festività'); 
        }
    });

}
// funzione navigazione mesi nel calendario
function navigateMonth(template, direction, baseMonth,monthTitle) {
    if ((baseMonth.month() === 0 && direction === 'prev') || (baseMonth.month() === 11 && direction === 'next')) {
            alert('Mese non disponibile')
        } else {
            if(direction === 'next') {
                baseMonth.add(1, "M");
            } else {
                baseMonth.subtract(1, "M");
            }
        printMonth(template, baseMonth, monthTitle);
        printHoliday(baseMonth);
        }
}

