import {CREATE_LISTING_URL, REVERSE_GEO_URL, SERVER_URL as serverUrl} from "serverEndpoints"
import { initAddressSuggestionInput } from "./createListing/addressSuggestionInput"
import { initMap } from "./createListing/map"
import './createListing/mediaUpload/'
import {
    ContactsSectionManager,
    DescriptionSectionManager,
    GoalSectionStateManager,
    ParametersSectionManager,
    PropertyValuationSectionManager,
    SectionDisplayManager
} from "./createListing/formStateManager"


const sectionDisplayManager = new SectionDisplayManager()

const goalSectionManger = new GoalSectionStateManager()
const parametersSectionManager = new ParametersSectionManager()
const propertyValuationSectionManager = new PropertyValuationSectionManager()
const descriptionSectionManager = new DescriptionSectionManager()
const contactsSectionManager = new ContactsSectionManager()

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


let lastListingGeoPosition = {
    lat: 0,
    lon: 0
}
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

    lastListingGeoPosition.lat = lat;
    lastListingGeoPosition.lon = lng;

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

document.getElementById('post-listing-btn').addEventListener('click', async (e) => {
    e.preventDefault();

    // goal section
    console.log(goalSectionManger.state)

    //address (point)
    console.log(lastListingGeoPosition)

    //all parameters
    console.log(parametersSectionManager.state)

    // video link
    console.log(document.getElementById('video-section').querySelector('input').value)

    //property valuation
    console.log(propertyValuationSectionManager.state)

    // desc
    console.log(descriptionSectionManager.description)

    // contacts
    console.log(contactsSectionManager.state)

    const listingData = {
        goal: goalSectionManger.state,
        address: lastListingGeoPosition,
        parameters: parametersSectionManager.state,
        utubeLink: document.getElementById('video-section').querySelector('input').value,
        propertyValuation: propertyValuationSectionManager.state,
        description: descriptionSectionManager.description,
        contacts: contactsSectionManager.state
    }

    const respone = await fetch(CREATE_LISTING_URL, {
        body: JSON.stringify(listingData),
        method: 'post',
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'})
})