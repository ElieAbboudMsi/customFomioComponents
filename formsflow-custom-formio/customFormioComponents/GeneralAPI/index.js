import React, { Component, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ReactComponent } from "@formio/react";
import settingsForm from "./GeneralAPI.settingsFrom"
import _ from 'lodash';
import { Utils } from "@formio/react";
import moment from "moment";

let oldState = {

};


const GeneralAPICustomComp = ({ ...props }) => {
    useEffect(() => {
        props.component.label = "";
        if (!oldState[props.component.key]) {
            oldState[props.component.key] = {};
            oldState[props.component.key]["completed"] = false;

        }
        if(oldState[props.component.key]["completed"] === true){


            props.onChange(moment().format("HH:mm").toString(), null);
            props.updateOnChange();
        }
        if (props.component.startProcessing && oldState[props.component.key]["completed"] === false) {

            const allData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                allData[key] = value;
            }
            let url = props.component.requestUrl;
            let body = props.component.requestBody;
            let method = props.component.requestMethod;

            let paramsGrid = props.component.paramsGrid;
            let headersGrid = props.component.headersGrid;
            let bodyGrid = props.component.bodyGrid;
            let fillResponse = props.component.fillResponse;

            for (let i = 0; i < paramsGrid?.length; i++) {
                let obj = allData[paramsGrid[i].paramsFieldPath.split(".")[0]];
                let valueToReplace = paramsGrid[i].paramsFieldPath.split(".").length > 1 ? _.get(JSON.parse(obj), paramsGrid[i].paramsFieldName, '') : allData[paramsGrid[i].paramsFieldPath]
                let toReplace = "{" + paramsGrid[i].paramsFieldName + "}";
                url = url.replace(toReplace, valueToReplace);
            }
            let headersJson = {};

            for (let i = 0; i < headersGrid?.length; i++) {
                if (headersGrid[i].isLocalStorage) {
                    let obj = allData[headersGrid[i].paramsFieldPath.split(".")[0]];
                    let value = headersGrid[i].paramsFieldPath.split(".").length > 1 ? _.get(JSON.parse(obj), headersGrid[i].paramsFieldName, '') : allData[headersGrid[i].paramsFieldPath]
                    headersJson[headersGrid[i].paramsFieldName] = value;
                }
                else {
                    headersJson[headersGrid[i].paramsFieldName] = headersGrid[i].paramsFieldPath;

                }

            }
            for (let i = 0; i < bodyGrid?.length; i++) {
                let obj = allData[bodyGrid[i].paramsFieldPath.split(".")[0]];
                let value = bodyGrid[i].paramsFieldPath.split(".").length > 1 ? _.get(JSON.parse(obj), bodyGrid[i].paramsFieldName, '') : allData[bodyGrid[i].paramsFieldPath]
                body = body.replace("{" + bodyGrid[i].paramsFieldName + "}", bodyGrid[i].paramsFieldName === "number" ? value : "\"" + value + "\"");
            }

            let requestJSON = { method: method, headers: headersJson };
            if (method === "POST") {

                requestJSON["body"] = JSON.stringify(JSON.parse(body));
            }
            fetch(url, requestJSON).then(response => response.json()).then((res) => {

                let result = props.component.dataPath === "" ? res : _.get(res, props.component.dataPath, '');
                if (fillResponse === "fillFields") {
                    let responseGrid = props.component.responseGrid;

                    for (let i = 0; i < responseGrid.length; i++) {

                        Utils.eachComponent(props.form.component.components, function (component) {

                            if (component.key === responseGrid[i].fieldApiKey) {
                                let fieldVal = _.get(result, responseGrid[i].paramsFieldPath, '');
                                component.defaultValue = fieldVal;
                                props.form._data[responseGrid[i].fieldApiKey] = fieldVal;
                                props.form._submission.data[responseGrid[i].fieldApiKey] = fieldVal

                                props.form.triggerRedraw();
                                props.form.triggerChange();

                            }


                        }, true)

                    }

                }
                else if (fillResponse === "fillSelect") {
                    Utils.eachComponent(props.form.component.components, function (component) {
                        if (component.key === props.component.selectApiKey) {
                            let path = props.component.selectDataPath;
                            let obj = _.get(result, path, '');
                            let values = [];
                            for (let i = 0; i < obj.length; i++) {
                                values.push({ label: obj[i][props.component.selectLabelPath], value: obj[i][props.component.selectValuePath] });
                            }
                            component.data.values = values;
                        }
                        props.form.triggerRedraw();


                    }, true)
                }
                props.component["loaded"] = moment().toString();

            }).then(() => {
                oldState[props.component.key]["completed"] = true;

            }).catch(error => { console.error("Error:", error); });
        }

    }, [])
};

export default class GeneralAPI extends ReactComponent {

    /**
   * This is the first phase of component building where the component is instantiated.
   *
   * @param component - The component definition created from the settings form.
   * @param options - Any options passed into the renderer.
   * @param data - The submission data where this component's data exists.
   */


    constructor(component, options, data) {
        super(component, options, data);
        this.reactInstance = null;
       
    }

    /**
   * This function is the default settings for the component. At a minimum you want to set the type to the registered
   * type of your component (i.e. when you call Components.setComponent('type', MyComponent) these types should match.
   *
   * @param sources
   * @returns {*}
   */
    static schema(...extend) {
        return ReactComponent.schema({
            type: "generalAPICustomComp",
            label: "",

        });
    }
    static get builderInfo() {
        return {
            title: "General API",
            icon: "cubes",
            group: "Basic",
            documentation: "",
            weight: -10,
            schema: GeneralAPI.schema()
        };
    }
    static editForm = settingsForm;

    /**
     * This method is called any time the component needs to be rebuilt. It is most frequently used to listen to other
     * components using the this.on() function.
     */
    init() {
        return super.init();
    }

    /**
     * This method is called before the component is going to be destroyed, which is when the component instance is
     * destroyed. This is different from detach which is when the component instance still exists but the dom instance is
     * removed.
     */
    destroy() {
        return super.destroy();
    }
    /**
     * This method is called before a form is submitted.
     * It is used to perform any necessary actions or checks before the form data is sent.
     *
     */

    beforeSubmit() {
        return super.beforeSubmit();
    }

    /**
     * The second phase of component building where the component is rendered as an HTML string.
     *
     * @returns {string} - The return is the full string of the component
     */
    render() {
        // For react components, we simply render as a div which will become the react instance.
        // By calling super.render(string) it will wrap the component with the needed wrappers to make it a full component.
        return super.render(`<div ref="react-${this.id}"></div>`);
    }
  /**
    * The user has changed the value in the component and the value needs to be updated on the main submission object and other components notified of a change event.
    *
    * @param value
    */
  updateValue = (value, flags) => {
    flags = flags || {};
    const newValue = value === undefined || value === null ? this.getValue() : value;
    const changed = (newValue !== undefined) ? this.hasChanged(newValue, this.dataValue) : false;
    this.dataValue = Array.isArray(newValue) ? [...newValue] : newValue;

    this.updateOnChange(flags, changed);
    return changed;
}

    /**
     * The third phase of component building where the component has been attached to the DOM as 'element' and is ready
     * to have its javascript events attached.
     *
     * @param element
     * @returns {Promise<void>} - Return a promise that resolves when the attach is complete.
     */
    attach(element) {
        super.attach(element);

        // The loadRefs function will find all dom elements that have the "ref" setting that match the object property.
        // It can load a single element or multiple elements with the same ref.
        this.loadRefs(element, {
            [`react-${this.id}`]: 'single',
        });

        if (this.refs[`react-${this.id}`]) {
            this.attachReact(this.refs[`react-${this.id}`], this.setReactInstance.bind(this));
            if (this.shouldSetValue) {
                this.setValue(this.dataForSetting);
                this.updateValue(this.dataForSetting);
            }
        }
        return Promise.resolve();
    }

    /**
     * The fourth phase of component building where the component is being removed from the page. This could be a redraw
     * or it is being removed from the form.
     */
    detach() {

        return super.detach();
    }
  

    /**
     * Override this function to insert your custom component.
     *
     * @param element
     * @param ref - callback ref
     */
    attachReact(element, ref) {
        const rootForm = this.getRoot(); // Get the root form object

        return ReactDOM.render(
            <GeneralAPICustomComp
                component={this.component} // These are the component settings if you want to use them to render the component.
                onChange={this.updateValue} // Pass the onChange event handler
                value={this.dataValue}
                data={this.data}
                dirty={this.dirty}
                updateOnChange={this.updateOnChange}
                element={this}
                form={rootForm}
                options={this.options}

            />,
            element
        );
    }


    /**
     * Something external has set a value and our component needs to be updated to reflect that. For example, loading a submission.
     *
     * @param value
     */
    setValue(value) {
        if (this.reactInstance) {
            this.reactInstance.setState({
                value: value
            });
            this.shouldSetValue = false;
        }
        else {
            this.shouldSetValue = true;
            this.dataForSetting = value;
        }
    }


    /**
     * Get the current value of the component. Should return the value set in the react component.
     *
     * @returns {*}
     */
    getValue() {
        if (this.reactInstance) {
            return this.reactInstance.state.value;
        }
        return this.defaultValue;
    }

    /**
     * Override normal validation check to insert custom validation in react component.
     *
     * @param data
     * @param dirty
     * @param rowData
     * @returns {boolean}
     */
    checkValidity(data, dirty, rowData) {
        const valid = super.checkValidity(data, dirty, rowData);
        if (!valid) {
            return false;
        }
        return this.validate(data, dirty, rowData);
    }

    /**
     * Do custom validation.
     *
     * @param data
     * @param dirty
     * @param rowData
     * @returns {boolean}
     */
    validate(data, dirty, rowData) {


        return true;

    }



}
