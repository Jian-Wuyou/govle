const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

var deadlines_list = [];
// Array of objects where each object is
//     {
//         lmsName: string,
//         deadlines = [
//             {
//                 date = "yyyy-mm-dd",
//                 requirements = [...]
//             }
//         ]
//     };
// unpack deadlines array, and just add lmsName inside each element of deadlines

function updateUrlQuery(date) {
    if (history.pushState) {
        const newurl =
            window.location.origin +
            window.location.pathname +
            `?year=${date.getFullYear()}&month=${date.getMonth() + 1}`;
        window.history.pushState({ path: newurl }, '', newurl);
    }
}

// TO-DO: try changing `.innerHTML = htmlString` to DocumentFragments or similar and compare performance
function getCalendarCurrent(date) {
    date = new Date(date.getFullYear(), date.getMonth()); // avoid modifying original date object
    updateUrlQuery(date); // change URL query to match current month/year

    let month = date.getMonth();
    document.getElementById('calendar-date').innerText = `${months[month]} ${date.getFullYear()}`;

    let table = date.getDay() ? '<tr>' : '';
    //number of cells
    //gets kung pang-ilang day yung simula nung calendar
    for (let i = date.getDay(); i > 0; i--) {
        table += '<td></td>';
    }

    while (date.getMonth() == month) {
        if (date.getDay() == 0) {
            table += '<tr>';
        }
        let day = date.getDate();
        table += `<td><div class="calendar-numbers">${day}</div>`;
        // for (let deadline of uvle_deadlines_list) {
        //     console.log(deadline);
        //     //if (days.getMonth() == month && days.getDate() == dates[0]){
        //     //for (deadline_for_the_day in dates){
        //     //table += `<div class = "uvle-box"> <b>${dates[1]}</b> ${deadline_for_the_day}</div>`;
        //     //table += '<br>'
        //     //}
        // }
        table += '</td>';
        if (date.getDay() == 6) {
            table += '</tr>';
        }
        //iterate
        date.setDate(day + 1);
    }

    for (let i = (7 - date.getDay()) % 7; i > 0; i--) {
        table += '<td></td>';
    }

    // close the table
    table += '</tr></table>';

    document.getElementsByTagName('tbody')[0].innerHTML = table;
}

//get classes from UVLE and google classroom
//if UVLE red if GClass green
(() => {
    // Get URL query parameters
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    // If month is not specified, always use the current date
    const today = new Date();
    let year = today.getFullYear();
    let month = params.month - 1;
    if (params.month) {
        year = params.year ? params.year : year;
    } else {
        month = today.getMonth();
    }

    const date = new Date(year, month);
    updateUrlQuery(date);

    // TO-DO: review and modify the following
    fetch('/api/v1/moodle/deadlines')
        .then((response) => response.json())
        .then((uvle_deadlines) => {
            // for (let date in uvle_deadlines) {
            //     const date_split = date.split("-");
            //     const deadline_month = months[parseInt(date_split[1]) - 1];
            //     const day = date_split[2];
            //     list = [];
            //     list.push(day);
            //     if (deadline_month == months[date.getMonth() - 1]) {
            //         for (let subjects in uvle_deadlines[date]) {
            //             list.push(subjects);
            //             for (let deadline_names in uvle_deadlines[date][
            //                 subjects
            //             ].deadlines) {
            //                 deadline_list = [];
            //                 deadline_list.push(
            //                     uvle_deadlines[date][subjects].deadlines[
            //                         deadline_names
            //                     ].name
            //                 );
            //             }
            //             list.push(deadline_list);
            //         }
            //         uvle_deadlines_list.push(list);
            //     }
            // }
        });

    fetch('/api/v1/google/coursework')
        .then((response) => response.json())
        .then((google_deadlines) => {
            //console.log(google_deadlines);
        });

    document.getElementById('prev-month').addEventListener('click', (e) => {
        date.setMonth(date.getMonth() - 1);
        getCalendarCurrent(date);
    });

    document.getElementById('next-month').addEventListener('click', (e) => {
        date.setMonth(date.getMonth() + 1);
        getCalendarCurrent(date);
    });

    getCalendarCurrent(date);
})();
