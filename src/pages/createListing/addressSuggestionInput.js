import { debounce } from "../../utils";


export function initAddressSuggestionInput() {
    const ac = new AddressAutoComplete()
    ac.init(document.getElementById('address-input'))
}

//todo remove
const words = ["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "Ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "Duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "Excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "Sed", "ut", "perspiciatis", "unde", "omnis", "iste", "natus", "error", "sit", "voluptatem", "accusantium", "doloremque", "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis", "et", "quasi", "architecto", "beatae", "vitae", "dicta", "sunt", "explicabo", "Nemo", "enim", "ipsam", "voluptatem", "quia", "voluptas", "sit", "aspernatur", "aut", "odit", "aut", "fugit", "sed", "quia", "consequuntur", "magni", "dolores", "eos", "qui", "ratione", "voluptatem", "sequi", "nesciunt", "Neque", "porro", "quisquam", "est", "qui", "dolorem", "ipsum", "quia", "dolor", "sit", "amet", "consectetur", "adipisci", "velit", "sed", "quia", "non", "numquam", "eius", "modi", "tempora", "incidunt", "ut", "labore", "et", "dolore", "magnam", "aliquam", "quaerat", "voluptatem"];

// todo remove
function getRandomSuggestions() {
    const suggestionNumber = Math.floor(Math.random() * 11);
    const result = []

    for (let index = 0; index <= suggestionNumber; index++) {
        const randomWordCount = Math.floor(Math.random() * 10);
        let currentSuggestionResult = ''

        for (let j = 0; j <= randomWordCount; j++) {
            const randomIndex = Math.floor(Math.random() * 99);
            currentSuggestionResult += ` ${words[randomIndex]}`
        }
        result.push(currentSuggestionResult.trim())
    }

    return result;
}


class AddressAutoComplete {
    inputEl = null;
    suggestContainerEl = null;
    suggestItemNode = null;
    #debounceKey = ''


    init(inputEl) {
        this.inputEl = inputEl


        const suggestContainerEl = document.createElement('div')
        suggestContainerEl.id = 'suggest-container'
        this.inputEl.insertAdjacentElement("afterend", suggestContainerEl)
        this.suggestContainerEl = suggestContainerEl

        const suggestItemNode = document.createElement('li')
        suggestItemNode.className = 'item-wrapper'
        this.suggestItemNode = suggestItemNode


        // todo fix when fetching but new debounce call
        const debouncedHandler = debounce((...args) => {
            this.#debounceKey = Date.now()
            this.handleDebouncedInput(...args)
        }, 500)
        this.inputEl.addEventListener('input', (ev) => debouncedHandler(ev))
    }

    handleDebouncedInput(ev) {
        if (this.inputEl.value.trim() === '') {
            this.hideSuggestContainer()
            return
        }

        const capturedKey = this.#debounceKey

        console.log(ev)
        console.log(this)

        const suggestedStrings = getRandomSuggestions()

        if (this.#debounceKey !== capturedKey) return;
        this.updateSuggestedContainer(suggestedStrings)
        this.showSuggestContainer()
    }

    updateSuggestedContainer(items) {
        this.suggestContainerEl.textContent = ''

        items.forEach(item => {
            const listItemEl = this.suggestItemNode.cloneNode(true)
            listItemEl.textContent = item
            listItemEl.addEventListener('click', () => this.handleSuggestionClick(item))
            this.suggestContainerEl.appendChild(listItemEl)
        });
    }

    handleSuggestionClick(data) {
        this.hideSuggestContainer()
        this.inputEl.value = data

        console.log('clicked on ', data)
    }

    showSuggestContainer() {
        this.suggestContainerEl.style.display = 'block'
    }

    hideSuggestContainer() {
        this.suggestContainerEl.style.display = 'none'
    }
}