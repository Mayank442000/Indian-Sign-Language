//setting chosen sign value in local storage
import { gebi, dc, setEvent, gebq } from "./../../Scripts/General/general";

function load(value: number) {
    console.log('load.chosenSignID', String(value), value)
    localStorage.setItem("chosenSignID", String(value));
    window.location.href = "./../Practice/index.html";
}

//for menu collapse
const menu = Array.from(document.querySelectorAll(".menu-item")) as HTMLDivElement[];
menu.forEach((menu: HTMLDivElement) => {
    menu.addEventListener("click", () => {
        const menuItems = Array.from(document.querySelectorAll(".menu-item")) as HTMLDivElement[];
        for (let mnIt of menuItems) {
            // console.log(mnIt, menu);
            if (mnIt == menu && !mnIt.classList.contains("active")) mnIt.classList.add("active");
            else mnIt.classList.remove("active");
        }
    });
});

const createAllButtons = () => {
    const createButton = (cont: string, gestureID: number) => {
        const butt = dc.createElement("button");
        setEvent("click", () => load(gestureID), butt, false);
        butt.classList.add("ChoiceOfButt");
        butt.innerText = cont;
        // if (gestureID > 3000) {
        //     butt.title = 'Under Development';
        //     butt.disabled = true;
        //     butt.classList.add("disabled")
        // }
        return butt;
    };
    const AlphaChoiceDiv = gebi("AlphaChoiceDiv") as HTMLDivElement,
        NumbChoiceDiv = gebi("NumbChoiceDiv") as HTMLDivElement,
        WordChoiceDiv = gebi("WordChoiceDiv") as HTMLDivElement;
    const words = ["I", "You", "India", "Man", "Woman", "Hello", "ThankYou", "welcome"];
    for (let i = 65, id = 1001; i < 91; ++i, ++id) AlphaChoiceDiv.appendChild(createButton(String.fromCharCode(i), id));
    for (let i = 48, id = 2001; i < 58; ++i, ++id) NumbChoiceDiv.appendChild(createButton(String.fromCharCode(i), id));
    for (let i = 0, id = 3001; i < words.length; ++i, ++id) WordChoiceDiv.appendChild(createButton(words[i], id));
};

createAllButtons();

console.log("bundle loaded");
