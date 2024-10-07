"use strict"

document.addEventListener('DOMContentLoaded', () => {
    /*Menu burger*/
    const headerBurger = document.querySelector('.header__burger');
    const headerMenu = document.querySelector('.header__menu');
    const headerList = document.querySelector('.header__list');
    const body = document.body;
    const bottomIconsPanel = document.querySelector('.bottom-icons-panel');

    headerBurger.addEventListener('click', function (event) {
        if (event.target.closest('.header__burger')) {
            headerMenu.classList.add('_active');
            headerList.classList.add('_active');
            bottomIconsPanel.classList.add('_close');
            //body.classList.toggle('_lock');
        }
    });

    window.addEventListener('resize', function () {
        if (body.offsetWidth > 623 && headerMenu.classList.contains('_active')) {
            closeMenu();
        }
    });

    headerMenu.addEventListener('click', function (event) {
        if (event.target === headerMenu) {
            closeMenu();
        }
    });

    function closeMenu() {
        headerMenu.classList.remove('_active');
        headerList.classList.remove('_active');
        bottomIconsPanel.classList.remove('_close');
    }


    /*Fixed header*/
    const headerFixed = document.querySelector('.header');
    const headerNav = document.querySelector('.header__nav');
    const headerLogo = document.querySelector('.header__logo');
    const headerBtn = document.querySelector('.header__btn');
    const headerBreadcrumbs = document.querySelector('.header__breadcrumbs');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && !headerMenu.classList.contains('_active')) {
                    headerNav.classList.add('_fixed');
                    headerLogo.classList.add('_fixed');
                    headerBtn.classList.add('_fixed');
                    headerBreadcrumbs.classList.add('_fixed');
                } else {
                    headerNav.classList.remove('_fixed');
                    headerLogo.classList.remove('_fixed');
                    headerBtn.classList.remove('_fixed');
                    headerBreadcrumbs.classList.remove('_fixed');
                }
            });
        },
        { threshold: 0 }
    );
    observer.observe(headerFixed);

    /*Drop down list*/
    //managForm
    const managFormSelect = document.querySelector('.form-wrapper__select');
    const managFormInitialOption = document.getElementById('initial1');

    managFormSelect.addEventListener('focus', function (e) {
        if (e.target.closest('.form-wrapper__main-form')) {
            managFormInitialOption.checked = true;
        }
    });

    //requestForm
    const requestFormSelect = document.querySelector('.request__select');
    const requestFormInitialOption = document.getElementById('initial2');

    requestFormSelect.addEventListener('focus', function (e) {
        if (e.target.closest('.request__form')) {
            requestFormInitialOption.checked = true;
        }
    });

    /*Spoilers*/
    const spoilersBlock = document.querySelector('.partners__links');

    spoilersBlock.addEventListener('click', function (e) {
        if (e.target.closest('.partners__link')) {
            if (e.target.closest('.partners__links[data-one-spoiler]')) {
                const openSpoilers = document.querySelectorAll('.partners__partner[open]');
                const details = e.target.parentElement;

                openSpoilers.forEach(spoiler => {
                    if (details !== spoiler) {
                        spoiler.querySelector('.partners__link').classList.remove('_active');
                        spoiler.removeAttribute('open');
                    }
                });

            }
            e.target.classList.toggle('_active');
        }
    });

    /*Placeholder on focus and blur*/
    document.addEventListener('focusin', function (e) {
        if (e.target.closest('.placeholder')) {
            getElementForm(e.target, e.target.placeholder);
        }
    });

    //Функции focus, blur и получение элемента placeholder
    function getElementForm(item, placeholder) {
        if (placeholder !== '') {
            const savePlaceholder = placeholder;
            focusElementForm(item);

            if (item.placeholder == '') {
                document.addEventListener('focusout', function (e) {
                    if (e.target.closest('.placeholder')) {
                        blurElementForm(e.target, savePlaceholder);
                    }
                }, { 'once': true });
            }
        }
    }

    function focusElementForm(item) {
        item.placeholder = '';
    }

    function blurElementForm(item, placeholder) {
        item.placeholder = placeholder;
    }

    /*Phone Input mask*/
    let phoneInput = document.querySelectorAll('input[data-tel-input]');

    phoneInput.forEach(input => {
        var mask = new IMask(input, {
            mask: '+7 (000) 000-00-00',
            lazy: false
        });
    });

    /*Popup*/
    let unlock = true;
    const timeout = 500;
    const popupLinks = document.querySelectorAll('[data-popup-link]');
    const lockPadding = document.querySelectorAll('[data-lock]');

    popupLinks.forEach(popupLink => {
        popupLink.addEventListener('click', function (e) {
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const curentPopup = document.getElementById(popupName);
            popupOpen(curentPopup);
            e.preventDefault();
        });
    });

    const popupCloseIcon = document.querySelectorAll('.popup__close');
    popupCloseIcon.forEach(item => {
        item.addEventListener('click', function (e) {
            popupClose(item.closest('.popup'));
            e.preventDefault();
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.code === "Escape") {
            const popupActive = document.querySelector('.popup._open');
            popupClose(popupActive);
        }
    })

    function popupOpen(curentPopup) {
        if (curentPopup && unlock) {
            const popupActive = document.querySelector('.popup._open');
            if (popupActive) {
                popupClose(popupActive, false);
            } else {
                bodyLock();
            }
            curentPopup.classList.add('_open');
            curentPopup.addEventListener('click', function (e) {
                if (!e.target.closest('.popup__content')) {
                    popupClose(e.target.closest('.popup'));
                }
            });
        }
    }

    function popupClose(popupActive, doUnlock = true) {
        if (unlock) {
            popupActive.classList.remove('_open');
            if (doUnlock) {
                bodyUnLock();
            }
        }
    }

    function bodyLock() {
        const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth;

        if (lockPadding.length > 0) {
            lockPadding.forEach(el => {
                if (window.getComputedStyle(el).position === 'fixed') {
                    const currentPadding = window.getComputedStyle(el).paddingRight;
                    const newPaddingValue = parseFloat(currentPadding) + lockPaddingValue;
                    el.style.paddingRight = newPaddingValue + 'px';
                }
            });
        }

        document.querySelector('.wrapper').style.paddingRight = lockPaddingValue + 'px';
        body.classList.add('_lock');

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    function bodyUnLock() {

        setTimeout(function () {
            if (lockPadding.length > 0) {
                lockPadding.forEach(el => {
                    el.style.paddingRight = '';
                });
            }
            document.querySelector('.wrapper').style.paddingRight = '';
            body.classList.remove('_lock');
        }, timeout);

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    /*Submit form*/
    const allForms = document.forms;
    const forms = Array.from(allForms);

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            checkingCorrectnessForm(e);
        });
    });

    function checkingCorrectnessForm(e) {
        let isValid = true;
        const formFields = e.currentTarget.elements;


        for (let field of formFields) {
            if (field.type === 'text' || field.type === 'password' || field.tagName.toLowerCase() === 'textarea') {
                if (!field.value.trim()) {
                    isValid = false;
                }
            }

            if (field.type === 'radio') {
                const radioGroupName = field.name;
                const radioGroup = e.currentTarget.querySelectorAll(`input[name="${radioGroupName}"]`);
                const isRadioChecked = Array.from(radioGroup).some(radio => radio.checked);

                if (!isRadioChecked) {
                    isValid = false;
                }
            }
        }

        if (!isValid) {
            alert("Заполните форму");
        } else {
            /*
                ...

                Логика отправки данных с формы на сервер

                ...
            */
            e.currentTarget.reset();
            const popupCheck = document.getElementById('popup-sent');
            popupOpen(popupCheck);
        }
    }

});


