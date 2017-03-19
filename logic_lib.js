/**
 * LogicJS
 * @version 1.0.0alpha
 * @author Andchir<andchir@gmail.com>
 */

var LogicLibrary = function () {

    'use strict';

    var self = this;

    /** On DOM ready */
    var onReady = function () {

        var elements = document.querySelectorAll('[data-toggle]');

        elements.forEach(function(element){
            var commands = element.dataset.toggle.split(',');
            commands = commands.map(function(str) {
                return str.trim();
            });
            commands.forEach(function(command){
                self.attachEvents(element, command);
            });
        });
    };

    /** initialize */
    this.init = function () {
        if (document.readyState != 'loading'){
            onReady();
        } else {
            document.addEventListener('DOMContentLoaded', onReady);
        }
    };

    /**
     * Attach event to elements by command name
     * @param element
     * @param commandName
     */
    this.attachEvents = function (element, commandName) {

        switch (commandName){
            case 'collapse':

                element.addEventListener('click', this.onClickCollapse.bind(this), false);

                break;
        }

    };

    /**
     * Collapse action
     * @param event
     */
    this.onClickCollapse = function (event) {

        var currentEl = event.target,
            currentElType = this.getElementType(currentEl);

        var targetSelector = currentEl.dataset.collapseTarget,
            targetElement = targetSelector ? document.querySelector(targetSelector) : null,
            isTargetVisible = targetElement ? this.getIsVisible( targetElement ) : null;

        if(!targetElement){
            return;
        }

        var needCollapse = null, action;

        switch ( currentElType ){
            case 'anchor':
            case 'button':

                event.preventDefault();

                action = currentEl.dataset.collapseAction || 'toggle';

                if( isTargetVisible && ['toggle','collapse'].indexOf(action) > -1 ){
                    needCollapse = true;
                }
                else if( !isTargetVisible && ['toggle','expand'].indexOf(action) > -1 ){
                    needCollapse = false;
                }

                break;
            case 'checkbox':
            case 'radio':

                var isChecked = currentEl.checked;
                action = currentEl.dataset.collapseAction;

                if( !action ){
                    action = 'expand';
                    currentEl.dataset.collapseAction = action;
                }

                needCollapse = (isChecked && action == 'collapse') || (!isChecked && action == 'expand');

                break;
        }

        if( needCollapse !== null ){
            targetElement.style.display = needCollapse ? 'none' : '';
            if( !needCollapse ){
                targetElement.style.visibility = 'visible';
            }
        }
    };

    /** Is visible element? */
    this.getIsVisible = function (element) {
        return this.getStyle(element, 'display') != 'none'
            && this.getStyle(element, 'visibility') != 'hidden';
    };

    /** Get element style value */
    this.getStyle = function(element, styleName){
        var computedStyle = window.getComputedStyle(element, null);
        return computedStyle[styleName] || element.style[styleName];
    };

    /**
     * Get element type
     * @param element
     * @returns {string}
     */
    this.getElementType = function (element) {
        var elTagName = element.tagName.toLowerCase(),
            output = '';

        switch ( elTagName ){
            case 'input':

                var elType = element.getAttribute('type');
                if( ['button','submit','reset','image'].indexOf(elType) > -1 ){
                    elType = 'button';
                }
                output = elType;

                break;
            case 'a':
                output = 'anchor';
                break;
            default:
                output = elTagName;
                break;
        }
        return output;
    };

    this.init();
};

