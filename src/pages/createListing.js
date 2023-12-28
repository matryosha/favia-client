import { initAddressSuggestionInput } from "./createListing/addressSuggestionInput"
import { initMap } from "./createListing/map"
import { REVERSE_GEO_URL } from "../serverEndpoints"
import { DescriptionSectionManager, GoalSectionStateManager, ParametersSectionManager, PropertyValuationSectionManager, SectionDisplayManager } from "./createListing/formStateManager"


const sectionDisplayManager = new SectionDisplayManager()

const goalSectionManger = new GoalSectionStateManager()
const parametersSectionManager = new ParametersSectionManager()
const propertyValuationSectionManager = new PropertyValuationSectionManager()
const descriptionSectionManager = new DescriptionSectionManager()

goalSectionManger.onPropertyTypeCardClick(() => {
    sectionDisplayManager.showSection("address")
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

// timeout because webpack could not set pageModule in time
setTimeout(() => {
    dispatchEvent(new Event('pageModuleLoaded'))
}, 50)