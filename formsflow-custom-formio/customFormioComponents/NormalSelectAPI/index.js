import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ReactComponent, Utils } from "@formio/react";
import settingsForm from "./NormalSelectAPI.settingsFrom"
import CustomSelect from "../customSelect";
import _ from 'lodash';


let oldState = {

}
const NormalSelectCustomComp = ({ ...props }) => {
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
        loading: false,
        mainData: []


    });

    const updateState = async (json) => {
        setState({ ...json[props.form._form._id][props.component.key] });
    }

    // Update the setValue method to handle onChange event
    const updateValue = (e) => {
        if (props.form._form.components[0]?.toEdit !== true) {

            const newValue = e.target.value; // Get the selected value from the event
            // oldState[props.form._form._id][props.component.key]["value"] = newValue;
            props.setOldState("value" , newValue);
            // updateState({ ...oldState })
            props.onChange(newValue, null); // Call onChange with the new value


        }
    };

    useEffect(() => {
        const handlePopState = () => {
            // This function will be called when the popstate event occurs
            oldState = {};

            // You can perform any actions here based on the popstate event
        };
        // if (!oldState[props.form._form._id]) {
        //     oldState[props.form._form._id] = {};
        // }
        // if (!oldState[props.form._form._id][props.component.key]) {
        //     oldState[props.form._form._id][props.component.key] = {
        //         options: [],
        //         value: null,
        //         loading: false,
        //         requestUrl: "",
        //         mainData: []

        //     }

        // }
        if (props.value !== state.value) {
            props.setOldState("value" , props.value);

            // oldState[props.form._form._id][props.component.key]["value"] = props.value;

        }
        if (props.oldState["options"].length === 0) {
            loadData();

        }
        else {
            props.component.properties.options = props.oldState["options"]

            // updateState({ ...oldState })

        }

        // Add the event listener when the component mounts
        window.addEventListener('popstate', handlePopState);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };

    }, [])



    //ON LOAD
    const loadData = async () => {
        
        if (props.component.requestUrl !== "" && props.component.requestUrl  && props.oldState.loading === false && props.oldState.options.length === 0) {
            props.setOldState("loading" ,true);


            // oldState[props.form._form._id][props.component.key]["loading"] = true;
            // updateState({ ...oldState })

            let accessToken = localStorage.getItem("accessToken");

            let refreshToken = localStorage.getItem("refreshToken");


            fetch(props.component.requestUrl, { method: "GET", headers: { "Content-Type": "application/json", "AccessToken": accessToken, "RefreshToken": refreshToken } }).then(response => response.json()).then((res) => {
                if (res) {
                    let path = props.component.dataPath;
                    let result = path ? _.get(res, path, '') : res;
                    let val = [];
                    if (result) {
                        for (let i = 0; i < result.length; i++) {
                            if (props.component.labelsName && props.component.labelsName.length !== 0) {
                                let labelName = "";

                                for (let j = 0; j < props.component.labelsName.length; j++) {
                                    labelName = labelName + " " + result[i][props.component.labelsName[j].gridLabelName]

                                }
                                result[i].label = labelName;
                            }
                            else {
                                result[i].label = result[i][props.component.labelName];;
                            }
                            result[i].value = result[i][props.component.valueName];

                        }
                    }
                    val = result;
                    // oldState[props.form._form._id][props.component.key]["mainData"] = val;
                    props.setOldState("mainData" ,val);


                    if (props.form._form.components[0]?.toEdit !== true) {
                        props.component.values = val;
                        if(!props.component.data){
                            props.component.data = {};
                        }
                        props.component.data.values = val;

                    }


                    // oldState[props.form._form._id][props.component.key]["loading"] = false;
                    props.setOldState("loading" ,false);
                   

                    // updateState({ ...oldState })

                }

            }).then(() => {

            }).catch(error => { console.error("Error:", error); });
        }
        else {
            if (props.component.values && Object.keys(props.component.values).length !== 0) {
                // oldState[props.form._form._id][props.component.key]["options"] = props.component.values;

                props.setOldState("options" ,props.component.values);

                // updateState({ ...oldState })

            }
        }

    }
    useEffect(() => {
        let allData = [];
        for (let i = 0; i < props.oldState["mainData"].length; i++) {
            if (props.form._form.settings) {
                let lan = props.form._form.settings.language || "en"

                    allData.push({
                        label: props.form._form.settings.translatedData ? props.form._form.settings.translatedData[lan] ? props.form._form.settings.translatedData[lan][props.oldState["mainData"][i].label] || props.oldState["mainData"][i].label : props.oldState["mainData"][i].label : props.oldState["mainData"][i].label,
                        value: props.oldState["mainData"][i].value

                    })

            }
        }
        // oldState[props.form._form._id][props.component.key]["options"] = allData;
        props.setOldState("options" ,allData);

        props.component.properties.options = allData;
      
        // if(props.insideGrid === true && allData.length > 0){
        //     props.gridComponent.options[props.component.key] = allData
        //     // props.updateOnChange({} , true)
        //     props.gridComponent.triggerRedraw();
        // }
    

        if (props.oldState["value"] !== null) {
            props.data[props.component.key] = props.oldState["value"];
        }
        if (props.component.defaultValue && props.component.defaultValue !== "") {
            // oldState[props.form._form._id][props.component.key]["value"] = props.component.defaultValue;
            props.setOldState("value" ,props.component.defaultValue);

            if (props.component.componentsToFill) {
                for (let i = 0; i < props.component.componentsToFill.length; i++) {
                    let valOfCom = allData.filter(d => d.value === props.component.defaultValue)[0]?.label;
                    props.data[props.component.componentsToFill[i]["fieldApi"]] = valOfCom;
                }
            }

        }

        // updateState({ ...oldState })


    }, [props.oldState["mainData"], props.form])
    useEffect(() => {
        if(props.oldState.options.length > 0){
            if(props.insideGrid && props.oldState.girdRefreshed === false){
                props.setOldState("girdRefreshed" ,true);
                props.component.properties.options = props.oldState.options;

                props.gridComponent.triggerRedraw();
    
            }
        }
    }, [props.oldState.options])
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

   
    return (
        <CustomSelect component={props.component} disabled={props.component.disabled === true} value={props.oldState["value"]} options={props.oldState["options"]} updateValue={updateValue} />

    );
};

export default class NormalSelect extends ReactComponent {
    static shouldSetValue = false; // Define shouldSetValue as a static property

    /**
   * This is the first phase of component building where the component is instantiated.
   *
   * @param component - The component definition created from the settings form.
   * @param options - Any options passed into the renderer.
   * @param data - The submission data where this component's data exists.
   */


    constructor(component, options, data) {
        options["oldState"] = {
            options: [],
            value: null,
            requestUrl: "",
            loading: false,
            mainData: [],
            girdRefreshed: false,
            
    
    
        }
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
            type: "normalSelectCustomComp",
            label: "",

        });
    }
    static get builderInfo() {
        return {
            title: "Normal Select",
            icon: "cubes",
            group: "Basic",
            documentation: "",
            weight: -10,
            schema: NormalSelect.schema()
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
        let insideGrid = false;
        let gridComponent = null;
        let key = this.component.key;
        const rootForm = this.getRoot(); // Get the root form object

        Utils.eachComponent(rootForm.components, function (component) {

            if (component.component.type === "editgrid") {
                gridComponent = component;
              
                Utils.eachComponent(component.component.components, function (component2) {
                    if(!insideGrid){
                        insideGrid = component2.key === key

                    }


                }, true)
            }

        }, true)
        const setOldState = (key, value) => {
    
            this.options["oldState"][key] = value;
            this.updateOnChange({}, true);
            return ReactDOM.render(
                <NormalSelectCustomComp
                    component={this.component} // These are the component settings if you want to use them to render the component.
                    onChange={this.updateValue} // Pass the onChange event handler
                    value={this.dataValue}
                    form={rootForm}
                    data={this.data}
                    insideGrid={insideGrid}
                    gridComponent={gridComponent}
                    setOldState={setOldState}
                    oldState={this.options["oldState"]}
                    updateOnChange={this.updateOnChange}
                />,
                element
            );
        }

      
        return ReactDOM.render(
            <NormalSelectCustomComp
                component={this.component} // These are the component settings if you want to use them to render the component.
                onChange={this.updateValue} // Pass the onChange event handler
                value={this.dataValue}
                form={rootForm}
                data={this.data}
                insideGrid={insideGrid}
                gridComponent={gridComponent}
                setOldState={setOldState}
                oldState={this.options["oldState"]}
                updateOnChange={this.updateOnChange}
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
