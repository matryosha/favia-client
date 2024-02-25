import Alpine from "alpinejs";

export class StepsManager {

    stepsSidemenuData = {}
    #scrollToSection;

    constructor(scrollToSection) {
        Alpine.data('stepsSidemenu', () => ({
            isStepActiveStatuses: {
                goal: false,
                address: false,
                param: false,
                media: false,
                propVal: false,
                desc: false,
                contacts: false
            }
        }))
        this.#scrollToSection = scrollToSection

        const tickElsContainer = document.getElementById('steps-sidemenu').querySelector('div');
        tickElsContainer.setAttribute('x-data', 'stepsSidemenu')

        // deffer creation
        setTimeout(() => {

            const tickEls = document.getElementById('steps-sidemenu').querySelectorAll('div > figure > div');
            const stepsLinks = tickElsContainer.querySelectorAll('a')

            tickEls[0].setAttribute('x-bind:class', "isStepActiveStatuses.goal === true ? 'tick-circle-active' : ''")
            this.#addScrollToSectionOnClick(stepsLinks[0], 'goal')
            tickEls[1].setAttribute('x-bind:class', "isStepActiveStatuses.address ? 'tick-circle-active' : ''")
            this.#addScrollToSectionOnClick(stepsLinks[1], 'address')
            tickEls[2].setAttribute('x-bind:class', "isStepActiveStatuses.param ? 'tick-circle-active' : ''")
            this.#addScrollToSectionOnClick(stepsLinks[2], 'parameters')
            tickEls[3].setAttribute('x-bind:class', "isStepActiveStatuses.media ? 'tick-circle-active' : ''")
            this.#addScrollToSectionOnClick(stepsLinks[3], 'media')
            tickEls[4].setAttribute('x-bind:class', "isStepActiveStatuses.propVal ? 'tick-circle-active' : ''")
            this.#addScrollToSectionOnClick(stepsLinks[4], 'valuation')
            tickEls[5].setAttribute('x-bind:class', "isStepActiveStatuses.desc ? 'tick-circle-active' : ''")
            this.#addScrollToSectionOnClick(stepsLinks[5], 'description')
            tickEls[6].setAttribute('x-bind:class', "isStepActiveStatuses.contacts ? 'tick-circle-active' : ''")
            this.#addScrollToSectionOnClick(stepsLinks[6], 'contacts')
        })

        document.addEventListener('alpine:initialized', () => {
            this.stepsSidemenuData = Alpine.$data(tickElsContainer)
        })
    }

    /**
     * @param step {'goal' | 'address' | 'param' | 'media' | 'propVal' | 'desc' | 'contacts'}
     * @param isActive {true | false}
     */
    setStepStatus(step, isActive) {
        this.stepsSidemenuData.isStepActiveStatuses[step] = isActive
    }

    #addScrollToSectionOnClick(el, sectionName) {
        el.addEventListener('click', e => {
            e.preventDefault();

            this.#scrollToSection(sectionName)
        })
    }
}