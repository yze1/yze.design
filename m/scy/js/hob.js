fetch("/m/scy/data/hob.json?v=4")
    .then(response => {
        if (!response.ok) throw new Error(`Could not load House of Blossoming events: ${response.status}`);
        return response.json();
    })
    .then(events => {
        const container = document.querySelector("#hob-events");
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const groups = events.reduce((groups, event) => {
            const date = new Date(`${event.date}T00:00:00`);
            if (Number.isNaN(date.getTime())) {
                console.error(`Invalid HOB event date: ${event.date}`);
                return groups;
            }
            const group = date >= today ? "Upcoming" : String(date.getFullYear());
            (groups[group] ??= []).push(event);
            return groups;
        }, {});
        const order = ["Upcoming", ...Object.keys(groups).filter(group => group !== "Upcoming").sort((a, b) => b - a)];

        order.forEach(group => {
            const section = document.createElement("section");
            const heading = document.createElement("div");
            heading.className = "s12";
            heading.innerHTML = `<h4>${group}</h4>`;
            section.append(heading);

            if (!groups[group]?.length) {
                const empty = document.createElement("div");
                empty.className = "s12 center";
                empty.innerHTML = "<h3>Coming soon</h3><p>AWODN Homecoming 27' is in production...</p>";
                section.append(empty);
                container.append(section);
                return;
            }

            groups[group]
                .sort((a, b) => group === "Upcoming" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date))
                .forEach(event => {
                    const card = document.createElement("div");
                    const caption = document.createElement("p");
                    const image = document.createElement("img");
                    const name = document.createElement("p");
                    const date = document.createElement("p");
                    const link = document.createElement("a");
                    card.className = "s4";
                    link.className = "hob-event-link";
                    caption.className = "caption";
                    caption.textContent = event.caption;
                    image.src = event.image;
                    image.alt = "";
                    name.textContent = event.name;
                    date.textContent = event.date.split("-").reverse().join(".");
                    link.href = event.url;
                    link.textContent = "Learn More";
                    card.append(caption, image, name, date, link);
                    section.append(card);
                });

            container.append(section);
        });

        document.dispatchEvent(new Event("contentloaded"));
    })
    .catch(console.error);
