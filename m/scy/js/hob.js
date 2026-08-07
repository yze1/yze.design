fetch("/m/scy/data/hob.json")
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
            const group = date >= today ? "Upcoming" : String(date.getFullYear());
            (groups[group] ??= []).push(event);
            return groups;
        }, {});
        const order = ["Upcoming", ...Object.keys(groups).filter(group => group !== "Upcoming").sort((a, b) => b - a)];

        order.filter(group => groups[group]?.length).forEach(group => {
            const section = document.createElement("section");
            const heading = document.createElement("div");
            heading.className = "s12";
            heading.innerHTML = `<h4>${group}</h4>`;
            section.append(heading);

            groups[group]
                .sort((a, b) => a.date.localeCompare(b.date))
                .forEach(event => {
                    const card = document.createElement("div");
                    const caption = document.createElement("p");
                    const image = document.createElement("img");
                    const name = document.createElement("p");
                    card.className = "s4";
                    caption.className = "caption";
                    caption.textContent = event.caption;
                    image.src = event.image;
                    image.alt = "";
                    name.textContent = event.name;
                    card.append(caption, image, name);
                    section.append(card);
                });

            container.append(section);
        });

        document.dispatchEvent(new Event("contentloaded"));
    })
    .catch(console.error);
