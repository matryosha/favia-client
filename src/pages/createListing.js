import { initAddressSuggestionInput } from "./createListing/addressSuggestionInput"

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
        updateStateAndPrint({...listingState, type: value})
    })
})

listingGoalEls.forEach(el => {
    el.addEventListener('click', () => {
        const value = el.dataset['listingGoal']
        updateStateAndPrint({...listingState, goal: value})
    })
})

listingIsOwnerEls.forEach(el => {
    el.addEventListener('click', () => {
        const value = el.dataset['listingIsOwner']
        updateStateAndPrint({...listingState, ownerType: value})
    })
})

listingPropertyTypeEls.forEach(el => {
    el.addEventListener('click', () => {
        const value = el.dataset['listingPropertyType']
        updateStateAndPrint({...listingState, propertyType: value})
    })
})

initAddressSuggestionInput();

document.getElementById('page-content').style.display = 'block'