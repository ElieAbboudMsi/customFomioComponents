import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ReactComponent, Utils } from "@formio/react";
import settingsForm from "./CompanyUsers.settingsForm"
import CustomSelect from "../customSelect";
import _ from 'lodash';
import { createRoot } from "react-dom/client";


let oldState = {

}
const CompanyUsersCustomComp = ({ ...props }) => {
    function checkURLchange() {
        if (window.location.href != oldURL) {
            oldState = {};
            oldURL = window.location.href;
        }
    }

    var oldURL = window.location.href;
    setInterval(checkURLchange, 200);
    const [state, setState] = useState({
        options: [],
        value: null,
        requestUrl: "",
        loaded: false,
        selectedValues: {

        }
    });
    const setData = (selectedValues) => {

        if (selectedValues) {
            for (let i = 0; i < Object.keys(selectedValues).length; i++) {
                if (props.component.companyGrid?.findIndex((f) => f.companyFieldPath === Object.keys(selectedValues)[i]) >= 0) {
                    props.data[props.component.key + "_" + Object.keys(selectedValues)[i]] = selectedValues[Object.keys(selectedValues)[i]];

                }
            }
        }

    }
    const updateState = async (json) => {

        setState({ ...json[props.form._form._id][props.component.key] });
    }

    // Update the setValue method to handle onChange event
    const updateValue = (e) => {

        if (props.form._form.components[0]?.toEdit !== true) {
            const newValue = e.target.value; // Get the selected value from the event
            props.onChange(newValue, null);
            props.form._data[props.component.key] = newValue;
            let selectedValues = oldState[props.form._form._id][props.component.key]["options"].filter(v => v.value === newValue)[0];
            if (selectedValues) {
                oldState[props.form._form._id][props.component.key]["selectedValues"] = selectedValues;
                setData(selectedValues)

            }

            oldState[props.form._form._id][props.component.key]["value"] = newValue;
            updateState({ ...oldState })


        }

    };


    useEffect(() => {
        const handlePopState = () => {
            // This function will be called when the popstate event occurs
            oldState = {};

            // You can perform any actions here based on the popstate event
        };
        // Add the event listener when the component mounts
        if (!oldState[props.form._form._id]) {
            oldState[props.form._form._id] = {};
        }
        if (!oldState[props.form._form._id][props.component.key]) {
            oldState[props.form._form._id][props.component.key] = {
                options: [],
                value: null,
                loaded: false,
                requestUrl: "",
                selectedValues: {

                }
            }

        }
        if (props.value !== state.value) {
            oldState[props.form._form._id][props.component.key]["value"] = props.value;
            updateValue({ target: { value: oldState[props.form._form._id][props.component.key]["value"] } })


        }
        
        if (props.component.defaultValue !== "" && props.component.defaultValue) {
            oldState[props.form._form._id][props.component.key]["value"] = props.component.defaultValue;
            props.onChange(props.component.defaultValue, null);

        }
        if (props.component.defaultValue && props.component.defaultValue !== "" && props.form._form.settings) {
            let myData = JSON.parse(props.form._form.settings.data);
            let tempValues = state.selectedValues;
            if (props.component.companyGrid) {
                for (let i = 0; i < props.component.companyGrid.length; i++) {
                    tempValues[props.component.companyGrid[i].companyFieldPath] = myData[props.component.key + "_" + props.component.companyGrid[i]["companyFieldPath"]];


                }
            }

            oldState[props.form._form._id][props.component.key]["selectedValues"] = tempValues;

            oldState[props.form._form._id][props.component.key]["options"] = [{ label: props.component.defaultValue, value: props.component.defaultValue }];
            setData(tempValues);

            updateState({ ...oldState })
        }
        else {
            if (props.component.validate.required === true) {

                if (oldState[props.form._form._id][props.component.key]["options"].length === 0) {
                    loadData();

                }
                else {
                    updateValue({ target: { value: oldState[props.form._form._id][props.component.key]["value"] } })
                }
            }
        }

        window.addEventListener('popstate', handlePopState);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };

    }, [])


    //ON LOAD
    const loadData = async () => {
        if (props.component.requestUrl !== "" && props.component.requestUrl && props.component.roleName !== "" && props.component.roleName) {

            let accessToken = localStorage.getItem("accessToken");

            let refreshToken = localStorage.getItem("refreshToken");
            let companyID = JSON.parse(localStorage.getItem("loggedInUserInfo")).attributes.CompanyID[0];


            fetch(props.component.requestUrl + "?keyword=CompanyID:" + companyID + "&roleName=" + props.component.roleName, { method: "GET", headers: { "Content-Type": "application/json", "AccessToken": accessToken, "RefreshToken": refreshToken } }).then(response => response.json()).then((res) => {
                if (res) {
                    let path = props.component.dataPath;
                    let result = path ? _.get(res, path, '') : res;

                    let val = result?.map(e => ({ label: e.fullName, value: e.email, ...e }));
                    oldState[props.form._form._id][props.component.key]["options"] = val;

                    if (props.form._form.components[0]?.toEdit !== true) {
                        props.component.values = val;

                    }

                    oldState[props.form._form._id][props.component.key]["loaded"] = true;


                    updateState({ ...oldState })

                }

            }).then(() => {

            }).catch(error => { console.error("Error:", error); });
        }
        else {
            if (props.component.values && Object.keys(props.component.values).length !== 0) {
                oldState[props.form._form._id][props.component.key]["options"] = props.component.values;
                oldState[props.form._form._id][props.component.key]["loaded"] = true;

                if (props.component.defaultValue && props.component.defaultValue !== "") {
                    let selectedValues = props.component.values.filter(v => v.value === props.component.defaultValue)[0];
                    oldState[props.form._form._id][props.component.key]["selectedValues"] = selectedValues;

                }
                updateState({ ...oldState })

            }
        }

    }
    useEffect(() => {


        let keys = Object.keys(props.data);
        for (let i = 0; i < keys.length; i++) {
            props.form._data[keys[i]] = props.data[keys[i]];
            props.form._submission.data[keys[i]] = props.data[keys[i]];


        }
        if (props.form._form.settings) {
            if (props.form._form.settings.data) {

                let myData = JSON.parse(props.form._form.settings.data);
                if (props.component.companyGrid) {
                    for (let i = 0; i < props.component.companyGrid.length; i++) {
                        if (props.data[props.component.key + "_" + props.component.companyGrid[i]["companyFieldPath"]] === null || props.data[props.component.key + "_" + props.component.companyGrid[i]["companyFieldPath"]] === undefined) {
                            props.data[props.component.key + "_" + props.component.companyGrid[i]["companyFieldPath"]] = myData[props.component.key + "_" + props.component.companyGrid[i]["companyFieldPath"]];

                        }



                    }
                }

            }

        }

        // if (props.insideGrid === true) {
        //     delete props.form._data[props.component.key]
        //     delete props.form._submission.data[props.component.key]

        // }
    }, [props.data])
   

    return (
        <div>
            <div className="row ">
                    <div style={{display : props.component.dropdownLabel ? "block" : "none"}}>{props.form._form.settings && props.form._form.settings.translatedData ? props.form._form.settings.translatedData[props.form._form.settings.language] ? props.form._form.settings.translatedData[props.form._form.settings.language][props.component.dropdownLabel] || props.component.dropdownLabel : props.component.dropdownLabel : props.component.dropdownLabel}</div>

                    <CustomSelect component={props.component} disabled={props.component.disabled && props.component.disabled === true} value={state.value} options={state.options} updateValue={updateValue} />

                    {/* <select disabled={props.component.disabled && props.component.disabled === true} className="form-control custom-dropdown" value={value} onChange={this.updateValue}>
                            <option disabled value="">Select option</option>

                            {
                                options?.map((option) => {
                                    return <option value={option.value}>
                                        {option.label}
                                    </option>
                                })
                            }
                        </select> */}


                {
                    props.component.companyGrid?.map((grid) => {
                        return grid.companyFieldPath.replaceAll(" ", "") !== "" && grid.companyFieldName.replaceAll(" ", "") !== "" && <div className="col-sm-6 mt-3">
                            <label>{props.form._form.settings && props.form._form.settings.translatedData ? props.form._form.settings.translatedData[props.form._form.settings.language] ? props.form._form.settings.translatedData[props.form._form.settings.language][grid.companyFieldName] || grid.companyFieldName : grid.companyFieldName : grid.companyFieldName}</label>
                            <input type="text" className="form-control" value={_.get(state.selectedValues, grid.companyFieldPath, '')} disabled={true} />
                        </div>
                    })
                }


            </div>
        </div>
    );
};

export default class CompanyUsers extends ReactComponent {
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
            type: "companyUsersCustomComp",
            label: "",

        });
    }
    static get builderInfo() {
        return {
            title: "Company Users",
            icon: "cubes",
            group: "Basic",
            documentation: "",
            weight: -10,
            schema: CompanyUsers.schema()
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
        let gridComponent = null;
        let newValue = null;
        let tempComponent = this.component;
        const root = createRoot(element);

        Utils.eachComponent(rootForm.components, function (component) {

            if (component.component.type === "editgrid") {
                gridComponent = component;

                Utils.eachComponent(component.component.components, function (component2) {
                    if (!insideGrid) {
                        insideGrid = component2.key === key;




                    }


                }, true)
            }

        }, true)

      

        root.render(
            <CompanyUsersCustomComp
                component={this.component} // These are the component settings if you want to use them to render the component.
                onChange={this.updateValue} // Pass the onChange event handler
                value={this.dataValue}
                form={rootForm}
                data={this.data}
                insideGrid={insideGrid}
                gridComponent={gridComponent}
                tempComponent={tempComponent}

            />
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
        if (value !== null) {
            flags = flags || {};
            const newValue = value === undefined || value === null ? this.getValue() : value;
            const changed = (newValue !== undefined) ? this.hasChanged(newValue, this.dataValue) : false;
            this.dataValue = Array.isArray(newValue) ? [...newValue] : newValue;

            this.updateOnChange(flags, changed);
            return changed;
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
