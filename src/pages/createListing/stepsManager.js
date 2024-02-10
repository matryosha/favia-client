import Alpine from "alpinejs";

export class StepsManager {

    stepsSidemenuData = {}

    constructor() {
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

        const tickElsContainer = document.getElementById('steps-sidemenu').querySelector('div');
        tickElsContainer.setAttribute('x-data', 'stepsSidemenu')

        // deffer creation
        setTimeout(() => {

            const tickEls = document.getElementById('steps-sidemenu').querySelectorAll('div > figure > div');

            tickEls[0].setAttribute('x-bind:class', "isStepActiveStatuses.goal === true ? 'tick-circle-active' : ''")
            tickEls[1].setAttribute('x-bind:class', "isStepActiveStatuses.address ? 'tick-circle-active' : ''")
            tickEls[2].setAttribute('x-bind:class', "isStepActiveStatuses.param ? 'tick-circle-active' : ''")
            tickEls[3].setAttribute('x-bind:class', "isStepActiveStatuses.media ? 'tick-circle-active' : ''")
            tickEls[4].setAttribute('x-bind:class', "isStepActiveStatuses.propVal ? 'tick-circle-active' : ''")
            tickEls[5].setAttribute('x-bind:class', "isStepActiveStatuses.desc ? 'tick-circle-active' : ''")
            tickEls[6].setAttribute('x-bind:class', "isStepActiveStatuses.contacts ? 'tick-circle-active' : ''")
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
}