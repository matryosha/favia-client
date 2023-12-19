import { throwIfUndefinedOrNullWithKeys } from "../../utils"

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

        throwIfUndefinedOrNullWithKeys({
            goalSection: this.sectionEls.goal,
            addressSection: this.sectionEls.address,
            parametersSection: this.sectionEls.parameters,
            mediaSection: this.sectionEls.media,
            videoSection: this.sectionEls.video,
            valuationSection: this.sectionEls.valuation,
            descriptionSection: this.sectionEls.description,
            contactsSection: this.sectionEls.contacts
        })
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

export class GoalSectionStateManager {
    state = {
        type: '', // offering or lookingFor,
        goal: '', // rent or sell or buy,
        ownerType: '', // owner or agent or tenant,
        propertyType: '', // flat, room, house or office,
    }

    #youAreEls = null
    #goalEls = null
    #ownerTypeEls = null
    #propertyTypeEls = null

    #youAreSectionEl = null
    #yourGoalIsSectionEl = null
    #areYouOwnerSectionEl = null
    #propertyTypeSectionEl = null

    #onPropertyCardClickedCb = () => {}


    constructor() {
        function id(id) {
            return document.getElementById(id)
        }

        const offeringCardEl = id('offering-card')
        const lookingForCardEl = id('looking-for-card')

        const toRentCardEl = id('to-rent-card')
        const toSellCardEl = id('to-sell-card')
        const toBuyCardEl = id('to-buy-card')

        const iAmOwnerCardEl = id('i-am-owner-card')
        const iAmAgentCardEl = id('i-am-agent-card')
        const iAmTenantCardEl = id('i-am-tenant-card')

        const propertyFlatCardEL = id('property-flat-card')
        const propertyRoomCardEL = id('property-room-card')
        const propertyHouseCardEL = id('property-house-card')
        const propertyOfficeCardEL = id('property-office-card')
        const propertyGarageCardEL = id('property-garage-card')

        this.#youAreSectionEl = id('you-are-card-section')
        this.#yourGoalIsSectionEl = id('your-goal-is-card-section')
        this.#areYouOwnerSectionEl = id('are-you-owner-card-section')
        this.#propertyTypeSectionEl = id('property-type-card-section')

        const sectionEls = {
            youAre: this.#youAreSectionEl,
            goal: this.#yourGoalIsSectionEl,
            areYouOwner: this.#areYouOwnerSectionEl,
            propertyType: this.#propertyTypeSectionEl
        }

        throwIfUndefinedOrNullWithKeys({
            offeringCardEl,
            lookingForCardEl,

            toRentCardEl,
            toSellCardEl,
            toBuyCardEl,

            iAmAgentCardEl,
            iAmAgentCardEl,
            iAmTenantCardEl,

            propertyFlatCardEL,
            propertyRoomCardEL,
            propertyHouseCardEL,
            propertyOfficeCardEL,
            propertyGarageCardEL,

            youAreCardSectionEl: this.#youAreSectionEl,
            yourGoalIsCardSectionEl: this.#yourGoalIsSectionEl,
            areYouOwnerCardSectionEl: this.#areYouOwnerSectionEl,
            propertyTypeCardSectionEl: this.#propertyTypeSectionEl
        })

        this.#hideSections([sectionEls.goal, sectionEls.areYouOwner, sectionEls.propertyType])

        this.#youAreEls = [offeringCardEl, lookingForCardEl]
        this.#goalEls = [toRentCardEl, toSellCardEl, toBuyCardEl]
        this.#ownerTypeEls = [iAmOwnerCardEl, iAmAgentCardEl, iAmTenantCardEl]
        this.#propertyTypeEls = [propertyFlatCardEL, propertyRoomCardEL, propertyHouseCardEL, propertyOfficeCardEL, propertyGarageCardEL]

        this.#youAreEls.forEach(el => {
            el.addEventListener('click', () => {
                const value = el.dataset['listingType']
                this.updateStateAndPrint({ ...this.state, type: value })

                this.#hideSections([
                    this.#yourGoalIsSectionEl,
                    this.#areYouOwnerSectionEl,
                    this.#propertyTypeSectionEl
                ])

                if (this.state.type === 'offering') {
                    this.#showSection(this.#yourGoalIsSectionEl)
                } else {
                    this.#showSection(this.#propertyTypeSectionEl)
                }
            })
        })
        this.#goalEls.forEach(el => {
            el.addEventListener('click', () => {
                const value = el.dataset['listingGoal']
                this.updateStateAndPrint({ ...this.state, goal: value })

                this.#hideSections([
                    this.#propertyTypeSectionEl
                ])

                this.#showSection(this.#areYouOwnerSectionEl)
            })
        })
        this.#ownerTypeEls.forEach(el => {
            el.addEventListener('click', () => {
                const value = el.dataset['listingIsOwner']
                this.updateStateAndPrint({ ...this.state, ownerType: value })

                this.#showSection(this.#propertyTypeSectionEl)
            })
        })
        this.#propertyTypeEls.forEach(el => {
            el.addEventListener('click', () => {
                const value = el.dataset['listingPropertyType']
                this.updateStateAndPrint({ ...this.state, propertyType: value })

                this.#onPropertyCardClickedCb()
            })
        })

        
        offeringCardEl.addEventListener('click', () => {

        })
    }

    onPropertyTypeCardClick(cb) {
        this.#onPropertyCardClickedCb = cb
    }

    #hideSections(sectionsEls) {
        sectionsEls.forEach(el => {
            this.#hideEl(el)
        })
    }

    // todo use base method show/hide el
    #showAllCardsInSection(sectionEls) {
        sectionEls.forEach(cardEl => this.#showEl(cardEl))
    }

    // todo to base method show/hide el
    #showSection(sectionEl) {
        this.#showEl(sectionEl)
    }

    // todo: d-none used twice in code. Move from designer or create constant
    #hideEl(el) {
        el.classList.add('d-none')
    }

    #showEl(el) {
        el.classList.remove('d-none')
    }

    updateStateAndPrint(newListingState) {
        this.state = newListingState
        console.log('new listing state: ', this.state)
    }

}

export class ParametersSectionManager {
    state = {
        totalArea: 0,
        isPetsAllowed: false,
        isObstacleFree: false,
        isSmokingAllowed: false,
        hasParking: false,
        rentTermType: null, // short or long
        floorNumber: null,
        floorTotalNumber: null,
        flatType: '',
        energyClass: '',
        furniture: ''
    }

    #afterStateChangedCb = undefined
    #requiredFilledCb = () => {}

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
        const floorNumberInputEl = id('fs-inputcounter-1-input')
        const floorTotalNumberInputEl = id('fs-inputcounter-2-input')

        throwIfUndefinedOrNullWithKeys({
            totalAreaInputEl,
            petsTglEl,
            obstacleFreeTglEl,
            smokingTglEl,
            parkingTglEl,
            flatTypeInputEl,
            energyClassInputEl,
            furnitureInputEl,
            longTermRadioEl,
            shortTermRadioEl,
            floorNumberInputEl,
            floorTotalNumberInputEl
        })

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
        floorNumberInputEl.addEventListener('input', () => {
            this.#setStateAndLog({...this.state, floorNumber: floorNumberInputEl.value})
        })
        floorTotalNumberInputEl.addEventListener('input', () => {
            this.#setStateAndLog({...this.state, floorTotalNumber: floorTotalNumberInputEl.value})
        })

        this.#afterStateChangedCb = () => this.#checkAndNotifyIfRequiredIsFilled();
    }

    onRequiredIsFilled(cb) {
        this.#requiredFilledCb = () => cb()
    }

    #setStateAndLog(state) {
        this.state = state;
        this.#afterStateChangedCb();
        console.log('New parameters section state: ', state);
    }

    #checkAndNotifyIfRequiredIsFilled() {
        function isNullOrEmpty(...args) {
            try {
                for (const arg of args) {
                    if (arg === null || arg.trim() === '') return true
                }
            } catch {
                return true
            }

            return false
        }
        const { rentTermType, floorNumber, floorTotalNumber, flatType, totalArea } = this.state;

        if (totalArea === 0) return

        if (isNullOrEmpty(rentTermType, floorNumber, floorTotalNumber, flatType)) return
        this.#afterStateChangedCb = () => {}
        this.#requiredFilledCb()
    }
}

export class PropertyValuationSectionManager {
    state = {
        pricePerMonth: 0,
        servicesPerMonth: 0,
        deposit: 0,
        additionalFees: 0,
    }

    #afterStateChangedCb = undefined
    #requiredFilledCb = () => {}

    constructor() {
        function id(id) {
            return document.getElementById(id)
        }

        const pricePerMonthInputEl = id('Price-per-month')
        const servicesPerMonthInputEl = id('Services-per-month')
        const depositInputEl = id('Deposit')
        const additionalFeesInputEl = id('Additional-fees')

        throwIfUndefinedOrNullWithKeys({pricePerMonthInputEl, servicesPerMonthInputEl, depositInputEl, additionalFeesInputEl})

        pricePerMonthInputEl.addEventListener('input', () => {
            this.#setStateAndLog({...this.state, pricePerMonth: pricePerMonthInputEl.value})
        })
        servicesPerMonthInputEl.addEventListener('input', () => {
            this.#setStateAndLog({...this.state, servicesPerMonth: servicesPerMonthInputEl.value})
        })
        depositInputEl.addEventListener('input', () => {
            this.#setStateAndLog({...this.state, deposit: depositInputEl.value})
        })
        additionalFeesInputEl.addEventListener('input', () => {
            this.#setStateAndLog({...this.state, additionalFees: additionalFeesInputEl.value})
        })

        this.#afterStateChangedCb = () => this.#checkAndNotifyIfRequiredIsFilled()
    }

    onRequiredIsFilled(cb) {
        this.#requiredFilledCb = cb
    }

    #checkAndNotifyIfRequiredIsFilled() {
        function isZeroOrUndefined(...args) {
            try {
                for (const arg of args) {
                    if (arg === undefined || arg === 0 || arg.trim() === '') return true
                }
            }
            catch {
                return true
            }

            return false

        }
        const {pricePerMonth, servicesPerMonth, deposit, additionalFees} = this.state

        try {
            parseInt(additionalFees, 10)
        } catch {
            return
        }

        if (isZeroOrUndefined(pricePerMonth, servicesPerMonth, deposit)) return

        this.#afterStateChangedCb = () => {}
        this.#requiredFilledCb()
    }


    #setStateAndLog(state) {
        this.state = state;
        this.#afterStateChangedCb();
        console.log('New property valuation section state: ', state);
    }
}

export class DescriptionSectionManager {
    description = ''
    #minCharactersFilledCb = () => {}

    constructor() {
        const descriptionInputEl = document.getElementById('property-description-input')

        throwIfUndefinedOrNullWithKeys({descriptionInputEl})

        descriptionInputEl.addEventListener('input', () => {
            this.description = descriptionInputEl.value
            if (this.description.trim().length > 20) {
                this.#minCharactersFilledCb()
                this.#minCharactersFilledCb = () => {}
            }
        })
    }


    onMinimumCharactersFilled(cb) {
        this.#minCharactersFilledCb = cb

    }





}