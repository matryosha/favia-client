import { initAddressSuggestionInput } from "./createListing/addressSuggestionInput"
import { initMap } from "./createListing/map"
import { REVERSE_GEO_URL } from "../serverEndpoints"
import { DescriptionSectionManager, ParametersSectionManager, PropertyValuationSectionManager, SectionDisplayManager } from "./createListing/formStateManager"


const sectionDisplayManager = new SectionDisplayManager()
const parametersSectionManager = new ParametersSectionManager()
const propertyValuationSectionManager = new PropertyValuationSectionManager()
const descriptionSectionManager = new DescriptionSectionManager()

let listingState = {
    type: '', // offering or lookingFor,
    goal: '', // rent or sell,
    ownerType: '', // owner or agent or tenant,
    propertyType: '', // flat, room, house or office,
    propertyAddress: '',
}


function updateStateAndPrint(newListingState) {
    listingState = newListingState
    console.log('new listing state: ', listingState)
}


const listingTypeEls = document.querySelectorAll('[data-listing-type]')
const listingGoalEls = document.querySelectorAll('[data-listing-goal]')
const listingIsOwnerEls = document.querySelectorAll('[data-listing-is-owner]')
const listingPropertyTypeEls = document.querySelectorAll('[data-listing-property-type]')


listingTypeEls.forEach(el => {
    el.addEventListener('click', () => {
        const value = el.dataset['listingType']
        updateStateAndPrint({ ...listingState, type: value })
    })
})

listingGoalEls.forEach(el => {
    el.addEventListener('click', () => {
        const value = el.dataset['listingGoal']
        updateStateAndPrint({ ...listingState, goal: value })
    })
})

listingIsOwnerEls.forEach(el => {
    el.addEventListener('click', () => {
        const value = el.dataset['listingIsOwner']
        updateStateAndPrint({ ...listingState, ownerType: value })
    })
})

listingPropertyTypeEls.forEach(el => {
    el.addEventListener('click', () => {
        const value = el.dataset['listingPropertyType']
        updateStateAndPrint({ ...listingState, propertyType: value })

        sectionDisplayManager.showSection("address")
    })
})

parametersSectionManager.onRequiredIsFilled(() => {
    sectionDisplayManager.showSection('media')
    sectionDisplayManager.showSection('video')
})

propertyValuationSectionManager.onRequiredIsFilled(() => {
    sectionDisplayManager.showSection('description')
})

descriptionSectionManager.onMinimumCharactersFilled(() => {
    sectionDisplayManager.showSection('contacts')
})

const autoSuggestion = initAddressSuggestionInput();

let isInReverseGeoProcess = false


const map = initMap(async (e, setMapMarker) => {
    const { lat, lng } = e.latlng;

    if (isInReverseGeoProcess) {
        return
    }

    isInReverseGeoProcess = true
    autoSuggestion.disableInput()
    const reverseGeoResponse = await fetch(REVERSE_GEO_URL + `?lat=${lat}&lon=${lng}`)
    const reverseGeoResult = await reverseGeoResponse.json()

    if (reverseGeoResult.error) {
        return
    }

    setMapMarker()
    autoSuggestion.setInputValue(reverseGeoResult['display_name'])
    autoSuggestion.enableInput()
    isInReverseGeoProcess = false
})


autoSuggestion.onSuggestionSelected(async (suggestion) => {
    let zoom = 13;

    const placeRank = suggestion['place_rank']
    if (placeRank > 25) {
        zoom = 19
    }


    map.setMapView(suggestion.lat, suggestion.lon, zoom)
})

export function getMap() {
    return map
}

export function handleAddressContinueBtnClicked() {
    sectionDisplayManager.showSection('parameters')
}

export { sectionDisplayManager }

document.getElementById('page-content').style.display = 'block';