// ==UserScript==
// @name        MangaDex Forums : Hide Images Spam
// @namespace   mdex-forums-images-spam
// @description Hide images spam in Mangadex Forums
// @version     1.0.2
// @author      reforget-id
// @icon        https://mangadex.org/favicon.svg
// @homepage    https://github.com/reforget-id/mangadex-userscripts
// @supportURL  https://github.com/reforget-id/mangadex-userscripts/issues
// @downloadURL https://raw.githubusercontent.com/reforget-id/mangadex-userscripts/master/scripts/mdex-forums-images-spam.user.js
// @updateURL   https://raw.githubusercontent.com/reforget-id/mangadex-userscripts/master/scripts/mdex-forums-images-spam.user.js
// @match       https://forums.mangadex.org/threads/*
// @license     MIT
// @run-at      document-end
// @grant       GM_addStyle
// ==/UserScript==

(() => {
    GM_addStyle(`
        .img-toggle-btn {
            display: block;
            margin: 10px 0;
            padding: 10px 12px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 14px;
            color: #333 ;
        }
    `)

    // Only select `.bbImageWrapper` that are not inside nested quotes/spoilers
    const bbImageSelector = 'div.bbImageWrapper:not(:is(:scope blockquote, :scope .bbCodeSpoiler) .bbImageWrapper)'

    const posts = document.querySelectorAll('article > .bbWrapper:has(.bbImageWrapper)')
    if (posts.length === 0) return

    posts.forEach(post => {
        const quotes = post.querySelectorAll('blockquote')
        const spoilers = post.querySelectorAll('.bbCodeSpoiler')

        processImages(post)
        quotes.forEach(quote => processImages(quote))
        spoilers.forEach(spoiler => processImages(spoiler))
    })


    /**
     * @param {Element} rootElement
     */
    function processImages(rootElement) {
        const images = rootElement.querySelectorAll(bbImageSelector)
        if (images.length < 2) return

        images.forEach(image => image.style.display = 'none')

        let toggleButton = new DOMParser().parseFromString(`
            <button class="img-toggle-btn">
                Show (${images.length}) hidden images
            </button>
        `, 'text/html')
        toggleButton = toggleButton.body.firstElementChild

        toggleButton.addEventListener('click', () => {
            const isHidden = images[0].style.display === 'none'
            images.forEach(image => image.style.display = isHidden ? '' : 'none')
            toggleButton.textContent = isHidden ? `Hide (${images.length}) images` : `Show (${images.length}) hidden images`
        })

        images[0].insertAdjacentElement('beforebegin', toggleButton)
    }
})()