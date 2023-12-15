import { throwIfUndefinedOrNull } from "../../utils"

export class SectionDisplayManager {
    sectionEls = null

    constructor() {
        this.sectionEls = {
            goal: document.getElementById('goal-section'),
            address: document.getElementById('address-section'),
            parameters: document.getElementById('parameters-section'),
            media: document.getElementById('media-section'),
            video: document.getElementById('video-section'),
            valuation: document.getElementById('valuation-section'),
            description: document.getElementById('description-section'),
            contacts: document.getElementById('contacts-section')
        }
    }

    showSection(sectionName) {
        this.#showEl(this.sectionEls[sectionName])
    }

    hideSection(sectionName) {
        this.#hideEl(this.sectionEls[sectionName])
    }

    #showEl(el) {
        // d-none is added in Webflow designer page as embedded html element at the bottom of the page
        el.classList.remove('d-none')
    }

    #hideEl(el) {
        el.classList.add('d-none')
    }
}

class GoalSectionStateManager {
    //

}

export class ParametersSectionManager {
    state = {
        totalArea: 0,
        isPetsAllowed: false,
        isObstacleFree: false,
        isSmokingAllowed: false,
        hasParking: false,
        rentTermType: null, // short or long
        flatType: '',
        energyClass: '',
        furniture: ''
    }

    constructor() {
        function id(id) {
            return document.getElementById(id)
        }

        const totalAreaInputEl = id('total-area-input')
        const petsTglEl = id('pets-toggle')
        const obstacleFreeTglEl = id('obstacle-free-toggle')
        const smokingTglEl = id('smoking-toggle')
        const parkingTglEl = id('parking-toggle')
        const flatTypeInputEl = id('Flat-type-field')
        const energyClassInputEl = id('Energy-class-field')
        const furnitureInputEl = id('Furniture-field')
        const longTermRadioEl = id('long-term-radio-input')
        const shortTermRadioEl = id('short-term-radio-input')

        throwIfUndefinedOrNull(totalAreaInputEl, petsTglEl, obstacleFreeTglEl, smokingTglEl, parkingTglEl, flatTypeInputEl, energyClassInputEl, furnitureInputEl, longTermRadioEl, shortTermRadioEl)

        this.state = {
            ...this.state,
            flatType: flatTypeInputEl.value,
            energyClass: energyClassInputEl.value,
            furniture: furnitureInputEl.value
        }

        totalAreaInputEl.addEventListener('input', () => {
            this.#setStateAndLog({...this.state, totalArea: totalAreaInputEl.value})
        })
        petsTglEl.addEventListener('click', () => {
            this.#setStateAndLog({...this.state, isPetsAllowed: !this.state.isPetsAllowed})
        })
        obstacleFreeTglEl.addEventListener('click', () => {
            this.#setStateAndLog({...this.state, isObstacleFree: !this.state.isObstacleFree})
        })
        smokingTglEl.addEventListener('click', () => {
            this.#setStateAndLog({...this.state, isSmokingAllowed: !this.state.isSmokingAllowed})
        })
        parkingTglEl.addEventListener('click', () => {
            this.#setStateAndLog({...this.state, hasParking: !this.state.hasParking})
        })
        flatTypeInputEl.addEventListener('change', () => {
            this.#setStateAndLog({...this.state, flatType: flatTypeInputEl.value})
        })
        energyClassInputEl.addEventListener('change', () => {
            this.#setStateAndLog({...this.state, energyClass: energyClassInputEl.value})
        })
        furnitureInputEl.addEventListener('change', () => {
            this.#setStateAndLog({...this.state, furniture: furnitureInputEl.value})
        })
        longTermRadioEl.addEventListener('click', () => {
            this.#setStateAndLog({...this.state, rentTermType: 'long'})
        })
        shortTermRadioEl.addEventListener('click', () => {
            this.#setStateAndLog({...this.state, rentTermType: 'short'})
        })
    }

    #setStateAndLog(state) {
        this.state = state;
        console.log('New parameters section state: ', state);
    }

}