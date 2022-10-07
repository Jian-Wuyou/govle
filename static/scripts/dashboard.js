const DeadlineRow = (day, month, deadlineSetList) => `
    <div class="deadline">
        <div class="deadline-date">
            <h1>${day}</h1>
            <h6>${month}</h6>
        </div>
        <div class="deadline-detail">${deadlineSetList}</div>
    </div>
`;
const DeadlineSet = (courseName, courseLink, deadlineList) => `
    <div class="deadline-set">
        <h2>${courseName} <a href="${courseLink}" class="course-link" target="_blank" rel="noopener">Open...</a></h2>
        <ul>${deadlineList}</ul>
    </div>
`;
const Deadline = (deadlineName, deadlineLink) => `
    <li>
        <a href=${deadlineLink} target="_blank" rel="noopener">${deadlineName}</a>
    </li>
`;
const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const buildDeadlineList = (rawDeadlineList) => {
    const mergedDeadlineList = Object.assign({}, ...rawDeadlineList);

    const deadlinesContainer = document.getElementById('deadlines-container');

    // Iterate through each date
    const deadlineRowList = [];
    for (const date in mergedDeadlineList) {
        // Parse YYYY-MM-DD date into MM and DD
        const dateSplit = date.split('-');
        const month = MonthNames[parseInt(dateSplit[1]) - 1];
        const day = dateSplit[2];

        // Iterate through each course
        const deadlineSetList = [];
        for (const [courseName, course] of Object.entries(mergedDeadlineList[date])) {
            // Iterate through each deadline
            const deadlineList = [];
            for (const deadline of Object.values(course['deadlines'])) {
                // Add deadline to list
                deadlineList.push(Deadline(deadline['name'], deadline['url']));
            }

            // Concat all deadline elements into one string
            deadlineSetList.push(DeadlineSet(courseName, course['url'], deadlineList.join('')));
        }

        // Concat all deadline set elements into one string
        deadlineRowList.push(DeadlineRow(day, month, deadlineSetList.join('')));
    }
    // clear previous deadlines
    deadlinesContainer.replaceChildren(...deadlinesContainer.querySelectorAll('.spinner-border'));

    // insert new deadlines
    deadlinesContainer.insertAdjacentHTML('beforeend', deadlineRowList.join(''));

    // // TO-DO: implement #deadlines-overview or remove this code
    // document.getElementById('deadlines-overview').innerText = `${numDeadlines} assignment${
    //     numDeadlines === 1 ? '' : 's'
    // }`;
};

(() => {
    // Update greeting with proper time of day
    const timeOfDayGreeting = document.getElementById('time-of-day');
    const currentHour = new Date().getHours();
    let timeOfDay = 'day';
    if (currentHour < 12) {
        timeOfDayGreeting.innerText = 'morning';
    } else if (currentHour < 18) {
        timeOfDayGreeting.innerText = 'afternoon';
    } else {
        timeOfDayGreeting.innerText = 'evening';
        timeOfDay = 'night';
    }

    // Get weather from API
    fetch(`/api/v1/weather?timeOfDay=${timeOfDay}`)
        .then((response) => response.json())
        .then((weather) => {
            document.getElementById('weather-icon').classList.add(`wi-${weather.icon}`);
            document.getElementById('weather-temp').innerHTML = `${weather.temperature}&deg;C`;
            document.getElementById('weather-desc').innerText = `${weather.condition} in ${weather.place}`;
            document.getElementById('weather-fl').innerHTML = `Feels like ${weather.feels_like}&deg;C`;
        });

    // Get list of deadlines from API
    let deadlines = [];

    const deadlinesContainer = document.getElementById('deadlines-container');

    const classProviders = {
        'UVL&#234;': '/api/v1/moodle/deadlines',
        'Google Classroom': '/api/v1/google/coursework',
    };

    // fetch and mutate values to JSON
    for (const [provider, url] of Object.entries(classProviders)) {
        classProviders[provider] = fetch(url)
            .then((response) => response.json())
            .then((provider_deadlines) => {
                if (Object.keys(provider_deadlines).length === 0) {
                    deadlinesContainer.insertAdjacentHTML(
                        'beforeend',
                        `<p class="text-center">No deadlines from ${provider}.</p>`
                    );
                }
                deadlines.push(provider_deadlines);
                buildDeadlineList(deadlines);
            });
    }

    // Once one finishes, regardless of status, remove the centering
    Promise.race(Object.values(classProviders)).finally(() => {
        deadlinesContainer.classList.remove('text-center');
    });

    // When all are done, regardless of status, remove spinner/s
    Promise.allSettled(Object.values(classProviders)).then(() => {
        deadlinesContainer.querySelectorAll('.spinner-border').forEach((e) => e.remove());
    });
})();
