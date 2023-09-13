import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ReactComponent, Utils } from "@formio/react";
import settingsForm from "./CompanyRelation.settingsForm"
import CustomSelect from "../customSelect";
import _ from 'lodash';
import { createRoot } from "react-dom/client";


let oldState = {

};
const CompanyRelationCustomComp = ({ ...props }) => {
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
        selectedValues: {},
        loaded: false,
    });

    const updateState = async (json) => {


        if (json[props.form._form._id][props.component.key].loaded !== null && json[props.form._form._id][props.component.key].loaded !== undefined && json[props.form._form._id][props.component.key].loaded === false) {
            await loadData();

        }
        setState({ ...json[props.form._form._id][props.component.key] });
    }
    const setData = (selectedValues) => {

        if (selectedValues) {
            for (let i = 0; i < Object.keys(selectedValues).length; i++) {
                if (props.component.companyGrid?.findIndex((f) => f.companyFieldPath === Object.keys(selectedValues)[i]) >= 0) {
                    props.data[props.component.key + "_" + Object.keys(selectedValues)[i]] = selectedValues[Object.keys(selectedValues)[i]];

                }
            }
        }

    }
    // Update the setValue method to handle onChange event
    const updateValue = (e) => {
        if (props.form._form.components[0]?.toEdit !== true) {
            const newValue = e.target.value; // Get the selected value from the event
            props.onChange(newValue, null);
            let selectedValues = oldState[props.form._form._id][props.component.key]["options"].filter(v => v.value === newValue)[0];
            oldState[props.form._form._id][props.component.key]["selectedValues"] = selectedValues;
            oldState[props.form._form._id][props.component.key]["value"] = newValue;
            updateState({ ...oldState })
            setData(selectedValues);


        }

    };
    useEffect(() => {
        if (!oldState[props.form._form._id]) {
            oldState[props.form._form._id] = {};
        }
        if (!oldState[props.form._form._id][props.component.key]) {
            oldState[props.form._form._id][props.component.key] = {
                options: [],
                value: null,
                requestUrl: "",
                selectedValues: {},
                loaded: false,
            }
        }
        oldState[props.form._form._id][props.component.key]["value"] = props.value;
        updateValue({ target: { value: oldState[props.form._form._id][props.component.key]["value"] } })

    }, [props.value])
    const loadData = async () => {
        if (props.component.defaultValue !== "" && props.component.defaultValue) {
            oldState[props.form._form._id][props.component.key]["value"] = props.component.defaultValue;
            updateState({ ...oldState })


        }
        if (props.component.defaultValue && props.component.defaultValue !== "" && props.form._form.settings && props.form._form.settings?.data) {
            let myData = JSON.parse(props.form._form.settings.data);

            let options = [{ label: myData[props.component.key], value: myData[props.component.key] }];
            let selectedValues = {};
            if (props.component.companyGrid) {
                for (let i = 0; i < props.component.companyGrid.length; i++) {
                    selectedValues[props.component.companyGrid[i].companyFieldPath] = myData[props.component.key + "_" + props.component.companyGrid[i].companyFieldPath];
                }
            }
            oldState[props.form._form._id][props.component.key]["options"] = options;
            oldState[props.form._form._id][props.component.key]["selectedValues"] = selectedValues;

            oldState[props.form._form._id][props.component.key]["value"] = props.component.defaultValue;
            setData(selectedValues);


        }
        else {
            if (state.loaded === false && props.component.requestUrl !== "" && props.component.requestUrl && props.component.companyRelation !== "" && props.component.companyRelation) {

                let companyID = JSON.parse(localStorage.getItem("loggedInUserInfo")).companyID;
                let accessToken = localStorage.getItem("accessToken");

                let refreshToken = localStorage.getItem("refreshToken");
                let facilityBody = { "companyid": companyID, "CompanyTypeID": "2" };
                let transporterBody = { "companyid": companyID, "CompanyTypeID": "3" };
                let fetchParams = { method: props.component.method, headers: { "Content-Type": "application/json", "AccessToken": accessToken, "RefreshToken": refreshToken } };
                let reqUrl = props.component.requestUrl;
                if (!props.component.resultsRelated) {
                    reqUrl = reqUrl + "/CompanyTypeID=eq." + (props.component.companyRelation === "transporter" ? "3" : "2");
                }
                else{
                    if (props.component.method === "POST") {
                        fetchParams["body"] = JSON.stringify(props.component.companyRelation === "transporter" ? transporterBody : facilityBody);
                    }
                }
                
                fetch(reqUrl, { ...fetchParams }).then(response => response.json()).then((res) => {
                    if (res) {
                        let path = props.component.dataPath;
                        let result = path ? _.get(res, path, '') : res;
                        let val = result?.map(e => ({ label: e[props.component.labelName], value:  e[props.component.valueName], ...e }));
                        let gridKeyToFilter = props.component.gridKeyToFilter;
                        let gridDataPath = props.component.gridDataPath;
                        if (props.form._form.components[0]?.toEdit !== true) {
                            props.component.values = val;

                        }
                        if (gridKeyToFilter !== null && gridKeyToFilter !== undefined && gridKeyToFilter !== "") {
                            let filtersDataValues = props.form._data[gridKeyToFilter];
                            let tempVal = [];
                            for (let i = 0; i < val.length; i++) {

                                let recordValue = val[i].value;
                                let recordFoundInGrid = filtersDataValues.findIndex(g => g[gridDataPath] === recordValue);
                                if (recordFoundInGrid >= 0) {
                                    tempVal.push(val[i]);
                                }
                            }

                            val = tempVal;
                        }



                        if (props.component.defaultValue && props.component.defaultValue !== "") {
                            let selectedValues = val.filter(v => v.value === props.component.defaultValue)[0];
                            oldState[props.form._form._id][props.component.key]["selectedValues"] = selectedValues;
                            updateState({ ...oldState })

                        }
                        oldState[props.form._form._id][props.component.key]["options"] = val;
                        oldState[props.form._form._id][props.component.key]["loaded"] = true;

                        updateState({ ...oldState })

                    }

                }).then(() => {

                }).catch(error => { console.error("Error:", error); });
            }
            else {
                if (state.loaded) {
                    if (props.component.defaultValue && props.component.defaultValue !== "") {
                        let selectedValues = state.options.filter(v => v.value === props.component.defaultValue)[0];
                        oldState[props.form._form._id][props.component.key]["selectedValues"] = selectedValues;

                        updateState({ ...oldState })

                    }
                }
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
        if (props.insideGrid === true) {
            delete props.form._data[props.component.key]
            delete props.form._submission.data[props.component.key]

        }

    }, [props.data])


    useEffect(() => {
        const handlePopState = () => {
            // This function will be called when the popstate event occurs
            oldState = {};

            // You can perform any actions here based on the popstate event
        };
        // Add the event listener when the component mounts
        window.addEventListener('popstate', handlePopState);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };

    }, [])
    let labelToTranslate = (props.component.companyRelation !== "" && props.component.companyRelation) ? props.component.companyRelation === "transporter" ? "Select Transporter" : props.component.companyRelation === "facility" ? "Select Treatment Facility" : "" : "";
    return (
        <div>
            <div className="row">
              
                <label style={{display : props.component.dropdownLabel ? "block" : "none"}}>{props.form._form.settings && props.form._form.settings.translatedData ? props.form._form.settings.translatedData[props.form._form.settings.language] ? props.form._form.settings.translatedData[props.form._form.settings.language][props.component.dropdownLabel] || props.component.dropdownLabel : props.component.dropdownLabel : props.component.dropdownLabel}</label>
                    <CustomSelect component={props.component} disabled={props.component.disabled && props.component.disabled === true} value={state.value} options={state.options} updateValue={updateValue} />

                    {/* <select disabled={this.props.component.disabled && this.props.component.disabled === true} className="form-control custom-dropdown" value={value} onChange={this.updateValue}>
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

export default class CompanyRelation extends ReactComponent {
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
            type: "companyRelationCustomComp",
            label: "",

        });
    }
    static get builderInfo() {
        return {
            title: "Company Relation",
            icon: "cubes",
            group: "Basic",
            documentation: "",
            weight: -10,
            schema: CompanyRelation.schema()
        };
    }
    static editForm = settingsForm;





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
        let tempComponent = this.component;
        const root = createRoot(element);

        // Utils.eachComponent(rootForm.components, function (component) {

        //     if (component.component.type === "editgrid") {
        //         gridComponent = component;

        //         Utils.eachComponent(component.component.components, function (component2) {
        //             if(!insideGrid){
        //                 insideGrid = component2.key === key;
        //                if(insideGrid){
        //                 tempComponent = component2;
        //                }



        //             }


        //         }, true)
        //     }

        // }, true)
        // if(gridComponent && gridComponent.component){
        //     if(gridComponent.component.disabled === true && tempComponent.disabled !== true){
        //         tempComponent.disabled = true;
        //         tempComponent.validate.required = false;
        //         for(let i = 0 ; i < gridComponent.editRows.length ; i++){
        //             gridComponent.editRows[i].state = "saved";
        //         }
        //         gridComponent.triggerRedraw();
        //         gridComponent.triggerChange();

        //        }
        // }
        root.render(
            <CompanyRelationCustomComp
                component={this.component} // These are the component settings if you want to use them to render the component.
                onChange={this.updateValue} // Pass the onChange event handler
                value={this.dataValue || ""}
                form={rootForm}
                data={this.data}
                insideGrid={insideGrid}

            />
        );

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




}
