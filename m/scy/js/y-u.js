fetch("/m/scy/data/y-u.json?v=3")
    .then(response => {
        if (!response.ok) throw new Error(`Could not load Youth-Unlocked events: ${response.status}`);
        return response.json();
    })
    .then(events => {
        const container = document.querySelector("#y-u-events");
        const years = events.reduce((groups, event) => {
            (groups[event.date.slice(0, 4)] ??= []).push(event);
            return groups;
        }, {});

        Object.keys(years).sort((a, b) => b - a).forEach(year => {
            const section = document.createElement("section");
            const heading = document.createElement("div");
            heading.className = "s12";
            heading.innerHTML = `<h4 class="red">${year}</h4>`;
            section.append(heading);

            years[year]
                .sort((a, b) => b.date.localeCompare(a.date))
                .forEach(event => {
                    const card = document.createElement("div");
                    const title = document.createElement("h5");
                    const date = document.createElement("p");
                    const artist = document.createElement("p");
                    const link = document.createElement("a");
                    card.className = "s6";
                    link.className = "hob-event-link";
                    title.textContent = event.title;
                    date.textContent = new Date(`${event.date}T00:00:00`).toLocaleDateString("en-GB", {day: "numeric", month: "long", year: "numeric"}).toUpperCase();
                    artist.textContent = event.artist.toUpperCase();
                    link.href = event.url;
                    link.textContent = "Learn More";
                    card.append(title, date, artist, link);
                    section.append(card);
                });

            container.append(section);
        });

        document.dispatchEvent(new Event("contentloaded"));
    })
    .catch(console.error);
