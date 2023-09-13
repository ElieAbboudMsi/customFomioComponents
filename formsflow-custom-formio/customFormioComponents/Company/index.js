import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ReactComponent, Utils } from "@formio/react";
import settingsForm from "./Company.settingsForm";
import _ from 'lodash';


let oldState = {

}
const CompanyCustomComp = ({ ...props }) => {
    function checkURLchange(){
        if(window.location.href != oldURL){
            oldState = {};
            oldURL = window.location.href;
        }
    }
    
    var oldURL = window.location.href;
    setInterval(checkURLchange, 200);
    const [state, setState] = useState({
        values: {

        },
        value: null,
        requestUrl: "",
        loading: false,
        companyGrid: [],
        loaded: false,
    });
   

    // Update the setValue method to handle onChange event
    const updateValue = (e) => {
        if (props.form._form.components[0]?.toEdit !== true) {

            const newValue = e; // Get the selected value from the event
            props.onChange(newValue, null);
            oldState[props.form._form._id][props.component.key]["value"] = newValue;
            setState({ ...oldState[props.form._form._id][props.component.key] })

        }
    };

    const setData = (selectedValues) => {

        if (selectedValues) {
            for (let i = 0; i < Object.keys(selectedValues).length; i++) {
                if (props.component.companyGrid?.findIndex((f) => f.companyFieldPath === Object.keys(selectedValues)[i]) >= 0) {
                    props.data[props.component.key + "_" + Object.keys(selectedValues)[i]] = selectedValues[Object.keys(selectedValues)[i]];

                }
            }
        }

    }

    useEffect(() => {
        if(!oldState[props.form._form._id]){
            oldState[props.form._form._id] = {};
        }
        if (!oldState[props.form._form._id][props.component.key]) {
            oldState[props.form._form._id][props.component.key] = {
                values: {

                },
                value: null,
                requestUrl: "",
                loading: false,
                companyGrid: props.component.companyGrid,
                loaded: false,

            }

        }
        if (props.component.defaultValue !== "" && props.component.defaultValue) {
            oldState[props.form._form._id][props.component.key]["value"] = props.component.defaultValue;

        }
        if (props.component.defaultValue !== "" && props.component.defaultValue && props.form._form.settings) {
            let myData = JSON.parse(props.form._form.settings.data);
            let tempValues = state.values;

            for (let i = 0; i < props.component.companyGrid.length; i++) {
                tempValues[props.component.companyGrid[i].companyFieldPath] = myData[props.component.key + "_" + props.component.companyGrid[i]["companyFieldPath"]];


            }
            oldState[props.form._form._id][props.component.key]["values"] = tempValues;
            setData(tempValues)
            setState({ ...oldState[props.form._form._id][props.component.key] })
        }
        else {
            // if (oldState[props.component.key]["value"] === null) {
            //     getData();

            // }
            // else {
            //     props.onChange(oldState[props.component.key]["value"], null)
            //     updateState({ ...oldState })

            // }
            if (oldState[props.form._form._id][props.component.key]["loaded"] === false) {
                getData();

            }
            else {
                setData(oldState[props.form._form._id][props.component.key]["values"])
                updateValue(oldState[props.form._form._id][props.component.key]["value"]);

            }

        }

    }, [])

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


    //ON LOAD
    const getData = () => {
        if (props.component.companyRequestUrl !== "" && props.component.companyRequestUrl) {

            let accessToken = localStorage.getItem("accessToken");

            let refreshToken = localStorage.getItem("refreshToken");
            let email = JSON.parse(localStorage.getItem("loggedInUserInfo")).email;

            fetch(props.component.companyRequestUrl + "/" + email + "/company", { method: "GET", headers: { "Content-Type": "application/json", "AccessToken": accessToken, "RefreshToken": refreshToken } }).then(response => response.json()).then((res) => {

                if (res) {

                    let path = props.component.dataPath;
                    let result = path ? _.get(res, path, '') : res;

                    if (props.component.validate.required === true) {
                        oldState[props.form._form._id][props.component.key]["values"] = result;
                        oldState[props.form._form._id][props.component.key]["loaded"] = true

                        setState({ ...oldState[props.form._form._id][props.component.key] })
                        if (props.form._form.components[0]?.toEdit !== true) {
                            props.component.values = result;
                            updateValue(email);


                        }
                        setData(result)

                    }



                }

            }).then(() => {

            }).catch(error => {

            });
        }
        else {
            if (props.component.values && Object.keys(props.component.values).length !== 0) {
                oldState[props.form._form._id][props.component.key]["values"] = props.component.values;
                let email = JSON.parse(localStorage.getItem("loggedInUserInfo")).email;
                if (props.component.defaultValue !== "" && props.component.defaultValue) {
                    email = props.component.defaultValue;

                }
                if (props.form._form.components[0]?.toEdit !== true) {
                    updateValue(email);

                }
                setData(oldState[props.form._form._id][props.component.key]["values"])


            }
        }






    }

    return (
        <div className="row mt-3">
            {
                props.component.companyGrid?.map((grid) => {
                    return grid.companyFieldPath.replaceAll(" ", "") !== "" && grid.companyFieldName.replaceAll(" ", "") !== "" && <div className="mt-3 col-sm-6">
                        <label>{props.form._form.settings && props.form._form.settings.translatedData ? props.form._form.settings.translatedData[props.form._form.settings.language] ? props.form._form.settings.translatedData[props.form._form.settings.language][grid.companyFieldName] || grid.companyFieldName : grid.companyFieldName : grid.companyFieldName}</label>
                        <input type="text" className="form-control" value={_.get(state.values, grid.companyFieldPath, '')} disabled={true} />
                    </div>
                })
            }
        </div>
    );
};

export default class Company extends ReactComponent {

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
            type: "companyCustomComp",
            label: "",

        });
    }
    static get builderInfo() {
        return {
            title: "Company",
            icon: "cubes",
            group: "Basic",
            documentation: "",
            weight: -10,
            schema: Company.schema()
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

        Utils.eachComponent(rootForm._form.components, function (component) {
            if (component.type === "editgrid") {
                Utils.eachComponent(component.components, function (component2) {
                    insideGrid = component2.key === key


                })
            }

        })
        return ReactDOM.render(
            <CompanyCustomComp
                component={this.component} // These are the component settings if you want to use them to render the component.
                onChange={this.updateValue} // Pass the onChange event handler
                value={this.dataValue}
                data={this.data}
                form={rootForm}
                insideGrid={insideGrid}


            />,
            element
        );
    }




}
