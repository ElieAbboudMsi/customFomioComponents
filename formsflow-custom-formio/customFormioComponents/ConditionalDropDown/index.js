import React, { Component, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ReactComponent, Utils } from "@formio/react";
import settingsForm from "./ConditionalDropDown.settingsForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import CustomSelect from "../customSelect";
import i18next from 'i18next';
import _ from 'lodash';

let oldState = {

}
const ConditionalDropDownCustomComp = ({ ...props }) => {
    function checkURLchange(){
        if(window.location.href != oldURL){
            oldState = {};
            oldURL = window.location.href;
        }
    }
    
    var oldURL = window.location.href;
    setInterval(checkURLchange, 200);
    const [state, setState] = useState({
        options: [],
        value: null,
        conditionalKey: "",
        mainSelectValue: "",
        mainData: []

    })

    // Update the setValue method to handle onChange event
    const updateValue = (e) => {
        if (props.form._form.components[0]?.toEdit !== true) {

            const newValue = e.target.value; // Get the selected value from the event
            oldState[props.form._form._id][props.component.key]["value"] = newValue;
            updateState({ ...oldState })
            props.onChange(newValue, null); // Call onChange with the new value


        }
    };
    const updateState = async (json) => {



        setState({ ...json[props.form._form._id][props.component.key] });
    }
    const getAllValues = () => {
        let allValues = {};
        let accessToken = localStorage.getItem("accessToken");

        let refreshToken = localStorage.getItem("refreshToken");
        let conditionalKey = props.component.conditionalKey;
        let dataType = props.component.dataType;
        // if (props.component.startProcessing && props.data[conditionalKey] !== undefined && props.data[conditionalKey] !== null) {

        if (dataType === "manual" || dataType === undefined || dataType === "") {
            let mainValues = props.component.conditionalValues;
            for (let i = 0; i < mainValues?.length; i++) {
                let array = [];
                if (allValues[mainValues[i].conditionalValue]) {
                    array = allValues[mainValues[i].conditionalValue];
                }
                for (let j = 0; j < mainValues[i].conditionalRenderedValues.length; j++) {
                    array.push({
                        label: mainValues[i].conditionalRenderedValues[j].conditionalRenderedLabel,
                        value: mainValues[i].conditionalRenderedValues[j].conditionalRenderedValue,
                    })
                }
                allValues[mainValues[i].conditionalValue] = array;

            }

            let allData = props.data && props.data[conditionalKey] ? allValues[props.data[conditionalKey]] || [] : []
            oldState[props.form._form._id][props.component.key]["mainData"] = allData;


            oldState[props.form._form._id][props.component.key]["conditionalKey"] = conditionalKey

            oldState[props.form._form._id][props.component.key]["mainSelectValue"] = props.data[conditionalKey];
            if (props.component.defaultValue !== "" && props.component.defaultValue) {
                oldState[props.form._form._id][props.component.key]["value"] = props.component.defaultValue;
    
            }
            updateState({ ...oldState })

            if (!props.component.defaultValue) {
                updateValue({ target: { value: "" } })

            }

        }
        else if (dataType === "request" && props.component.startProcessing) {
            let requestUrl = props.component.requestUrl;
            let resLabelName = props.component.labelName;
            let resValueName = props.component.valueName;

            if (props.data[conditionalKey] !== "" && props.data[conditionalKey] && requestUrl && requestUrl !== "" && resLabelName && resLabelName !== "" && resValueName && resValueName !== "") {

                fetch(requestUrl + "/select=*&&" + props.component.fieldFilterName + "=eq." + props.data[conditionalKey], { method: "GET", headers: { "Content-Type": "application/json", "AccessToken": accessToken, "RefreshToken": refreshToken } }).then(response => response.json()).then((res) => {
                    if (res) {
                        let path = props.component.dataPath;
                        let allData = path ? _.get(res, path, '') : res;
                        let finalData = allData?.map(e => ({ label: e[resLabelName], value: e[resValueName], ...e }));
                        oldState[props.form._form._id][props.component.key]["mainData"] = finalData;

                        oldState[props.form._form._id][props.component.key]["conditionalKey"] = conditionalKey;

                        oldState[props.form._form._id][props.component.key]["mainSelectValue"] = props.data[conditionalKey]
                        if (props.component.defaultValue !== "" && props.component.defaultValue) {
                            oldState[props.form._form._id][props.component.key]["value"] = props.component.defaultValue;
                
                        }
                        updateState({ ...oldState })
                        

                        if (!props.component.defaultValue) {
                            updateValue({ target: { value: "" } })

                        }

                    }

                }).then(() => {

                }).catch(error => { console.error("Error:", error); });
            }
            else {
                oldState[props.form._form._id][props.component.key]["mainData"] = [];
                oldState[props.form._form._id][props.component.key]["mainSelectValue"] = ""

                updateState({ ...oldState })

                updateValue({ target: { value: "" } })

            }

        }

    }

    useEffect(() => {
        const handlePopState = () => {
            // This function will be called when the popstate event occurs
            oldState = {};

            // You can perform any actions here based on the popstate event
        };
        if(!oldState[props.form._form._id]){
            oldState[props.form._form._id] = {};
        }
        if (!oldState[props.form._form._id][props.component.key]) {
            oldState[props.form._form._id][props.component.key] = {
                options: [],
                value: props.value || "",
                conditionalKey: "",
                mainSelectValue: "",
                mainData: []

            }

        }
        //tbr
        // getAllValues();

        props.element.on('change', (event) => {

            if (event.data) {
                if (oldState[props.form._form._id][props.component.key]["mainSelectValue"] !== props.data[props.component.conditionalKey]) {
                    getAllValues();

                }
                else {
                    updateValue({ target: { value: oldState[props.form._form._id][props.component.key]["value"] } })

                }
            }
        });
        if (props.data[props.component.conditionalKey]) {
            if (oldState[props.form._form._id][props.component.key]["value"] !== null) {
                updateValue({ target: { value: oldState[props.form._form._id][props.component.key]["value"] } })

            }
            if (oldState[props.form._form._id][props.component.key]["mainData"].length !== 0) {
                updateState({ ...oldState })

            }
            else {
                getAllValues();

            }

        }
        window.addEventListener('popstate', handlePopState);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [])

    useEffect(() => {
        let allData = [];
        for (let i = 0; i < oldState[props.form._form._id][props.component.key]["mainData"].length; i++) {
            if (props.form._form.settings) {
                if (props.form._form.settings.translatedData && props.form._form.settings.language) {
                    allData.push({
                        label: props.form._form.settings.translatedData[props.form._form.settings.language][oldState[props.form._form._id][props.component.key]["mainData"][i].label] || oldState[props.component.key]["mainData"][i].label,
                        value: oldState[props.form._form._id][props.component.key]["mainData"][i].value

                    })
                }

            }
        }
        oldState[props.form._form._id][props.component.key]["options"] = allData;
        if (props.component.defaultValue && props.component.defaultValue !== "") {
            for (let i = 0; i < props.component.componentsToFill.length; i++) {
                props.data[props.component.componentsToFill[i]["fieldApi"]] = allData.filter(d => d.value === props.component.defaultValue)[0]?.label;

                if (props.form._data[props.component.componentsToFill[i]["fieldApi"]] === null || props.form._data[props.component.componentsToFill[i]["fieldApi"]] === undefined) {
                    props.form._data[props.component.componentsToFill[i]["fieldApi"]] = allData.filter(d => d.value === props.component.defaultValue)[0]?.label;

                }
                if (props.form._submission.data[props.component.componentsToFill[i]["fieldApi"]] === null || props.form._submission.data[props.component.componentsToFill[i]["fieldApi"]] === undefined) {
                    props.form._submission.data[props.component.componentsToFill[i]["fieldApi"]] = allData.filter(d => d.value === props.component.defaultValue)[0]?.label;

                }

            }
        }
        updateState({ ...oldState })


    }, [state.mainData, props.form])

    useEffect(() => {
        let keys = Object.keys(props.data);
        for (let i = 0; i < keys.length; i++) {
            props.form._data[keys[i]] = props.data[keys[i]];
            props.form._submission.data[keys[i]] = props.data[keys[i]];


        }
        if (props.insideGrid === true) {
            delete props.form._data[props.component.key]
            delete props.form._submission.data[props.component.key]

        }


    }, [props.data])

    // console.log(props.component.key , props.component)
    return (
        <CustomSelect component={props.component} disabled={props.component.disabled && props.component.disabled === true} value={state.value} options={state.options} updateValue={updateValue} />

    );
};

export default class ConditionalDropDown extends ReactComponent {
    static shouldSetValue = false; // Define shouldSetValue as a static property

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
        this.formData = null;
        this.state = {
            newData: {}
        }
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
            type: "conditionalDropDownCustomComp",
            label: "",

        });
    }
    static get builderInfo() {
        return {
            title: "Conditional Dropdown",
            icon: "square",
            group: "Basic",
            documentation: "",
            weight: -10,
            schema: ConditionalDropDown.schema()
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

    // /**
    //  * The second phase of component building where the component is rendered as an HTML string.
    //  *
    //  * @returns {string} - The return is the full string of the component
    //  */
    // render() {
    //     // For react components, we simply render as a div which will become the react instance.
    //     // By calling super.render(string) it will wrap the component with the needed wrappers to make it a full component.
    //     return super.render(`<div ref="react-${this.id}"></div>`);
    // }

    /**
     * Callback ref to store a reference to the node.
     *
     * @param element - the node
     */
    setReactInstance(element) {
        this.reactInstance = element;
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
        // this.loadRefs(element, {
        //     [`react-${this.id}`]: 'single',
        // });

        if (this.refs[`react-${this.id}`]) {
            // this.attachReact(this.refs[`react-${this.id}`], this.setReactInstance.bind(this));
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
        if (this.refs[`react-${this.id}`]) {
            this.detachReact(this.refs[`react-${this.id}`]);
        }
        super.detach();
    }


    /**
     * Override this function to insert your custom component.
     *
     * @param element
     * @param ref - callback ref
     */
    attachReact(element, ref) {
        const rootForm = this.getRoot(); // Get the root form object

        let insideGrid = false;
        let key = this.component.key

        Utils.eachComponent(rootForm._form.components, function (component) {
            if (component.type === "editgrid") {
                Utils.eachComponent(component.components, function (component2) {
                    insideGrid = component2.key === key


                })
            }

        })

        return ReactDOM.render(
            <ConditionalDropDownCustomComp
                component={this.component} // These are the component settings if you want to use them to render the component.
                onChange={this.updateValue} // Pass the onChange event handler
                value={this.dataValue}
                formData={this.formData}
                element={this}
                form={rootForm}
                data={this.data}
                insideGrid={insideGrid}

            />,
            element
        );
    }

    /**
     * Override this function.
     */
    detachReact(element) {
        return;
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
