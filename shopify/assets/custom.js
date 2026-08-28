function handleScroll() {
    var btnSupport = document.getElementsByClassName('support-floating')[0],
        btnFlutuante = document.getElementsByClassName('botaoflutuante')[0],
        priceList = document.getElementById("evolution-price-list");

    var btnFlutuanteStyle = null;

    if (btnFlutuante) {
        btnFlutuanteStyle = window.getComputedStyle(btnFlutuante);
    }

    if (btnSupport && priceList) btnSupport.style.bottom = btnFlutuanteStyle != null && btnFlutuanteStyle.display === 'block' ? '65px' : '15px';
}

window.onload = function() {
    if (window.matchMedia("(max-width: 768px)").matches) {
        handleScroll();
        window.onscroll = handleScroll;

        var btnSupport = document.getElementsByClassName('support-floating')[0],
            btnFlutuante = document.getElementsByClassName('botaoflutuante')[0];

        var btnFlutuanteStyle = null;

        if (btnFlutuante) {
            btnFlutuanteStyle = window.getComputedStyle(btnFlutuante);
        }

        if(btnSupport && btnFlutuanteStyle != null && btnFlutuanteStyle.display === 'block') {
            btnSupport.style.bottom = '65px';
        }
    }
}

$(".block-swatch__radio, .variant-swatch__radio, .product-form__single-selector").change(function () {
  setTimeout(function () { parcelamento(); }, 150);
});

function increaseValue() {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  document.getElementById('number').value = value;
}

function decreaseValue() {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  if(value !== 1) value--;

  document.getElementById('number').value = value;
}

$('.options:first-child').addClass('active')

$(".options").each(function() {
    $(this).on("click", function(){
        $('.options').removeClass('active')
        $(this).addClass('active')

        $('#evolution-price-list .price-promotional-wrap strong').html($(this).find('.valortot').text());
        $('#evolution-price-list .price-promotional-wrap span').html($(this).find('.valorcomp').text());

        $('#evolution-price-list .price-promotional-wrap .selector-desconto').remove();
        $('#evolution-price-list .price-promotional-wrap').append('<p class="selector-desconto">CUPOM ' + $(this).find('.saving').text() + ' APLICADO</p>');

        parcelamento();
    });
});

$(".product-form").each(function () {
    $(this).on('click', '.botaocmprar', function (event) {
      	var arraydeprodutos = [];
        event.stopImmediatePropagation();
        var idproduto = parseInt($('.options.active .iddavariante').attr('val'))
        var qtdproduto = parseInt($('.options.active .iddavariante').attr('qtd'))
        arraydeprodutos.push({
            id: idproduto,
            quantity: qtdproduto
        });

        $('.buy-together-list input').each(function () {
            if ($(this).prop("checked") === true) {
                arraydeprodutos.push({
                    id: $(this).attr("data-id"),
                    quantity: 1
                });
            }
        });

        data = {
            items: arraydeprodutos
        }

        fetch("".concat(window.routes.cartAddUrl, ".js"), {
            body: JSON.stringify(data),
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(function (response) {
            if (response.ok) {
                if(window.theme.cartType === 'drawer') {
                    document.dispatchEvent(new CustomEvent("theme:loading:end"));

                    const productTemplateElement = document.querySelector('[data-section-id="product-template"]');

                    if (productTemplateElement) {
                        productTemplateElement.dispatchEvent(new CustomEvent("product:added", {
                            bubbles: true,
                            detail: {
                                variant: arraydeprodutos[0],
                                quantity: arraydeprodutos[0].quantity || 1
                            }
                        }));
                    }
                } else {
                    setTimeout(function () {
                        window.location.href = '/cart';
                    }, 500);
                }
            }
        });
    });
});

function serialize(form) {
    function stringKey(key, value) {
        var beginBracket = key.lastIndexOf('[');

        if (beginBracket === -1) {
            var _hash = {};
            _hash[key] = value;
            return _hash;
        }

        var newKey = key.substr(0, beginBracket);
        var newValue = {};
        newValue[key.substring(beginBracket + 1, key.length - 1)] = value;
        return stringKey(newKey, newValue);
    }

    var hash = {};

    for (var i = 0, len = form.elements.length; i < len; i++) {
        var formElement = form.elements[i];

        if (formElement.name === '' || formElement.disabled) {
            continue;
        }

        if (formElement.name && !formElement.disabled && (formElement.checked || /select|textarea/i.test(formElement.nodeName) || /hidden|text|search|tel|url|email|password|datetime|date|month|week|time|datetime-local|number|range|color/i.test(formElement.type))) {
            var stringKeys = stringKey(formElement.name, formElement.value);
            hash = extend(hash, stringKeys);
        }
    }

    return hash;
}

function extend() {
    var extended = {};
    var i = 0;

    var merge = function merge(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                // If property is an object, merge properties
                if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = Form.extend(extended[prop], obj[prop]);
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };


    for (; i < arguments.length; i++) {
        merge(arguments[i]);
    }

    return extended;
}

const youtubeVideos = [...document.querySelectorAll('[data-youtube]')];
youtubeVideos.forEach(function(element) {
    const button = element.querySelector('[data-youtube-button]');
    button.addEventListener('click', function () {
            const url = event.target.dataset.youtubeButton;
            const youtubePlaceholder = event.target.parentNode;

            const htmlString = '<iframe width="100%" src="' + url + '?autoplay=1&showinfo=0&controls=1&rel=0&modestbranding=1" allow="autoplay;" frameborder="0" allowfullscreen></iframe>';

            youtubePlaceholder.style.display = 'none';
            youtubePlaceholder.insertAdjacentHTML('beforebegin', htmlString);
            youtubePlaceholder.parentNode.removeChild(youtubePlaceholder);
        }
    );
});

$(document).ready(function() {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;

        name = name.replace(/[\[\]]/g, '\\$&');

        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);

        if (!results) return null;
        if (!results[2]) return '';

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    var customerPosted = getParameterByName('customer_posted');

    if(customerPosted) {
        $(".modal--newsletter").attr("aria-hidden", "false");
    }

    const copiarCupomElement = document.getElementById("copiar-cupom");

    if (copiarCupomElement) {
        copiarCupomElement.addEventListener("click", function() {
            var textoCupom = document.getElementById("texto-cupom");

            if (navigator.clipboard) {
                navigator.clipboard.writeText(textoCupom.innerText)
                    .then(function() {
                        console.log("Texto copiado com sucesso!" + textoCupom.innerText);
                    })
                    .catch(function(err) {
                        console.error("Erro ao copiar o texto: ", err);
                    });
            } else {
                console.warn("A API Clipboard não é suportada neste navegador.");
            }
        });
    }
});

(function () {
    var catalog = null;
    var catalogLoading = null;

    function loadCatalog() {
        if (catalog) {
            return Promise.resolve(catalog);
        }

        if (!catalogLoading) {
            var catalogUrl = (window.routes && window.routes.productsCatalogUrl) || '/assets/products-catalog.json';

            catalogLoading = fetch(catalogUrl, { credentials: 'same-origin' })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('catalog unavailable');
                    }

                    return response.json();
                })
                .then(function (data) {
                    catalog = Array.isArray(data) ? data : [];
                    return catalog;
                })
                .catch(function () {
                    catalog = [];
                    return catalog;
                });
        }

        return catalogLoading;
    }

    function formatMoney(value) {
        var amount = Number(value);

        if (isNaN(amount)) {
            return '';
        }

        return 'R$ ' + amount.toFixed(2).replace('.', ',');
    }

    function highlightTerm(text, term) {
        if (!term) {
            return text;
        }

        var regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
        return text.replace(regex, '<strong>$1</strong>');
    }

    function searchCatalog(query) {
        if (!catalog || !query) {
            return [];
        }

        var normalized = query.toLowerCase().trim();

        return catalog.filter(function (product) {
            return product.title.toLowerCase().indexOf(normalized) !== -1
                || product.handle.indexOf(normalized) !== -1;
        }).slice(0, 3);
    }

    function renderCatalogResults(results, query) {
        if (!results.length) {
            return '<div class="search-bar__empty-state"><p class="heading h4">Nenhum produto encontrado</p></div>';
        }

        var html = '<p class="search-bar__result-category">Produtos</p><div class="search-bar__result-products">';

        results.forEach(function (product) {
            html += '<a href="' + product.url + '" class="search-bar__result-item">'
                + '<div class="search-bar__image-container"><div class="aspect-ratio aspect-ratio--square">'
                + '<img src="' + product.image + '" alt="' + product.title.replace(/"/g, '&quot;') + '">'
                + '</div></div><div class="search-bar__item-info">'
                + '<p class="search-bar__item-title">' + highlightTerm(product.title, query) + '</p>'
                + '<span class="search-bar__item-price">' + formatMoney(product.price) + '</span>'
                + '</div></a>';
        });

        html += '</div>';

        if (catalog.filter(function (product) {
            var normalized = query.toLowerCase().trim();
            return product.title.toLowerCase().indexOf(normalized) !== -1 || product.handle.indexOf(normalized) !== -1;
        }).length > 3) {
            html += '<button class="search-bar__view-all" type="submit">Ver todos os resultados</button>';
        }

        return html;
    }

    function maybeFillSearchFromCatalog(input) {
        var searchBar = input.closest('.search-bar');

        if (!searchBar) {
            return;
        }

        var resultsInner = searchBar.querySelector('.search-bar__results-inner');
        var query = input.value.trim();

        if (!resultsInner || query.length < 2) {
            return;
        }

        loadCatalog().then(function () {
            var shopifyResults = resultsInner.querySelector('.search-bar__result-products');
            var emptyState = resultsInner.querySelector('.search-bar__empty-state');

            if (shopifyResults && shopifyResults.children.length) {
                return;
            }

            if (!emptyState && resultsInner.textContent.trim() !== '') {
                return;
            }

            var matches = searchCatalog(query);

            if (!matches.length) {
                return;
            }

            searchBar.classList.remove('is-loading');
            resultsInner.innerHTML = renderCatalogResults(matches, query);
            searchBar.querySelector('.search-bar__results').setAttribute('aria-hidden', 'false');
        });
    }

    function initCatalogSearch() {
        var searchInput = document.querySelector('.search-bar__input');

        if (!searchInput) {
            return;
        }

        loadCatalog();

        searchInput.addEventListener('input', function () {
            window.setTimeout(function () {
                maybeFillSearchFromCatalog(searchInput);
            }, 350);
        });

        var resultsInner = document.querySelector('.search-bar__results-inner');

        if (resultsInner && window.MutationObserver) {
            var observer = new MutationObserver(function () {
                maybeFillSearchFromCatalog(searchInput);
            });

            observer.observe(resultsInner, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCatalogSearch);
    } else {
        initCatalogSearch();
    }
})();