import { GEODECODE_URL } from "../../serverEndpoints";
import { debounce } from "../../utils";


export function initAddressSuggestionInput() {
    const ac = new AddressAutoComplete()
    ac.init(document.getElementById('address-input'))
    return ac
}

class AddressAutoComplete {
    inputEl = null;
    suggestContainerEl = null;
    suggestItemNode = null;
    #debounceKey = ''
    #suggestionSelectedCallback = undefined


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
        const debouncedHandler = debounce(async (...args) => {
            this.#debounceKey = Date.now()
            await this.handleDebouncedInput(...args)
        }, 500)
        this.inputEl.addEventListener('input', (ev) => debouncedHandler(ev))
    }

    async handleDebouncedInput(ev) {
        if (this.inputEl.value.trim() === '') {
            this.hideSuggestContainer()
            return
        }

        const capturedKey = this.#debounceKey

        console.log(ev)
        console.log(this)

        const result = await (await fetch(GEODECODE_URL + '?search=' + this.inputEl.value)).json()

        if (result.length === 0) {
            this.hideSuggestContainer()
            return
        }

        if (this.#debounceKey !== capturedKey) return;
        this.updateSuggestedContainer(result)
        this.showSuggestContainer()

    }

    updateSuggestedContainer(items) {
        this.suggestContainerEl.textContent = ''

        items.forEach(item => {
            const listItemEl = this.suggestItemNode.cloneNode(true)
            listItemEl.textContent = item['display_name']
            listItemEl.addEventListener('click', () => this.handleSuggestionClick(item))
            this.suggestContainerEl.appendChild(listItemEl)
        });
    }

    disableInput() {
        this.inputEl.setAttribute('disabled', '');
    }

    enableInput() {
        this.inputEl.removeAttribute('disabled');
    }

    onSuggestionSelected(cb) {
        this.#suggestionSelectedCallback = cb
    }

    setInputValue(str) {
        this.inputEl.value = str 
    }

    handleSuggestionClick(data) {
        this.hideSuggestContainer()
        this.setInputValue(data['display_name'])

        console.log('clicked on ', data)
        this.#suggestionSelectedCallback(data)
    }

    showSuggestContainer() {
        this.suggestContainerEl.style.display = 'block'
    }

    hideSuggestContainer() {
        this.suggestContainerEl.style.display = 'none'
    }
}